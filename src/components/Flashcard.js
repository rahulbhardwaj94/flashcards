import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Lightbulb } from 'lucide-react';
import './Flashcard.css';

const Flashcard = ({ card, showHint, onShowHint }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHintLocal, setShowHintLocal] = useState(false);

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleShowHint = () => {
    if (!showHint) {
      setShowHintLocal(!showHintLocal);
      onShowHint?.();
    }
  };

  const currentHint = showHint || showHintLocal;

  // If no card data, show a placeholder
  if (!card) {
    return (
      <div className="flashcard-wrapper">
        <div className="flashcard-placeholder">
          <h3>No card data available</h3>
          <p>Please check if the topic has any flashcards.</p>
        </div>
      </div>
    );
  }

  // Ensure we have valid question and answer
  const questionText = card.question || 'No question available';
  const answerText = card.answer || 'No answer available';

  // Force text to be a proper string and handle any encoding issues
  const sanitizedQuestion = String(questionText).replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  const sanitizedAnswer = String(answerText).replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // If the text is still corrupted, use a fallback
  const displayQuestion = sanitizedQuestion.length > 0 ? sanitizedQuestion : 'Question not available';
  const displayAnswer = sanitizedAnswer.length > 0 ? sanitizedAnswer : 'Answer not available';

  return (
    <div className="flashcard-wrapper">
      <motion.div
        className="flashcard"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <motion.div
          className="card-face"
          style={{ 
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="card-header">
            <div className="card-suit">♠</div>
            <div className="card-corner">Q</div>
          </div>
          
          <div className="card-content">
            <h3 className="card-question">
              {displayQuestion}
            </h3>
          </div>
          
          <div className="card-footer">
            <button 
              className="hint-button"
              onClick={onShowHint}
              disabled={!card.hint}
            >
              <Lightbulb size={16} />
              Hint
            </button>
            
            <button 
              className="flip-button"
              onClick={handleFlip}
            >
              <RotateCcw size={16} />
              Flip Card
            </button>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="card-face card-back"
          style={{ 
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="card-header">
            <div className="card-suit">♠</div>
            <div className="card-corner">A</div>
            <button 
              className="flip-button top-right"
              onClick={handleFlip}
            >
              <RotateCcw size={16} />
              Flip Back
            </button>
          </div>
          
          <div className="card-content">
            <h3 className="card-answer">Answer</h3>
            <div className="answer-content">
              {displayAnswer}
            </div>
          </div>
          
          <div className="card-footer">
            {/* Footer content can be empty or used for other purposes */}
          </div>
        </motion.div>
      </motion.div>

      {/* Hint display */}
      {showHint && card.hint && (
        <motion.div
          className="hint-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="hint-icon">
            <Lightbulb size={16} />
          </div>
          <div className="hint-text">{card.hint}</div>
        </motion.div>
      )}
    </div>
  );
};

export default Flashcard;
