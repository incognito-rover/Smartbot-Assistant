# utils/qa_engine.py

import re

def find_relevant_context(question, document, top_n=3):
    """Find the top-N relevant sentences from the document based on word overlap."""
    question_words = set([
        word.lower() for word in question.split()
        if len(word) > 3
    ])

    sentences = re.split(r'[.!?]', document)
    scored = []

    for sentence in sentences:
        clean_sentence = sentence.strip()
        if len(clean_sentence) < 20:
            continue

        score = sum(1 for word in question_words if word in clean_sentence.lower())
        if score > 0:
            scored.append((clean_sentence, score))

    # Sort by relevance
    top_sentences = sorted(scored, key=lambda x: x[1], reverse=True)[:top_n]
    return [s[0] for s in top_sentences]


def generate_answer(question, context_list):
    """Generate a basic answer by selecting and formatting from context."""
    if not context_list:
        return "❌ I couldn't find a relevant answer in the document."

    question_lower = question.lower()
    base = "Based on the document: "

    if any(q in question_lower for q in ["what is", "define", "explain"]):
        return base + context_list[0]
    elif any(q in question_lower for q in ["why", "how"]):
        return base + " ".join(context_list[:2])
    elif any(q in question_lower for q in ["who", "when", "where"]):
        return base + context_list[0]
    else:
        return base + context_list[0]
