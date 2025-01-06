// Timer variables
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkTime = true;

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
                
                // Toggle between work and break
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
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

// Reset function
function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    statusText.textContent = 'Work Time!';
    startButton.textContent = 'Start';
    updateDisplay();
}

// Add this function to handle mode switching
function updateModeVisuals() {
    if (isWorkTime) {
        document.body.classList.remove('break-mode');
        document.body.classList.add('work-mode');
    } else {
        document.body.classList.remove('work-mode');
        document.body.classList.add('break-mode');
    }
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
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

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', toggleMode);

// Initial display update
updateDisplay(); 