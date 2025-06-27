# utils/pdf_parser.py

import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    """Extract text content from all pages of a PDF."""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"[ERROR] PDF Parsing failed: {e}")
    return text
