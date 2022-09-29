var express = require('express')
var router = express.Router()
const database = require('../database_connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET

/* GET users listing. */
router.get('/', function (req, res, next) {
  database('users').then(users => {
    res.json()
  })
})

router.post('/', (req, res, next) => {
  const { username, password } = req.body
  bcrypt.hash(password, 10).then(hashedPassword => {
    return database('users')
      .insert({
        username,
        password_digest: hashedPassword,
      })
      .returning(['id', 'username'])
      .then(users => {
        res.json(users[0])
      })
      .catch(error => next(error))
  })
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  database('users')
    .where({ username })
    .first()
    .then(user => {
      if (!user) {
        res.status(401).json({ error: 'Username not found' })
      } else {
        return bcrypt
          .compare(password, user.password_digest)
          .then(isAuthenticated => {
            if (!isAuthenticated) {
              res.status(401).json({
                error: 'Wrong username/password combination',
              })
            } else {
              return jwt.sign(
                { user_id: user.id, username: user.username },
                SECRET,
                (error, token) => {
                  if (error) {
                    res.status(401).json({
                      error: 'Error authenticating',
                    })
                  } else {
                    res.status(200).json({ token })
                  }
                },
              )
            }
          })
      }
    })
})

module.exports = router
