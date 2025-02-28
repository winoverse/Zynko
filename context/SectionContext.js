const SectionContext = React.createContext();

function SectionProvider({ children, initialSection }) {
    console.log('SectionProvider initializing with section:', initialSection);
    
    const [currentSection, setCurrentSection] = React.useState(initialSection);
    
    // Add basic sections data
    const sections = {
        '1': {
            prose: {
                title: "Introduction to Sea Turtles",
                content: "<p>Welcome to the world of sea turtles!</p>"
            }
        }
    };

    const value = {
        currentSection,
        setCurrentSection,
        sections
    };

    console.log('SectionProvider value:', value);
    return React.createElement(SectionContext.Provider, { value }, children);
}

window.SectionContext = {
    SectionContext,
    SectionProvider
};

console.log('SectionContext initialized'); 
