const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('a total of 6 blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  //console.log(response.body)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('all blogs have an id field', async () => {
  const response = await api.get('/api/blogs')
  //console.log(response.body)
  const blog = response.body[0]

  assert.ok(blog.id, 'the list of blogs have an id property')
  assert.ok(!blog._id, 'the list of blogs do not have an _id property')
})

test('a valid blog can be added with a valid token', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const token = loginResponse.body.token

  const newBlog = {
    title: 'Blog with auth',
    author: 'test author',
    url: 'example.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(titles.includes(newBlog.title))
})

test('adding a blog fails with statuscode 401 if no token is provided', async () => {
  const newBlog = {
    title: 'No token Blog',
    author: 'Jon Doe',
    url: 'example.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(!titles.includes(newBlog.title))
})

test('the likes property defaults to 0 if missing', async () => {
  const testBlog = {
    title: 'Blog with no likes',
    author: 'Jon Doe',
    url: 'example.com',
  }

  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const blogLikes = blogsAtEnd.map(b => b.likes)

  assert.strictEqual(blogLikes.at(-1), 0)

  /*const response = await api
  .post('/api/blogs')
  .send(testBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const savedBlog = response.body
  assert.strictEqual(savedBlog.likes, 0)*/
})

test('missing title property results in 400 Bad Request', async () => {
  const noTitleBlog = {
    author: 'Jon Doe',
    url: 'example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('missing url property results in 400 Bad Request', async () => {
  const noUrlBlog = {
    title: 'Blog not added',
    author: 'Jon Doe',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  // console.log(titles)
  assert.ok(!titles.includes(blogToDelete.title))
})

test('blog data can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'Updated blog',
    author: 'Updated author',
    url: 'example.com',
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  // console.log(blogsAtEnd)
  const updatedBlogAtEnd = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogAtEnd.likes, updatedBlog.likes)

  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(!titles.includes(blogToUpdate.title))
  assert.ok(titles.includes(updatedBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})