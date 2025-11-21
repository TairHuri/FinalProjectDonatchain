from sentence_transformers import SentenceTransformer
import numpy as np
import pandas as pd
import torch


EMBEDDINGS_FILE_PATH = "all_ngo_embeddings.npy"
NGO_DATA_PATH = "ngo.csv"
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
embedding_model = SentenceTransformer(MODEL_NAME)   

# def get_model():
#     embedding_model = SentenceTransformer(MODEL_NAME)
#     return embedding_model

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# embedding_model.to(device)


def new_ngo_controller(name, description):
    ngo_vector = create_new_ngo_embedding(name, description, embedding_model)
    add_new_ngo_embedding(ngo_vector)


def update_ngo_controller(name, description, tags, ngoNumber):
    ngo_vector = create_new_ngo_embedding(name, description, embedding_model)
    status, error = update_existing_ngo_embedding(ngoNumber, ngo_vector, name, description, tags)
    return status, error
    


def create_new_ngo_embedding(name, description, embedding_model):
    """
        embedding new ngo in the system
    """
    combined_text = f" {name}, {description}"
    new_embedding = embedding_model.encode(
        [combined_text],
        convert_to_tensor=False)
    return new_embedding



def add_new_ngo_embedding(new_vectors):
    existing_embeddings = np.load(EMBEDDINGS_FILE_PATH)
    updated_embeddings = np.concatenate([existing_embeddings, new_vectors], axis=0)
    np.save(EMBEDDINGS_FILE_PATH, updated_embeddings)



def update_existing_ngo_embedding(ngo_number_to_update, updated_vector, name, description, tags):
    try:
        df_metadata = pd.read_csv(NGO_DATA_PATH)
    except FileNotFoundError:
        return False, "Error: Data file not found."

    try:
        target_index = df_metadata[df_metadata['ngoNumber'] == int(ngo_number_to_update)].index[0]
    except IndexError:
        return False, f"Error: The ngo with the ngoNumber {ngo_number_to_update} was not found in the data. Cannot update."

    try:
        existing_embeddings = np.load(EMBEDDINGS_FILE_PATH)
    except FileNotFoundError:
        return False, "Error: Embeddings file not found."
  
    existing_embeddings[target_index] = updated_vector
    np.save(EMBEDDINGS_FILE_PATH, existing_embeddings)
  
    df_metadata.loc[target_index, 'name'] = name
    df_metadata.loc[target_index, 'description'] = description
    df_metadata.loc[target_index, 'tags'] = tags

    df_metadata.to_csv(NGO_DATA_PATH, index=False)
    
    return True, ""


#embedding all the Ngos in the system
def embedding_all_ngo():
    
    df_ngos = pd.read_csv(NGO_DATA_PATH)
    df_ngos['combined_text'] = df_ngos.apply(
        lambda row: f" {row['name']} {row['description']}",
        axis=1)
    texts_to_embed = df_ngos['combined_text'].tolist()

    all_ngo_embeddings = embedding_model.encode(
        texts_to_embed,
        show_progress_bar=True,
        convert_to_tensor=False,
        batch_size=32
    )
    np.save(EMBEDDINGS_FILE_PATH, all_ngo_embeddings)
    print(f"The embeddings matrix was saved in:  {EMBEDDINGS_FILE_PATH}")


