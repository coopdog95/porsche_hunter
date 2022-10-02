var express = require('express')
var router = express.Router()
const {
  getAllUsers,
  createNewUser,
  authenticateUser,
  issueToken,
} = require('../models/user')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await getAllUsers()
    res.json({ users })
  } catch (error) {
    res.status(401).json({ error })
  }
})

router.post('/', async (req, res, next) => {
  const { username, password } = req.body
  try {
    const [newUser] = await createNewUser(username, password)
    const token = await issueToken(newUser)
    res.json({ user: newUser, token })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const { authenticated, user } = await authenticateUser(username, password)
  if (!authenticated || !user) {
    res.status(401).json({ error: 'Invalid credentials' })
  } else {
    try {
      const token = await issueToken(user)
      res.status(200).json({ token, user })
    } catch (error) {
      res.status(401).json({
        error: 'Error authenticating',
      })
    }
  }
})

module.exports = router
