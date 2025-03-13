document.addEventListener('DOMContentLoaded', function() {
    const intakeForm = document.getElementById('intakeForm');
    const submissionList = document.getElementById('submissionList');
    const requestsList = document.getElementById('requestsList');
    
    // Load existing submissions from localStorage
    loadSubmissions();
    
    // Handle form submission
    intakeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            id: Date.now(), // Unique ID based on timestamp
            projectTitle: document.getElementById('projectTitle').value,
            priority: document.getElementById('priority').value,
            sponsor: document.getElementById('sponsor').value,
            businessNeed: document.getElementById('businessNeed').value,
            timeline: document.getElementById('timeline').value,
            stakeholders: document.getElementById('stakeholders').value,
            status: 'pending',
            submittedDate: new Date().toLocaleString()
        };
        
        // Save to localStorage
        saveSubmission(formData);
        
        // Reset form
        intakeForm.reset();
        
        // Reload submissions list
        loadSubmissions();
        
        // Show success message
        alert('Work request submitted successfully!');
    });
    
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
    
    // Render submissions to the page
    function renderSubmissions(submissions) {
        requestsList.innerHTML = '';
        
        submissions.forEach(item => {
            const requestItem = document.createElement('div');
            requestItem.classList.add('request-item');
            
            // Status indicator
            const statusClass = 
                item.status === 'approved' ? 'status-approved' :
                item.status === 'rejected' ? 'status-rejected' : 'status-pending';
            
            requestItem.innerHTML = `
                <h3>${item.projectTitle} <span class="${statusClass}">${item.status}</span></h3>
                <p><strong>Priority:</strong> ${item.priority}</p>
                <p><strong>Sponsor:</strong> ${item.sponsor}</p>
                <p><strong>Business Need:</strong> ${item.businessNeed}</p>
                <p><strong>Timeline:</strong> ${item.timeline}</p>
                <p><strong>Stakeholders:</strong> ${item.stakeholders}</p>
                <p><strong>Submitted:</strong> ${item.submittedDate}</p>
            `;
            
            // Add approval buttons for pending items
            if (item.status === 'pending') {
                const approvalDiv = document.createElement('div');
                approvalDiv.classList.add('approval-buttons');
                
                const approveBtn = document.createElement('button');
                approveBtn.classList.add('approve-btn');
                approveBtn.textContent = 'Approve';
                approveBtn.addEventListener('click', () => updateStatus(item.id, 'approved'));
                
                const rejectBtn = document.createElement('button');
                rejectBtn.classList.add('reject-btn');
                rejectBtn.textContent = 'Reject';
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
        loadSubmissions();
    }
});