import express from "express";
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { dbUser } = require("../databases");
const jwt = require("jsonwebtoken");
const checkUserPassword = require("../functions/checkUserPassword");
const JWT_SECRET = process.env.JWT_SECRET;
import { authorization } from "../midleware/Authorization";
import { User, UserStorage } from "../storage/UserStorage";

const userStorage = new UserStorage()

router.post("/", (req, res) => {
  const body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email.toLowerCase().trim(),
    password: req.body.password,
  };

  const saltRounds = 10;
  const myPlaintextPassword = body.password;
  const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
  const userId = uuidv4();

  const user: User = {
    email: body. email,
    firstName: body.firstName,
    lastName: body.lastName,
    password: hash,
    userId: userId
  } 

  const isUserExist = userStorage.getByEmail(user.email);
  if (isUserExist) {
    return res.status(400).send({
      message: "User already registered!",
    });
  }

  userStorage.save(user);

  return res.send({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    userId: userId,
  });
});

router.post("/signin", async (req, res) => {
  const body = {
    email: req.body.email.toLowerCase().trim(),
    password: req.body.password
  }

  const user = userStorage.getByEmail(body.email);

  if (!user) {
    return res.status(401).send({
      message: "bad email",
    });
  }
  const userPasswordHash = user.password;
  const userPassword = body.password;

  const match = await checkUserPassword(userPassword, userPasswordHash);
  if (!match) {
    return res.sendStatus(400);
  }
  const token = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user.userId,
    },
    JWT_SECRET
  );
  return res.send({
    token: token,
    email: user.email,
    userId: user.userId,
  });
});

router.use(authorization);

router.patch("/", (req, res) => {
  const body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }

  const userFromDb = userStorage.getByEmail(req.user.email);

  if (body.firstName) {
    userFromDb.firstName = body.firstName;
  }

  if (body.lastName) {
    userFromDb.lastName = body.lastName;
  }

  userStorage.save(userFromDb);

  return res.send({
    firstName: userFromDb.firstName,
    lastName: userFromDb.lastName,
    email: userFromDb.email,
    userId: userFromDb.userId,
  });
});

export default router;