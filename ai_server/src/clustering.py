from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import json


# ----- Paths to saved fine-tuned model and label mappings -----
MODEL_PATH_1 = "../best_classifier_model"

# Global references for lazy loading
MAP_PATH ="../files/id_to_label_map.json"
model = tokenizer = None


# -----------------------------------------------------------------
# Load the label mapping from a JSON file (model ID → category label)
# -----------------------------------------------------------------
def load_category_map():
    try:
        with open(MAP_PATH, 'r', encoding='utf-8') as f:
            id_to_label = json.load(f)
        return id_to_label
    except FileNotFoundError:
        print("The label mapping file was not found.")
    except Exception as e:
        print(f"Error loading label mapping: {e}")


# -----------------------------------------------------------------
# Load a fine-tuned model and its tokenizer from a local directory
# -----------------------------------------------------------------
def load_model(path):
    try:
        # Load tokenizer and model from the specified local path
        tokenizer = AutoTokenizer.from_pretrained(path, local_files_only=True)
        model = AutoModelForSequenceClassification.from_pretrained(path, local_files_only=True)
        
        # Set the model to evaluation mode (disables dropout, etc.)
        model.eval()
        return model, tokenizer
    except Exception as e:
        print(f"Error loading model: {e}")


# -----------------------------------------------------------------
# Predict the category label for the given input text
# -----------------------------------------------------------------
def predict_category(query_text):
    global model, tokenizer

    # Lazy loading: load model and tokenizer only on first request
    if model is None:
        model, tokenizer = load_model(MODEL_PATH_1)

    # Load label mapping (dictionary from ID to label name)
    id_to_label = load_category_map()

    # Tokenize the input text and prepare it for the model
    inputs = tokenizer(query_text, return_tensors="pt", truncation=True, padding=True)

    # Select appropriate computation device (GPU if available, otherwise CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    # Filter only valid keys required by the model (prevents runtime errors)
    clean_inputs = {
        k: v.to(device)
        for k, v in inputs.items()
        if k in ['input_ids', 'attention_mask', 'token_type_ids']
    }

    # Forward pass without gradient calculation (saves memory & is faster)
    with torch.no_grad():
        outputs = model(**clean_inputs)

    # Extract logits and choose the most likely label ID
    logits = outputs.logits
    predicted_id = torch.argmax(logits, dim=-1).item()

    # Convert predicted ID to readable label
    predicted_label = id_to_label.get(str(predicted_id), f"LABEL_{predicted_id}")

    # Calculate softmax probabilities to obtain confidence score
    probabilities = torch.softmax(logits, dim=-1)[0]
    confidence = probabilities[predicted_id].item()

    # Return predicted ID and label (confidence can be exposed if needed)
    return predicted_id, predicted_label
