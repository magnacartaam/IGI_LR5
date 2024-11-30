document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submit');
    
    submitButton.addEventListener('click', function() {
        const pageColor = document.getElementById('page_color').value;
        const fontColor = document.getElementById('font_color').value;
        const fontSize = document.getElementById('font_size').value;
        
        // Apply styles only to the door div
        const doorElement = document.querySelector('.door');
        doorElement.style.backgroundColor = pageColor;
        doorElement.style.color = fontColor;
        doorElement.style.fontSize = `${fontSize}px`;
    });
});