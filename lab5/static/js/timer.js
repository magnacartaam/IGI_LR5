function initializeTimer() {
    let endTime = localStorage.getItem('timerEndTime');
    
    if (!endTime) {
        endTime = new Date().getTime() + (60 * 60 * 1000);
        localStorage.setItem('timerEndTime', endTime);
    }

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.querySelector('.countdown').textContent = "Time's up!";
            localStorage.removeItem('timerEndTime');
            return;
        }

        // Calculate hours, minutes, seconds
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Format time with leading zeros
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.querySelector('.countdown').textContent = formattedTime;
    }, 1000);
}

// Initialize timer when page loads
document.addEventListener('DOMContentLoaded', initializeTimer);
