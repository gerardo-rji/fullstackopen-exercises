import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Test blog')
  await user.type(authorInput, 'Test author')
  await user.type(urlInput, 'http://localhost:3000')
  await user.click(createButton)

  //  console.log(createBlog.mock.calls)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toMatchObject({
    title: 'Test blog',
    author: 'Test author',
    url: 'http://localhost:3000'
  })
})