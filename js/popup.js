fetchOptions();
let website = document.getElementById("website");
if (website) {
  website.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://lakport.utl.gov.in/Home.aspx" });
  });
}

let add_passenger = document.getElementById("add_passenger");
if (add_passenger) {
  add_passenger.addEventListener("click", function (e) {
    e.preventDefault();
    let table = document.getElementById("passenger_table");
    let row = table.insertRow(table.rows.length);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    // add input fields to the cells
    cell1.innerHTML = `<input type="text" class="form-control" id="name" >`;
    cell2.innerHTML = `<input type="number" class="form-control" min="0" id="photo_id">`;
    cell3.innerHTML = `<input type="number" class="form-control" min="0" id="age" >`;
    cell4.innerHTML = `<select name="gender" class="form-control input-field" id="gender">
                         <option value="0">Male</option>
                         <option value="1">Female</option>
                       </select>`;
    cell5.innerHTML = `<select name="category" id="category" class="form-control input-field">
                        <option value="Select Category" >
                          Select Category
                        </option>
                        <option value="G?1">Government Employee</option>
                        <option value="I?1" selected="selected">Islander</option>
                        <option value="P?2">Permit</option>
                        <option value="R?1">Relatives</option>
                        <option value="Z?1">Senior Citizen</option>
                      </select>`;
  });
}
let save = document.getElementById("save");
if (save) {
  save.addEventListener("click", function (e) {
    e.preventDefault();
    let ship = document.getElementById("ship").value;
    let source = document.getElementById("source").value;
    let destination = document.getElementById("destination").value;
    let classs = document.getElementById("class").value;
    let passengers = document.getElementById("passengers").value;
    let infants = document.getElementById("infants").value;
    let mobile = document.getElementById("mobile").value;
    const fixedDetails = {
      ship: ship,
      source: source,
      destination: destination,
      class: classs,
      passengers: passengers,
      infants: infants,
      mobile: mobile,
    };
    const passengerDetails = [];

    // passengerDetails.push({ id: Date.now(), passengerName, photoID, age });
    let table = document.getElementById("passenger_table");
    // save all the details of the passengers
    for (let i = 1; i < table.rows.length; i++) {
      let name = table.rows[i].cells[0].children[0].value;
      let photoID = table.rows[i].cells[1].children[0].value;
      let age = table.rows[i].cells[2].children[0].value;
      let gender = table.rows[i].cells[3].children[0].value;
      let category = table.rows[i].cells[4].children[0].value;
      passengerDetails.push({
        id: i,
        name: name,
        photoID: photoID,
        age: age,
        gender: gender,
        category: category,
      });
    }

    chrome.storage.sync.set(
      {
        fixedDetails: fixedDetails,
        passengerDetails: passengerDetails,
      },
      function () {
        console.log("Data is saved: ");
      }
    );
    chrome.storage.sync.get(
      ["fixedDetails", "passengerDetails"],
      function (result) {
        if (result && result.fixedDetails) {
          console.log(
            "Fixed Details: ",
            result.fixedDetails,
            "Passenger Details: ",
            result.passengerDetails
          );
        }
      }
    );
    let options = {
      type: "basic",
      title: "Lakport",
      message: "Data saved successfully",
      iconUrl: "/images/48.png",
    };
    chrome.notifications.create(options);
  });
}

let clear = document.getElementById("clear");
if (clear) {
  clear.addEventListener("click", function (e) {
    e.preventDefault();
    // clearing all the fields
    document.getElementById("ship").value = "Select Ship";
    document.getElementById("source").value = "Select Source";
    document.getElementById("destination").value = "Select Destination";
    document.getElementById("class").value = "Select Class";
    document.getElementById("passengers").value = "";
    document.getElementById("infants").value = "";
    document.getElementById("mobile").value = "";
    // clearing the table
    let table = document.getElementById("passenger_table");
    if (table.rows.length > 2) {
      for (let i = table.rows.length - 1; i > 1; i--) {
        table.deleteRow(i);
      }
    }
    // emptying the first row of table; i.e. below the header row
    table.rows[1].cells[0].children[0].value = "";
    table.rows[1].cells[1].children[0].value = "";
    table.rows[1].cells[2].children[0].value = "";
    table.rows[1].cells[3].children[0].value = "0";
    table.rows[1].cells[4].children[0].value = "I?1";
    // clearing the storage
    chrome.storage.sync.remove(["fixedDetails", "passengerDetails"]);
  });
}

/**
 * Function to fetch the existing data from the storage
 */
function fetchOptions() {
  chrome.storage.sync.get(
    ["fixedDetails", "passengerDetails"],
    function (items) {
      if (items.fixedDetails) {
        document.getElementById("ship").value =
          items.fixedDetails.ship === null
            ? "Select Ship"
            : items.fixedDetails.ship;
        document.getElementById("source").value =
          items.fixedDetails.source === null
            ? "Select Source"
            : items.fixedDetails.source;
        document.getElementById("destination").value =
          items.fixedDetails.destination;
        document.getElementById("class").value = items.fixedDetails.class;
        document.getElementById("passengers").value =
          items.fixedDetails.passengers;
        document.getElementById("infants").value = items.fixedDetails.infants;
        document.getElementById("mobile").value = items.fixedDetails.mobile;
      }
      if (items.passengerDetails) {
        let table = document.getElementById("passenger_table");
        for (let i = 0; i < items.passengerDetails.length; i++) {
          let row = table.insertRow(table.rows.length - 1);
          let cell1 = row.insertCell(0);
          let cell2 = row.insertCell(1);
          let cell3 = row.insertCell(2);
          let cell4 = row.insertCell(3);
          let cell5 = row.insertCell(4);
          // add input fields to the cells
          cell1.innerHTML = `<input type="text" class="form-control" id="name" value="${items.passengerDetails[i].name}">`;
          cell2.innerHTML = `<input type="number" class="form-control" min="0" id="photo_id" value="${items.passengerDetails[i].photoID}">`;
          cell3.innerHTML = `<input type="number" class="form-control" min="0" id="age" value="${items.passengerDetails[i].age}">`;
          cell4.innerHTML = `<select name="gender" class="form-control input-field" id="gender">
                              <option value="0">Male</option>
                              <option value="1">Female</option>
                            </select>`;
          cell5.innerHTML = `<select name="category" id="category" class="form-control input-field">
                              <option value="Select Category" >
                                Select Category
                              </option>
                              <option value="G?1">Government Employee</option>
                              <option value="I?1" selected="selected">Islander</option>
                              <option value="P?2">Permit</option>
                              <option value="R?1">Relatives</option>
                              <option value="Z?1">Senior Citizen</option>
                            </select>`;
          cell4.children[0].value = items.passengerDetails[i].gender;
          cell5.children[0].value = items.passengerDetails[i].category;
        }
      }
    }
  );
}
