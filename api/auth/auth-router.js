// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const bcrypt = require('bcryptjs');
const router = require("express").Router()

const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('../auth/auth-middleware')

const User = require('../users/users-model');

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res , next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 8);
    const user = await User.add({ username: req.body.username, password: hash });
    res.status(201).json(`added new user ${user.username}`);
  } catch (err) {
    next({message: err.message});
  }

})


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

  router.post("/login", checkUsernameExists, (req, res, next) => {
    if(bcrypt.compareSync(req.body.password, req.user.password)) {
      req.session.user = req.user
      res.status(200).json(`Welcome ${req.user.username}`);
  } else {
      next({  status: 400, message: 'invalid login credentials' });
  }
  })


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router
