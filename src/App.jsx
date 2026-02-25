import React, { useState } from 'react';
import { questions } from './data/questions';
import QuestionCard from './components/QuestionCard';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
    const [activeQuestions, setActiveQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const getFiveRandom = () => {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        setActiveQuestions(shuffled.slice(0, 5));
        setScore(0);
        setCurrentIndex(0);
        setIsComplete(false);
    };

    const handleCorrect = () => {
        setScore(prev => prev + 1);
    };

    const handleNext = () => {
        if (currentIndex < activeQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Quiz Master</h1>
                <p>Test your coding knowledge across C, Python, Java, and DBMS</p>
            </header>

            {!activeQuestions.length && (
                <section>
                    <button className="btn-primary" onClick={getFiveRandom}>
                        Give me 5 questions
                    </button>
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
                                key={activeQuestions[currentIndex].id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <QuestionCard
                                    data={activeQuestions[currentIndex]}
                                    onCorrect={handleCorrect}
                                    onNext={handleNext}
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
                    <button className="btn-primary" onClick={getFiveRandom}>
                        Try Another Set
                    </button>
                </motion.div>
            )}

            {activeQuestions.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8' }}>
                    <p>Ready to start? Click the button above to get your first set of questions!</p>
                </div>
            )}
        </div>
    );
}

export default App;
