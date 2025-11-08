import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog\'s title and author by default', () => {
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'http://localhost:3000',
    likes: 0,
    user: {
      username: 'Test user',
      name: 'Test name',
      id: '1234567890'
    }
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog blog={blog} handleLike={mockHandler} onDelete={mockHandler}/>)

  const divOne = container.querySelector('.blog')
  expect(divOne).toHaveTextContent(blog.title)
  expect(divOne).toHaveTextContent(blog.author)

  expect(divOne).not.toHaveTextContent(blog.url)
  expect(divOne).not.toHaveTextContent(String(blog.likes))

  const divTwo = container.querySelector('.blog-info')
  expect(divTwo).toHaveStyle('display: none')
  // screen.debug()
})

test('renders blog\'s url and likes when clicked', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'http://localhost:3000',
    likes: 0,
    user: {
      username: 'Test user',
      name: 'Test name',
      id: '1234567890'
    }
  }

  const {container} = render(<Blog blog={blog} handleLike={vi.fn()} onDelete={vi.fn()}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const divTwo = container.querySelector('.blog-info')
  expect(divTwo).not.toHaveStyle('display: none')
  expect(divTwo).toHaveTextContent(blog.url)
  expect(divTwo).toHaveTextContent(String(blog.likes))
})

test('calls handleLike when like button is clicked', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Test author',
    url: 'http://localhost:3000',
    likes: 0,
    user: {
      username: 'Test user',
      name: 'Test name',
      id: '1234567890'
    }
  }

  const mockLikeHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockLikeHandler} onDelete={vi.fn()}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  // expect(mockLikeHandler.mock.calls).toHaveLength(2)
  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})