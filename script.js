/**
 * MazeFlux: Search Intelligence Simulator
 * Core Logic and Visualization Engine
 *
 * This file contains the implementation of the maze generation,
 * search algorithms, and the main UI controller.
 */

/**
 * Handles Maze Generation and Rendering on a Canvas.
 * Uses Recursive Backtracking for generation.
 */
class Maze {
    constructor(canvasId, difficulty) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.difficulty = difficulty;
        this.grid = [];
        this.cols = 0;
        this.rows = 0;
        this.cellSize = 0;
        this.width = 0;
        this.height = 0;
        this.resize();
        this.initGrid();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.width;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        const config = {
            easy: { size: 11 },
            medium: { size: 21 },
            hard: { size: 41 }
        };

        this.cols = config[this.difficulty].size;
        this.rows = config[this.difficulty].size;
        this.cellSize = this.width / this.cols;
    }

    initGrid() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(1));
    }

    generate() {
        return new Promise(resolve => {
            this.initGrid();
            this.isGenerating = true;
            const startX = 1;
            const startY = 1;
            this.grid[startY][startX] = 0;

            const stack = [[startX, startY]];
            const directions = [[0, 2], [0, -2], [2, 0], [-2, 0]];

            const step = () => {
                if (stack.length === 0) {
                    this.grid[1][0] = 0;
                    this.grid[this.rows - 2][this.cols - 1] = 0;
                    this.draw();
                    this.isGenerating = false;
                    resolve();
                    return;
                }

            const [cx, cy] = stack[stack.length - 1];
            const neighbors = [];

            for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;
                if (nx > 0 && nx < this.cols - 1 && ny > 0 && ny < this.rows - 1 && this.grid[ny][nx] === 1) {
                    neighbors.push([nx, ny]);
                }
            }

            if (neighbors.length > 0) {
                const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.grid[cy + (ny - cy) / 2][cx + (nx - cx) / 2] = 0;
                this.grid[ny][nx] = 0;
                stack.push([nx, ny]);

                this.drawCell(cx + (nx - cx) / 2, cy + (ny - cy) / 2, '#05050a');
                this.drawCell(nx, ny, '#05050a');
                this.drawCell(nx, ny, 'rgba(0, 242, 255, 0.5)');
            } else {
                const [lx, ly] = stack.pop();
                this.drawCell(lx, ly, '#05050a');
            }

            // High speed generation: process multiple steps per frame for hard difficulty
            if (this.difficulty === 'hard') {
                for(let i=0; i<10; i++) {
                    if (stack.length === 0) break;
                    const [ccx, ccy] = stack[stack.length - 1];
                    const nns = [];
                    for (const [dx, dy] of directions) {
                        const nx = ccx + dx;
                        const ny = ccy + dy;
                        if (nx > 0 && nx < this.cols - 1 && ny > 0 && ny < this.rows - 1 && this.grid[ny][nx] === 1) {
                            nns.push([nx, ny]);
                        }
                    }
                    if (nns.length > 0) {
                        const [nx, ny] = nns[Math.floor(Math.random() * nns.length)];
                        this.grid[ccy + (ny - ccy) / 2][ccx + (nx - ccx) / 2] = 0;
                        this.grid[ny][nx] = 0;
                        stack.push([nx, ny]);
                        this.drawCell(ccx + (nx - ccx) / 2, ccy + (ny - ccy) / 2, '#05050a');
                        this.drawCell(nx, ny, '#05050a');
                    } else {
                        stack.pop();
                    }
                }
            }

                requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    this.ctx.fillStyle = '#1a1a2e';
                } else {
                    this.ctx.fillStyle = '#05050a';
                }
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }

        this.ctx.fillStyle = 'rgba(0, 242, 255, 0.3)';
        this.ctx.fillRect(0, 1 * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fillStyle = 'rgba(57, 255, 20, 0.3)';
        this.ctx.fillRect((this.cols - 1) * this.cellSize, (this.rows - 2) * this.cellSize, this.cellSize, this.cellSize);
    }

    drawCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
}

/**
 * Visualizes Classical Breadth-First Search (BFS).
 * Explores nodes layer by layer to guarantee the shortest path.
 */
class ClassicalSearch {
    constructor(maze, onUpdate) {
        this.maze = maze;
        this.onUpdate = onUpdate;
        this.queue = [[1, 0]];
        this.visited = new Set(['1,0']);
        this.parentMap = new Map();
        this.exploredCount = 0;
        this.finished = false;
        this.foundExit = false;
        this.path = [];
        this.elapsedTime = 0;
        this.lastUpdateTime = null;
    }

    updateTimer() {
        if (this.finished) return;
        const now = Date.now();
        if (this.lastUpdateTime) {
            this.elapsedTime += (now - this.lastUpdateTime) / 1000;
        }
        this.lastUpdateTime = now;
    }

    step() {
        if (this.finished || this.queue.length === 0) return;

        const current = this.queue.shift();
        const [cx, cy] = current;
        this.exploredCount++;

        this.maze.ctx.save();
        this.maze.ctx.shadowBlur = 5;
        this.maze.ctx.shadowColor = 'var(--neon-red)';
        this.maze.drawCell(cx, cy, 'rgba(255, 49, 49, 0.6)');
        this.maze.ctx.restore();

        if (cx === this.maze.cols - 1 && cy === this.maze.rows - 2) {
            this.finished = true;
            this.foundExit = true;
            this.reconstructPath(current);
            return;
        }

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;
            const key = `${nx},${ny}`;

            if (nx >= 0 && nx < this.maze.cols && ny >= 0 && ny < this.maze.rows &&
                this.maze.grid[ny][nx] === 0 && !this.visited.has(key)) {
                this.visited.add(key);
                this.parentMap.set(key, current);
                this.queue.push([nx, ny]);
                this.maze.drawCell(nx, ny, 'rgba(255, 49, 49, 0.2)');
            }
        }

        this.onUpdate({
            time: this.elapsedTime,
            nodes: this.exploredCount,
            status: 'Searching...'
        });
    }

    reconstructPath(endNode) {
        let curr = endNode;
        while (curr) {
            this.path.push(curr);
            const key = `${curr[0]},${curr[1]}`;
            curr = this.parentMap.get(key);
        }
        this.path.reverse();
        this.drawPath();
        this.onUpdate({
            time: this.elapsedTime,
            nodes: this.exploredCount,
            pathLength: this.path.length,
            status: 'Complete',
            finished: true
        });
    }

    drawPath() {
        for (const [x, y] of this.path) {
            this.maze.drawCell(x, y, '#ff3131');
        }
    }

    drawVisited() {
        this.visited.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            this.maze.drawCell(x, y, 'rgba(255, 49, 49, 0.4)');
        });
    }
}

/**
 * Visualizes a Quantum-Inspired Parallel Search.
 * Simulates superposition by exploring all possible branches simultaneously.
 * Uses neon particles to represent probability cloud/wavefunction.
 */
class QuantumSearch {
    constructor(maze, onUpdate) {
        this.maze = maze;
        this.onUpdate = onUpdate;
        this.frontiers = [[1, 0]];
        this.visited = new Set(['1,0']);
        this.parentMap = new Map();
        this.exploredCount = 0;
        this.finished = false;
        this.foundExit = false;
        this.path = [];
        this.elapsedTime = 0;
        this.lastUpdateTime = null;
        this.particles = [];
    }

    updateTimer() {
        if (this.finished) return;
        const now = Date.now();
        if (this.lastUpdateTime) {
            this.elapsedTime += (now - this.lastUpdateTime) / 1000;
        }
        this.lastUpdateTime = now;
    }

    step() {
        if (this.finished || this.frontiers.length === 0) return;

        const nextFrontiers = [];

        // Pulse effect for the entire wavefront
        const pulseSize = (Math.sin(Date.now() / 200) * 5) + 10;

        for (const current of this.frontiers) {
            const [cx, cy] = current;
            this.exploredCount++;

            this.maze.ctx.save();
            this.maze.ctx.shadowBlur = pulseSize;
            this.maze.ctx.shadowColor = 'var(--neon-green)';
            this.maze.drawCell(cx, cy, 'rgba(57, 255, 20, 0.6)');
            this.maze.ctx.restore();

            this.addParticles(cx, cy);

            if (cx === this.maze.cols - 1 && cy === this.maze.rows - 2) {
                this.finished = true;
                this.foundExit = true;
                this.reconstructPath(current);
                return;
            }

            const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;
                const key = `${nx},${ny}`;

                if (nx >= 0 && nx < this.maze.cols && ny >= 0 && ny < this.maze.rows &&
                    this.maze.grid[ny][nx] === 0 && !this.visited.has(key)) {
                    this.visited.add(key);
                    this.parentMap.set(key, current);
                    nextFrontiers.push([nx, ny]);
                }
            }
        }

        this.frontiers = nextFrontiers;

