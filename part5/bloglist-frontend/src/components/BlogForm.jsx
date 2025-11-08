import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <label htmlFor='title'>title:</label>
        <input id='title'
          data-testid='title'
          value={newTitle} onChange={event => setNewTitle(event.target.value)}/>
        <br/>
        <label htmlFor='author'>author:</label>
        <input id='author'
          data-testid='author'
          value={newAuthor} onChange={event => setNewAuthor(event.target.value)}/>
        <br/>
        <label htmlFor='url'>url:</label>
        <input id='url'
          data-testid='url'
          value={newUrl} onChange={event => setNewUrl(event.target.value)}/>
        <br/>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm