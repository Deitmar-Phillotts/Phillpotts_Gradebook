function fetchGradeData() {
    console.log("Fetching grade data...");
    const xhr = new XMLHttpRequest();
    const apiRoute = "http://127.0.0.1:3000/api/grades";
    console.log("API Route:", apiRoute);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    populateGradebook_Phillpotts(data);
                } catch (err) {
                    console.error("Failed to parse JSON response:", err);
                }
            } else {
                console.error(`Could not get grades. Status: ${xhr.status}`);
            }
        }
    };

    xhr.open("GET", apiRoute, true);
    xhr.send();
}

function populateGradebook_Phillpotts(data) {
    console.log("Populating gradebook with data:", data);
    const tableBody = document.getElementById('gradebook').querySelector('tbody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach(student => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = student?.studentName ?? 'N/A';
            row.appendChild(nameCell);

            const assign1Cell = document.createElement('td');
            assign1Cell.textContent = student?.assignment1 ?? 'N/A';
            row.appendChild(assign1Cell);

            const assign2Cell = document.createElement('td');
            assign2Cell.textContent = student?.assignment2 ?? 'N/A';
            row.appendChild(assign2Cell);

            const assign3Cell = document.createElement('td');
            assign3Cell.textContent = student?.assignment3 ?? 'N/A';
            row.appendChild(assign3Cell);

            tableBody.appendChild(row);
        });
    } else {
        console.error("Received data is not in the expected array format:", data);
    }
}







