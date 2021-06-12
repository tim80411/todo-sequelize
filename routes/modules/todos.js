const express = require('express')
const router = express.Router()

const db = require('../../models')
const User = db.User
const Todo = db.Todo

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', async (req, res) => {
  const userId = req.user.id
  const name = req.body.name

  try {
    await Todo.create({
      name,
      UserId: userId,
    })

    return res.redirect('/')
  } catch (error) {
    req.flash('error', '資料庫載入失敗，請稍後再試')

    res.redirect('/')
  }

})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(err => console.log(err))
})

router.get('/:id/edit', async (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  try {
    let todo = await Todo.findOne({ id, UserId: userId })
    todo = todo.toJSON()

    res.render('edit', { todo })
  } catch (error) {
    req.flash('error', '資料庫載入失敗，請稍後再試')

    res.redirect('/')
  }
})

router.put('/:id', async (req, res) => {
  const userId = req.user._id
  const id = req.params.id
  const { name, isDone } = req.body

  try {
    const todo = await Todo.findOne({ id, UserId: userId })
    todo.name = name
    todo.isDone = isDone === 'on'

    await todo.save()

    return res.redirect(`/todos/${id}`)

  } catch (error) {
    req.flash('error', '資料庫載入失敗，請稍後再試')

    res.redirect('/')
  }
})
module.exports = router