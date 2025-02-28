function ErrorBoundary({ children }) {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        window.onerror = (message, source, lineno, colno, error) => {
            console.error('Global error:', { message, source, lineno, colno, error });
            setHasError(true);
            setError(error);
            return false;
        };
    }, []);

    if (hasError) {
        return React.createElement('div', { style: { color: 'red' } },
            'Something went wrong:',
            React.createElement('pre', null, error?.toString())
        );
    }

    return children;
}

function App({ unit, contentType, contentTitle }) {
    console.log('App rendering, checking dependencies...');
    console.log('SectionContext available:', !!window.SectionContext);
    console.log('SectionContent available:', !!window.SectionContent);
    console.log('Loading available:', !!window.Loading);
    
    console.log('App rendering with:', { unit, contentType, contentTitle });
    
    return React.createElement(
        ErrorBoundary,
        null,
        React.createElement(
            window.SectionContext.SectionProvider,
            { initialSection: unit || '1' },
            React.createElement(window.SectionContent, {
                contentType: contentType || 'Prose',
                contentTitle: contentTitle || 'Introduction'
            })
        )
    );
}

window.App = App; 
