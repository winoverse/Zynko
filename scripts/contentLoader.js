// This script will initialize the React app with the correct content
document.addEventListener('DOMContentLoaded', () => {
    const selectedUnit = localStorage.getItem('selectedUnit');
    const contentType = localStorage.getItem('contentType');
    const contentTitle = localStorage.getItem('contentTitle');

    // Initialize your React app with these values
    const root = document.getElementById('root');
    ReactDOM.render(
        React.createElement(window.App, {
            unit: selectedUnit,
            contentType: contentType,
            contentTitle: contentTitle
        }),
        root
    );
}); 
