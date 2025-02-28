import { SectionProvider } from './context/SectionContext';
import Navigation from './components/Navigation';
import SectionContent from './components/SectionContent';

function App({ unit, contentType, contentTitle }) {
    return (
        <SectionProvider initialSection={unit}>
            <Navigation />
            <div className="content-wrapper">
                <SectionContent 
                    contentType={contentType}
                    contentTitle={contentTitle}
                />
            </div>
        </SectionProvider>
    );
}

export default App; 