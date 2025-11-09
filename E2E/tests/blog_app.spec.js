const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('http://localhost:3003/api/testing/reset')

    const res1 = await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      },
    })
    console.log('user 1:', await res1.json())

    const res2 = await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'user1',
        name: 'User One',
        password: 'salainen'
      },
    })
    console.log('user 2:', await res2.json())

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({page}) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('login-form')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'My Blog', 'John Doe', 'example.com')
      await expect(page.getByText('My Blog John Doe')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'My Blog', 'John Doe', 'example.com')
      await page.getByRole('button', { name: 'view' }).click()

      const likesBefore = await page.getByText(/likes \d+/).textContent()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(`likes ${parseInt(likesBefore.match(/\d+/)[0]) + 1}`)).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'My Blog', 'John Doe', 'example.com')
      // await page.pause()
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('My Blog John Doe')).not.toBeVisible()
    })
  })

  test('the delete button is not shown for other users blogs', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await createBlog(page, 'My Blog', 'John Doe', 'example.com')
    await page.getByRole('button', { name: 'logout' }).click()

    await loginWith(page, 'user1', 'salainen')
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
  })

  test.only('the blogs are sorted by likes', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')

    await createBlog(page, 'Blog with least likes', 'Author A', 'url1.com')
    await createBlog(page, 'Blog with most likes', 'Author B', 'url2.com')
    await createBlog(page, 'Blog with medium likes', 'Author C', 'url3.com')
    await page.pause()

    await page.getByText(/Blog with least likes/).locator('..').getByRole('button', { name: 'view' }).click()
    await page.getByText(/Blog with least likes/).locator('..').getByRole('button', { name: 'like' }).click()
    await expect(page.getByText(/Blog with least likes/).locator('..').getByText('likes 1')).toBeVisible()

    await page.getByText(/Blog with most likes/).locator('..').getByRole('button', { name: 'view' }).click()
    for (let i = 0; i < 3; i++) {
      await page.getByText(/Blog with most likes/).locator('..').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/Blog with most likes/).locator('..').getByText(`likes ${i + 1}`)).toBeVisible()
    }

    await page.getByText(/Blog with medium likes/).locator('..').getByRole('button', { name: 'view' }).click()
    for (let i = 0; i < 2; i++) {
      await page.getByText(/Blog with medium likes/).locator('..').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/Blog with medium likes/).locator('..').getByText(`likes ${i + 1}`)).toBeVisible()
    }

    await page.reload()

    const sortedBlogs = await page.locator('.blog-list').allTextContents()
    await expect(sortedBlogs[0]).toContain('Blog with most likes')
    await expect(sortedBlogs[1]).toContain('Blog with medium likes')
    await expect(sortedBlogs[2]).toContain('Blog with least likes')
  })
})