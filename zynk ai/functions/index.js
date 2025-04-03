require('dotenv').config();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dialogflow = require('@google-cloud/dialogflow-cx');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const vision = require('@google-cloud/vision');
const speech = require('@google-cloud/speech');

// Add this at the start of your code to verify service account
const admin = require('firebase-admin');
console.log('Service Account Email:', serviceAccount.client_email);
console.log('Project ID:', serviceAccount.project_id);

// Initialize with explicit project ID
// Decode the Base64-encoded JSON key from Netlify environment variable
const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString()
);
console.log("Decoded Service Account Key:", process.env.GOOGLE_SERVICE_ACCOUNT_KEY);


console.log('Service Account Email:', serviceAccount.client_email);
console.log('Project ID:', serviceAccount.project_id);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

module.exports = admin;
// Then get Firestore instance
const db = admin.firestore();

// Initialize other clients
/* eslint-disable no-unused-vars */
const dialogflowClient = new dialogflow.SessionsClient({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: 'v1beta',
});
const textToSpeechClient = new TextToSpeechClient();
/* eslint-enable no-unused-vars */
const speechClient = new speech.SpeechClient();
const visionClient = new vision.ImageAnnotatorClient();

// Move this function to the root level (outside of processTextQuery)
function areTopicsRelated(previousContent, currentContent) {
  // Define topic categories with related keywords
  const topicCategories = {
    personal: [
      'name', 'age', 'grade', 'class', 'school', 'hobby', 'like', 'interest', 'favorite',
      'family', 'brother', 'sister', 'parent', 'mother', 'father', 'friend',
    ],
    academic: [
      'study', 'subject', 'math', 'science', 'physics', 'chemistry', 'biology',
      'history', 'geography', 'english', 'homework', 'exam', 'test', 'grade',
    ],
    learning: [
      'learn', 'understand', 'explain', 'help', 'question', 'concept', 'topic',
      'problem', 'solution', 'example', 'practice', 'method',
    ],
  };

  // Function to determine the topic category of a message
  function getMessageTopics(content) {
    const topics = new Set();
    for (const [category, keywords] of Object.entries(topicCategories)) {
      if (keywords.some((keyword) => content.toLowerCase().includes(keyword))) {
        topics.add(category);
      }
    }
    return topics;
  }

  const previousTopics = getMessageTopics(previousContent);
  const currentTopics = getMessageTopics(currentContent);

  // Check if there's any overlap in topics
  return [...previousTopics].some((topic) => currentTopics.has(topic));
}

