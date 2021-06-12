const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User
const Todo = db.Todo

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  try {
    const user = await User.findOne({ where: { email } })
    if (user) {
      console.log('User already exist')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      const userId = await User.create({ name, email, password: hash })

      return res.redirect('/users/login')
    }
  } catch (error) {
    console.log('register failed.')
  }
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router