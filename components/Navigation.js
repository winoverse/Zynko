function Navigation() {
    const { currentSection, sections, nextSection, previousSection } = React.useContext(window.SectionContext.SectionContext);

    return React.createElement(
        'nav',
        { className: 'section-navigation' },
        [
            React.createElement(
                'button',
                {
                    key: 'prev',
                    onClick: previousSection,
                    disabled: currentSection === 1,
                    className: 'nav-button prev'
                },
                '← Previous'
            ),
            React.createElement(
                'span',
                { key: 'indicator', className: 'section-indicator' },
                `Section ${currentSection}`
            ),
            React.createElement(
                'button',
                {
                    key: 'next',
                    onClick: nextSection,
                    disabled: currentSection === Object.keys(sections).length,
                    className: 'nav-button next'
                },
                'Next →'
            )
        ]
    );
}

window.Navigation = Navigation; 
