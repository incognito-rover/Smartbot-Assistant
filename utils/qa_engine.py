from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# STEP 3: Chunk the document
def chunk_text(text, chunk_size=300):
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

# STEP 3: Embed document chunks
def embed_chunks(chunks):
    embeddings = model.encode(chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))
    return index, embeddings, chunks

# STEP 4: Get relevant chunk based on user question
def get_relevant_chunk(question, index, embeddings, chunks, top_k=1):
    q_embed = model.encode([question])
    D, I = index.search(np.array(q_embed), top_k)
    return chunks[I[0][0]]

# STEP 4: Answer the question using context
def answer_question(question, context):
    # You can later plug in GPT, Claude, or LLaMA here
    answer = f"[Answer based on context]\n\n{context}\n\nQ: {question}\nA: [Your model's answer here]"
    return answer
