const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000

const db = require('./models')
const User = db.User
const Todo = db.Todo

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then(todos => {
      return res.render('index', { todos })
    })
    .catch(error => {
      return res.status(422).json(error)
    })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', async (req, res) => {
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

      console.log(userId)

      return res.redirect('/users/login')
    }
  } catch (error) {
    console.log('register failed.')
  }
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`)
})