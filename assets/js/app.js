// ///////// Next Train Application - see README for details on functionality

// //////////////////// Global Varibles

// Elements of the Object stored in Firebase
var key = "";     
var route = "";
var origin = "";
var next = "";
var interval = "";

// ///// Booleans
var isUpdated = false;

// ///// short-name for icons
const modifyIcon = "<span onClick='modifyTrain()' class='modify'><i class='fas fa-edit'></i></span>";
const editIcon   = "<span><i class='fas fa-edit'></i></span>";
const cancelIcon = "<span><i class='fas fa-times'></i></span>";
const deleteIcon = "<span><i class='fas fa-trash'></i></span>";

// //////////////////// Functions

function displayScheduleRow() {
  console.log("display called");
};


function updateNext() {
  
  var tempNext = moment(next, "X");
  var currentDate = moment();
  while (currentDate >= tempNext) {
    tempNext = tempNext.add(interval, "m");
    isUpdated = true;
  }
  next = tempNext;
  
};


function modifyTrain() {
  console.log("modify clicked");

};
// $(".modifyTrain").on("click", function(event) {
//   console.log("modify clicked");

// });
// /////////////////// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyARh801jsvtY4XFk3Mx122JdISZGYs7D8U",
  authDomain: "train-schedule-c9a32.firebaseapp.com",
  databaseURL: "https://train-schedule-c9a32.firebaseio.com",
  projectId: "train-schedule-c9a32",
  storageBucket: "train-schedule-c9a32.appspot.com",
  messagingSenderId: "185182548833",
  appId: "1:185182548833:web:d1bddb3c0973ee94"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.database();

// TO DO: experiment with creating a newChild event
// var trigger = {
//   route: "TRIGGER",
//   origin: "TRIGGER",
//   next: "TRIGGER",
//   interval: "TRIGGER"
// };
// db.ref().push(trigger);


$("#add-train-btn").on("click", function(event) {
  
    event.preventDefault();
    
    route     = $("#train-route-input").val().trim();
    origin    = $("#train-origin-input").val().trim();
    next      = moment($("#train-next-arrival-input").val().trim(), "H:mm").format("X");
    interval  = $("#train-interval-input").val().trim();
    
    var newChooChoo = {
      route: route,
      origin: origin,
      next: next,
      interval: interval
    };
    
    db.ref().push(newChooChoo);
    
    // Pop-up modal confirmation
    $('#added-train-info').text("New train: " + newChooChoo.route + "route, from " + newChooChoo.origin);
    $('#modalConfirmSuccess').modal('show');
        
  });
  

  db.ref().on("child_added", function(childSnapshot) {
    
      // load elements from db
      key = childSnapshot.key
      route = childSnapshot.val().route;
      origin = childSnapshot.val().origin;
      next = childSnapshot.val().next;
      interval = childSnapshot.val().interval;

      if ( route == "TRIGGER") {
        console.log ("TRIGGER");
        // TO DO: remove TRIGGER object
        return;
      }
      
      // update each train with arrival time and how long, update db if necessary
      isUpdated = false;
      updateNext();
      if ( isUpdated ) {
        // TO DO: Update the record & trigger a refresh
        // looks something like this
        // db.ref(key).update({ next : next });
      }
      
      var convertedTime = moment(next, "X");
          convertedTime.fromNow();
      
      var delta = Math.floor(convertedTime.diff(moment())/60000);

      var lastCol = $("<td>");
          // lastCol.addClass("modifyTrain");
          lastCol.html(modifyIcon);
          lastCol.attr("data-key", key);
      
      var newRow = $("<tr>").append(
          $("<td>").text(route),
          $("<td>").text(origin),
          $("<td>").text(convertedTime.format("HH:mm")),
          $("<td>").text((delta+1) + " minutes"),
          $("<td>").text("every " + interval + " minutes"),
          lastCol
          );

      $("#schedule-table > tbody").append(newRow);

  });
