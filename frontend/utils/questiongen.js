// utils/questionGen.js

// Utility to pick a random element from an array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const extractKeyTerm = (sentence) => {
  const words = sentence.split(' ').filter(w => w.length > 5);
  return randomChoice(words) || 'this topic';
};

export const extractCause = (sentence) => {
  const triggers = ['because', 'due to', 'leads to', 'causes', 'results in'];
  const trigger = triggers.find(t => sentence.toLowerCase().includes(t));
  if (trigger) {
    const parts = sentence.split(trigger);
    return parts[1]?.slice(0, 50).trim() || 'this happens';
  }
  return 'this occurs';
};

export const extractConcept = (sentence) => {
  const matches = sentence.match(/\b[A-Z][a-z]+\s[a-z]+\b/g);
  return matches?.[0] || extractKeyTerm(sentence);
};

export const extractTwoTerms = (sentence) => {
  const terms = sentence.match(/\b[A-Z][a-z]+\b/g);
  if (terms?.length >= 2) {
    return `${terms[0]} and ${terms[1]}`;
  }
  return 'these concepts';
};

export const generateChallengeQuestion = (document) => {
  const sentences = document
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 50);

  if (sentences.length === 0) return '';

  const sentence = randomChoice(sentences);

  const templates = [
    () => `What does the document say about ${extractKeyTerm(sentence)}?`,
    () => `Why does ${extractCause(sentence)} happen according to the document?`,
    () => `How is ${extractConcept(sentence)} explained?`,
    () => `What is the relation between ${extractTwoTerms(sentence)}?`,
    () => `True or False: ${sentence.trim()}`
  ];

  return randomChoice(templates)();
};
