#  Smart Assistant

An intelligent assistant that reads PDF or TXT documents and provides:

-  Accurate, justified answers to user questions  
-  Logical “Challenge Me” questions and feedback  
-  Clear explanations using relevant document context

---

##  Setup Instructions

###  1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/Smart-Assistant.git
cd Smart-Assistant
pip install -r requirements.txt



▶ 2. Run the App

streamlit run app.py




 3. Use the Assistant
Upload a .pdf or .txt document from the sidebar.

Choose between:

--Q&A Mode – Ask any question; get document-based answers with context.

--Challenge Mode – Answer logic-based questions; receive a score.

All answers include justification from the uploaded document.


 Modular Design
Module	                                     Purpose
app.py	                              Main Streamlit interface
utils/pdf_parser.py	                  Extracts text from uploaded PDFs
utils/qa_engine.py	                  Finds relevant context and generates answers
utils/challenge_generator.py	        Creates logic-based questions from the document



 Architecture & Reasoning Flow
graph TD
  A[ Upload PDF/TXT] --> B[ Extract Text (pdf_parser)]
  B --> C[ Document Corpus]

  %% Q&A Flow
  C --> D1[ User Asks Question]
  D1 --> E1[ Context Finder (qa_engine)]
  E1 --> F1[ Answer + Justification]
  F1 --> G1[ Show in Streamlit (Answer + Snippets)]

  %% Challenge Flow
  C --> D2[ Generate Challenge Question (challenge_generator)]
  D2 --> E2[User Answers]
  E2 --> F2[ Evaluate Answer (QA engine overlap)]
  F2 --> G2[ Score + Feedback]





