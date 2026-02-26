import React, { useState, useMemo } from 'react';
import { questions } from './data/questions';
import QuestionCard from './components/QuestionCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';

function App() {
    const categories = useMemo(() => [...new Set(questions.map(q => q.category))], []);
    const [selectedCategories, setSelectedCategories] = useState(categories);
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
    const [userAnswers, setUserAnswers] = useState([]); // [{selected: null, validated: false}]

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const getFiveRandom = () => {
        const pool = questions.filter(q =>
            selectedCategories.includes(q.category) &&
            q.difficulty === selectedDifficulty
        );
        if (pool.length === 0) return;

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, Math.min(5, pool.length));

        setActiveQuestions(selectedQuestions);
        setUserAnswers(new Array(selectedQuestions.length).fill(null).map(() => ({
            selected: null,
            validated: false
        })));
        setScore(0);
        setCurrentIndex(0);
        setIsComplete(false);
    };

    const handleAnswerUpdate = (index, newState) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = newState;
        setUserAnswers(newAnswers);

        // Update score dynamically based on validated correct answers
        const currentScore = newAnswers.reduce((acc, curr, i) => {
            if (curr.validated && curr.selected === activeQuestions[i].answer) {
                return acc + 1;
            }
            return acc;
        }, 0);
        setScore(currentScore);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Quiz Master</h1>
                <p>Test your coding knowledge across C, Python, Java, and DBMS</p>
            </header>

            {!activeQuestions.length && !isComplete && (
                <section className="setup-section">
                    <div className="category-filter">
                        <div className="filter-header">
                            <Filter size={18} />
                            <span>Select Categories</span>
                        </div>
                        <div className="category-chips">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`chip ${selectedCategories.includes(cat) ? 'active' : ''}`}
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="filter-actions">
                            <button className="text-btn" onClick={() => setSelectedCategories(categories)}>Select All</button>
                            <button className="text-btn" onClick={() => setSelectedCategories([])}>Clear All</button>
                        </div>
                    </div>

                    <div className="difficulty-selector" style={{ marginBottom: '2rem' }}>
                        <div className="filter-header">
                            <Filter size={18} />
                            <span>Select Difficulty</span>
                        </div>
                        <div className="category-chips">
                            {['Easy', 'Medium', 'Hard'].map(level => (
                                <button
                                    key={level}
                                    className={`chip ${selectedDifficulty === level ? 'active' : ''}`}
                                    onClick={() => setSelectedDifficulty(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={getFiveRandom}
                        disabled={selectedCategories.length === 0}
                    >
                        Start Quiz (5 Questions)
                    </button>
                    {selectedCategories.length === 0 && (
                        <p className="warning-text">Please select at least one category to start.</p>
                    )}
                </section>
            )}

            {activeQuestions.length > 0 && !isComplete && (
                <>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <span className="stat-value">{score}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{currentIndex + 1} / {activeQuestions.length}</span>
                            <span className="stat-label">Progress</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{Math.round((score / activeQuestions.length) * 100)}%</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                    </div>

                    <div className="questions-container">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <QuestionCard
                                    data={activeQuestions[currentIndex]}
                                    savedState={userAnswers[currentIndex]}
                                    onUpdate={(newState) => handleAnswerUpdate(currentIndex, newState)}
                                    onNext={() => {
                                        if (currentIndex < activeQuestions.length - 1) {
                                            setCurrentIndex(prev => prev + 1);
                                        } else {
                                            setIsComplete(true);
                                        }
                                    }}
                                    onPrev={handlePrev}
                                    isFirst={currentIndex === 0}
                                    isLast={currentIndex === activeQuestions.length - 1}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </>
            )}

            {isComplete && (
                <motion.div
                    className="completion-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2>Quiz Complete!</h2>
                    <div className="final-stats">
                        <div className="final-stat">
                            <span>Score</span>
                            <strong>{score} / {activeQuestions.length}</strong>
                        </div>
                        <div className="final-stat">
                            <span>Accuracy</span>
                            <strong>{Math.round((score / activeQuestions.length) * 100)}%</strong>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => {
                        setActiveQuestions([]);
                        setIsComplete(false);
                    }}>
                        Try Another Set
                    </button>
                </motion.div>
            )}

            {activeQuestions.length === 0 && !isComplete && (
                <div style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
                    <p>Configure your categories and click Start!</p>
                </div>
            )}
        </div>
    );
}

export default App;
