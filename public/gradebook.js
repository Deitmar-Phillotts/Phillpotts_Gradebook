
function fetchGradeData() {
    console.log("Fetching grade data...");
    let xhr = new XMLHttpRequest();
    let apiRoute = "/api/grades";
    xhr.onreadystatechange = function(){
        if (xhr.readyState === xhr.DONE){
            if (xhr.status != 200) {
                console.error(`Could not get grades. status: ${xhr.status}`);
            }
            populateGradebook_Phillpotts(JSON.parse(xhr.responseText));
        }
    }.bind(this);
    xhr.open("get", apiRoute, true);
    xhr.send();
}


function populateGradebook_Phillpotts(data) {
    console.log("Populating gradebook with data:", data); // Debug: Check the data

    // Check if data is valid and an array.  This is CRUCIAL.
    if (!data || !Array.isArray(data)) {
        console.error("Error: Invalid data received.  Expected an array, got:", data);
        //  IMPORTANT:  Stop here to prevent further errors.  You might want to display an error message to the user.
        return;
    }

    let tableElm = document.getElementById("gradebook");
    if (!tableElm) {
        console.error("Error: Could not find the 'gradebook' table element in the HTML.");
        return; // Stop if the table doesn't exist.
    }

    // Clear the table body before adding new rows.  This prevents duplicate entries.
    tableElm.innerHTML = ''; // Or, more robust: while (tableElm.firstChild) tableElm.removeChild(tableElm.firstChild);


    data.forEach(function(assignment) {
        // Debug: Check each 'assignment' object.
        console.log("Processing assignment:", assignment);

        // Check if the expected properties exist in the assignment object.
        if (!assignment || typeof assignment.last_name === 'undefined' || typeof assignment.first_name === 'undefined' || typeof assignment.total_grade === 'undefined') {
            console.error("Error: Missing properties in assignment object:", assignment);
            return; // Skip this row, but continue processing other assignments.  Important!
        }
        let row = document.createElement("tr");
        let columns = {};

        columns.name = document.createElement("td");
        columns.name.appendChild(
            document.createTextNode(assignment.last_name + ", " + assignment.first_name)
        );

        columns.grade = document.createElement("td");
        columns.grade.appendChild(
            document.createTextNode(assignment.total_grade)
        );

        row.appendChild(columns.name);
        row.appendChild(columns.grade);
        tableElm.appendChild(row);
    });
}







