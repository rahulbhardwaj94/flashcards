import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText } from 'lucide-react';
import './CardForm.css';

const CardForm = ({ card, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    question: '',
    hint: '',
    answer: ''
  });

  useEffect(() => {
    if (card) {
      setFormData({
        question: card.question || '',
        hint: card.hint || '',
        answer: card.answer || ''
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.question.trim() && formData.answer.trim()) {
      onSubmit(formData);
    }
  };

  const isEditing = !!card;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title">
              <FileText className="modal-icon" />
              <h3>{isEditing ? 'Edit Flashcard' : 'Create New Flashcard'}</h3>
            </div>
            <motion.button
              className="close-btn"
              onClick={onCancel}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="card-form">
            <div className="form-group">
              <label htmlFor="question">Question/Concept</label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="What would you like to learn or review?"
                required
                rows={3}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hint">Hint (Optional)</label>
              <textarea
                id="hint"
                name="hint"
                value={formData.hint}
                onChange={handleChange}
                placeholder="A helpful clue to guide the learner..."
                rows={2}
                className="form-textarea"
              />
              <small className="form-help">This will be shown when the hint button is clicked</small>
            </div>

            <div className="form-group">
              <label htmlFor="answer">Answer/Explanation</label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Provide a detailed explanation or answer..."
                required
                rows={4}
                className="form-textarea"
              />
              <small className="form-help">This will be shown when the card is flipped</small>
            </div>

            <div className="form-actions">
              <motion.button
                type="button"
                className="cancel-btn"
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={16} />
                {isEditing ? 'Update Card' : 'Create Card'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardForm;
