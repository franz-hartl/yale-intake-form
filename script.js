document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const intakeForm = document.getElementById('intakeForm');
    const submissionList = document.getElementById('submissionList');
    const requestsList = document.getElementById('requestsList');
    const statusFilter = document.getElementById('statusFilter');
    const resetBtn = document.getElementById('resetBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close-modal');
    const viewSubmissionsBtn = document.getElementById('viewSubmissionsBtn');
    const newRequestBtn = document.getElementById('newRequestBtn');
    
    // Initialize date pickers
    flatpickr("#timelineStart", {
        dateFormat: "Y-m-d",
        minDate: "today",
        allowInput: true,
        onChange: function(selectedDates) {
            // Set the min date of the end date picker to the selected start date
            if (selectedDates[0]) {
                endDatePicker.set("minDate", selectedDates[0]);
            }
        }
    });
    
    const endDatePicker = flatpickr("#timelineEnd", {
        dateFormat: "Y-m-d",
        minDate: "today",
        allowInput: true
    });
    
    // Load existing submissions from localStorage
    loadSubmissions();
    
    // Event Listeners
    intakeForm.addEventListener('submit', handleFormSubmission);
    resetBtn.addEventListener('click', resetForm);
    statusFilter.addEventListener('change', filterSubmissions);
    closeModal.addEventListener('click', () => hideModal());
    viewSubmissionsBtn.addEventListener('click', () => {
        hideModal();
        showSubmissionsList();
    });
    newRequestBtn.addEventListener('click', () => {
        hideModal();
        resetForm();
    });
    
    // Handle form submission
    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            id: Date.now(), // Unique ID based on timestamp
            projectTitle: document.getElementById('projectTitle').value,
            priority: document.getElementById('priority').value,
            sponsor: document.getElementById('sponsor').value,
            businessNeed: document.getElementById('businessNeed').value,
            timelineStart: document.getElementById('timelineStart').value,
            timelineEnd: document.getElementById('timelineEnd').value,
            stakeholders: document.getElementById('stakeholders').value,
            status: 'pending',
            submittedDate: new Date().toLocaleString()
        };
        
        // Save to localStorage
        saveSubmission(formData);
        
        // Reset form
        resetForm();
        
        // Reload submissions list
        loadSubmissions();
        
        // Show confirmation modal
        showModal();
    }
    
    // Reset the form
    function resetForm() {
        intakeForm.reset();
        
        // Reset the flatpickr instances
        flatpickr("#timelineStart").clear();
        flatpickr("#timelineEnd").clear();
    }
    
    // Show the confirmation modal
    function showModal() {
        confirmationModal.style.display = "flex";
    }
    
    // Hide the confirmation modal
    function hideModal() {
        confirmationModal.style.display = "none";
    }
    
    // Show submissions list
    function showSubmissionsList() {
        submissionList.classList.remove('hidden');
        window.scrollTo({
            top: submissionList.offsetTop,
            behavior: 'smooth'
        });
    }
    
    // Save submission to localStorage
    function saveSubmission(submission) {
        let submissions = JSON.parse(localStorage.getItem('yaleWorkIntake')) || [];
        submissions.push(submission);
        localStorage.setItem('yaleWorkIntake', JSON.stringify(submissions));
    }
    
    // Load submissions from localStorage
    function loadSubmissions() {
        let submissions = JSON.parse(localStorage.getItem('yaleWorkIntake')) || [];
        
        if (submissions.length > 0) {
            submissionList.classList.remove('hidden');
            renderSubmissions(submissions);
        } else {
            submissionList.classList.add('hidden');
        }
    }
    
    // Filter submissions by status
    function filterSubmissions() {
        const filterValue = statusFilter.value;
        let submissions = JSON.parse(localStorage.getItem('yaleWorkIntake')) || [];
        
        if (filterValue !== 'all') {
            submissions = submissions.filter(item => item.status === filterValue);
        }
        
        renderSubmissions(submissions);
    }
    
    // Format timeline for display
    function formatTimeline(start, end) {
        if (!start || !end) return 'Not specified';
        return `${start} to ${end}`;
    }
    
    // Render submissions to the page
    function renderSubmissions(submissions) {
        requestsList.innerHTML = '';
        
        if (submissions.length === 0) {
            requestsList.innerHTML = '<p class="no-requests">No requests found matching the selected filter.</p>';
            return;
        }
        
        submissions.forEach(item => {
            const requestItem = document.createElement('div');
            requestItem.classList.add('request-item');
            
            // Status indicator
            const statusClass = 
                item.status === 'approved' ? 'status-approved' :
                item.status === 'rejected' ? 'status-rejected' : 'status-pending';
            
            const statusText = 
                item.status === 'approved' ? 'Approved' :
                item.status === 'rejected' ? 'Rejected' : 'Pending';
            
            requestItem.innerHTML = `
                <h3>${item.projectTitle} <span class="${statusClass}">${statusText}</span></h3>
                <p><strong>Priority:</strong> ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</p>
                <p><strong>Sponsor:</strong> ${item.sponsor}</p>
                <p><strong>Business Need:</strong> ${item.businessNeed}</p>
                <p><strong>Timeline:</strong> ${formatTimeline(item.timelineStart, item.timelineEnd)}</p>
                <p><strong>Stakeholders:</strong> ${item.stakeholders.replace(/\n/g, ', ')}</p>
                <p><strong>Submitted:</strong> ${item.submittedDate}</p>
            `;
            
            // Add approval buttons for pending items
            if (item.status === 'pending') {
                const approvalDiv = document.createElement('div');
                approvalDiv.classList.add('approval-buttons');
                
                const approveBtn = document.createElement('button');
                approveBtn.classList.add('approve-btn');
                approveBtn.innerHTML = '<i class="fas fa-check"></i> Approve';
                approveBtn.addEventListener('click', () => updateStatus(item.id, 'approved'));
                
                const rejectBtn = document.createElement('button');
                rejectBtn.classList.add('reject-btn');
                rejectBtn.innerHTML = '<i class="fas fa-times"></i> Reject';
                rejectBtn.addEventListener('click', () => updateStatus(item.id, 'rejected'));
                
                approvalDiv.appendChild(approveBtn);
                approvalDiv.appendChild(rejectBtn);
                requestItem.appendChild(approvalDiv);
            }
            
            requestsList.appendChild(requestItem);
        });
    }
    
    // Update status of a submission
    function updateStatus(id, status) {
        let submissions = JSON.parse(localStorage.getItem('yaleWorkIntake')) || [];
        
        submissions = submissions.map(item => {
            if (item.id === id) {
                return { ...item, status: status };
            }
            return item;
        });
        
        localStorage.setItem('yaleWorkIntake', JSON.stringify(submissions));
        
        // Reapply the current filter
        filterSubmissions();
    }
});