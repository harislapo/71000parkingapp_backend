var conn = require("./connection");
const bcrypt = require('bcrypt');


module.exports = {

  register: function (req, res) {
    const user = req.body;

    conn.query("INSERT INTO USER SET ?", [user], function (err, results) {
      if (err) return res.status(500).send(err);
      res.status(200).json(results.insertId);
    });
  },

  login: function (req, res) {
    const user = req.body;
    conn.query('SELECT * FROM USER WHERE username = ? AND password = ?',
      [user.username, user.password],
      function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results[0]); // override results array, return only one object instead of an array with one object
      }
    );
  }
};
