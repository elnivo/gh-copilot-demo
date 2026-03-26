import { expect, test } from '@playwright/test'

test('opens the app, adds the first album, and shows it in the cart', async ({ page }, testInfo) => {
  await page.goto('/')

  const firstAlbumTitle = page.locator('.album-title').first()
  const firstAlbumPrice = page.locator('.price').first()
  const addToCartButton = page.getByTestId('add-to-cart').first()

  await expect(firstAlbumTitle).toBeVisible()
  await expect(firstAlbumPrice).toBeVisible()
  await expect(addToCartButton).toBeVisible()

  const albumTitle = await firstAlbumTitle.textContent()
  const albumPrice = await firstAlbumPrice.textContent()

  await addToCartButton.click()
  await expect(page.getByTestId('cart-count')).toHaveText('1')

  await page.getByTestId('cart-toggle').click()
  await expect(page.getByTestId('cart-panel')).toBeVisible()

  await expect(page.getByTestId('cart-panel')).toContainText(albumTitle ?? '')
  await expect(page.getByTestId('cart-panel')).toContainText('Quantity: 1')
  await expect(page.getByTestId('cart-total')).toHaveText(albumPrice ?? '')

  await page.getByTestId('cart-panel').screenshot({
    path: testInfo.outputPath('cart-panel.png'),
  })
})