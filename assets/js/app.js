// //////////////////// Global Varibles
// var trainNumber = 0;

// Initialize Firebase
var firebaseConfig = {
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
  var trainRoute = $("#train-route-input").val().trim();
  var trainDestination= $("#train-destination-input").val().trim();
  var trainFirst = moment($("#train-first-departure-input").val().trim(), "H:mm").format("X");
  var trainInterval = $("#train-interval-input").val().trim();
      trainInterval *= 60000;

  
    // route, destination, first, interval 

  var newChooChoo = {
    route: trainRoute,
    destination: trainDestination,
    first: trainFirst,
    interval: trainInterval
  };

  // Upload to the database
  db.ref().push(newChooChoo);

  // Logs everything to console
  console.log(newChooChoo.route);
  console.log(newChooChoo.destination);
  console.log(newChooChoo.first);
  console.log(newChooChoo.interval);

  // alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-route-input").val("");
  $("#train-destination-input").val("");
  $("#train-first-departure-input").val("");
  $("#train-interval-input").val("");
});

db.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var route = childSnapshot.val().route;
  var destination = childSnapshot.val().destination;
  var first = childSnapshot.val().first;
  var interval = childSnapshot.val().interval;

  // Train Info
  console.log("route: " + route + " | "
              + "destination: " + destination + " | "
              + "first: " + first + " | "
              + "interval: " + interval);





  // Create the new row
  var intervalPretty = (interval/60000) + " minutes";
  var convertedDate = moment(first, "X");
  var temp = convertedDate.toNow().diff(moment(),"minutes");
  var newRow = $("<tr>").append(
    // $("<td>").text(trainNumber),
    $("<td>").text(route),
    $("<td>").text(destination),
    
    $("<td>").text(convertedDate.format("H:mm")),
    // $("<td>").text(200),
    $("<td>").text(temp),
    $("<td>").text(intervalPretty)
  );

//   // Append the new row to the table
  $("#schedule-table > tbody").append(newRow);
});
