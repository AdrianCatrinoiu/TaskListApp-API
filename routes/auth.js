const express = require("express");
const router = express.Router();
const models = require("../models");
const jwt = require("jsonwebtoken");
//Login
router.post("/login", async (req, res) => {
  let response = {
    status: "ERROR",
    message: "Login Error",
  };
  if (!req.body) {
    res.status(403).json(response);
  } else {
    const { email, password } = req.body;
    //dbRespons==User
    const dbResponse = await models.Users.findOne({
      where: { email },
    });
    if (dbResponse) {
      const hashedResponse = await dbResponse.validPassword(password);
      response.status = "Success";
      response.message = "User Found!";
      if (hashedResponse) {
        response.message = "Successfully login";
        response["data"] = {
          userId: dbResponse.id,
          name: dbResponse.name,
          email: dbResponse.email,
        };
        const jwtToken = jwt.sign(
          { userId: response.userId },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        response["token"] = {
          token: jwtToken,
        };
        res.status(200).json(response);
      } else {
        response.message = "Incorrect credentials";
        res.status(400).json(response);
      }
    } else {
      response.message = "User not found!";
      res.status(404).json(response);
    }
  }
});

//Register
router.post("/register", async (req, res) => {
  let response = {
    status: "ERROR",
    message: "Register error",
  };
  if (!req.body) {
    res.status(403).json(response);
  } else {
    const data = req.body;
    const { email, password, name } = data;
    let newUser = {
      email: email,
      password: password,
      name: name,
    };
    const dbResponse = await models.Users.create(newUser);
    // var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{7,15}$/;
    // let userList = usersDB;
    if (dbResponse) {
      //console.log(dbResponse);
      response.status = "Success";
      response.message = "User created";
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  }
});

router.get("/ping", async (req, res) => {
  res.send("pong-win2");
});

module.exports = router;
