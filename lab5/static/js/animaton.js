document.addEventListener('DOMContentLoaded', function() {
    const door1 = document.querySelector('.door-1');
    const door2 = document.querySelector('.door-2');
    let lastScrollY = window.scrollY;
    const maxRotation = 116;
    
    // Calculate rotation based on scroll position
    function updateDoorRotation() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
        const rotation = maxRotation * scrollPercent;
        
        door1.style.transform = `rotateY(-${rotation}deg)`;
        door2.style.transform = `rotateY(${rotation}deg)`;
    }

    window.addEventListener('scroll', updateDoorRotation);
});