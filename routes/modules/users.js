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
  successRedirect: '/',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const error = []

  if (!name || !email || !password || !confirmPassword) {
    error.push('每個欄位都是必填。')
  }

  if (password !== confirmPassword) {
    error.push('密碼與確認密碼不符')
  }

  if (error.length) {
    return res.render('register', {
      error,
      name,
      email,
      password,
      confirmPassword
    })
  }

  try {
    const user = await User.findOne({ where: { email } })
    if (user) {
      error.push('此信箱已被註冊')

      return res.render('register', {
        error,
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
  req.logout()
  req.flash('success', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router