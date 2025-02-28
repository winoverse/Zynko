function Loading() {
    console.log('Loading component rendered');
    return React.createElement(
        'div',
        { className: 'loading-container' },
        React.createElement('div', { className: 'loading-spinner' }),
        React.createElement('p', null, 'Loading content...')
    );
}

window.Loading = Loading;
console.log('Loading component registered'); 
