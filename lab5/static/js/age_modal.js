
document.addEventListener('DOMContentLoaded', () => {
    // Check if age verification has been completed before
    if (localStorage.getItem('ageVerified') === 'true') {
        document.getElementById('ageModal').style.display = 'none';
    }
});

function verifyAge() {
    const dobInput = document.getElementById('dobInput');
    const dob = new Date(dobInput.value);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    // Day of week calculation
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[dob.getDay()];

    // Age verification logic
    if (age >= 18) {
        alert(`You were born on a ${dayOfWeek}! Welcome to the site.`);
        document.getElementById('ageModal').style.display = 'none';
        localStorage.setItem('ageVerified', 'true');
    } else {
        const parentalPermissionConfirm = confirm(`You are ${age} years old. You need parental permission to use this site. Do your parents approve?`);
        
        if (parentalPermissionConfirm) {
            alert(`You were born on a ${dayOfWeek}! Welcome to the site with parental consent.`);
            document.getElementById('ageModal').style.display = 'none';
            localStorage.setItem('ageVerified', 'true');
        } else {
            alert('Access denied. You need parental permission.');
        }
    }
}