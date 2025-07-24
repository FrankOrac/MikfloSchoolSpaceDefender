# Space Defender Game - Educational Edition

## Overview

Space Defender is an educational browser-based space shooter game developed by MIKFLO SCHOOLS TECHNOLOGY DIVISION - STEAM HUB. Players destroy "bad habit" asteroids while progressing through educational levels from Montessori to SS3. The game combines entertainment with character building, featuring always-visible mobile controls, voice welcome messages, session-based scoring, and comprehensive school branding.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-page application** using vanilla HTML5, CSS3, and JavaScript
- **Canvas-based rendering** for smooth 2D graphics and animations
- **Responsive design** with mobile-friendly controls and viewport adaptation
- **Client-side state management** for game logic, scoring, and user interface

### Key Components

#### Core Game Engine
- **Game Loop**: Real-time rendering and physics using requestAnimationFrame
- **Entity System**: Manages player, asteroids, bullets, power-ups, and particle effects
- **Collision Detection**: Handles interactions between game objects
- **Input Management**: Supports keyboard, mouse, and touch controls

#### User Interface
- **Menu System**: Start screen, game over screen, instructions, and high scores
- **HUD Elements**: Real-time display of score, lives, level, and power-up status
- **Mobile Controls**: On-screen D-pad and action buttons for touch devices

#### Educational Game Features
- **Bad Habit Asteroids**: 30+ different bad habits displayed on asteroids (failure, bullying, cheating, etc.)
- **Educational Level System**: Progress from Montessori through Basic 1-9 to SS1-SS3
- **Personalized Experience**: Username input with customized scoring and messages  
- **Character Building Focus**: Motivational messages when destroying bad habits
- **STEAM HUB Branding**: MIKFLO SCHOOLS TECHNOLOGY DIVISION - STEAM HUB branding throughout
- **Voice Welcome System**: Placeholder speech synthesis (ready for student voice recordings)
- **Always-Visible Controls**: On-screen D-pad and buttons available on all screen sizes
- **Session-Based Scoring**: Simple session scores without database storage
- **Sound Effects**: Audio feedback for all game actions using Web Audio API
- **Asset Organization**: Dedicated folders for images and sounds ready for custom content

### Data Flow

1. **Game Initialization**: Load saved high scores from localStorage and initialize game objects
2. **Input Processing**: Capture user input from keyboard, mouse, or touch events
3. **Game Logic Update**: Process movement, collisions, spawning, and game state changes
4. **Rendering**: Draw all game objects, UI elements, and effects to the canvas
5. **State Persistence**: Save high scores to browser localStorage

### External Dependencies

- **Browser APIs**: Canvas 2D API, Web Audio API, Speech Synthesis API, sessionStorage
- **No external libraries**: Pure vanilla JavaScript implementation for maximum compatibility
- **Asset Structure**: Organized folders for images (assets/images/) and sounds (assets/sounds/)
- **Custom Content Ready**: Placeholder systems ready for school-specific logos, sounds, and student voice recordings

### Deployment Strategy

#### Static File Hosting
- **Simple deployment**: Standard HTML/CSS/JS files can be hosted on any static web server
- **No build process**: Files are ready to deploy without compilation or bundling
- **Cross-platform compatibility**: Runs in any modern web browser

#### Mobile Considerations
- **Responsive viewport**: Adapts to different screen sizes and orientations
- **Touch controls**: Dedicated mobile interface for touchscreen devices
- **Performance optimization**: Efficient rendering for mobile browsers

#### Browser Compatibility
- **Modern browser support**: Requires HTML5 Canvas and ES6 JavaScript features
- **Local storage**: Uses browser localStorage for persistent high score tracking
- **No server requirements**: Fully client-side application

## Technical Notes

The game uses a traditional game loop architecture with separation of concerns between rendering, input handling, and game logic. The modular structure allows for easy addition of new features like additional power-ups, enemy types, or game modes. The responsive design ensures the game works well on both desktop and mobile devices without requiring separate codebases.