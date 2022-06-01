// /**
//  *
//  * @param {number} ms
//  * @returns promise
//  */
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// let baseUrl = "";
// let bearerToken = "";

window.onload = function () {
  init();
};

/**
 * Fetch API Key from chrome storage
 */
// function fetchApiKey() {
//   chrome.storage.sync.get(["baseUrl", "bearerToken"], function (result) {
//     try {
//       if (result.baseUrl) {
//         baseUrl = result.baseUrl.replace(/\/$/, "");
//         bearerToken = result.bearerToken;
//         init();
//       } else {
//         vNotify.error({ text: "Set API Url" });
//       }
//     } catch (err) {
//       let desc = `${err.toString()} in fetchApiKey() in Content Script`;
//       console.log(desc);
//     }
//   });
// }
// Main Function
/**
 * check for the pathname and follow up functions execution
 */
// https://secure.vermont.gov/DPS/criminalrecords/subscriber/request.php
function init() {
  try {
    let { pathname } = window.location;
    console.log(`pathname`, pathname);
    switch (pathname) {
      case "/shipping/Test_LoginPage.aspx": {
        chrome.storage.sync.get(["fixedDetails"], function (result) {
          if (result && result.fixedDetails) {
            let data = result.fixedDetails;
            populateShippingDetails(data);
          }
        });

        break;
      }
      case "/shipping/Test_ship_Ticket_Public.aspx": {
        chrome.storage.sync.get(["fixedDetails"], function (result) {
          if (result && result.fixedDetails) {
            let data = result.fixedDetails;
            populateTicketDetails(data);
          }
        });
        break;
      }
      case "/shipping/pg_req_test1.aspx": {
        let table = document.querySelectorAll("tbody")[0];
        chrome.storage.sync.get(["passengerDetails"], function (result) {
          if (result && result.passengerDetails) {
            let data = result.passengerDetails;
            populatePassengerDetails(data, table);
          }
        });

        break;
      }
      default:
        return false;
    }
  } catch (err) {
    let desc = `${err.toString()} in init() in Content Script`;
    console.log(desc);
  }
  // }
}

/**
 * This function populates the shipping details
 *  * @param {object} data
 */
const populateShippingDetails = (data) => {
  let ship = document.getElementById("ContentPlaceHolder1_ddlShip");
  if (ship) {
    ship.value = data.ship;
  }

  let source = document.getElementById("ContentPlaceHolder1_cmbSource");
  if (source) {
    source.value = data.source;
  }

  let destination = document.getElementById("ContentPlaceHolder1_CmbDest");
  if (destination) {
    destination.value = data.destination;
  }
  let bookNow = document.getElementById(
    "ContentPlaceHolder1_ctl01_seats_dgrid_btnBookNow_0"
  );
  if (bookNow) {
    bookNow.click();
  }
};
/**
 * This function populates the ticket details
 *  * @param {object} data
 */
const populateTicketDetails = (data) => {
  let classs = document.getElementById(
    "ContentPlaceHolder1_shipclas_DropDownList"
  );
  if (classs) {
    console.log("here");
    classs.value = data.class;
    classs.dispatchEvent(new Event("change"));
  }

  let passengers = document.getElementById(
    "ContentPlaceHolder1_shippassengers_TextBox"
  );
  if (passengers) {
    if (data.passengers !== "") {
      passengers.value = data.passengers;
    }
  }

  let infants = document.getElementById("ContentPlaceHolder1_txtInfant");
  if (infants) {
    if (data.infants !== "") {
      infants.value = data.infants;
    }
  }

  let mobile = document.getElementById("ContentPlaceHolder1_txt_MobileNumber");
  if (mobile) {
    if (data.mobile !== "") {
      mobile.value = data.mobile;
    }
  }
  let NextBtn = document.getElementById(
    "ContentPlaceHolder1_shiptsubmit_Button"
  );
  if (NextBtn) {
    NextBtn.click();
  }
};
/**
 * This function populates the passenger details
 *  * @param {array} data
 *  * @param {HTMLTableSectionElement} table
 */
const populatePassengerDetails = (data, table) => {
  let passengerDetails = data;
  let rows = table.querySelectorAll("tr");
  for (let i = 7, j = 0; i < rows.length - 4; i++, j++) {
    let row = rows[i];
    let cols = row.querySelectorAll("td");
    let name = cols[0];
    let photoID = cols[1];
    let age = cols[2];
    let gender = cols[3];
    let category = cols[4];

    if (name) {
      if (passengerDetails[j]["name"]) {
        name.querySelectorAll("input")[0].value = passengerDetails[j]["name"];
      } else {
        let randomWord = Math.random().toString(36).substring(2, 7);
        name.querySelectorAll("input")[0].value = randomWord;
      }
    }

    if (photoID) {
      if (passengerDetails[j].photoID) {
        photoID.querySelectorAll("input")[0].value =
          passengerDetails[j].photoID;
      } else {
        let randomNumber = Math.floor(Math.random() * (5000 - 1000) + 1000);
        photoID.querySelectorAll("input")[0].value = randomNumber;
      }
    }
    if (age) {
      if (passengerDetails[j].age) {
        age.querySelectorAll("input")[0].value = passengerDetails[j].age;
      } else {
        let randomNumber = Math.floor(Math.random() * (100 - 20) + 20);
        age.querySelectorAll("input")[0].value = randomNumber;
      }
    }
    if (gender) {
      if (passengerDetails[j].gender) {
        gender.children[0].value = passengerDetails[j].gender;
      } else {
        gender.children[0].value = 0;
      }
    }
    if (category) {
      if (passengerDetails[j].category) {
        category.children[0].value = passengerDetails[j].category;
      } else {
        category.children[0].value = "I?1";
      }
      category.children[0].dispatchEvent(new Event("change"));
    }
  }
};
