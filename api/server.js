const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require('path');
const session = require('express-session');


const usersRouter = require('./users/users-router.js')
const authRouter = require('./auth/auth-router.js')

const server = express();

server.use('/api/users', usersRouter)


const sessionConfig = {
  name: 'kahsbfhjasef',
  secret: "You'll never guess this password",
  cookie: {
    maxAge: 1000 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
};

server.use(session(sessionConfig));
server.use(express.static(path.join(__dirname, '../client')));

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})


server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
