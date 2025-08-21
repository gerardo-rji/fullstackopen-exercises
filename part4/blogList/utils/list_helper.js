const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((a, b) => a.likes > b.likes ? a : b)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const count = blogs.reduce((acc, blog) => {
    const prevAuthor = acc[blog.author] || 0
    return {...acc, [blog.author]: prevAuthor + 1}
  }, {})

  const mstBlgs = Object.entries(count).reduce((max, [author, count]) =>
    count > max.blogs ? {author, blogs: count} : max,
    {autor: '', blogs: 0})

  return mstBlgs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const totalLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const mostLikes = Object.entries(totalLikes).reduce((a, b) => {
    return a[1] > b[1] ? a : b
  })

  return {
    author: mostLikes[0],
    likes: mostLikes[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}