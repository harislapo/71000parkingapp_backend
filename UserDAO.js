var conn = require("./connection");
const bcrypt = require("bcrypt");

module.exports = {
  register: async function (req, res) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPass = await bcrypt.hash(req.body.password, salt);
      const user = {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        username: req.body.username,
        password: hashPass,
        role: req.body.role,
      };
      conn.query("INSERT INTO USER SET ?", [user], function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results.insertId);
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  login: function (req, res) {
    const user = req.body;
    conn.query(
      "SELECT * FROM USER WHERE username = ? AND password = ?",
      [user.username, user.password],
      function (err, results) {
        if (err) return res.status(500).send(err);
        res.status(200).json(results[0]); // override results array, return only one object instead of an array with one object
      }
    );
  },

  getAllUsers: function (req, res) {
    conn.query("SELECT * FROM user ORDER BY createDate DESC;", function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json(results);
    });
  },

  deleteUser: function (req, res) {
    const id = req.query.id;
    conn.query("DELETE FROM user WHERE id = ?", [id], function (
      err,
      results
    ) {
      if (err) return res.send(err);
      res.status(200).json({ message: "Sucessfully removed user" });
    });
  },
};
