function Loading() {
    return React.createElement(
        'div',
        { className: 'loading-container' },
        React.createElement(
            'div',
            { className: 'loading-spinner' }
        ),
        React.createElement(
            'p',
            { className: 'loading-text' },
            'Loading...'
        )
    );
}

window.Loading = Loading; 