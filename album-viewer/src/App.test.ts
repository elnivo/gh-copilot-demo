// @vitest-environment jsdom

import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'
import { resetCart } from './composables/useCart'
import { setLanguage } from './i18n'
import type { Album } from './types/album'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedAxios = vi.mocked(axios, true)

const sampleAlbums: Album[] = [
  {
    id: 1,
    title: 'You, Me and an App Id',
    artist: {
      name: 'Daprize',
      birthdate: '1990-04-12',
      birthPlace: 'Seattle, USA',
    },
    price: 10.99,
    image_url: 'https://aka.ms/albums-daprlogo',
  },
  {
    id: 2,
    title: 'Seven Revision Army',
    artist: {
      name: 'The Blue-Green Stripes',
      birthdate: '1988-09-23',
      birthPlace: 'Portland, USA',
    },
    price: 13.99,
    image_url: 'https://aka.ms/albums-containerappslogo',
  },
]

describe('App cart management', () => {
  afterEach(() => {
    resetCart()
    setLanguage('en')
    vi.clearAllMocks()
  })

  it('adds albums to the cart and updates the header count', async () => {
    mockedAxios.get.mockResolvedValue({ data: sampleAlbums })

    const wrapper = mount(App)
    await flushPromises()

    const addButtons = wrapper.findAll('[data-testid="add-to-cart"]')
    await addButtons[0].trigger('click')
    await addButtons[0].trigger('click')

    expect(wrapper.get('[data-testid="cart-count"]').text()).toBe('2')

    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')

    expect(wrapper.get('[data-testid="cart-panel"]').text()).toContain('You, Me and an App Id')
    expect(wrapper.get('[data-testid="cart-panel"]').text()).toContain('Quantity: 2')
    expect(wrapper.get('[data-testid="cart-total"]').text()).toBe('$21.98')
  })

  it('removes albums from the cart detail', async () => {
    mockedAxios.get.mockResolvedValue({ data: sampleAlbums })

    const wrapper = mount(App)
    await flushPromises()

    const addButtons = wrapper.findAll('[data-testid="add-to-cart"]')
    await addButtons[0].trigger('click')
    await addButtons[1].trigger('click')
    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')

    await wrapper.get('[data-testid="remove-from-cart-1"]').trigger('click')

    expect(wrapper.get('[data-testid="cart-count"]').text()).toBe('1')
    expect(wrapper.get('[data-testid="cart-panel"]').text()).not.toContain('You, Me and an App Id')
    expect(wrapper.get('[data-testid="cart-panel"]').text()).toContain('Seven Revision Army')
  })

  it('renders translated cart labels in French', async () => {
    mockedAxios.get.mockResolvedValue({ data: sampleAlbums })
    setLanguage('fr')

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('[data-testid="cart-toggle"]').text()).toContain('Panier')

    await wrapper.get('[data-testid="cart-toggle"]').trigger('click')

    expect(wrapper.get('[data-testid="cart-panel"]').text()).toContain('Votre panier est vide.')
  })
})