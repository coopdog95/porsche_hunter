const model = require('./')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET

const User = model({
  name: 'users',
  tableName: 'users',
  selectableProps: ['id', 'username'],
})

const UserWithPasswordDigest = model({
  name: 'users',
  tableName: 'users',
  selectableProps: ['id', 'username', 'password_digest'],
})

const getAllUsers = async () => await User.findAll()

const createNewUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return User.create({ username, password_digest: hashedPassword })
}

const authenticateUser = async (username, password) => {
  const [foundUser] = await UserWithPasswordDigest.find({ username })
  if (!foundUser) return { authenticated: false, user: null }

  const passwordsMatch = await bcrypt.compare(
    password,
    foundUser.password_digest,
  )
  return { authenticated: passwordsMatch, user: foundUser }
}

const issueToken = async user => {
  const { id, username } = user
  try {
    return jwt.sign({ user_id: id, username }, SECRET)
  } catch (error) {
    return null
  }
}

module.exports = {
  getAllUsers,
  createNewUser,
  authenticateUser,
  issueToken,
}
