document.addEventListener('DOMContentLoaded', function() {
    // Pagination setup
    const table = document.getElementById('doctorsTable');
    const tbody = table.querySelector('tbody');
    const rows = tbody.getElementsByTagName('tr');
    const rowsPerPage = 3;
    let currentPage = 1;

    // Sorting state
    let currentSortColumn = null;
    let isAscending = true;

    // Initialize sorting icons
    const headers = table.querySelectorAll('th:not(:first-child)'); // Skip checkbox column
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        const sortIcon = document.createElement('span');
        sortIcon.className = 'sort-icon';
        sortIcon.innerHTML = ' ↕️'; // Default icon
        header.appendChild(sortIcon);
        
        header.addEventListener('click', () => {
            const columnIndex = Array.from(header.parentElement.children).indexOf(header);
            sortTable(columnIndex);
            updateSortIcons(header);
        });
    });

    function updateSortIcons(clickedHeader) {
        headers.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (header === clickedHeader) {
                icon.innerHTML = isAscending ? ' ↑' : ' ↓';
            } else {
                icon.innerHTML = ' ↕️';
            }
        });
    }

    function sortTable(columnIndex) {
        const rowsArray = Array.from(rows);
        const isProfilePicColumn = columnIndex === 1;

        if (currentSortColumn === columnIndex) {
            isAscending = !isAscending;
        } else {
            isAscending = true;
            currentSortColumn = columnIndex;
        }

        rowsArray.sort((a, b) => {
            let aValue, bValue;

            if (isProfilePicColumn) {
                // Sort by presence of profile picture
                aValue = a.cells[columnIndex].querySelector('img') ? 1 : 0;
                bValue = b.cells[columnIndex].querySelector('img') ? 1 : 0;
            } else {
                aValue = a.cells[columnIndex].textContent.trim().toLowerCase();
                bValue = b.cells[columnIndex].textContent.trim().toLowerCase();
            }

            if (aValue < bValue) return isAscending ? -1 : 1;
            if (aValue > bValue) return isAscending ? 1 : -1;
            return 0;
        });

        // Reorder the table
        rowsArray.forEach(row => tbody.appendChild(row));
        
        // Reset to first page after sorting
        currentPage = 1;
        showPage(1);
    }

    // Select all functionality
    const selectAll = document.getElementById('selectAll');
    selectAll.addEventListener('change', function() {
        const checkboxes = document.getElementsByClassName('doctor-select');
        for (let checkbox of checkboxes) {
            checkbox.checked = selectAll.checked;
        }
    });

    // Filtering functionality
    const filterInput = document.getElementById('filterInput');
    const findButton = document.getElementById('findButton');
    const doctorDetails = document.getElementById('doctorDetails');

    function filterTable() {
        const filterText = filterInput.value.toLowerCase();
        const rowsArray = Array.from(rows);
        
        rowsArray.forEach(row => {
            const text = Array.from(row.cells)
                .slice(1) // Skip checkbox cell
                .map(cell => cell.textContent.trim().toLowerCase())
                .join(' ');
            
            const shouldShow = text.includes(filterText);
            row.dataset.filtered = shouldShow ? 'true' : 'false';
        });

        // Reset to first page and show only filtered rows
        currentPage = 1;
        showPage(1);
    }

    findButton.addEventListener('click', filterTable);
    
    // Allow filtering on Enter key
    filterInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterTable();
        }
    });

    // Row details functionality
    function showDoctorDetails(row) {
        const cells = row.cells;
        const detailImage = doctorDetails.querySelector('.detail-image');
        const detailInfo = doctorDetails.querySelector('.detail-info');
        
        // Get profile picture
        const img = cells[1].querySelector('img');
        detailImage.innerHTML = img ? 
            `<img src="${img.src}" alt="Doctor profile">` : 
            '<div class="no-image">No profile picture</div>';
        
        // Get other details
        detailInfo.innerHTML = `
            <p><strong>Name:</strong> ${cells[2].textContent}</p>
            <p><strong>Email:</strong> ${cells[3].textContent}</p>
            <p><strong>Phone:</strong> ${cells[4].textContent}</p>
        `;
        
        doctorDetails.style.display = 'block';
    }

    // Add click event to table rows
    Array.from(rows).forEach(row => {
        row.addEventListener('click', (e) => {
            // Ignore clicks on checkbox
            if (e.target.type !== 'checkbox') {
                showDoctorDetails(row);
            }
        });
    });

    // Modify showPage function to handle filtering
    function showPage(page) {
        const filteredRows = Array.from(rows).filter(row => 
            row.dataset.filtered !== 'false'
        );
        
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        
        Array.from(rows).forEach((row, index) => {
            if (row.dataset.filtered === 'false') {
                row.style.display = 'none';
            } else {
                const filteredIndex = filteredRows.indexOf(row);
                row.style.display = (filteredIndex >= start && filteredIndex < end) ? '' : 'none';
            }
        });
        
        document.getElementById('currentPage').textContent = page;
        document.getElementById('totalPages').textContent = 
            Math.ceil(filteredRows.length / rowsPerPage);
    }

    // Initialize all rows as filtered
    Array.from(rows).forEach(row => {
        row.dataset.filtered = 'true';
    });

    // Pagination functionality
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        if (currentPage < Math.ceil(rows.length / rowsPerPage)) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Initialize first page
    showPage(1);

    // Reward functionality
    const rewardBtn = document.getElementById('rewardBtn');
    const preloader = document.getElementById('preloader');
    const rewardMessage = document.getElementById('rewardMessage');

    // Update reward button state based on checkbox selection
    function updateRewardButtonState() {
        const checkedBoxes = document.querySelectorAll('.doctor-select:checked');
        rewardBtn.disabled = checkedBoxes.length === 0;
    }

    // Add event listeners to checkboxes
    document.querySelectorAll('.doctor-select').forEach(checkbox => {
        checkbox.addEventListener('change', updateRewardButtonState);
    });

    // Update select all functionality to also update reward button
    selectAll.addEventListener('change', function() {
        const checkboxes = document.getElementsByClassName('doctor-select');
        for (let checkbox of checkboxes) {
            checkbox.checked = selectAll.checked;
        }
        updateRewardButtonState();
    });

    // Reward button click handler
    rewardBtn.addEventListener('click', async function() {
        const selectedDoctors = [];
        const checkboxes = document.querySelectorAll('.doctor-select:checked');
        
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const name = row.cells[2].textContent; // Name is in the third column
            selectedDoctors.push(name);
        });

        if (selectedDoctors.length === 0) {
            alert('Please select at least one doctor to reward.');
            return;
        }

        // Show preloader
        preloader.style.display = 'flex';

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate reward message
            let message = '';
            if (selectedDoctors.length === 1) {
                message = `🎉 Congratulations to ${selectedDoctors[0]} on receiving a bonus!`;
            } else {
                const lastDoctor = selectedDoctors.pop();
                message = `🎉 Congratulations to ${selectedDoctors.join(', ')} and ${lastDoctor} on receiving bonuses!`;
            }

            // Display reward message
            rewardMessage.textContent = message;
            rewardMessage.style.display = 'block';

            // Uncheck all checkboxes
            selectAll.checked = false;
            checkboxes.forEach(checkbox => checkbox.checked = false);
            updateRewardButtonState();

            // Scroll to reward message
            rewardMessage.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error rewarding doctors:', error);
            alert('Error processing rewards. Please try again.');
        } finally {
            // Hide preloader
            preloader.style.display = 'none';
        }
    });

    // Add checkbox change handler to new rows
    function addCheckboxHandler(row) {
        const checkbox = row.querySelector('.doctor-select');
        if (checkbox) {
            checkbox.addEventListener('change', updateRewardButtonState);
        }
    }

    // Update addDoctorToTable function to add checkbox handler
    const originalAddDoctorToTable = addDoctorToTable;
    addDoctorToTable = function(doctor) {
        const newRow = originalAddDoctorToTable(doctor);
        addCheckboxHandler(newRow);
        return newRow;
    };

    // Initialize checkbox handlers for existing rows
    document.querySelectorAll('#doctorsTable tbody tr').forEach(addCheckboxHandler);
});
