import { computed, ref } from 'vue'

import type { Album } from '../types/album'

export interface CartItem {
  album: Album
  quantity: number
}

const cartItems = ref<CartItem[]>([])

const cloneCartItems = (items: CartItem[]): CartItem[] => items.map((item) => ({ ...item, album: item.album }))

export const useCart = () => {
  const items = computed(() => cartItems.value)
  const itemCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() => cartItems.value.reduce((total, item) => total + item.album.price * item.quantity, 0))

  const addAlbum = (album: Album): void => {
    const existingItem = cartItems.value.find((item) => item.album.id === album.id)

    if (existingItem) {
      existingItem.quantity += 1
      return
    }

    cartItems.value = [...cartItems.value, { album, quantity: 1 }]
  }

  const removeAlbum = (albumId: number): void => {
    const existingItem = cartItems.value.find((item) => item.album.id === albumId)

    if (!existingItem) {
      return
    }

    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1
      return
    }

    cartItems.value = cartItems.value.filter((item) => item.album.id !== albumId)
  }

  return {
    items,
    itemCount,
    totalPrice,
    addAlbum,
    removeAlbum,
  }
}

export const resetCart = (): void => {
  cartItems.value = []
}

export const getCartSnapshot = (): CartItem[] => cloneCartItems(cartItems.value)