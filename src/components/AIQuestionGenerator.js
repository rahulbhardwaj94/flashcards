import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import './AIQuestionGenerator.css';

const AIQuestionGenerator = ({ topic, onGenerate, onCancel }) => {
  const [apiKey, setApiKey] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert educator creating flashcards for learning. Create exactly ${numberOfQuestions} high-quality flashcards about "${topic.name}". 

Each flashcard should have:
1. A clear, concise question
2. A helpful hint that guides the learner
3. A comprehensive answer that explains the concept

IMPORTANT: Return your response as a VALID JSON ARRAY containing exactly ${numberOfQuestions} objects. Each object must have these exact field names:

[
  {
    "question": "Your question here",
    "hint": "Your hint here", 
    "answer": "Your answer here"
  },
  {
    "question": "Your second question here",
    "hint": "Your second hint here", 
    "answer": "Your second answer here"
  }
]

Do not include any text before or after the JSON array. Do not include explanations, markdown formatting, or any other content. Return ONLY the JSON array.`
            },
            {
              role: 'user',
              content: `Create exactly ${numberOfQuestions} flashcards about "${topic.name}" with ${difficulty} difficulty level. Focus on practical concepts and real-world applications.

CRITICAL: Return ONLY a valid JSON array with ${numberOfQuestions} objects. Each object must have "question", "hint", and "answer" fields. Do not include any other text, explanations, or formatting.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log('Raw AI Response:', content);
      
      // Parse the JSON response
      let parsedCards;
      try {
        // Clean the content to extract just the JSON
        const cleanedContent = cleanAIResponse(content);
        console.log('Cleaned Content:', cleanedContent);
        parsedCards = JSON.parse(cleanedContent);
        console.log('Parsed Cards:', parsedCards);
      } catch (parseError) {
        console.log('JSON parsing failed, trying fallback:', parseError);
        // If JSON parsing fails, try to extract content manually
        parsedCards = extractCardsFromText(content, topic.name);
        console.log('Fallback Cards:', parsedCards);
      }

      if (Array.isArray(parsedCards) && parsedCards.length > 0) {
        // Validate that we got the expected number of cards
        if (parsedCards.length !== numberOfQuestions) {
          console.warn(`Expected ${numberOfQuestions} cards but got ${parsedCards.length}`);
        }
        
        const formattedCards = parsedCards.map((card, index) => ({
          id: `ai-${Date.now()}-${index}`,
          question: cleanText(card.question || `AI Generated Question ${index + 1}`),
          hint: cleanText(card.hint || 'Use your knowledge to answer this question.'),
          answer: cleanText(card.answer || 'AI generated answer will appear here.')
        }));

        console.log(`Successfully generated ${formattedCards.length} cards`);
        setGeneratedCards(formattedCards);
      } else {
        throw new Error(`Failed to generate valid flashcards. Got: ${JSON.stringify(parsedCards)}`);
      }

    } catch (err) {
      setError(`Generation failed: ${err.message}`);
      console.error('AI Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanAIResponse = (content) => {
    // Remove any markdown formatting
    let cleaned = content.replace(/```json/g, '').replace(/```/g, '');
    
    // Look for JSON array pattern [ ... ] first
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      // Extract the JSON array
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    } else {
      // Fallback to looking for JSON object pattern { ... }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
    }
    
    // Remove any extra text before or after the JSON
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const cleanText = (text) => {
    if (!text) return '';
    
    // Remove quotes and extra formatting
    let cleaned = text.toString();
    
    // Remove surrounding quotes if they exist
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
        (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Remove field labels like "question:", "hint:", "answer:"
    cleaned = cleaned.replace(/^(question|hint|answer):\s*/i, '');
    
    // Clean up any remaining formatting
    cleaned = cleaned.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    return cleaned.trim();
  };

  const extractCardsFromText = (text, topicName) => {
    // Fallback method to extract cards if JSON parsing fails
    const lines = text.split('\n').filter(line => line.trim());
    const cards = [];
    
    // Look for patterns like "question:", "hint:", "answer:" in the text
    let currentCard = {};
    let currentField = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('question:')) {
        if (Object.keys(currentCard).length > 0) {
          cards.push(currentCard);
        }
        currentCard = { question: '', hint: '', answer: '' };
        currentField = 'question';
        currentCard.question = trimmedLine.replace(/^.*?question:\s*/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('hint:')) {
        currentField = 'hint';
        currentCard.hint = trimmedLine.replace(/^.*?hint:\s*/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('answer:')) {
        currentField = 'answer';
        currentCard.answer = trimmedLine.replace(/^.*?answer:\s*/i, '').trim();
      } else if (currentField && trimmedLine) {
        // Continue building the current field
        currentCard[currentField] += (currentCard[currentField] ? ' ' : '') + trimmedLine;
      }
    }
    
    // Add the last card if it exists
    if (Object.keys(currentCard).length > 0 && currentCard.question) {
      cards.push(currentCard);
    }
    
    // If we still don't have cards, create some basic ones
    if (cards.length === 0) {
      for (let i = 0; i < Math.min(numberOfQuestions, lines.length); i++) {
        cards.push({
          question: lines[i] || `Question about ${topicName}`,
          hint: `Hint for question ${i + 1}`,
          answer: `Answer for question ${i + 1}`
        });
      }
    }
    
    return cards;
  };

  const handleConfirm = () => {
    if (generatedCards.length > 0) {
      onGenerate(topic.id, generatedCards);
    }
  };

  const handleRegenerate = () => {
    setGeneratedCards([]);
    setError('');
  };

  return (
    <motion.div
      className="ai-generator-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="ai-generator-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="ai-generator-header">
          <div className="ai-generator-title">
            <Sparkles size={24} />
            <h2>Create with AI</h2>
          </div>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="ai-generator-content">
          {generatedCards.length === 0 ? (
            <>
              <div className="ai-generator-form">
                <div className="form-group">
                  <label htmlFor="apiKey">OpenAI API Key</label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="api-key-input"
                  />
                  <small>
                    Your API key is stored locally and never sent to our servers.
                  </small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="numberOfQuestions">Number of Questions</label>
                    <select
                      id="numberOfQuestions"
                      value={numberOfQuestions}
                      onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="difficulty">Difficulty Level</label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button
                  className="generate-btn"
                  onClick={handleGenerate}
                  disabled={isGenerating || !apiKey.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="spinner" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Questions
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="generated-cards">
              <div className="generated-cards-header">
                <CheckCircle size={20} className="success-icon" />
                <h3>Generated {generatedCards.length} Flashcards</h3>
              </div>
              
              <div className="cards-preview">
                {generatedCards.map((card, index) => (
                  <div key={card.id} className="card-preview">
                    <div className="card-preview-header">
                      <span className="card-number">#{index + 1}</span>
                    </div>
                    <div className="card-preview-content">
                      <h4>Q: {card.question}</h4>
                      <p><strong>Hint:</strong> {card.hint}</p>
                      <p><strong>A:</strong> {card.answer}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="generated-cards-actions">
                <button className="regenerate-btn" onClick={handleRegenerate}>
                  <Sparkles size={16} />
                  Regenerate
                </button>
                <button className="confirm-btn" onClick={handleConfirm}>
                  <CheckCircle size={16} />
                  Add to Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIQuestionGenerator;
