import React, { useState } from 'react';

const WordFill = ({ questions }) => {
    const [answers, setAnswers] = useState({});

    return (
        <div className="word-fill-container">
            <h3>Fill in the blanks</h3>
            {questions.map((q, index) => (
                <div key={index} className="word-fill-question">
                    {q.sentence.split('___').map((part, i, arr) => (
                        <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <span className="word-options">
                                    {q.options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setAnswers({...answers, [index]: option})}
                                            className={answers[index] === option ? 'selected' : ''}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default WordFill; 