// Main function
exports.processQuery = functions.https.onCall(async (data) => {
  try {
    const { type, content, userId } = data;
    let result;

    switch (type) {
    case 'text':
      result = await processTextQuery(content, userId);
      break;
    case 'voice':
      result = await processVoiceQuery(content, userId);
      break;
    case 'image':
      result = await processImageQuery(content, userId);
      break;
    default:
      throw new Error('Invalid query type');
    }

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

async function processTextQuery(text, userId) {
  try {
    console.log('Starting processTextQuery with:', { userId, text });

    // Get all conversation history from Firestore
    const chatRef = db.collection('students').doc(userId).collection('chatHistory');
    console.log('ChatRef path:', chatRef.path);

    let historySnapshot;
    try {
      // Test write permission first
      await chatRef.add({
        content: 'Test message',
        role: 'system',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'text',
        isImportant: false,
      });
      console.log('Write test successful');

      historySnapshot = await chatRef.orderBy('timestamp', 'asc').get();
      console.log('Read successful, documents count:', historySnapshot.size);
    } catch (dbError) {
      console.error('Firestore operation failed:', {
        error: dbError.message,
        code: dbError.code,
        details: dbError.details,
        path: chatRef.path,
      });
      throw dbError;
    }

    // First try Dialogflow for intent matching
    const dialogflowResponse = await processWithDialogflow(text);

    // If Dialogflow has a specific intent match, use its response
    if (dialogflowResponse && dialogflowResponse.match && dialogflowResponse.fulfillmentText) {
      // Store the Dialogflow response as important
      await db.collection('students').doc(userId).collection('chatHistory').add({
        content: text,
        role: 'user',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'text',
        isImportant: true,
        intent: dialogflowResponse.intent,
      });

      await db.collection('students').doc(userId).collection('chatHistory').add({
        content: dialogflowResponse.fulfillmentText,
        role: 'assistant',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'text',
        isImportant: true,
        intent: dialogflowResponse.intent,
      });

      return {
        message: dialogflowResponse.fulfillmentText,
        audioUrl: null,
        visualData: null,
      };
    }

    // If no Dialogflow match, proceed with Gemini processing
    const conversationHistory = historySnapshot.docs
      .map((doc) => ({
        role: doc.data().role,
        content: doc.data().content,
        isImportant: doc.data().isImportant || false,
        type: doc.data().type,
        timestamp: doc.data().timestamp,
      }))
      .filter((msg) => {
        // Keep messages that are:
        // 1. Marked as important AND related to current topic
        const isImportantAndRelevant = msg.isImportant &&
          areTopicsRelated(msg.content, text);

        // 2. Contains user information
        const isUserInfo = isImportantUserInformation(msg.content);

        // 3. Part of the current topic discussion
        const isRelevantToCurrentTopic = areTopicsRelated(msg.content, text);

        return isUserInfo || isImportantAndRelevant || isRelevantToCurrentTopic;
      })
      // Sort by timestamp to maintain conversation flow
      .sort((a, b) => {
        return a.timestamp.toMillis() - b.timestamp.toMillis();
      });

    // Update the context prompt
    const contextPrompt = `
      Previous relevant interactions:
      ${conversationHistory.map((msg) =>
    `${msg.role}: ${msg.content} ${msg.isImportant ? '[Important]' : ''}`,
  ).join('\n')}
      
      Current user message: ${text}
      
      As an educational AI assistant:
      1. Consider the conversation history that is relevant to the current topic
      2. Format your response with clear structure:
         - Use headings with "##" for main sections
         - Use "-" for bullet points
         - Use ">" for important quotes or highlights
         - Use "**" for emphasis
         - Add line breaks between sections
         - Use numbered lists when appropriate
         - Keep paragraphs short and focused
      3. If the user shares personal information, mark it as [Important]
      4. If your response contains key educational concepts, mark it as [Important]
      5. Make the response visually scannable
      6. Respond directly without prefacing with "Responding to" or similar phrases
      7. Start your response naturally as part of a conversation
      8. Stay focused on the current topic unless the user specifically asks about something else
      9. Reference relevant past discussions if they add value to the current topic
    `;

    // Generate response
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    // Clean and format the AI message
    const cleanedMessage = aiMessage
      .replace(/\[Important:?[^\]]*\]/g, '') // Remove [Important] tags
      .replace(/Responding to.*?\n/i, '') // Remove "Responding to" prefix
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>
      .replace(/##(.*?)\n/g, '<h2>$1</h2>\n') // Convert ## headings to <h2>
      .replace(/- (.*?)\n/g, '• $1<br>') // Convert - bullets to •
      .replace(/>(.*?)\n/g, '<blockquote>$1</blockquote>\n') // Convert > to blockquote
      .replace(/\n\n/g, '<br><br>') // Convert double line breaks to <br>
      .trim();

    // Determine if messages should be stored
    const isUserMessageImportant = isImportantUserInformation(text);
    const isAIMessageImportant = isImportantEducationalContent(aiMessage);

    // Only store messages if they're important
    if (isUserMessageImportant) {
      await chatRef.add({
        content: text,
        role: 'user',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'text',
        isImportant: true,
        category: 'learning_context', // Add category for better organization
      });
    }

    if (isAIMessageImportant) {
      await chatRef.add({
        content: aiMessage,
        role: 'assistant',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: 'text',
        isImportant: true,
        category: 'educational_content', // Add category for better organization
      });
    }

    // Store minimal context for conversation flow
    if (!isUserMessageImportant && !isAIMessageImportant) {
      // Only store the last message pair if not important
      const recentMessages = await chatRef
        .orderBy('timestamp', 'desc')
        .limit(2)
        .get();

      if (recentMessages.empty) {
        // Store first-time conversation starter
        await chatRef.add({
          content: text,
          role: 'user',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          type: 'text',
          isImportant: false,
          category: 'context',
        });
      }
    }

    return {
      message: cleanedMessage,
      audioUrl: null,
      visualData: null,
    };
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      userId: userId,
      stack: error.stack,
    });
    return {
      message: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
      audioUrl: null,
      visualData: null,
    };
  }
}

// Update processWithDialogflow to return more detailed information
async function processWithDialogflow(text) {
  try {
    const projectId = process.env.PROJECT_ID;
    const location = process.env.DIALOGFLOW_LOCATION;
    const agentId = process.env.DIALOGFLOW_AGENT_ID;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const sessionPath = `projects/${projectId}/locations/${location}/agents/${agentId}/sessions/${sessionId}`;

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
        },
        languageCode: 'en',
      },
    };

    const [response] = await dialogflowClient.detectIntent(request);
    const result = response.queryResult;

    return {
      match: result.intentDetectionConfidence > 0.7, // Only use high-confidence matches
      intent: result.intent ? result.intent.displayName : null,
      fulfillmentText: result.fulfillmentText,
      parameters: result.parameters,
    };
  } catch (error) {
    console.error('Error in processWithDialogflow:', error);
    return null;
  }
}

async function processVoiceQuery(audioContent, userId) {
  try {
    console.log('Processing voice query for userId:', userId);

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioContent, 'base64');

    // Configure speech recognition request
    const request = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        model: 'default',
      },
    };

    // Perform speech recognition
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');

    console.log('Transcribed text:', transcription);

    // Process the transcribed text using existing text query function
    const result = await processTextQuery(transcription, userId);
    return {
      ...result,
      transcription, // Include transcription in response
    };
  } catch (error) {
    console.error('Error in voice processing:', error);
    throw error;
  }
}

async function processImageQuery(imageContent, userId) {
  try {
    // 1. Analyze image with Vision API
    const visionAnalysis = await analyzeImage(imageContent);

    // 2. Process with Gemini Vision
    const geminiResponse = await processWithGeminiVision(imageContent, visionAnalysis);

    return {
      message: geminiResponse.text,
      visualData: geminiResponse.visualData,
    };
  } catch (error) {
    console.error('Error in processImageQuery:', error);
    throw error;
  }
}

// Helper functions
async function analyzeImage(imageContent) {
  const request = {
    image: {
      content: imageContent,
    },
    features: [
      { type: 'LABEL_DETECTION' },
      { type: 'TEXT_DETECTION' },
      { type: 'OBJECT_LOCALIZATION' },
    ],
  };

  const [result] = await visionClient.annotateImage(request);
  return result;
}

async function processWithGeminiVision(imageContent, visionAnalysis) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-vision-flash',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
  const prompt = 'Analyze this image and provide educational insights. ' +
    `Vision API detected: ${JSON.stringify(visionAnalysis)}`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageContent,
        mimeType: 'image/jpeg',
      },
    },
  ]);
  const responseText = result.response.text();

  return {
    text: responseText,
    visualData: null,
  };
}

// Update the helper functions to be more specific
function isImportantUserInformation(text) {
  const importantPatterns = [
    // Learning preferences and goals
    /i want to learn about (.*?)(physics|chemistry|biology|math|science)/i,
    /my goal is to (.*?)(understand|learn|master|improve)/i,
    /i'm struggling with (.*?)(concept|topic|subject|problem)/i,
    /i don't understand (.*?)/i,

    // Academic context
    /i'm in (.*?)(grade|class|standard)/i,
    /my exam is (.*?)/i,
    /preparing for (.*?)(test|exam|competition)/i,

    // Personal context and learning style
    /i (like|love|enjoy|prefer) to learn by (.*?)/i,
    /i learn better when (.*?)/i,
    /i find it (difficult|easy|hard|challenging) to (.*?)/i,
    /my weakness is (.*?)/i,
    /my strength is (.*?)/i,

    // Study habits and environment
    /i study (in|at|when) (.*?)/i,
    /i spend (.*?) (hours|time) (studying|learning|practicing)/i,
    /i get (distracted|motivated|confused) by (.*?)/i,

    // Emotional context
    /i feel (.*?) when (studying|learning)/i,
    /i (worry|stress|anxiety) about (.*?)/i,
    /i'm (excited|interested|passionate) about (.*?)/i,
    /i'm (confused|frustrated|stuck) with (.*?)/i,

    // Personal goals and aspirations
    /i want to become (.*?)/i,
    /my dream is to (.*?)/i,
    /i aspire to (.*?)/i,
    /in the future, i want to (.*?)/i,

    // Learning background
    /i have studied (.*?) before/i,
    /my background in (.*?) is/i,
    /i'm familiar with (.*?)/i,
    /i have experience in (.*?)/i,

    // Specific learning needs
    /can you explain (.*?)/i,
    /help me understand (.*?)/i,
    /i need help with (.*?)/i,
    /could you teach me (.*?)/i,

    // Personal preferences
    /i prefer (visual|audio|practical|theoretical) learning/i,
    /i learn best through (.*?)/i,
    /it helps me when (.*?)/i,
    /my favorite way to learn is (.*?)/i,

    // Basic personal info
    /my name is (.*?)/i,
    /i am (\d+|a|an) (.*?)/i,
    /i live in (.*?)/i,
    /my native language is (.*?)/i,
  ];

  return importantPatterns.some((pattern) => pattern.test(text));
}

function isImportantEducationalContent(text) {
  const importantPatterns = [
    // Key concepts and definitions
    /(definition|meaning) of (.*?)/i,
    /important (concept|principle|law|theory|formula) (.*?)/i,
    /(key|core|fundamental) (concept|principle|idea) (.*?)/i,

    // Problem-solving and methods
    /steps? to solve (.*?)/i,
    /method for (solving|calculating|finding) (.*?)/i,
    /formula (for|to) (.*?)/i,

    // Examples and applications
    /practical (application|example) of (.*?)/i,
    /real[- ]world example of (.*?)/i,
    /common misconception about (.*?)/i,

    // Important markers
    /\[Important\]/i,
    /key takeaway/i,
    /remember that/i,
    /essential to understand/i,
  ];
  return importantPatterns.some((pattern) => pattern.test(text));
}
