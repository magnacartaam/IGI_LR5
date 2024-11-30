document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('doctorModal');
    const addButton = document.getElementById('addDoctorBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('doctorForm');
    const submitButton = document.getElementById('submitDoctor');
    
    // Form inputs
    const phoneInput = document.getElementById('phone_number');
    const websiteInput = document.getElementById('website');
    const requiredInputs = form.querySelectorAll('input[required]');

    // Show/hide modal
    addButton.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    }

    // Validation functions
    function validateURL(url) {
        if (!url) return true; // Optional field
        const urlPattern = /^https?:\/\/.*\.(php|html)$/i;
        return urlPattern.test(url);
    }

    function validatePhone(phone) {
        const phonePatterns = [
            /^80\d{9}$/, // 80291112233
            /^8\s?\(\d{3}\)\s?\d{7}$/, // 8 (029) 1112233
            /^\+375\s?\(\d{2}\)\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/ // +375 (29) 111-22-33
        ];
        return phonePatterns.some(pattern => pattern.test(phone.replace(/\s+/g, ' ').trim()));
    }

    // Real-time validation
    websiteInput.addEventListener('input', function() {
        const isValid = validateURL(this.value);
        this.classList.toggle('invalid-input', !isValid);
        document.getElementById('urlValidation').textContent = 
            isValid ? '' : 'URL must start with http:// or https:// and end with .php or .html';
        checkFormValidity();
    });

    phoneInput.addEventListener('input', function() {
        const isValid = validatePhone(this.value);
        this.classList.toggle('invalid-input', !isValid);
        document.getElementById('phoneValidation').textContent = 
            isValid ? '' : 'Invalid phone number format';
        checkFormValidity();
    });

    // Check if all required fields are filled and valid
    function checkFormValidity() {
        let isValid = true;
        
        // Check required fields
        requiredInputs.forEach(input => {
            if (!input.value) isValid = false;
        });

        // Check phone validation
        if (!validatePhone(phoneInput.value)) isValid = false;

        // Check website validation if provided
        if (websiteInput.value && !validateURL(websiteInput.value)) isValid = false;

        submitButton.disabled = !isValid;
    }

    // Add input event listeners to all required fields
    requiredInputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        try {
            const response = await fetch('/api/doctors/', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const newDoctor = await response.json();
                addDoctorToTable(newDoctor);
                modal.style.display = "none";
                form.reset();
            } else {
                const error = await response.json();
                alert('Error adding doctor: ' + error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding doctor');
        }
    });

    // Function to add new doctor to table
    function addDoctorToTable(doctor) {
        const tbody = document.querySelector('#doctorsTable tbody');
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td><input type="checkbox" class="doctor-select"></td>
            <td>${doctor.profile_pic ? `<img src="${doctor.profile_pic}" alt="Profile" class="table-profile-pic">` : ''}</td>
            <td>${doctor.first_name} ${doctor.last_name}</td>
            <td>${doctor.email}</td>
            <td>${doctor.phone_number}</td>
        `;

        tbody.appendChild(newRow);
        
        // Refresh pagination
        showPage(currentPage);
    }
});