import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const QuestionCard = ({ data, savedState, onUpdate, onNext, onPrev, isFirst, isLast }) => {
    const [selected, setSelected] = useState(savedState?.selected || null);
    const [validated, setValidated] = useState(savedState?.validated || false);

    // Sync local state when moving between questions
    useEffect(() => {
        setSelected(savedState?.selected || null);
        setValidated(savedState?.validated || false);
    }, [savedState]);

    const handleSelect = (label) => {
        if (validated) return;
        setSelected(label);
        onUpdate({ selected: label, validated: false });
    };

    const handleValidate = () => {
        if (selected === null) return;
        setValidated(true);
        onUpdate({ selected, validated: true });
    };

    const getOptionClass = (optionLabel) => {
        if (!validated) {
            return selected === optionLabel ? 'option-btn selected' : 'option-btn';
        }

        if (optionLabel === data.answer) {
            return 'option-btn correct';
        }
        if (selected === optionLabel && selected !== data.answer) {
            return 'option-btn incorrect';
        }
        return 'option-btn muted';
    };

    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="question-card">
            <div className="question-meta">
                <span className="badge badge-category">{data.category}</span>
                <span className="badge badge-difficulty">{data.difficulty}</span>
            </div>

            <h3 className="question-text">{data.question}</h3>

            <div className="options-grid">
                {data.options.map((optionText, index) => {
                    const label = optionLabels[index];
                    return (
                        <button
                            key={label}
                            className={getOptionClass(label)}
                            onClick={() => handleSelect(label)}
                            disabled={validated}
                        >
                            <span className="option-label">{label}</span>
                            <span className="option-text-content">{optionText}</span>
                        </button>
                    );
                })}
            </div>

            <div className="card-footer">
                <div className="nav-buttons">
                    {!isFirst && (
                        <button className="btn-secondary" onClick={onPrev}>
                            <ArrowLeft size={18} /> Previous
                        </button>
                    )}

                    {!validated ? (
                        <button
                            className="btn-result"
                            onClick={handleValidate}
                            disabled={selected === null}
                        >
                            Check Result
                        </button>
                    ) : (
                        <div className="footer-validated">
                            <div className={`validation-msg ${selected === data.answer ? 'text-correct' : 'text-incorrect'}`}>
                                {selected === data.answer ? (
                                    <><CheckCircle2 size={20} /> Correct!</>
                                ) : (
                                    <><XCircle size={20} /> Incorrect</>
                                )}
                            </div>
                            <button className="btn-next" onClick={onNext}>
                                {isLast ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
