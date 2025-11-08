import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, user, onDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showDeleteButton = blog.user && user && blog.user.username === user.username

  return (
    <div className='blog-list'>
      <div style={Object.assign({}, blogStyle, hideWhenVisible)} className='blog'>
        { blog.title } { blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={Object.assign({}, blogStyle, showWhenVisible)} className='blog-info'>
        { blog.title }
        <button onClick={toggleVisibility}>hide</button> <br/>
        { blog.url } <br/>
        {'likes '}{ blog.likes }
        <button onClick={() => handleLike(blog)}>like</button> <br/>
        { blog.user?.name } <br/>
        {showDeleteButton && (
          <button onClick={() => onDelete(blog)}>remove</button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  user: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
}

export default Blog