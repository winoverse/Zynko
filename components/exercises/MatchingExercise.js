function MatchingExercise({ questions }) {
    const [selectedStart, setSelectedStart] = React.useState(null);
    const [matches, setMatches] = React.useState({});
    const [feedback, setFeedback] = React.useState(null);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleMatch = (start, end) => {
        if (selectedStart === start) {
            setSelectedStart(null);
        } else if (selectedStart === null) {
            setSelectedStart(start);
        } else {
            setMatches(prev => ({
                ...prev,
                [selectedStart]: end,
                [start]: matches[selectedStart]
            }));
            setSelectedStart(null);
        }
    };

    const handleSubmit = () => {
        const allCorrect = questions.every(q => matches[q.start] === q.end);
        setFeedback({
            type: allCorrect ? 'success' : 'error',
            message: allCorrect ? 'Perfect! All matches are correct!' : 'Some matches are incorrect. Try again!'
        });
        setIsSubmitted(allCorrect);
    };

    const resetExercise = () => {
        setMatches({});
        setSelectedStart(null);
        setFeedback(null);
        setIsSubmitted(false);
    };

    return React.createElement(
        window.motion.div,
        {
            className: 'matching-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        React.createElement('h3', null, 'Match the following'),
        React.createElement(
            'div',
            { className: 'matching-pairs' },
            questions.map((q, index) => 
                React.createElement(
                    window.motion.div,
                    {
                        key: index,
                        className: 'matching-pair',
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: index * 0.1 }
                    },
                    [
                        React.createElement(
                            'button',
                            {
                                key: 'start',
                                className: `match-button ${selectedStart === q.start ? 'selected' : ''} 
                                         ${matches[q.start] ? 'matched' : ''}`,
                                onClick: () => handleMatch(q.start, q.end)
                            },
                            q.start
                        ),
                        React.createElement(
                            window.motion.div,
                            {
                                key: 'line',
                                className: 'matching-line',
                                initial: { scaleX: 0 },
                                animate: { scaleX: matches[q.start] ? 1 : 0 },
                                transition: { duration: 0.3 }
                            }
                        ),
                        React.createElement(
                            'button',
                            {
                                key: 'end',
                                className: `match-button ${matches[q.start] === q.end ? 'matched' : ''}`,
                                onClick: () => handleMatch(q.start, q.end)
                            },
                            q.end
                        )
                    ]
                )
            )
        ),
        React.createElement(
            React.Fragment,
            null,
            feedback && React.createElement(
                window.motion.div,
                {
                    className: `feedback ${feedback.type}`,
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 }
                },
                feedback.message
            )
        ),
        React.createElement(
            'div',
            { className: 'exercise-controls' },
            !isSubmitted ? (
                React.createElement(
                    'button',
                    {
                        className: 'submit-btn',
                        onClick: handleSubmit,
                        disabled: Object.keys(matches).length !== questions.length
                    },
                    'Submit'
                )
            ) : (
                React.createElement(
                    'button',
                    {
                        className: 'reset-btn',
                        onClick: resetExercise
                    },
                    'Try Again'
                )
            )
        )
    );
}

window.MatchingExercise = MatchingExercise; 
