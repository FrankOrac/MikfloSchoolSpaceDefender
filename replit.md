# Space Defender Game

## Overview

Space Defender is a browser-based arcade-style space shooter game developed for Mikflo Schools Technology Division. The game is built using vanilla HTML5 Canvas, JavaScript, and CSS, featuring a retro space theme where players defend Earth from asteroid invasions.

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

#### Game Features
- **Progressive Difficulty**: Level-based asteroid spawning with increasing complexity
- **Power-up System**: Temporary abilities like rapid fire, shields, and multi-shot
- **Particle Effects**: Visual feedback for explosions and impacts
- **Starfield Background**: Animated space environment

### Data Flow

1. **Game Initialization**: Load saved high scores from localStorage and initialize game objects
2. **Input Processing**: Capture user input from keyboard, mouse, or touch events
3. **Game Logic Update**: Process movement, collisions, spawning, and game state changes
4. **Rendering**: Draw all game objects, UI elements, and effects to the canvas
5. **State Persistence**: Save high scores to browser localStorage

### External Dependencies

- **Browser APIs**: Canvas 2D API, localStorage, DOM manipulation
- **No external libraries**: Pure vanilla JavaScript implementation for maximum compatibility
- **Local Assets**: All game assets (sprites, sounds) are embedded or generated programmatically

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