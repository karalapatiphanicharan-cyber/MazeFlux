# MazeFlux Implementation Plan

This document outlines the proposed enhancements and fixes for the MazeFlux Search Intelligence Simulator.

## 1. Current Issues
- **DOM Thrashing in Performance Charts:** The `updateChart` function clears its entire container and re-creates DOM elements on every algorithm step, causing significant performance overhead during high-speed simulations.
- **Inflexible Chart Scaling:** Chart limits (max time, max nodes) are hardcoded based on difficulty, which often leads to bars being either too small to see or overflowing the container if the simulation takes longer than expected.
- **Light Theme Accessibility:** The neon brand colors (cyan, green, red) have poor contrast ratios when used against the light theme background (`#f0f2f5`), making the UI difficult to read.
- **Animation Bottlenecks:** Maze generation uses `setTimeout` for delays, which is less precise than `requestAnimationFrame` and can lead to inconsistent generation speeds.
- **State Inconsistency:** Statistics are updated via direct DOM manipulation across multiple callbacks, making it hard to track the "source of truth" for simulation data.

## 2. Root Causes
- **Imperative UI Updates:** The application lacks a centralized state-to-UI binding, leading to repetitive and inefficient DOM operations.
- **Missing Theme Overrides:** Brand variables are defined globally without specific adjustments for light mode contrast.
- **Hardcoded Configuration:** Heuristics for visualization (like chart limits and animation delays) are scattered throughout the logic instead of being centrally managed.

## 3. Proposed Fixes
- **Persistent Chart Elements:** Refactor `updateChart` to create bars once and only update their `height` and `label` properties during simulation.
- **Dynamic Chart Scaling:** Implement a "sliding scale" for charts where the maximum value is determined by the maximum observed metric, ensuring data is always visible.
- **Theme-Aware Variables:** Introduce theme-specific overrides for neon colors in CSS to ensure WCAG-compliant contrast in light mode.
- **Centralized Configuration:** Move all magic numbers (grid sizes, speeds, colors) into a global `CONSTANTS` object.

## 4. UI Improvements
- **Polished Glassmorphism:** Enhance the "AI Dashboard" look by refining the `backdrop-filter` and border-glow effects.
- **Responsive Layout:** Adjust the simulation grid for better viewing on tablets and mobile devices.
- **Interactive Stats:** Add "counting animations" for numerical statistics to make the data feel more dynamic.
- **Comparison Dashboard:** Redesign the comparison modal to feature a side-by-side visual comparison of the final paths.

## 5. Animation Improvements
- **Enhanced Quantum Wavefunction:** Upgrade the `QuantumSearch` particles with "tail" effects (fading trails) and varying particle sizes to better simulate a probability cloud.
- **Smooth State Transitions:** Add CSS transitions for panel expansions and modal appearances.
- **Precise Timing:** Transition maze generation to a `requestAnimationFrame` loop for smoother, monitor-synced carving animations.

## 6. Performance Improvements
- **Throttled UI Updates:** Limit DOM updates for statistics to a maximum frequency (e.g., 30fps) regardless of the simulation speed.
- **Canvas Rendering Optimization:** Use a secondary buffer or batch `fillRect` calls to reduce the number of draw operations during intensive search phases.
- **Memory Management:** Ensure particle arrays and event listeners are properly cleaned up when resetting simulations.

## 7. Maintainability Improvements
- **Modular Logic:** Refactor the monolithic `script.js` into logical sections (Core, Algorithms, UI, Charts) to prepare for future search algorithm additions (like A*).
- **Standardized State Management:** Implement a simple `SimulationState` class to handle starts, pauses, resets, and data collection consistently across both algorithms.
