import React, { useEffect, useRef, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { SectionContext } from '../context/SectionContext';

const DidYouKnow = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const { currentSection, sections } = useContext(SectionContext);
    const didYouKnowData = sections[currentSection].didYouKnow;

    // Animation values based on scroll
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    // Three.js turtle animation
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        
        // Set up scene
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        camera.position.z = 5;

        // Create turtle geometry
        const turtleGeometry = new THREE.Group();
        const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        turtleGeometry.add(body);

        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 2);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        // Add turtle to scene
        scene.add(turtleGeometry);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            turtleGeometry.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            scene.remove(turtleGeometry);
            renderer.dispose();
        };
    }, []);

    // Map configuration
    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const center = {
        lat: 20.2961,
        lng: 85.8245 // Coordinates for Odisha
    };

    const nestingSites = [
        {
            location: { lat: 19.2785, lng: 84.8739 },
            title: "Gahirmatha Marine Sanctuary"
        },
        {
            location: { lat: 19.6977, lng: 85.4517 },
            title: "Rushikulya River Mouth"
        }
    ];

    return React.createElement(
        motion.div,
        {
            className: 'did-you-know-container',
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5 }
        },
        React.createElement('h2', null, didYouKnowData.title),
        React.createElement('p', { className: 'content' }, didYouKnowData.content),
        React.createElement(
            'div',
            { className: 'facts-container' },
            didYouKnowData.facts.map((fact, index) =>
                React.createElement(
                    motion.div,
                    {
                        key: index,
                        className: 'fact-card',
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: index * 0.2 }
                    },
                    React.createElement('span', { className: 'fact-number' }, `#${index + 1}`),
                    React.createElement('p', null, fact)
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'animation-section' },
            React.createElement('canvas', { ref: canvasRef, className: 'turtle-animation' })
        ),
        React.createElement(
            motion.div,
            {
                className: 'map-section',
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8 }
            },
            React.createElement('h3', null, 'Nesting Sites in Odisha'),
            React.createElement(
                LoadScript,
                { googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY },
                React.createElement(GoogleMap, {
                    mapContainerStyle: mapContainerStyle,
                    center: center,
                    zoom: 8
                }, nestingSites.map((site, index) =>
                    React.createElement(Marker, {
                        key: index,
                        position: site.location,
                        title: site.title
                    })
                ))
            )
        )
    );
};

export default DidYouKnow; 
