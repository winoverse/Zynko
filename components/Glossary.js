function Glossary() {
    const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
    const glossaryData = sections[currentSection].glossary;
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredWords = Object.values(glossaryData).filter(word =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const playPronunciation = async (word) => {
        try {
            const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_GOOGLE_API_KEY}`
                },
                body: JSON.stringify({
                    input: { text: word },
                    voice: { languageCode: 'en-US', name: 'en-US-Standard-C' },
                    audioConfig: { audioEncoding: 'MP3' }
                })
            });

            const { audioContent } = await response.json();
            const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
            await audio.play();
        } catch (error) {
            console.error("Error playing pronunciation:", error);
        }
    };

    const WordCard = ({ term }) => React.createElement(
        window.motion.div,
        {
            className: "word-card",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            whileHover: { scale: 1.02 }
        },
        [
            React.createElement('div', { key: 'header', className: "word-header" }, [
                React.createElement('h3', { key: 'word' }, term.word),
                React.createElement('button', {
                    key: 'btn',
                    className: "pronunciation-btn",
                    onClick: () => playPronunciation(term.word)
                }, '🔊 Listen')
            ]),
            React.createElement('div', { key: 'pron', className: "pronunciation" }, `/${term.pronunciation}/`),
            React.createElement('div', { key: 'meaning', className: "meaning" }, term.meaning),
            React.createElement('div', { key: 'examples', className: "examples" }, [
                React.createElement('h4', { key: 'title' }, 'Examples:'),
                React.createElement('ul', { key: 'list' }, 
                    term.examples.map((example, index) => 
                        React.createElement('li', { key: index }, example)
                    )
                )
            ]),
            React.createElement(window.motion.div, {
                key: 'animation',
                className: "word-animation",
                animate: { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                },
                transition: { duration: 2, repeat: Infinity }
            }, term.word)
        ]
    );

    return React.createElement(
        window.motion.div,
        {
            className: 'glossary-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5 }
        },
        React.createElement(
            'div',
            { className: 'search-container' },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Search words...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: 'search-input'
            })
        ),
        React.createElement(
            'div',
            { className: 'word-list' },
            filteredWords.map((word, index) =>
                React.createElement(
                    window.motion.div,
                    {
                        key: word.word,
                        className: 'word-card',
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: index * 0.1 }
                    },
                    React.createElement('h3', null, word.word),
                    React.createElement('p', { className: 'meaning' }, word.meaning),
                    React.createElement('p', { className: 'pronunciation' }, `Pronunciation: ${word.pronunciation}`),
                    React.createElement(
                        'div',
                        { className: 'examples' },
                        React.createElement('h4', null, 'Examples:'),
                        React.createElement(
                            'ul',
                            null,
                            word.examples.map((example, i) =>
                                React.createElement('li', { key: i }, example)
                            )
                        )
                    )
                )
            )
        )
    );
}

window.Glossary = Glossary; 
