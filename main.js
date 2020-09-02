var express = require("express");
var app = express();
var PORT = 3000;
var bodyParser = require("body-parser");
var parkingDAO = require("./ParkingDAO");
var userDAO = require("./UserDAO");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", function (req, res) {
  res.send("Welcome to the 71000parking app!");
});

app.post("/user/register", userDAO.register);
app.post("/user/login", userDAO.login);

app.get("/parking/all", parkingDAO.getAll);
app.post("/parking/search", parkingDAO.searchParkings);
app.post("/parking/add/new", parkingDAO.addNewParking);

app.post("/parking/add-to-reserved", parkingDAO.addParkingToReserve);
app.get("/reserved/parking", parkingDAO.getReservedForUser);
app.delete("/reserved/delete", parkingDAO.removeParkingFromReserve)

app.post("/finished-reservations/insert-reservation", parkingDAO.saveReservationsForUser);
app.get("/finished-reservations/all", parkingDAO.getFinishedReservationsForUser);

app.get("/parking/comments", parkingDAO.getComments);
app.post("/parking/comments/add-comment", parkingDAO.addComment);


app.listen(PORT, function () {
  console.log("Application is started on port " + PORT);
});
