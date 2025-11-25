from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import json


MODEL_PATH_1 = "../best_classifier_model"
MODEL_PATH_2 = "../best_classifier_model_2"
MODEL_PATH_3 = "../best_classifier_model_3"

MAP_PATH ="../files/id_to_label_map.json"
model = tokenizer = None


#----------- loading map label from json file
def load_category_map():
    try:
        with open(MAP_PATH, 'r', encoding='utf-8') as f:
            id_to_label = json.load(f)
        return id_to_label
    except FileNotFoundError:
        print("The mapping file was not found.")
    except Exception as e:
        print(f"Error loading mapping:{e}")


#----------- loading model and tokenizer
def load_model(path):
    try:
        tokenizer = AutoTokenizer.from_pretrained(path, local_files_only=True)
        model = AutoModelForSequenceClassification.from_pretrained(path, local_files_only=True)
        model.eval()
        return model, tokenizer
    except Exception as e:
        print(f"Error loading model:{e}")


#----------- running the model and predicting the category
def predict_category(query_text):
    global model, tokenizer
    #loading the model, tokenizer and map category
    if model == None:
        model, tokenizer = load_model(MODEL_PATH_1)
    id_to_label = load_category_map()

    inputs = tokenizer(query_text, return_tensors="pt", truncation=True, padding=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    clean_inputs = {
        k: v.to(device)
        for k, v in inputs.items()
        if k in ['input_ids', 'attention_mask', 'token_type_ids'] # Filter only the keys that the model requires
    }
    # Running the model
    with torch.no_grad():
        outputs = model(**clean_inputs)
    # Prediction: Converting the model outputs (Logits) to the final category
    logits = outputs.logits
    predicted_id = torch.argmax(logits, dim=-1).item()
    # Convert ID to label and security score
    predicted_label = id_to_label.get(str(predicted_id), f"LABEL_{predicted_id}")
    probabilities = torch.softmax(logits, dim=-1)[0]
    confidence = probabilities[predicted_id].item()
    # print(confidence)
    return predicted_id, predicted_label
