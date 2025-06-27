// ✅ Enhanced version of DocumentQASystem.jsx for Smart-Assistant
// 📁 Follows the structure:
// Smart-Assistant/
// ├── app.py
// ├── utils/
// │   ├── pdf_parser.py
// │   └── qa_engine.py
// ├── data/
// ├── frontend/ ← React App
//     └── components/
//         └── DocumentQASystem.jsx (this file)

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, FileText, Brain, MessageCircle, CheckCircle, XCircle,
  Eye, EyeOff, Lightbulb, Target, Award, RefreshCw
} from 'lucide-react';

// ✅ Modular imports for reasoning and Q&A logic
import { findRelevantContext, generateAnswer } from '../utils/qa_engine';
import { generateChallengeQuestion } from '../utils/questionGen';

const DocumentQASystem = () => {
  // State Definitions
  const [document, setDocument] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [mode, setMode] = useState('qa');
  const [conversation, setConversation] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeQuestion, setChallengeQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [challengeResult, setChallengeResult] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [difficulty, setDifficulty] = useState('medium');
  const [showHints, setShowHints] = useState(true);
  const [highlightedText, setHighlightedText] = useState('');
  const [showDocumentPanel, setShowDocumentPanel] = useState(true);
  const [contextMemory, setContextMemory] = useState([]);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, challengeResult]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      setDocumentName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setDocument(text);
        setConversation([]);
        setContextMemory([]);
        setScore({ correct: 0, total: 0 });
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a .txt file');
    }
  };

  const handleQuestionSubmit = () => {
    if (!currentQuestion.trim() || !document) return;
    setIsLoading(true);
    const relevantContext = findRelevantContext(currentQuestion, document);
    const answer = generateAnswer(currentQuestion, relevantContext);
    if (relevantContext.length > 0) {
      setHighlightedText(relevantContext[0]);
    }
    const newEntry = {
      question: currentQuestion,
      answer,
      context: relevantContext,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversation(prev => [...prev, newEntry]);
    setContextMemory(prev => [...prev, newEntry].slice(-5));
    setCurrentQuestion('');
    setIsLoading(false);
  };

  const handleGenerateChallenge = () => {
    const question = generateChallengeQuestion(document);
    setChallengeQuestion(question);
    setUserAnswer('');
    setChallengeResult(null);
  };

  const evaluateAnswer = () => {
    const relevantContext = findRelevantContext(challengeQuestion, document);
    const correctAnswer = generateAnswer(challengeQuestion, relevantContext);
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/);
    const overlap = userWords.filter(word => correctWords.includes(word)).length;
    const scoreVal = overlap / Math.max(correctWords.length, userWords.length);
    const isCorrect = scoreVal > 0.3;
    setScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    setChallengeResult({
      isCorrect,
      userAnswer,
      correctAnswer,
      explanation: relevantContext[0] || 'No strong context.',
      score: Math.round(scoreVal * 100)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Brain className="text-indigo-600 h-6 w-6" />
            <h1 className="text-xl font-bold">DocuMind AI</h1>
          </div>
          <div className="flex items-center gap-3">
            <Award className="text-indigo-600 h-4 w-4" />
            <span className="text-sm">Score: {score.correct}/{score.total}</span>
            <select value={mode} onChange={e => setMode(e.target.value)} className="rounded px-2 py-1 text-sm">
              <option value="qa">Q&A</option>
              <option value="challenge">Challenge Me</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!document ? (
          <div className="text-center py-10">
            <Upload className="mx-auto text-indigo-400 h-12 w-12 mb-4" />
            <h2 className="text-lg font-semibold">Upload a text file to begin</h2>
            <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Choose File</button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-4 h-96 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-2">{documentName}</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {highlightedText ? (
                  document.split(highlightedText).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <mark className="bg-yellow-200 px-1 rounded">{highlightedText}</mark>
                      )}
                    </span>
                  ))
                ) : document}
              </pre>
            </div>

            <div className="col-span-2 bg-white rounded-xl shadow p-4">
              {mode === 'qa' ? (
                <>
                  <input
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Ask something about the document..."
                    className="w-full px-4 py-2 border rounded mb-4"
                  />
                  <button
                    onClick={handleQuestionSubmit}
                    className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
                  >Ask</button>

                  {conversation.map((entry, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-semibold">Q: {entry.question}</p>
                      <p>A: {entry.answer}</p>
                      <p className="text-xs italic text-gray-500">Context: {entry.context[0]}</p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {!challengeQuestion ? (
                    <button
                      onClick={handleGenerateChallenge}
                      className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >Generate Challenge</button>
                  ) : (
                    <div className="space-y-3">
                      <p className="font-semibold text-indigo-900">Question: {challengeQuestion}</p>
                      <textarea
                        className="w-full border px-2 py-2 rounded"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                      ></textarea>
                      <button
                        onClick={evaluateAnswer}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >Submit</button>
                      {challengeResult && (
                        <div className={`p-3 rounded ${challengeResult.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p><strong>Your Answer:</strong> {challengeResult.userAnswer}</p>
                          <p><strong>Correct Answer:</strong> {challengeResult.correctAnswer}</p>
                          <p><strong>Explanation:</strong> {challengeResult.explanation}</p>
                          <p><strong>Match Score:</strong> {challengeResult.score}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentQASystem;
