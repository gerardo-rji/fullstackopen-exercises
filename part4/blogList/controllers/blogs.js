const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    .sort({ likes: -1 })

  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  res.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(403).json({ error: 'user not authorized' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user // user Id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    .populate('user', { username: 1, name: 1 }) // keep populated for frontend

  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter