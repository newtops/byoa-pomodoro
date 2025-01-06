// Timer variables and configurations
const TIMER_MODES = {
    classic: {
        work: 25 * 60,
        break: 5 * 60
    },
    long: {
        work: 50 * 60,
        break: 10 * 60
    }
};

let currentMode = 'classic';
let timeLeft = TIMER_MODES[currentMode].work;
let timerId = null;
let isWorkTime = true;
let pomodoroCount = 0;

// Get DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status');
const toggleButton = document.getElementById('toggle-mode');
const container = document.querySelector('.container');

// Update timer display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Change duration mode
function changeDuration(mode) {
    currentMode = mode;
    
    // Update active button styling
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.duration === (mode === 'classic' ? '25' : '50')) {
            btn.classList.add('active');
        }
    });
    
    // Reset timer with new duration, maintaining work/break state
    clearInterval(timerId);
    timerId = null;
    // Instead of forcing work mode, use current break/work state
    timeLeft = isWorkTime ? 
        TIMER_MODES[mode].work : 
        TIMER_MODES[mode].break;
    startButton.textContent = 'Start';
    updateModeVisuals();
    updateDisplay();
}

// Timer function
function startTimer() {
    if (timerId !== null) {
        // Timer is running, so pause it
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    } else {
        // Start the timer
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                // Timer completed
                clearInterval(timerId);
                timerId = null;
                
                // Only count completion if finishing a work session
                if (isWorkTime) {
                    handlePomodoroCompletion();
                }
                
                // Toggle between work and break
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? 
                    TIMER_MODES[currentMode].work : 
                    TIMER_MODES[currentMode].break;
                statusText.textContent = isWorkTime ? 'Work Time!' : 'Break Time!';
                toggleButton.textContent = isWorkTime ? 'Break Mode' : 'Work Mode';
                updateModeVisuals();
                updateDisplay();
                startButton.textContent = 'Start';
                
                // Play notification sound
                alert('Timer completed!');
            }
        }, 1000);
        startButton.textContent = 'Pause';
    }
}

// Reset timer function
function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? 
        TIMER_MODES[currentMode].work : 
        TIMER_MODES[currentMode].break;
    statusText.textContent = isWorkTime ? 'Work Time!' : 'Break Time!';
    startButton.textContent = 'Start';
    toggleButton.textContent = isWorkTime ? 'Break Mode' : 'Work Mode';
    updateModeVisuals();
    updateDisplay();
}

// Add new function for resetting pomodoros
function resetPomodoros() {
    pomodoroCount = 0;
    document.getElementById('pomodoro-count').textContent = '0';
}

// Modify handlePomodoroCompletion to remove auto-reset
function handlePomodoroCompletion() {
    const increment = currentMode === 'classic' ? 1 : 2;
    pomodoroCount += increment;
    
    const countDisplay = document.getElementById('pomodoro-count');
    countDisplay.textContent = Math.min(pomodoroCount, 4);
    
    if (pomodoroCount >= 4) {
        createParticles();
    }
}

// Toggle between work and break modes
function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 
        TIMER_MODES[currentMode].work : 
        TIMER_MODES[currentMode].break;
    statusText.textContent = isWorkTime ? 'Work Time!' : 'Break Time!';
    toggleButton.textContent = isWorkTime ? 'Break Mode' : 'Work Mode';
    
    // Update visual mode
    updateModeVisuals();
    
    // Reset timer state
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    
    // Update display
    updateDisplay();
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Duration button listeners
    const durationButtons = document.querySelectorAll('.duration-btn');
    durationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const duration = btn.dataset.duration;
            changeDuration(duration === '25' ? 'classic' : 'long');
        });
    });
    
    // Set initial active state
    document.querySelector('[data-duration="25"]').classList.add('active');
    
    // Other button listeners
    startButton.addEventListener('click', startTimer);
    resetButton.addEventListener('click', resetTimer);
    toggleButton.addEventListener('click', toggleMode);
    
    // Add new reset pomodoros button listener
    const resetPomodorosButton = document.getElementById('reset-pomodoros');
    resetPomodorosButton.addEventListener('click', resetPomodoros);
});

// Update visual mode (assuming this function exists in your CSS)
function updateModeVisuals() {
    container.classList.toggle('break-mode', !isWorkTime);
} 