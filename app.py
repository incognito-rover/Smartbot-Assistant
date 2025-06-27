import streamlit as st
import os
from utils.pdf_parser import extract_text_from_pdf, extract_text_from_txt
from utils.qa_engine import chunk_text, embed_chunks, get_relevant_chunk, answer_question

# Set Streamlit config
st.set_page_config(page_title="Smart Research Assistant", layout="wide")

st.title("📚 Smart Assistant for Research Summarization")

# File upload
uploaded_file = st.file_uploader("Upload a PDF or TXT file", type=['pdf', 'txt'])

if uploaded_file:
    file_path = f"data/uploaded_docs/{uploaded_file.name}"
    
    # Save file locally
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getvalue())
    
    # Extract text
    if uploaded_file.name.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    else:
        text = extract_text_from_txt(file_path)

    # Display preview
    st.subheader("Document Preview")
    st.text_area("Extracted Content", text[:1000], height=200)

    # Chunk and embed
    st.write("🔍 Indexing document for QA...")
    chunks = chunk_text(text)
    index, embeddings, chunk_list = embed_chunks(chunks)
    st.success("✅ Document indexed!")

    # QA section
    st.subheader("Ask a Question")
    user_question = st.text_input("Enter your question about the document")

    if st.button("Get Answer"):
        context = get_relevant_chunk(user_question, index, embeddings, chunk_list)
        answer = answer_question(user_question, context)
        
        st.markdown("### 🧠 Answer")
        st.info(answer)

        st.markdown("### 📌 Justification")
        st.write(context)
