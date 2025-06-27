# utils/challenge_generator.py

import random
import re

def extract_key_term(sentence):
    words = [w for w in sentence.split() if len(w) > 6]
    return random.choice(words) if words else "this topic"

def extract_concept(sentence):
    concepts = re.findall(r"\b[A-Z][a-z]+\s[a-z]+\b", sentence)
    return concepts[0] if concepts else extract_key_term(sentence)

def extract_two_terms(sentence):
    terms = re.findall(r"\b[A-Z][a-z]+\b", sentence)
    return f"{terms[0]} and {terms[1]}" if len(terms) >= 2 else "these concepts"

def generate_challenge_question(document_text):
    sentences = [s.strip() for s in re.split(r"[.!?]", document_text) if len(s.strip()) > 50]
    if not sentences:
        return "No valid sentence found."

    sentence = random.choice(sentences)

    templates = [
        f"What does the document say about {extract_key_term(sentence)}?",
        f"How does the document explain {extract_concept(sentence)}?",
        f"What is the relationship between {extract_two_terms(sentence)}?",
        f"True or False: {sentence}"
    ]

    return random.choice(templates)
