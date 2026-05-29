# MazeFlux: Search Intelligence Simulator

![MazeFlux Logo](https://img.shields.io/badge/Status-Research_Simulator-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)
![Tech](https://img.shields.io/badge/Tech-Vanilla_JS-yellow)

**MazeFlux** is a modern, high-fidelity web application designed to visually simulate and compare Classical Search and Quantum-Inspired Search algorithms. Built with a futuristic "AI Research Dashboard" aesthetic, it provides an interactive platform for analyzing search efficiency across varying levels of maze complexity.

---

## 🚀 Project Overview

The goal of MazeFlux is to provide an educational yet visually stunning platform that demonstrates the conceptual differences between sequential and parallel search strategies. While traditional search algorithms like BFS (Breadth-First Search) explore possibilities node-by-node, our Quantum-Inspired simulation utilizes parallel exploration to find solutions with significantly fewer steps, mimicking the theoretical speedups of quantum computing.

---

## ✨ Key Features

- **Dual Simulation Panels:** Independent environments for Classical and Quantum-Inspired search.
- **Independent Difficulty System:** Select Easy, Medium, or Hard difficulty for each algorithm separately to experiment with diverse scenarios.
- **Animated Maze Generation:** Watch the maze being carved in real-time using a Recursive Backtracking algorithm.
- **Dynamic Performance Analytics:**
    - Real-time tracking of Time Taken, Nodes Explored, and Path Length.
    - **Efficiency Score:** A custom metric calculating the ratio of the solution path to the total area explored.
    - Interactive Bar Charts updating as the simulation progresses.
- **Global & Individual Controls:** Run simulations simultaneously or one at a time, with individual speed adjustments.
- **Advanced UI/UX:**
    - Dark-mode "Glassmorphism" interface.
    - Neon visual effects and particle-based wavefunction simulation.
    - **Export Results:** Save your simulation results and maze maps as a professional PNG report.
    - Theme switcher and Fullscreen mode for focus.
    - Keyboard shortcuts (Space to Pause, G to Generate, R to Run).

---

## 🛠 Technology Stack

- **HTML5:** Semantic structure for the dashboard.
- **CSS3:** Advanced styling using CSS Variables, Grid/Flexbox, and Glassmorphism effects.
- **JavaScript (ES6+):** Modular, object-oriented logic for simulation engines.
- **Canvas API:** High-performance rendering for maze generation and search visualizations.

---

## 🧠 Algorithms Used

### 1. Maze Generation
- **Algorithm:** Recursive Backtracking (Depth-First Search).
- **Behavior:** Carves paths through a solid grid, ensuring a "perfect" maze (all cells reachable, no cycles).

### 2. Classical Search
- **Algorithm:** Breadth-First Search (BFS).
- **Complexity:** O(N), where N is the number of nodes.
- **Visualization:** Red traversal paths showing realistic exploration behavior and backtracking.

### 3. Quantum-Inspired Search
- **Concept:** Parallel Exploration / Superposition Simulation.
- **Complexity:** Simulated O(√N) (Conceptual Grover's Speedup).
- **Visualization:** Neon green "probability cloud" particles exploring multiple paths simultaneously.

---

## 📸 Screenshots

*(Placeholder: Add your hosted screenshots here)*

---

## ⚙️ Installation & Usage

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mazeflux.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mazeflux
   ```
3. Open `index.html` in any modern web browser.

### User Guide
- **Generate:** Click "Generate Both Mazes" or use the individual panel buttons.
- **Adjust Difficulty:** Use the dropdowns to change grid size (Easy: 11x11, Medium: 21x21, Hard: 41x41).
- **Simulate:** Click "Run Both" or press `R`.
- **Compare:** After completion, the Comparison Dashboard will automatically trigger, or you can click "Compare Results" manually.
- **Analyze:** Observe the efficiency charts and live stats at the bottom of each panel.

---

## 🔮 Future Improvements

- [ ] Implementation of A* Search for heuristic comparisons.
- [ ] Real-time Quantum Grover's Algorithm visualization.
- [ ] Custom Maze Builder mode.
- [ ] CSV export for research data analysis.
- [ ] Sound design for algorithm milestones.

---

## 🌐 Deployment

### GitHub Pages
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Select the `main` branch and `/root` folder.
4. Click **Save**.

### Vercel
1. Connect your GitHub account to [Vercel](https://vercel.com).
2. Import the `mazeflux` repository.
3. Vercel will automatically detect the static project and deploy it.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed for AI Research and Educational Visualizations.**
