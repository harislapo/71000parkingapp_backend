var conn = require("./connection");

//Extract functions in order to keep the code clean and readable

//Save parking (finish reservation) that was in reserve component which was
//sent from parking-preview
function saveFinishedReservation(request) {
  //Promise lets us know when its finished doing its job through resolving
  //insertId
  return new Promise(function (resolve, reject) {
    conn.query(
      "INSERT INTO finished_reserve SET ?",
      [{ parkingId: request.parkingId, userId: request.userId }],
      function (err, results) {
        if (err) return reject(err);
        resolve(results.insertId);
      }
    );
  });
}

//Delete from reserved in html component after finishing reservation
function deleteReservedParking(id) {
  return new Promise(function (resolve, reject) {
    conn.query("DELETE FROM reserve_parking WHERE id=?", [id], function (
      err,
      results
    ) {
      if (err) return reject(err);
      resolve(id);
    });
  });
}

//Add 1 to parking's reserved counter after user has finished reservation
function reservedCounterAdd(id) {
  return new Promise(function (resolve, reject) {
    conn.query(
      "UPDATE parking SET reservedCounter = reservedCounter + 1 WHERE id =?",
      [id],
      function (err, results) {
        if (err) return reject(err);
        resolve(id);
      }
    );
  });
}

module.exports = {
  getAll: function (req, res) {
    conn.query("SELECT * FROM PARKING ORDER BY createDate DESC;", function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json(results);
    });
  },

  //Search parking locations by the parkingLocated field in database
  //and display it in parking-preview component
  searchParkings: function (req, res) {
    const searchParking = req.body;
    let query = "SELECT * FROM PARKING WHERE 1=1 ";
    if (searchParking.parkingLocated) {
      query += `AND parkingLocated LIKE CONCAT ('%', '${searchParking.parkingLocated}', '%') `;
    }
    conn.query(query, function (err, results) {
      if (err) return res.send(err);
      res.status(200).json(results);
    });
  },

  //Add parking to reserve
  addParkingToReserve: function (req, res) {
    const parking = req.body;
    conn.query("INSERT INTO reserve_parking SET ?", [parking], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json(results.insertId);
    });
  },

  //Get the reserved parking from user and display it in a component reserve.
  //With mapId we group the reservation so we can do delete operations after
  //confirming the reservation
  getReservedForUser: function (req, res) {
    const id = req.query.userId;
    conn.query(
      "SELECT r.id as reservationId, p.* FROM reserve_parking r JOIN parking p ON r.parkingId = p.id WHERE r.userId = ? ORDER BY p.createDate DESC;",
      [id],
      function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
      }
    );
  },

  //Remove parking from reserved html template
  removeParkingFromReserve: function (req, res) {
    const id = req.query.id;
    conn.query("DELETE FROM reserve_parking WHERE id = ?", [id], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json({ message: "Sucessfully removed from reserved" });
    });
  },

  //Save finished reservations from user and delete them from reserved
  saveReservationsForUser: async function (req, res) {
    const request = req.body;

    //Must implement Try Catch in order to catch rejects from
    //saveFinishedReserve function
    try {
      //Call saveFinishedReserve through async call and wait for it's response.
      //If its successful, we will get insertId
      const finishedReservationId = await saveFinishedReservation(request);
      const reservationId = await deleteReservedParking(request.reservationId);
      await reservedCounterAdd(request.parkingId);
      res.status(200).json({
        finishedReservationId: finishedReservationId,
        reservationId: reservationId,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  //Get finished reservations for user and display it in profile
  //component
  getFinishedReservationsForUser: function (req, res) {
    const id = req.query.userId;
    conn.query(
      "SELECT p.*, fr.dateCreated FROM finished_reserve fr JOIN parking p ON fr.parkingId = p.id WHERE fr.userId = ? ORDER BY p.createDate DESC;",
      [id],
      function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
      }
    );
  },

  getComments: function (req, res) {
    const id = req.query.parkingId;
    conn.query(
      `SELECT u.username, pc.message, pc.commentDateCreated 
      FROM parking_comment pc 
        JOIN parking p 
        ON pc.parkingId = p.id 
        JOIN user u 
        ON pc.userId = u.id 
        WHERE parkingId = ? ORDER BY pc.commentDateCreated DESC;`,
      [id],
      function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
      }
    );
  },

  addNewParking: function (req, res) {
    const parking = req.body;
    conn.query("INSERT INTO parking SET ?", [parking], function (err, results) {
      if (err) return res.status(500).send(err);
      res.status(200).json(results.insertId);
    });
  },

  //admin
  deleteParking: function (req, res) {
    const id = req.query.id;
    conn.query("DELETE FROM parking WHERE id = ?", [id], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json({ message: "Parking removed!" });
    });
  },

  addComment: function (req, res) {
    const comment = req.body;
    conn.query("INSERT INTO parking_comment SET ?", [comment], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json(results.insertId);
    });
  },

  rateParking: function (req, res) {
    const rating = req.body;
    conn.query("INSERT INTO parking_rating SET ?", [rating], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json(results.insertId);
    });
  },

  getRatingForUser: function (req, res) {
    const userId = req.query.userId;
    const parkingId = req.query.parkingId;
    conn.query(
      "select * from parking_rating where userId = ? AND parkingId = ?;",
      [userId, parkingId],
      function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
      }
    );
  },

  deleteRating:function (req, res) {
    const parkingId = req.query.parkingId;
    const userId = req.query.userId;
    conn.query("DELETE FROM parking_rating WHERE parkingId = ? AND userId = ?", [parkingId, userId], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json({ message: "Rating removed!" });
    });
  },
};
