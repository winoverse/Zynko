function Loading() {
    return React.createElement(
        'div',
        { className: 'loading-container' },
        React.createElement('div', { className: 'loading-spinner' })
    );
}

window.Loading = Loading; 
