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
        return React.createElement('div', { style: { color: 'red', padding: '20px' } },
            'Something went wrong:',
            React.createElement('pre', null, error?.toString())
        );
    }

    return children;
}

function App({ unit, contentType, contentTitle }) {
    console.log('App rendering with:', { unit, contentType, contentTitle });
    
    return React.createElement(
        window.SectionContext.SectionProvider,
        { initialSection: unit || '1' },
        React.createElement(window.SectionContent, {
            contentType: contentType || 'Prose',
            contentTitle: contentTitle || 'Introduction'
        })
    );
}

window.App = App;
console.log('App component registered'); 
