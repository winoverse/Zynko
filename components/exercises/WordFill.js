function WordFill({ questions }) {
    const [answers, setAnswers] = React.useState({});

    return React.createElement(
        'div',
        { className: 'word-fill-container' },
        React.createElement('h3', null, 'Fill in the blanks'),
        questions.map((q, index) => 
            React.createElement(
                'div',
                { key: index, className: 'word-fill-question' },
                q.sentence.split('___').map((part, i, arr) => 
                    React.createElement(
                        React.Fragment,
                        { key: i },
                        part,
                        i < arr.length - 1 && React.createElement(
                            'span',
                            { className: 'word-options' },
                            q.options.map(option => 
                                React.createElement(
                                    'button',
                                    {
                                        key: option,
                                        onClick: () => setAnswers({...answers, [index]: option}),
                                        className: answers[index] === option ? 'selected' : ''
                                    },
                                    option
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}

window.WordFill = WordFill; 
