# app.py

import streamlit as st
from utils.pdf_parser import extract_text_from_pdf
from utils.qa_engine import find_relevant_context, generate_answer
from utils.challenge_generator import generate_challenge_question
import os
import tempfile

# ------------------ App Config ------------------
st.set_page_config(page_title="🧠 DocuMind AI", layout="wide")
st.title("📄 DocuMind AI – Smart Research Assistant")

# ------------------ Sidebar: Upload File ------------------
st.sidebar.header("📁 Upload Document")
uploaded_file = st.sidebar.file_uploader("Choose a PDF or TXT file", type=["pdf", "txt"])

document_text = ""
document_name = ""
if uploaded_file:
    document_name = uploaded_file.name
    st.sidebar.success(f"Loaded: {document_name}")

    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        tmp_file.write(uploaded_file.read())
        tmp_path = tmp_file.name

    if uploaded_file.type == "application/pdf":
        document_text = extract_text_from_pdf(tmp_path)
    elif uploaded_file.type == "text/plain":
        with open(tmp_path, "r", encoding="utf-8") as f:
            document_text = f.read()
    else:
        st.sidebar.error("❌ Unsupported file format")

# ------------------ Main Interface ------------------
if not document_text:
    st.info("👈 Please upload a document to begin.")
else:
    st.subheader(f"📘 Document: {document_name}")
    mode = st.radio("Choose Mode", ["📖 Ask Questions", "🎯 Challenge Me"])

    # ------------------ Q&A Mode ------------------
    if mode == "📖 Ask Questions":
        question = st.text_input("Ask something about the document:")
        if st.button("Ask"):
            with st.spinner("🤔 Finding answer..."):
                context = find_relevant_context(question, document_text)
                answer = generate_answer(question, context)

                st.success("✅ Answer")
                st.markdown(f"**{answer}**")

                if context:
                    with st.expander("📌 Justification (Relevant Sentences)"):
                        for i, ctx in enumerate(context, 1):
                            st.markdown(f"**{i}.** {ctx}")

    # ------------------ Challenge Mode ------------------
    elif mode == "🎯 Challenge Me":
        if "score" not in st.session_state:
            st.session_state.score = {"correct": 0, "total": 0}
        if "challenge_q" not in st.session_state:
            st.session_state.challenge_q = ""

        col1, col2 = st.columns([3, 1])
        with col1:
            if st.button("🧠 Generate Challenge Question"):
                st.session_state.challenge_q = generate_challenge_question(document_text)
        with col2:
            st.metric("📊 Score", f"{st.session_state.score['correct']} / {st.session_state.score['total']}")

        if st.session_state.challenge_q:
            st.markdown(f"**🧩 Challenge Question:** {st.session_state.challenge_q}")
            user_answer = st.text_input("Your Answer:")

            if st.button("✅ Submit Answer"):
                context = find_relevant_context(st.session_state.challenge_q, document_text)
                expected = generate_answer(st.session_state.challenge_q, context)

                # Keyword overlap logic
                ua_words = set(user_answer.lower().split())
                ex_words = set(expected.lower().split())
                overlap = len(ua_words & ex_words) / max(1, len(ua_words | ex_words))

                is_correct = overlap > 0.3
                st.session_state.score["total"] += 1
                if is_correct:
                    st.session_state.score["correct"] += 1
                    st.success("🎉 Correct!")
                else:
                    st.error("❌ Incorrect")

                with st.expander("📖 Explanation"):
                    st.markdown(f"**Expected Answer:** {expected}")
                    st.markdown(f"**Justification:** {context[0] if context else 'Not found'}")
