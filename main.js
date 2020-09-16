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

//user
app.post("/user/register", userDAO.register);
app.post("/user/login", userDAO.login);

//parkings
app.get("/parking/all", parkingDAO.getAll);
app.post("/parking/search", parkingDAO.searchParkings);
app.post("/parking/add/new", parkingDAO.addNewParking);
app.post("/parking/add-to-reserved", parkingDAO.addParkingToReserve);

//reservations
app.get("/reserved/get-reserved", parkingDAO.getReservedForUser);
app.delete("/reserved/delete", parkingDAO.removeParkingFromReserve)

//finished reservations/profile
app.post("/finished-reservations/insert-reservation", parkingDAO.saveReservationsForUser);
app.get("/finished-reservations/all", parkingDAO.getFinishedReservationsForUser);

//parking preview
app.get("/parking/comments", parkingDAO.getComments);
app.post("/parking/comments/add-comment", parkingDAO.addComment);
/* app.post("/parking/ratings/add-rating", parkingDAO.rateParking);
 */app.get("/parking/ratings/get-rating-for-user", parkingDAO.getRatingForUser);
app.delete("/parking/ratings/remove-rating", parkingDAO.deleteRating);

//admin
app.get("/admin/get/all-users", userDAO.getAllUsers);
app.delete("/admin/delete-user", userDAO.deleteUser)
app.delete("/admin/delete-parking", parkingDAO.deleteParking)

app.listen(PORT, function () {
  console.log("Application is started on port " + PORT);
});
