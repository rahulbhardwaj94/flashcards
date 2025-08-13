import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Edit3, Trash2, Sparkles, BookOpen, PlusCircle } from 'lucide-react';
import TopicForm from './TopicForm';
import CardForm from './CardForm';
import AIQuestionGenerator from './AIQuestionGenerator';
import './TopicPanel.css';

const TopicPanel = ({ 
  topics, 
  onAddTopic, 
  onUpdateTopic, 
  onDeleteTopic, 
  onAddCard, 
  onUpdateCard, 
  onDeleteCard, 
  onStartRevision,
  onAddAICards
}) => {
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedTopicForAI, setSelectedTopicForAI] = useState(null);
  const [selectedTopicForCard, setSelectedTopicForCard] = useState(null);

  const handleAddTopic = (topicData) => {
    onAddTopic(topicData);
    setShowTopicForm(false);
  };

  const handleUpdateTopic = (topicData) => {
    onUpdateTopic(editingTopic.id, topicData);
    setEditingTopic(null);
    setShowTopicForm(false);
  };

  const handleAddCard = (cardData) => {
    onAddCard(selectedTopicForCard.id, cardData);
    setShowCardForm(false);
    setSelectedTopicForCard(null);
  };

  const handleUpdateCard = (cardData) => {
    onUpdateCard(selectedTopicForCard.id, editingCard.id, cardData);
    setEditingCard(null);
    setShowCardForm(false);
    setSelectedTopicForCard(null);
  };

  const handleAIGeneration = (topicId, aiCards) => {
    // Add the AI-generated cards to the topic using the parent function
    if (onAddAICards) {
      onAddAICards(topicId, aiCards);
      setShowAIGenerator(false);
      setSelectedTopicForAI(null);
    }
  };

  const openCardForm = (topic, card = null) => {
    setSelectedTopicForCard(topic);
    setEditingCard(card);
    setShowCardForm(true);
  };

  const openTopicForm = (topic = null) => {
    setEditingTopic(topic);
    setShowTopicForm(true);
  };

  const openAIGenerator = (topic) => {
    setSelectedTopicForAI(topic);
    setShowAIGenerator(true);
  };

  const confirmDelete = (topic) => {
    if (window.confirm(`Are you sure you want to delete "${topic.name}" and all its ${topic.cards.length} cards?`)) {
      onDeleteTopic(topic.id);
    }
  };

  const confirmDeleteCard = (topic, card) => {
    if (window.confirm(`Are you sure you want to delete this card?`)) {
      onDeleteCard(topic.id, card.id);
    }
  };

  return (
    <div className="topic-panel">
      <div className="panel-header">
        <h2 className="panel-title">Your Learning Topics</h2>
        <motion.button
          className="add-topic-btn"
          onClick={() => openTopicForm()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="btn-icon" />
          Add Topic
        </motion.button>
      </div>

      {topics.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen className="empty-icon" />
          <h3>No topics yet</h3>
          <p>Create your first learning topic to get started!</p>
          <motion.button
            className="empty-state-btn"
            onClick={() => openTopicForm()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="btn-icon" />
            Create First Topic
          </motion.button>
        </motion.div>
      ) : (
        <div className="topics-grid">
          <AnimatePresence>
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className="topic-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: 'var(--shadow-xl)' }}
              >
                <div className="topic-header">
                  <h3 className="topic-name">{topic.name}</h3>
                  <div className="topic-actions">
                    <motion.button
                      className="action-btn edit-btn"
                      onClick={() => openTopicForm(topic)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit topic"
                    >
                      <Edit3 size={16} />
                    </motion.button>
                    <motion.button
                      className="action-btn delete-btn"
                      onClick={() => confirmDelete(topic)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete topic"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
                
                <p className="topic-description">{topic.description}</p>
                
                <div className="topic-stats">
                  <span className="card-count">
                    {topic.cards.length} card{topic.cards.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="topic-cards">
                  {topic.cards.length > 0 ? (
                    <div className="cards-preview">
                      {topic.cards.slice(0, 3).map((card) => (
                        <div key={card.id} className="card-preview">
                          <span className="card-preview-text">{card.question}</span>
                          <div className="card-preview-actions">
                            <motion.button
                              className="preview-action-btn edit-btn"
                              onClick={() => openCardForm(topic, card)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit card"
                            >
                              <Edit3 size={14} />
                            </motion.button>
                            <motion.button
                              className="preview-action-btn delete-btn"
                              onClick={() => confirmDeleteCard(topic, card)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete card"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                      {topic.cards.length > 3 && (
                        <div className="more-cards">
                          +{topic.cards.length - 3} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-cards">
                      <p>No cards yet</p>
                    </div>
                  )}
                </div>

                <div className="topic-footer">
                  <motion.button
                    className="action-btn add-card-btn"
                    onClick={() => openCardForm(topic)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} />
                    Add Card
                  </motion.button>
                  
                  <motion.button
                    className="action-btn ai-generate-btn"
                    onClick={() => openAIGenerator(topic)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles size={16} />
                    Create with AI
                  </motion.button>
                  
                  <motion.button
                    className="action-btn start-revision-btn"
                    onClick={() => onStartRevision(topic)}
                    disabled={topic.cards.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={16} />
                    Start Revision
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Topic Form Modal */}
      <AnimatePresence>
        {showTopicForm && (
          <TopicForm
            topic={editingTopic}
            onSubmit={editingTopic ? handleUpdateTopic : handleAddTopic}
            onCancel={() => {
              setShowTopicForm(false);
              setEditingTopic(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Card Form Modal */}
      <AnimatePresence>
        {showCardForm && (
          <CardForm
            card={editingCard}
            onSubmit={editingCard ? handleUpdateCard : handleAddCard}
            onCancel={() => {
              setShowCardForm(false);
              setEditingCard(null);
              setSelectedTopicForCard(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* AI Question Generator Modal */}
      <AnimatePresence>
        {showAIGenerator && (
          <AIQuestionGenerator
            topic={selectedTopicForAI}
            onGenerate={handleAIGeneration}
            onCancel={() => {
              setShowAIGenerator(false);
              setSelectedTopicForAI(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicPanel;
