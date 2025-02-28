function DidYouKnow() {
    const { currentSection, sections } = React.useContext(window.SectionContext.SectionContext);
    const didYouKnowData = sections[currentSection].didYouKnow;
    const mapRef = React.useRef(null);
    const [map, setMap] = React.useState(null);

    const nestingSites = [
        {
            location: [19.2785, 84.8739],
            title: "Gahirmatha Marine Sanctuary"
        },
        {
            location: [19.6977, 85.4517],
            title: "Rushikulya River Mouth"
        }
    ];

    React.useEffect(() => {
        if (!map && mapRef.current) {
            const newMap = L.map(mapRef.current).setView([20.2961, 85.8245], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(newMap);

            // Add markers for nesting sites
            nestingSites.forEach(site => {
                L.marker(site.location)
                    .bindPopup(site.title)
                    .addTo(newMap);
            });

            setMap(newMap);
        }
        return () => map?.remove();
    }, [mapRef.current]);

    return React.createElement(
        window.motion.div,
        {
            className: 'did-you-know-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        [
            React.createElement('h2', { key: 'title' }, didYouKnowData.title),
            React.createElement('p', { key: 'content', className: 'content' }, didYouKnowData.content),
            React.createElement(
                'div',
                { key: 'facts', className: 'facts-container' },
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
                        [
                            React.createElement('span', { key: 'num', className: 'fact-number' }, `#${index + 1}`),
                            React.createElement('p', { key: 'text' }, fact)
                        ]
                    )
                )
            ),
            React.createElement(
                window.motion.div,
                {
                    key: 'map',
                    className: 'map-section',
                    initial: { opacity: 0, y: 50 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.8 }
                },
                [
                    React.createElement('h3', { key: 'map-title' }, 'Nesting Sites in Odisha'),
                    React.createElement('div', {
                        key: 'map-container',
                        ref: mapRef,
                        style: { height: '400px', width: '100%' }
                    })
                ]
            )
        ]
    );
}

window.DidYouKnow = DidYouKnow; 
