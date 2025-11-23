from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import torch
from sentence_transformers import SentenceTransformer
from embedding_NGO import EMBEDDINGS_FILE_PATH, NGO_DATA_PATH
from clustering import predict_category



MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
embedding_model = None
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# embedding_model.to(device)

def load_model():
    global embedding_model
    if embedding_model == None:
        embedding_model = SentenceTransformer(MODEL_NAME)   
    else:
        embedding_model

def create_query_embedding(query_text):
    load_model()
    query_embedding = embedding_model.encode(
        [query_text],
        convert_to_tensor=False
    )
    return query_embedding


def retrieve_top_k_ngos(user_query, k=5):
    NGO_EMBEDDINGS = np.load(EMBEDDINGS_FILE_PATH)
    NGO_METADATA = pd.read_csv(NGO_DATA_PATH)
    TAG = 'tags'

    predicted_id, predicted_label = predict_category(user_query)

    print("predicted_label", predicted_label, NGO_METADATA[TAG])
    predicted_id = int(predicted_id)
    relevant_metadata = NGO_METADATA[NGO_METADATA[TAG] == predicted_label].copy()

    relevant_indices = relevant_metadata.index.tolist()

    if not relevant_indices:
        return pd.DataFrame({'name': ['לא נמצאו עמותות בקטגוריה זו']})

    query_embedding = create_query_embedding(user_query)

    filtered_embeddings = NGO_EMBEDDINGS[relevant_indices]

    similarity_scores = cosine_similarity(
        query_embedding,
        filtered_embeddings
    ).flatten()

    relevant_metadata['Similarity_Score'] = similarity_scores
    top_results = relevant_metadata.sort_values(by='Similarity_Score', ascending=False).head(k)
    return top_results[['name', 'ngoNumber', 'Similarity_Score']]