        this.onUpdate({
            time: this.elapsedTime,
            nodes: this.exploredCount,
            status: 'Collapsing...'
        });
    }

    addParticles(x, y) {
        // Particles now feel more like data-packets or "flux"
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: (x + 0.5) * this.maze.cellSize,
                y: (y + 0.5) * this.maze.cellSize,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                life: 1.0,
                trail: []
            });
        }
    }

    updateParticles() {
        if (this.particles.length === 0) return;

        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            // Add current pos to trail
            p.trail.push({x: p.x, y: p.y});
            if (p.trail.length > 5) p.trail.shift();

            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.015;

            // Draw Trail
            this.maze.ctx.beginPath();
            this.maze.ctx.strokeStyle = `rgba(57, 255, 20, ${p.life * 0.3})`;
            this.maze.ctx.lineWidth = p.size;
            if (p.trail.length > 0) {
                this.maze.ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for(let i=1; i<p.trail.length; i++) {
                    this.maze.ctx.lineTo(p.trail[i].x, p.trail[i].y);
                }
                this.maze.ctx.stroke();
            }

            // Draw Head
            this.maze.ctx.fillStyle = `rgba(57, 255, 20, ${p.life})`;
            this.maze.ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        });
    }

    reconstructPath(endNode) {
        let curr = endNode;
        while (curr) {
            this.path.push(curr);
            const key = `${curr[0]},${curr[1]}`;
            curr = this.parentMap.get(key);
        }
        this.path.reverse();
        this.drawPath();
        this.onUpdate({
            time: this.elapsedTime,
            nodes: this.exploredCount,
            pathLength: this.path.length,
            status: 'Complete',
            finished: true
        });
    }

    drawPath() {
        for (const [x, y] of this.path) {
            this.maze.drawCell(x, y, '#39ff14');
        }
    }

    drawVisited() {
        this.visited.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            this.maze.drawCell(x, y, 'rgba(57, 255, 20, 0.3)');
        });
    }
}

// --- Main App Logic ---

