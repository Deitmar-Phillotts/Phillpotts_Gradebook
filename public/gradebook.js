function fetchGradeData() {
    console.log("Fetching grade data...");
    const apiRoute = "/api/grades"; 
    const errorDiv = document.getElementById('error'); 
    if (errorDiv) {
        errorDiv.textContent = ''; 
    } else {
        console.warn("Error display element with id 'error' not found.");
    }

    let xhr = new XMLHttpRequest(); 

    xhr.onreadystatechange = function() { 
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                
                try {
                    const data = JSON.parse(xhr.responseText); 
                    console.log("Data received:", data);
                    populateGradebook(data); 
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    if (errorDiv) {
                        errorDiv.textContent = "Failed to load grades: Invalid data format received.";
                    }
                }
            } else {
                
                console.error(`Could not get grades. Status: ${xhr.status} ${xhr.statusText}`); 
                if (errorDiv) {
                    errorDiv.textContent = `Failed to load grades: Server responded with status ${xhr.status} ${xhr.statusText}`;
                }
            }
        }
    }; 

    xhr.open("GET", apiRoute, true); 
    xhr.send(); 
}

function populateGradebook(data) {
    console.log("Populating gradebook with data:", data); 
    const tableElm = document.getElementById("gradebook"); 
    const errorDiv = document.getElementById('error');
    if (!tableElm) {
        console.error("Gradebook table element not found!");
        if(errorDiv) errorDiv.textContent = "Error: Gradebook table structure missing in HTML.";
        return;
    }
    const tableBody = tableElm.querySelector('tbody'); 
     if (!tableBody) {
        console.error("Gradebook table body element not found!");
        if(errorDiv) errorDiv.textContent = "Error: Gradebook table body structure missing in HTML.";
        return;
    }

    tableBody.innerHTML = '';

    
    if (Array.isArray(data)) {
        data.forEach(function(assignment) { 
            console.log("Processing assignment:", assignment);
            const row = document.createElement("tr"); 

            
            const nameCell = document.createElement('td'); 
            const lastName = assignment.last_name ?? 'N/A';
            const firstName = assignment.first_name ?? 'N/A';
            nameCell.textContent = `${lastName}, ${firstName}`; 
            row.appendChild(nameCell); 

            
            const gradeCell = document.createElement('td'); 
            gradeCell.textContent = assignment.total_grade ?? 'N/A'; 
            row.appendChild(gradeCell); 

            tableBody.appendChild(row); 
        }); 
    } else {
        console.error("Received data is not an array:", data);
        if (errorDiv) {
             errorDiv.textContent = "Failed to load grades: Invalid data format received (expected an array).";
        }
    }
} 
document.addEventListener('DOMContentLoaded', fetchGradeData);