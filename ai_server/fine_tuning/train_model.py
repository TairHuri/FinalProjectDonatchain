import pandas as pd
from datasets import Dataset, Features, ClassLabel
from google.colab import drive

#The model running code was run in Google Colab due to a lack of GPU.

drive.mount('/content/drive')
df = pd.read_excel('/content/drive/MyDrive/train_model/cleanData.xlsx')

#---------------------------------first
# loading
df = pd.read_excel('/content/drive/MyDrive/train_model/cleanData.xlsx')
df = df.rename(columns={'מטרות עמותה': 'text', 'סיווג פעילות ענפי': 'label_name'})

# map label name to id
unique_labels = df['label_name'].unique()
label_to_id = {label: i for i, label in enumerate(unique_labels)}
id_to_label = {i: label for i, label in enumerate(unique_labels)}

df['label'] = df['label_name'].map(label_to_id)

df = df.dropna(subset=['text', 'label'])
df['text'] = df['text'].astype(str)
df = df[df['text'].str.len() > 0]

# creating a Hugging Face Dataset Object
hg_dataset = Dataset.from_pandas(df[['text', 'label']])
hg_dataset = hg_dataset.remove_columns(["__index_level_0__"])

class_labels_feature = ClassLabel(num_classes=len(unique_labels), names=unique_labels.tolist())
new_features = Features({'text': hg_dataset.features['text'], 'label': class_labels_feature})
hg_dataset = hg_dataset.cast(new_features)

#---------------------------------second

# Divided into 80% training and 20% testing
train_test_split = hg_dataset.train_test_split(test_size=0.2, seed=42,stratify_by_column="label")
train_dataset = train_test_split['train']

# dividing the remaining 20% into Validation and Test (10% each)
test_validation_split = train_test_split['test'].train_test_split(test_size=0.5, seed=42, stratify_by_column="label")
validation_dataset = test_validation_split['train']
test_dataset = test_validation_split['test']


#---------------------------------third: tokenize state

from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_NAME = "bert-base-multilingual-cased"
NUM_LABELS = len(unique_labels)
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME,num_labels=NUM_LABELS)

def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True)

#preper the data for the model
tokenized_train = train_dataset.map(tokenize_function, batched=True)
tokenized_validation = validation_dataset.map(tokenize_function, batched=True)
tokenized_test = test_dataset.map(tokenize_function, batched=True)

#---------------------------------third: training details

from transformers import TrainingArguments, Trainer
import numpy as np
import evaluate


#defined the Trainer object
training_args = TrainingArguments(
    output_dir= "/content/drive/MyDrive/train_model",
    num_train_epochs=3,                    
    per_device_train_batch_size=16,         
    per_device_eval_batch_size=16,
    warmup_steps=500,                       
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=100,
    learning_rate=2e-5,                     
    eval_strategy="epoch",           
    save_strategy="epoch",
    load_best_model_at_end=True,         
)

metric = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metric.compute(predictions=predictions, references=labels)

# Creating the Trainer object
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_validation,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

trainer.train()

# saving the final model
trainer.save_model("./best_classifier_model")
tokenizer.save_pretrained("./best_classifier_model")

# Evaluating the model on the test set
results = trainer.evaluate(tokenized_test)
print(results)