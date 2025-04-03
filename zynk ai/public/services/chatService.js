import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-functions.js";

class ChatService {
    constructor(firebaseApp) {
        this.functions = getFunctions(firebaseApp);
        this.processQuery = httpsCallable(this.functions, 'processQuery');
    }

    async sendTextQuery(text) {
        try {
            const result = await this.processQuery({
                type: 'text',
                content: text,
                timestamp: new Date().toISOString()
            });
            return result.data;
        } catch (error) {
            console.error('Error processing text query:', error);
            throw new Error('Failed to process text query: ' + error.message);
        }
    }

    async sendVoiceQuery(audioBlob) {
        try {
            const base64Audio = await this.blobToBase64(audioBlob);
            const result = await this.processQuery({
                type: 'voice',
                content: base64Audio,
                timestamp: new Date().toISOString()
            });
            return result.data;
        } catch (error) {
            console.error('Error processing voice query:', error);
            throw error;
        }
    }

    async sendImageQuery(imageBlob) {
        try {
            const base64Image = await this.blobToBase64(imageBlob);
            const result = await this.processQuery({
                type: 'image',
                content: base64Image,
                timestamp: new Date().toISOString()
            });
            return result.data;
        } catch (error) {
            console.error('Error processing image query:', error);
            throw error;
        }
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}

export { ChatService }; 