document.addEventListener('DOMContentLoaded', () => {
    const cCanvas = 'classical-canvas';
    const qCanvas = 'quantum-canvas';

    window.classicalMaze = new Maze(cCanvas, 'medium');
    window.quantumMaze = new Maze(qCanvas, 'medium');

    window.classicalSim = null;
    window.quantumSim = null;

    window.isPaused = false;
    let animationId = null;

    // Chart Synchronization State
    let latestStats = {
        classical: { time: 0, nodes: 0, efficiency: 0 },
        quantum: { time: 0, nodes: 0, efficiency: 0 }
    };
    let globalMaxTime = 5;
    let globalMaxNodes = 100;
    let lastChartUpdate = 0;

    // UI Elements
    const cDiffSelect = document.getElementById('classical-difficulty');
    const qDiffSelect = document.getElementById('quantum-difficulty');
    const cSpeedRange = document.getElementById('classical-speed');
    const qSpeedRange = document.getElementById('quantum-speed');

    const cStats = {
        time: document.getElementById('c-stat-time'),
        nodes: document.getElementById('c-stat-nodes'),
        path: document.getElementById('c-stat-path'),
        eff: document.getElementById('c-stat-eff'),
        status: document.getElementById('c-stat-status'),
        progress: document.getElementById('c-progress')
    };

    const qStats = {
        time: document.getElementById('q-stat-time'),
        nodes: document.getElementById('q-stat-nodes'),
        path: document.getElementById('q-stat-path'),
        eff: document.getElementById('q-stat-eff'),
        status: document.getElementById('q-stat-status'),
        progress: document.getElementById('q-progress')
    };

    // Initialize Mazes
    classicalMaze.generate();
    quantumMaze.generate();

    // Event Listeners
    document.getElementById('gen-classical').addEventListener('click', async () => {
        if (classicalMaze.isGenerating) return;
        classicalMaze.difficulty = cDiffSelect.value;
        classicalMaze.resize();
        resetStats('classical');
        await classicalMaze.generate();
    });

    document.getElementById('gen-quantum').addEventListener('click', async () => {
        if (quantumMaze.isGenerating) return;
        quantumMaze.difficulty = qDiffSelect.value;
        quantumMaze.resize();
        resetStats('quantum');
        await quantumMaze.generate();
    });

    document.getElementById('gen-both').addEventListener('click', async () => {
        if (classicalMaze.isGenerating || quantumMaze.isGenerating) return;
        classicalMaze.difficulty = cDiffSelect.value;
        classicalMaze.resize();
        quantumMaze.difficulty = qDiffSelect.value;
        quantumMaze.resize();
        resetStats('both');
        await Promise.all([
            classicalMaze.generate(),
            quantumMaze.generate()
        ]);
    });

    document.getElementById('run-classical').addEventListener('click', () => {
        if (classicalMaze.isGenerating) return;
        if (classicalSim && !classicalSim.finished) return;
        startClassical();
        if (!animationId) startAnimationLoop();
    });

    document.getElementById('run-quantum').addEventListener('click', () => {
        if (quantumMaze.isGenerating) return;
        if (quantumSim && !quantumSim.finished) return;
        startQuantum();
        if (!animationId) startAnimationLoop();
    });

    document.getElementById('run-both').addEventListener('click', () => {
        if (classicalMaze.isGenerating || quantumMaze.isGenerating) return;
        if ((classicalSim && !classicalSim.finished) || (quantumSim && !quantumSim.finished)) return;
        startClassical();
        startQuantum();
        if (!animationId) startAnimationLoop();
    });

    document.getElementById('reset-all').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('pause-sim').addEventListener('click', () => {
        window.isPaused = true;
        if (window.classicalSim) window.classicalSim.lastUpdateTime = null;
        if (window.quantumSim) window.quantumSim.lastUpdateTime = null;
    });
    document.getElementById('resume-sim').addEventListener('click', () => window.isPaused = false);

    document.getElementById('compare-results').addEventListener('click', () => {
        showComparison();
    });

    document.getElementById('close-comparison').addEventListener('click', () => {
        document.getElementById('comparison-dashboard').classList.add('hidden');
    });

    document.getElementById('export-img').addEventListener('click', () => {
        exportAsImage();
    });

    document.getElementById('export-img-modal').addEventListener('click', () => {
        exportAsImage();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            window.isPaused = !window.isPaused;
        } else if (e.code === 'KeyG') {
            document.getElementById('gen-both').click();
        } else if (e.code === 'KeyR') {
            document.getElementById('run-both').click();
        }
    });

    // Collapsible Logic
    document.querySelector('.collapse-btn').addEventListener('click', () => {
        document.querySelector('.educational-section').classList.toggle('open');
    });

    function resetStats(side) {
        if (side === 'classical' || side === 'both') {
            cStats.time.innerText = '0.0s';
            cStats.nodes.innerText = '0';
            cStats.path.innerText = '0';
            cStats.eff.innerText = '0%';
            cStats.status.innerText = 'Idle';
            cStats.progress.style.width = '0%';
            document.getElementById('classical-chart').innerHTML = '';
            window.classicalSim = null;
            latestStats.classical = { time: 0, nodes: 0, efficiency: 0 };
        }
        if (side === 'quantum' || side === 'both') {
            qStats.time.innerText = '0.0s';
            qStats.nodes.innerText = '0';
            qStats.path.innerText = '0';
            qStats.eff.innerText = '0%';
            qStats.status.innerText = 'Idle';
            qStats.progress.style.width = '0%';
            document.getElementById('quantum-chart').innerHTML = '';
            window.quantumSim = null;
            latestStats.quantum = { time: 0, nodes: 0, efficiency: 0 };
        }
        globalMaxTime = 5;
        globalMaxNodes = 100;
    }

    function startClassical() {
        window.classicalMaze.draw(); // Clear previous marks
        const totalPathNodes = window.classicalMaze.grid.flat().filter(cell => cell === 0).length;
        window.classicalSim = new ClassicalSearch(window.classicalMaze, (data) => {
            cStats.time.innerText = data.time.toFixed(1) + 's';
            cStats.nodes.innerText = data.nodes;
            let efficiency = 0;
            if (data.pathLength) {
                cStats.path.innerText = data.pathLength;
                efficiency = (data.pathLength / data.nodes) * 100;
                cStats.eff.innerText = efficiency.toFixed(1) + '%';
            }
            cStats.status.innerText = data.status;

            cStats.progress.style.width = Math.min(100, (data.nodes / totalPathNodes) * 100) + '%';

            updateChart('classical', {
                time: data.time,
                nodes: data.nodes,
                efficiency: efficiency
            });
        });
    }

    function startQuantum() {
        window.quantumMaze.draw(); // Clear previous marks
        const totalPathNodes = window.quantumMaze.grid.flat().filter(cell => cell === 0).length;
        window.quantumSim = new QuantumSearch(window.quantumMaze, (data) => {
            qStats.time.innerText = data.time.toFixed(1) + 's';
            qStats.nodes.innerText = data.nodes;
            let efficiency = 0;
            if (data.pathLength) {
                qStats.path.innerText = data.pathLength;
                efficiency = (data.pathLength / data.nodes) * 100;
                qStats.eff.innerText = efficiency.toFixed(1) + '%';
            }
            qStats.status.innerText = data.status;

            qStats.progress.style.width = Math.min(100, (data.nodes / totalPathNodes) * 100) + '%';

            updateChart('quantum', {
                time: data.time,
                nodes: data.nodes,
                efficiency: efficiency
            });
        });
    }

    function updateChart(side, stats) {
        latestStats[side] = stats;

        // Update global max for unified scaling
        if (stats.time > globalMaxTime) globalMaxTime = stats.time * 1.1;
        if (stats.nodes > globalMaxNodes) globalMaxNodes = stats.nodes * 1.1;

        const now = Date.now();
        // Throttle DOM updates to improve performance during high-speed sim
        if (now - lastChartUpdate < 100 && !stats.finished) return;
        lastChartUpdate = now;

        renderChart('classical-chart', latestStats.classical);
        renderChart('quantum-chart', latestStats.quantum);
    }

    function renderChart(containerId, stats) {
        const container = document.getElementById(containerId);
        let bars = container.querySelectorAll('.chart-bar');
        let labels = container.querySelectorAll('.chart-value');

        const metrics = [
            { label: 'Time', value: stats.time, unit: 's' },
            { label: 'Nodes', value: stats.nodes, unit: '' },
            { label: 'Eff', value: stats.efficiency || 0, unit: '%' }
        ];

        const limits = [globalMaxTime, globalMaxNodes, 100];

        if (bars.length === 0) {
            container.innerHTML = '';
            metrics.forEach((m) => {
                const barContainer = document.createElement('div');
                barContainer.className = 'chart-bar-container';
                barContainer.innerHTML = `
                    <div class="chart-label">${m.label}</div>
                    <div class="chart-bar-wrap"><div class="chart-bar" style="height: 0%"></div></div>
                    <div class="chart-value">0</div>
                `;
                container.appendChild(barContainer);
            });
            bars = container.querySelectorAll('.chart-bar');
            labels = container.querySelectorAll('.chart-value');
        }

        metrics.forEach((m, i) => {
            const percentage = Math.min(100, (m.value / limits[i]) * 100);
            bars[i].style.height = percentage + '%';
            labels[i].innerText = m.value.toFixed(m.unit === 's' ? 1 : 0) + m.unit;
        });
    }

    let cFrameCount = 0;
    let qFrameCount = 0;

    function startAnimationLoop() {
        function animate() {
            if (!window.isPaused) {
                // Update Timers
                if (window.classicalSim && !window.classicalSim.finished) window.classicalSim.updateTimer();
                if (window.quantumSim && !window.quantumSim.finished) window.quantumSim.updateTimer();

                // Smooth Particle Updates (Independent of search speed)
                if (window.quantumSim && !window.quantumSim.finished) {
                    window.quantumSim.updateParticles();
                }

                // Classical Speed Control
                const cSpeed = parseInt(cSpeedRange.value);
                const cInterval = Math.max(1, Math.floor(100 / cSpeed));
                if (window.classicalSim && !window.classicalSim.finished) {
                    cFrameCount++;
                    if (cFrameCount >= cInterval) {
                        window.classicalSim.step();
                        cFrameCount = 0;
                    }
                }

                // Quantum Speed Control
                const qSpeed = parseInt(qSpeedRange.value);
                const qInterval = Math.max(1, Math.floor(100 / qSpeed));
                if (window.quantumSim && !window.quantumSim.finished) {
                    qFrameCount++;
                    if (qFrameCount >= qInterval) {
                        window.quantumSim.step();
                        qFrameCount = 0;
                    }
                }
            }

            if ((window.classicalSim && !window.classicalSim.finished) || (window.quantumSim && !window.quantumSim.finished)) {
                animationId = requestAnimationFrame(animate);
            } else {
                animationId = null;
                checkComparisonAuto();
            }
        }
        animationId = requestAnimationFrame(animate);
    }

    function checkComparisonAuto() {
        if (window.classicalSim && window.classicalSim.finished && window.quantumSim && window.quantumSim.finished) {
            showComparison();
        }
    }

    function showComparison() {
        if (!window.classicalSim || !window.quantumSim || !window.classicalSim.finished || !window.quantumSim.finished) {
            alert("Please run both simulations to completion first.");
            return;
        }

        const dashboard = document.getElementById('comparison-dashboard');
        dashboard.classList.remove('hidden');

        const cTime = window.classicalSim.elapsedTime;
        const qTime = window.quantumSim.elapsedTime;
        const cNodes = window.classicalSim.exploredCount;
        const qNodes = window.quantumSim.exploredCount;
        const cPath = window.classicalSim.path.length;
        const qPath = window.quantumSim.path.length;
        const cEff = (cPath / cNodes) * 100;
        const qEff = (qPath / qNodes) * 100;

        document.getElementById('comp-c-time').innerText = `${cTime.toFixed(2)}s`;
        document.getElementById('comp-c-nodes').innerText = cNodes;
        document.getElementById('comp-c-path').innerText = cPath;
        document.getElementById('comp-c-eff').innerText = `${cEff.toFixed(1)}%`;

        document.getElementById('comp-q-time').innerText = `${qTime.toFixed(2)}s`;
        document.getElementById('comp-q-nodes').innerText = qNodes;
        document.getElementById('comp-q-path').innerText = qPath;
        document.getElementById('comp-q-eff').innerText = `${qEff.toFixed(1)}%`;

        const winnerText = document.getElementById('winner-text');
        const winnerTitle = document.getElementById('winner-title');

        const advantage = ((Math.abs(cTime - qTime)) / Math.max(cTime, qTime) * 100).toFixed(1);
        if (qTime < cTime) {
            winnerTitle.innerText = "Quantum Advantage Detected";
            winnerText.innerHTML = `Quantum-Inspired search achieved a <span style="color:var(--neon-green)">${advantage}%</span> speedup over Classical BFS.`;
            document.querySelector('.quantum-res').classList.add('winner-highlight');
            document.querySelector('.classical-res').classList.remove('winner-highlight');
        } else {
            winnerTitle.innerText = "Classical Superiority";
            winnerText.innerHTML = `Classical BFS maintained efficiency, outperforming Quantum by <span style="color:var(--neon-red)">${advantage}%</span>.`;
            document.querySelector('.classical-res').classList.add('winner-highlight');
            document.querySelector('.quantum-res').classList.remove('winner-highlight');
        }
    }

    window.exportAsImage = function() {
        const offscreen = document.createElement('canvas');
        offscreen.width = 1200;
        offscreen.height = 800;
        const ctx = offscreen.getContext('2d');

        ctx.fillStyle = '#05050a';
        ctx.fillRect(0, 0, offscreen.width, offscreen.height);

        ctx.fillStyle = '#fff';
        ctx.font = '30px Orbitron';
        ctx.fillText('MazeFlux Simulation Results', 50, 50);

        // Draw Classical Canvas
        const cImg = new Image();
        cImg.src = document.getElementById('classical-canvas').toDataURL();
        cImg.onload = () => {
            ctx.drawImage(cImg, 50, 100, 500, 500);
            ctx.fillText('Classical Search', 50, 650);

            // Draw Quantum Canvas
            const qImg = new Image();
            qImg.src = document.getElementById('quantum-canvas').toDataURL();
            qImg.onload = () => {
                ctx.drawImage(qImg, 650, 100, 500, 500);
                ctx.fillText('Quantum-Inspired', 650, 650);

                const link = document.createElement('a');
                link.download = 'MazeFlux-Results.png';
                link.href = offscreen.toDataURL();
                link.click();
            };
        };
    }

    // Fullscreen
    document.getElementById('fullscreen-toggle').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    // Theme Switcher
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        window.classicalMaze.resize();
        window.classicalMaze.draw();
        if (window.classicalSim) {
            window.classicalSim.drawVisited();
            if (window.classicalSim.finished) window.classicalSim.drawPath();
        }

        window.quantumMaze.resize();
        window.quantumMaze.draw();
        if (window.quantumSim) {
            window.quantumSim.drawVisited();
            if (window.quantumSim.finished) window.quantumSim.drawPath();
        }
    });

    // Background Particles
    initParticles();
});

function initParticles() {
    const container = document.getElementById('particle-container');
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'bg-particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.width = Math.random() * 3 + 'px';
        p.style.height = p.style.width;
        p.style.setProperty('--duration', (Math.random() * 10 + 10) + 's');
        p.style.setProperty('--delay', (Math.random() * 5) + 's');
        container.appendChild(p);
    }
}
