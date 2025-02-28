function DidYouKnow() {
    const containerRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const { scrollYProgress } = window.motion.useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
    const didYouKnowData = sections[currentSection].didYouKnow;

    // Animation values based on scroll
    const opacity = window.motion.useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = window.motion.useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    React.useEffect(() => {
        // Three.js setup code...
    }, []);

    // Map configuration
    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const center = {
        lat: 20.2961,
        lng: 85.8245
    };

    const nestingSites = [
        {
            location: { lat: 19.2785, lng: 84.8739 },
            title: "Gahirmatha Marine Sanctuary"
        },
        {
            location: { lat: 19.6977, lng: 85.4517 },
            title: "Rushikulya River Mouth"
        }
    ];

    return React.createElement(
        window.motion.div,
        {
            className: 'did-you-know-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        React.createElement('h2', null, didYouKnowData.title),
        React.createElement('p', { className: 'content' }, didYouKnowData.content),
        React.createElement(
            'div',
            { className: 'facts-container' },
            didYouKnowData.facts.map((fact, index) =>
                React.createElement(
                    window.motion.div,
                    {
                        key: index,
                        className: 'fact-card',
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: index * 0.2 }
                    },
                    React.createElement('span', { className: 'fact-number' }, `#${index + 1}`),
                    React.createElement('p', null, fact)
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'animation-section' },
            React.createElement('canvas', { ref: canvasRef, className: 'turtle-animation' })
        ),
        React.createElement(
            window.motion.div,
            {
                className: 'map-section',
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8 }
            },
            React.createElement('h3', null, 'Nesting Sites in Odisha'),
            React.createElement(
                window.LoadScript,
                { googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY },
                React.createElement(window.GoogleMap, {
                    mapContainerStyle: mapContainerStyle,
                    center: center,
                    zoom: 8
                }, nestingSites.map((site, index) =>
                    React.createElement(window.Marker, {
                        key: index,
                        position: site.location,
                        title: site.title
                    })
                ))
            )
        )
    );
}

window.DidYouKnow = DidYouKnow; 
