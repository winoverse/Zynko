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

    return (
        <div ref={containerRef} className="did-you-know-container">
            <motion.div 
                className="title-section"
                style={{ opacity, scale }}
            >
                <h2>Did You Know?</h2>
                <h3>{didYouKnowData.title}</h3>
            </motion.div>

            <div className="content-section">
                <motion.div 
                    className="text-content"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p>{didYouKnowData.content}</p>
                </motion.div>

                <div className="animation-section">
                    <canvas ref={canvasRef} className="turtle-animation" />
                </div>
            </div>

            <motion.div 
                className="map-section"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h3>Nesting Sites in Odisha</h3>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={8}
                    >
                        {nestingSites.map((site, index) => (
                            <Marker
                                key={index}
                                position={site.location}
                                title={site.title}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </motion.div>

            <motion.div 
                className="fun-facts"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h3>Amazing Facts</h3>
                <ul>
                    {didYouKnowData.facts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};

export default DidYouKnow; 