import React, { createContext, useState } from 'react';

export const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
    const [currentSection, setCurrentSection] = useState(1);
    const [progress, setProgress] = useState({
        1: { completed: false, score: 0 },
        2: { completed: false, score: 0 },
        3: { completed: false, score: 0 }
    });

    const sections = {
        1: {
            title: "Introduction to Sea Turtles",
            prose: {
                title: "Sea Turtles - Introduction",
                content: `Most of us have seen a tortoise in a zoo or a reptile park. However, not many
                would have seen its marine relative, the sea turtle. This is not surprising, since these
                reptiles spend almost their entire life in the sea.
                There are seven species of marine or sea turtles
                in the world. Of them, five are found in India's coastal
                waters: the Olive Ridley, the Hawksbill, the Green Sea
                Turtle, the Loggerhead and the Leatherback. Compared
                to most tortoises, sea turtles are huge. Even the smallest
                species, the Olive Ridley, weighs up to 35 kg when fully
                grown. The largest of them all, the Leatherback, grows to a
                length of 2.2m and each could weigh as much as 700 kg!
                Sea turtles live their life entirely in the oceans. But they still have a connection
                with land – they must come ashore to lay eggs. Today, four of the sea turtle species
                mentioned above have become extremely rare in India. The Olive Ridleys, however, are
                still commonly seen nesting on sandy beaches all along our coasts.`
            },
            glossary: {
                marine: {
                    word: "marine",
                    meaning: "found in the sea",
                    examples: ["Marine animals live in salt water.", "The marine ecosystem is vast and diverse."],
                    pronunciation: "mə-ˈrēn"
                },
                species: {
                    word: "species",
                    meaning: "group of animals with common features",
                    examples: ["There are many species of birds.", "Each species has unique characteristics."],
                    pronunciation: "ˈspē-ˌsēz"
                },
                coastal: {
                    word: "coastal",
                    meaning: "land by the edge of a sea",
                    examples: ["Coastal areas often have beautiful beaches.", "Many people live in coastal regions."],
                    pronunciation: "ˈkō-stəl"
                }
            },
            quiz: {
                questions: [
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
                    // ... other questions
                ]
            },
            didYouKnow: {
                title: "Arribada - The Mass Nesting Phenomenon",
                content: `In most parts of the world, Olive Ridleys come ashore alone to lay their eggs.
                However, Odisha is one of the only three places in the world where a phenomenon
                known as 'mass nesting' or Arribada takes place.`,
                facts: [
                    "Up to 600,000 turtles can nest in a single Arribada",
                    "Each turtle can lay around 100-150 eggs",
                    "The nesting usually occurs between November and April",
                    "Odisha's beaches are among the world's largest nesting sites"
                ]
            }
        },
        2: {
            title: "The Nesting Process",
            prose: {
                title: "Nesting Habits of Sea Turtles",
                content: `Between the months of January and March, female Olive Ridleys come ashore at
                night to lay their eggs. This is quite a problem for them, as a turtle's front flippers enable it
                to swim gracefully and effortlessly but are not very useful for moving on land. The turtle has
                to haul itself laboriously onto the beach. Then it chooses a spot well away from the high-tide
                line. Here, it scoops out a nest cavity 45 cm deep, into which it lays about 100 eggs. Each
                egg is in the shape and size of a table tennis ball. Once all the eggs are laid, the turtle fills
                in the cavity, then it camouflages the nest by tossing sand on it using its flippers. That
                done, it returns to the sea. The eggs are left to incubate under the warmth of the sun.
                In many places around the world, local people follow the tracks of the turtle
                to its nest. They collect the eggs for eating. Jackals, domestic dogs and pigs too dig up
                and eat the eggs by following the scent left by the turtle. Those eggs that escape such
                people and predators hatch 45–60 days later. The hatchlings slash open the leathery
                eggshell with the help of a tiny 'egg-tooth'. This is like a razor blade at the tip of a hatchling's
                snout. When most of the eggs have hatched, the hatchlings push themselves upwards
                through the sand and emerge on the surface of the beach. From here they make a
                hurried dash to the sea.`
            },
            glossary: {
                flippers: {
                    word: "flippers",
                    meaning: "broad, flat limbs used for swimming",
                    examples: ["The turtle uses its flippers to swim.", "Seals have powerful flippers."],
                    pronunciation: "ˈflipərz"
                },
                haul: {
                    word: "haul",
                    meaning: "pull with force",
                    examples: ["The turtle has to haul itself onto the beach.", "They hauled the heavy nets."],
                    pronunciation: "hôl"
                },
                laboriously: {
                    word: "laboriously",
                    meaning: "with great effort",
                    examples: ["The turtle moved laboriously across the sand.", "He laboriously climbed the steep hill."],
                    pronunciation: "lə-ˈbȯr-ē-əs-lē"
                },
                cavity: {
                    word: "cavity",
                    meaning: "a hollow space",
                    examples: ["The turtle digs a cavity for its eggs.", "The dentist found a cavity in the tooth."],
                    pronunciation: "ˈka-və-tē"
                },
                camouflage: {
                    word: "camouflage",
                    meaning: "hide or disguise something",
                    examples: ["The turtle camouflages its nest with sand.", "Soldiers camouflage themselves in battle."],
                    pronunciation: "ˈka-mə-ˌfläzh"
                },
                incubate: {
                    word: "incubate",
                    meaning: "hatch eggs using warmth",
                    examples: ["The eggs incubate under the sun.", "Birds incubate their eggs by sitting on them."],
                    pronunciation: "ˈin-kyə-ˌbāt"
                },
                predators: {
                    word: "predators",
                    meaning: "animals that kill other animals for food",
                    examples: ["Lions are predators.", "Sea turtles have many predators."],
                    pronunciation: "ˈpre-də-tər"
                },
                slash: {
                    word: "slash",
                    meaning: "cut",
                    examples: ["The hatchling slashes open the egg.", "He slashed through the rope."],
                    pronunciation: "ˈslash"
                },
                snout: {
                    word: "snout",
                    meaning: "pointed nose of an animal",
                    examples: ["The turtle has an egg-tooth on its snout.", "A pig's snout is used for digging."],
                    pronunciation: "ˈsnau̇t"
                },
                emerge: {
                    word: "emerge",
                    meaning: "come out",
                    examples: ["The hatchlings emerge from the sand.", "Butterflies emerge from cocoons."],
                    pronunciation: "i-ˈmərj"
                }
            },
            quiz: {
                questions: [
                    {
                        statement: "Female Olive Ridleys come ashore at night to lay eggs.",
                        isCorrect: true,
                        explanation: "Correct! They come ashore at night to lay their eggs."
                    },
                    {
                        statement: "The eggs of an Olive Ridley are in the shape and size of a cricket ball.",
                        isCorrect: false,
                        explanation: "No, they are in the shape and size of a table tennis ball."
                    },
                    {
                        statement: "Ridleys come to lay their eggs in the month of January.",
                        isCorrect: true,
                        explanation: "Yes, they come between January and March."
                    },
                    {
                        statement: "The turtles use their flippers and make a hollow for their nests.",
                        isCorrect: true,
                        explanation: "Correct! They use their flippers to dig the nest cavity."
                    },
                    {
                        statement: "The hatchlings use a tiny egg-tooth to come out of the eggs.",
                        isCorrect: true,
                        explanation: "Yes, they use an egg-tooth to slash open the eggshell."
                    }
                ]
            },
            didYouKnow: {
                title: "Temperature and Gender",
                content: `There is an interesting aspect of sea turtle biology. The temperature inside the
                egg determines the sex of the embryo while it is growing.`,
                facts: [
                    "27˚C – 28˚C produces only male hatchlings",
                    "30˚C produces only female hatchlings",
                    "29˚C – 30˚C produces an equal mix of male and female hatchlings"
                ]
            }
        },
        3: {
            title: "Survival and Conservation",
            prose: {
                title: "The Journey of Sea Turtles",
                content: `Many of these tiny hatchlings, which weigh less than 20 grams each, will not
                even reach the sea. They will fall prey to crabs or birds even before they reach the water.
                Most of those that do make it into the water will also be eaten by many predators in
                the sea within the first few days of their lives. In fact, scientists estimate that only one
                in every thousand hatchlings becomes an adult. It is perhaps to ensure that enough
                hatchlings survive to keep the species going that sea turtles lay so many eggs.
                After many years of swimming in the open ocean, the female hatchlings that have
                become adults return to the same beach where they were born. They come there to lay their own
                eggs. How they manage to find the place after so many years in the sea is one of the many mysteries
                of these fascinating reptiles!
                Sea turtles are among the many wonderful creatures we share this planet with. They have survived natural dangers for millions of years. But, sadly, human activities
                during the last few decades have put them in grave danger. There are many factors that
                threaten their survival. People hunt them for their meat or collect their eggs. Sometimes
                they are accidentally trapped in the nests of motorboats. Problems like pollution, dumping
                of plastics into the ocean and construction activities on nesting beaches also hurt their
                survival. Only by systematically tackling these problems, and removing these threats,
                can we ensure that sea turtles will continue to exist in the years to come.`
            },
            glossary: {
                survive: {
                    word: "survive",
                    meaning: "continue to live",
                    examples: ["Sea turtles survive many dangers.", "Plants need water to survive."],
                    pronunciation: "sər-ˈvīv"
                },
                mysteries: {
                    word: "mysteries",
                    meaning: "facts that are difficult to understand",
                    examples: ["How turtles find their way back is a mystery.", "The detective solved the mystery."],
                    pronunciation: "ˈmis-t(ə-)rē"
                },
                fascinating: {
                    word: "fascinating",
                    meaning: "attracting greatly",
                    examples: ["Sea turtles are fascinating creatures.", "The story was fascinating to read."],
                    pronunciation: "ˈfa-sə-ˌnā-tiŋ"
                },
                decade: {
                    word: "decade",
                    meaning: "a period of ten years",
                    examples: ["Sea turtles have faced threats for decades.", "She lived there for a decade."],
                    pronunciation: "ˈde-ˌkād"
                }
            },
            quiz: {
                questions: [
                    {
                        statement: "The sea turtle is a biological relative of ___.",
                        options: ["sea turtle", "fish", "reptile"],
                        correctAnswers: ["sea turtle"],
                        type: "multiple"
                    },
                    {
                        statement: "In India's coastal waters we can see a species of ___.",
                        options: ["tortoises", "sea turtles", "dolphin"],
                        correctAnswers: ["sea turtles"],
                        type: "multiple"
                    },
                    {
                        statement: "Sea turtles come to the shore to ___.",
                        options: ["visit their birth place", "lay eggs", "go back to sea"],
                        correctAnswers: ["visit their birth place", "lay eggs"],
                        type: "multiple"
                    },
                    {
                        statement: "It is a problem for sea turtles to come ashore because ___.",
                        options: [
                            "they find it difficult to walk on sand",
                            "they don't know their way to the shore",
                            "animals and people hunt them"
                        ],
                        correctAnswers: ["they find it difficult to walk on sand"],
                        type: "multiple"
                    },
                    {
                        statement: "A turtle's flippers help it to ___.",
                        options: ["swim", "dig a nest", "climb"],
                        correctAnswers: ["swim"],
                        type: "multiple"
                    },
                    {
                        statement: "A sea turtle camouflages its nest by tossing sand on it to ___.",
                        options: [
                            "hide its eggs from predators",
                            "incubate eggs in the warmth of the sun",
                            "keep the hatchlings safe"
                        ],
                        correctAnswers: ["hide its eggs from predators"],
                        type: "multiple"
                    }
                ],
                vocabulary: {
                    wordFill: [
                        {
                            sentence: "Tiny hatchlings fall ___ to many predators.",
                            options: ["pray", "prey"],
                            correct: "prey"
                        },
                        {
                            sentence: "Sea turtles live their ___ life in the sea.",
                            options: ["hole", "whole"],
                            correct: "whole"
                        },
                        {
                            sentence: "The turtles come ashore only during the ___.",
                            options: ["night", "knight"],
                            correct: "night"
                        },
                        {
                            sentence: "The predators follow the ___ of the turtles to eat their eggs.",
                            options: ["sent", "scent"],
                            correct: "scent"
                        },
                        {
                            sentence: "The female turtles lay eggs and go back to the ___.",
                            options: ["see", "sea"],
                            correct: "sea"
                        }
                    ],
                    matching: [
                        {
                            start: "Sea turtles",
                            end: "come ashore to lay eggs",
                            correct: true
                        },
                        {
                            start: "Hatchlings",
                            end: "cut open the leathery egg shell",
                            correct: true
                        },
                        {
                            start: "A turtle",
                            end: "uses its front flippers to swim",
                            correct: true
                        },
                        {
                            start: "Many factors",
                            end: "threaten the survival of sea turtles",
                            correct: true
                        }
                    ],
                    seaWords: {
                        instruction: "Find any five words related to sea from the text (Sections I & II). Write them below. Then use the words to frame sentences of your own.",
                        example: {
                            word: "beach",
                            sentence: "We like to play in the sandy beach."
                        }
                    }
                },
                listening: {
                    title: "Flash News Report",
                    newsContent: `Breaking News! A playful monkey has escaped from the city zoo this morning at 10 a.m. 
                    The monkey, named Charlie, went over the fence of its enclosure during feeding time. 
                    The zoo-keeper immediately rang up the police after discovering the escape.
                    Zoo officials have requested the public to remain calm and not to approach the monkey if spotted.
                    If you see the monkey, please call the emergency hotline at 180345778 to report its location.
                    The zoo staff and local authorities are working together to safely capture and return Charlie to the zoo.
                    This is Sarah Johnson, reporting live from City Zoo.`,
                    questions: [
                        {
                            question: "What escaped from the zoo?",
                            options: ["a tiger", "a monkey"],
                            correct: "a monkey"
                        },
                        {
                            question: "When did it escape?",
                            options: ["at 10 p.m", "at 10 a.m"],
                            correct: "at 10 a.m"
                        },
                        {
                            question: "How did it escape?",
                            options: ["pushed out of the fence", "went over the fence"],
                            correct: "went over the fence"
                        },
                        {
                            question: "What did the zoo-keeper do?",
                            options: ["rang up the police", "rang up the warden"],
                            correct: "rang up the police"
                        },
                        {
                            question: "When should you call or dial 180345778?",
                            options: ["when you see the monkey", "to report the escape of the monkey"],
                            correct: "to report the escape of the monkey"
                        }
                    ]
                }
            },
            didYouKnow: {
                title: "Conservation Efforts",
                content: `Conservation efforts are crucial for sea turtle survival. Many organizations work
                to protect nesting sites and reduce threats to these ancient creatures.`,
                facts: [
                    "Only 1 in 1000 hatchlings survives to adulthood",
                    "Female turtles return to their birth beach to lay eggs",
                    "Human activities are the biggest threat to sea turtles",
                    "Plastic pollution severely affects sea turtle populations"
                ]
            }
        }
    };

    const updateProgress = (section, completed, score) => {
        setProgress(prev => ({
            ...prev,
            [section]: { completed, score }
        }));
    };

    const nextSection = () => {
        if (currentSection < Object.keys(sections).length) {
            setCurrentSection(prev => prev + 1);
        }
    };

    const previousSection = () => {
        if (currentSection > 1) {
            setCurrentSection(prev => prev - 1);
        }
    };

    return (
        <SectionContext.Provider 
            value={{ 
                currentSection, 
                setCurrentSection, 
                sections,
                progress,
                updateProgress,
                nextSection,
                previousSection
            }}
        >
            {children}
        </SectionContext.Provider>
    );
}; 