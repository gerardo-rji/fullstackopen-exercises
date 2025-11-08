import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog.jsx'
import Notification from './components/Notification.jsx'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import BlogForm from './components/BlogForm.jsx'
import Togglable from './components/Togglable.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLike = async (blog) => {
    const userId = typeof blog.user === 'string'
      ? blog.user
      : blog.user?.id || blog.user?._id

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: userId            // user must be an id string
    }

    const blogId = blog.id || blog._id

    const returnedBlog = await blogService.update(blogId, updatedBlog)
    setBlogs(blogs.map(b => (b.id || b._id) !== blogId ? b : returnedBlog))
  }

  const handleDelete = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (error) {
      console.log(error)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} data-testid='login-form'>
      <h2>log in to application</h2>
      <div>
        <label htmlFor='username'>username</label>
        <input
          id='username'
          data-testid='username'
          type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor='password'>password</label>
        <input
          id='password'
          data-testid='password'
          type='password'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  return (
    <div>
      <Notification errorMessage={errorMessage} message={message} />
      {user === null
        ? loginForm()
        : <div>
          <h2>blogs</h2>
          <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogs
            .slice()  //  create a copy to avoid mutating state
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                user={user}             //  current logged-in user
                onDelete={handleDelete} //  deletion handler
              />
            )}
        </div>
      }
    </div>
  )
}

export default App