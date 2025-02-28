import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase-config';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase-config';
import { SectionContext } from '../context/SectionContext';
import WordFill from './exercises/WordFill';
import MatchingExercise from './exercises/MatchingExercise';
import SeaWordsExercise from './exercises/SeaWordsExercise';

const Quiz = () => {
    const { currentSection, sections } = useContext(SectionContext);
    const quizData = sections[currentSection].quiz;
    const [currentQuestionType, setCurrentQuestionType] = useState('questions'); // ['questions', 'vocabulary', 'listening']
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [questions, setQuestions] = useState([]);

    // Quiz questions
    const quizQuestions = [
        {
            statement: "Turtles are different from tortoises.",
            isCorrect: true,
            explanation: "Yes, turtles and tortoises are different species with distinct characteristics."
        },
        {
            statement: "Turtles are sea animals.",
            isCorrect: true,
            explanation: "Correct! Sea turtles spend almost their entire life in the sea."
        },
        {
            statement: "There are seven kinds of sea turtles in the world.",
            isCorrect: true,
            explanation: "Yes, there are exactly seven species of sea turtles globally."
        },
        {
            statement: "Sea turtles are very small.",
            isCorrect: false,
            explanation: "No, sea turtles are actually quite large. Even the smallest species weighs up to 35 kg!"
        },
        {
            statement: "Turtles come ashore to lay eggs.",
            isCorrect: true,
            explanation: "Correct! Sea turtles must come ashore to lay their eggs."
        },
        {
            statement: "Sea turtles come to rest on land.",
            isCorrect: false,
            explanation: "No, sea turtles only come to land to lay eggs, not to rest."
        },
        {
            statement: "Olive Ridleys are the only sea turtles seen on Indian shores.",
            isCorrect: false,
            explanation: "No, while Olive Ridleys are common, there are other species found on Indian shores as well."
        }
    ];

    // Initialize quiz
    useEffect(() => {
        // Randomize questions
        const shuffledQuestions = [...quizQuestions]
            .sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        
        // Start timer when quiz begins
        if (isActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isActive, timeLeft]);

    // Watch for timer end
    useEffect(() => {
        if (timeLeft === 0) {
            endQuiz();
        }
    }, [timeLeft]);

    // Load leaderboard
    useEffect(() => {
        const leaderboardRef = collection(db, 'leaderboard');
        const q = query(leaderboardRef, orderBy('score', 'desc'), limit(5));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leaderboardData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaderboard(leaderboardData);
        });

        return () => unsubscribe();
    }, []);

    const handleAnswer = async (answer) => {
        const currentQ = questions[currentQuestion];
        const isCorrect = answer === currentQ.isCorrect;

        // Show immediate feedback
        await showFeedback(isCorrect, currentQ.explanation);

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Move to next question or end quiz
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            endQuiz();
        }
    };

    const showFeedback = async (isCorrect, explanation) => {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="feedback-text">${explanation}</div>
        `;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    };

    const startQuiz = () => {
        setIsActive(true);
        setTimeLeft(30);
        setScore(0);
        setCurrentQuestion(0);
        setShowResults(false);
    };

    const endQuiz = async () => {
        setIsActive(false);
        setShowResults(true);

        // Save score to leaderboard
        try {
            const user = auth.currentUser; // Get current user from Firebase Auth
            if (user) {
                await addDoc(collection(db, 'leaderboard'), {
                    userId: user.uid,
                    name: user.name || 'Anonymous',
                    score: score,
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    // Render different question types
    const renderQuestionsByType = () => {
        switch(currentQuestionType) {
            case 'questions':
                return <MultipleChoiceQuestions questions={quizData.questions} />;
            case 'vocabulary':
                return (
                    <>
                        <WordFill questions={quizData.vocabulary.wordFill} />
                        <MatchingExercise questions={quizData.vocabulary.matching} />
                        <SeaWordsExercise data={quizData.vocabulary.seaWords} />
                    </>
                );
            case 'listening':
                return <Listening data={quizData.listening} />;
            default:
                return null;
        }
    };

    return (
        <motion.div 
            className="quiz-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="quiz-navigation">
                <button 
                    onClick={() => setCurrentQuestionType('questions')}
                    className={currentQuestionType === 'questions' ? 'active' : ''}
                >
                    Quiz Questions
                </button>
                <button 
                    onClick={() => setCurrentQuestionType('vocabulary')}
                    className={currentQuestionType === 'vocabulary' ? 'active' : ''}
                >
                    Vocabulary
                </button>
                <button 
                    onClick={() => setCurrentQuestionType('listening')}
                    className={currentQuestionType === 'listening' ? 'active' : ''}
                >
                    Listening
                </button>
            </div>

            {renderQuestionsByType()}
        </motion.div>
    );
};

export default Quiz; 