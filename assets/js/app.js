// //////////////////// Global Varibles

var uid = "";
var route = "";
var origin = "";
var next = "";
var interval = "";
var isUpdated = false;

function updateTrains () {

  tempNext = moment(next, "X");
  console.log("start: " + tempNext.format("MM/DD/YY H:mm"));
  var currentDate = moment();
    console.log("current: " + currentDate.format("MM/DD/YY H:mm"));
    while (currentDate >= tempNext) {
      tempNext = tempNext.add(interval, "m");
    }
    console.log("next: " + tempNext.format("MM/DD/YY H:mm"));
    next = tempNext;

}

// Initialize Firebase
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



// var firstMoment = moment("13:00","H:mm");
// var tempinterval = 5000;

// console.log("time: " + firstMoment.format("H:mm") + " | " +  firstMoment);
// console.log(firstMoment.format("YYYY-MM-DD H:mm:ss"));
// // tempMoment = firstMoment.format("X");
// // console.log(tempMoment);
// var tempMoment = moment().diff(moment.unix(firstMoment), " minutes");
// // console.log(firstMoment.format("H:mm"));
// console.log(tempMoment);
// var nextMoment = moment("1557248400", "X");
// console.log(nextMoment.format("YYYY-MM-DD H:mm:ss"));


$("#add-train-btn").on("click", function(event) {

  event.preventDefault();

  // Grabs user input
  var route = $("#train-route-input").val().trim();
  var origin= $("#train-origin-input").val().trim();
  var next = moment($("#train-next-arrival-input").val().trim(), "H:mm").format("X");
  var interval = $("#train-interval-input").val().trim();
      // trainInterval *= 60000;

  
    // route, origin, next, interval 

  var newChooChoo = {
    route: route,
    origin: origin,
    next: next,
    interval: interval
  };

  // Upload to the database
  db.ref().push(newChooChoo);

  // Logs everything to console
  // console.log(newChooChoo.route);
  // console.log(newChooChoo.origin);
  // console.log(newChooChoo.next);
  // console.log(newChooChoo.interval);

  $('#added-train-info').text(newChooChoo.route + " from " + newChooChoo.origin);
  $('#modalConfirmTrainAdded').modal('show');

  // Clears all of the text-boxes
  $("#train-route-input").val("");
  $("#train-origin-input").val("");
  $("#train-next-departure-input").val("");
  $("#train-interval-input").val("");
});

db.ref().on("child_added", function(childSnapshot) {
  // console.log(childSnapshot);

  // Store everything into a variable.
  uid = childSnapshot.key
  route = childSnapshot.val().route;
  origin = childSnapshot.val().origin;
  next = childSnapshot.val().next;
  interval = childSnapshot.val().interval;

  updateTrains();

  // Train Info
  console.log("uid: " + uid + " | "
              + "route: " + route + " | "
              + "origin: " + origin + " | "
              + "next: " + next + " | "
              + "interval: " + interval);

      if (route == "janskis") {
      console.log ("I am here route: " + route);
                  // var t_update = {}
                  //     t_update [uid] = {
                  //         junnk: "double-junk"
                  //         };
                
                  // // Upload to the database
                  route = "jan";
                  db.ref(uid).update({ route: "jan" });
                }


  // Create the new row
  
  var convertedTime = moment(next, "X");
      convertedTime.fromNow();

  // var temp = Math.floor(convertedTime.diff(moment())/60000) + " minutes";
  var newRow = $("<tr>").append(
    $("<td>").text(route),
    $("<td>").text(origin),
    $("<td>").text(convertedTime.format("H:mm")),
    $("<td>").text(Math.floor(convertedTime.diff(moment())/60000) + " minutes"),
    $("<td>").text("every " + interval + " minutes"),
    $("<td>").text("")
  );

//   // Append the new row to the table
  $("#schedule-table > tbody").append(newRow);
});
