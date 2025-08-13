import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lightbulb, RotateCcw, Edit3, Trash2 } from 'lucide-react';
import Flashcard from './Flashcard';
import CardForm from './CardForm';
import './FlashcardDeck.css';

const FlashcardDeck = ({ topic, onBack, onUpdateCard, onDeleteCard }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const currentCard = topic.cards[currentCardIndex];
  const totalCards = topic.cards.length;
  const isFirstCard = currentCardIndex === 0;
  const isLastCard = currentCardIndex === totalCards - 1;

  // Debug logging
  console.log('FlashcardDeck - Topic:', topic);
  console.log('FlashcardDeck - Current card index:', currentCardIndex);
  console.log('FlashcardDeck - Current card:', currentCard);
  console.log('FlashcardDeck - Total cards:', totalCards);

  const goToNextCard = () => {
    if (!isLastCard) {
      setCurrentCardIndex(prev => prev + 1);
      setShowHint(false);
    }
  };

  const goToPreviousCard = () => {
    if (!isFirstCard) {
      setCurrentCardIndex(prev => prev - 1);
      setShowHint(false);
    }
  };

  const goToCard = (index) => {
    setCurrentCardIndex(index);
    setShowHint(false);
  };

  const handleUpdateCard = (cardData) => {
    onUpdateCard(topic.id, editingCard.id, cardData);
    setShowCardForm(false);
    setEditingCard(null);
  };

  const openCardForm = (card) => {
    setEditingCard(card);
    setShowCardForm(true);
  };

  const confirmDeleteCard = (card) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDeleteCard(topic.id, card.id);
      // If we're deleting the current card and it's the last one, go back one
      if (currentCardIndex === totalCards - 1 && currentCardIndex > 0) {
        setCurrentCardIndex(prev => prev - 1);
      }
    }
  };

  if (totalCards === 0) {
    return (
      <div className="flashcard-deck">
        <div className="deck-header">
          <motion.button
            className="back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Back to Topics
          </motion.button>
          <h2 className="deck-title">{topic.name}</h2>
        </div>
        
        <div className="empty-deck">
          <h3>No flashcards yet</h3>
          <p>Add some flashcards to start learning!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-deck">
      <div className="deck-header">
        <motion.button
          className="back-btn"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Topics
        </motion.button>
        <h2 className="deck-title">{topic.name}</h2>
        <div className="deck-info">
          <span className="card-counter">
            {currentCardIndex + 1} of {totalCards}
          </span>
        </div>
      </div>

      <div className="deck-content">
        <div className="flashcard-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Flashcard
                card={currentCard}
                showHint={showHint}
                onShowHint={() => setShowHint(true)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="card-actions">
          <motion.button
            className="action-btn hint-btn"
            onClick={() => setShowHint(!showHint)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!currentCard.hint}
          >
            <Lightbulb size={20} />
            <span>Show Hint</span>
          </motion.button>

          <motion.button
            className="action-btn edit-btn"
            onClick={() => openCardForm(currentCard)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit3 size={20} />
            <span>Edit</span>
          </motion.button>

          <motion.button
            className="action-btn delete-btn"
            onClick={() => confirmDeleteCard(currentCard)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 size={20} />
            <span>Delete</span>
          </motion.button>
        </div>

        <div className="card-navigation">
          <motion.button
            className="nav-btn prev-btn"
            onClick={goToPreviousCard}
            disabled={isFirstCard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Previous
          </motion.button>

          <div className="card-dots">
            {topic.cards.map((_, index) => (
              <motion.button
                key={index}
                className={`dot ${index === currentCardIndex ? 'active' : ''}`}
                onClick={() => goToCard(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>

          <motion.button
            className="nav-btn next-btn"
            onClick={goToNextCard}
            disabled={isLastCard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Card Form Modal */}
      <AnimatePresence>
        {showCardForm && (
          <CardForm
            card={editingCard}
            onSubmit={handleUpdateCard}
            onCancel={() => {
              setShowCardForm(false);
              setEditingCard(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardDeck;
