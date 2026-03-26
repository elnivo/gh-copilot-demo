<template>
  <aside v-if="isOpen" class="cart-panel" data-testid="cart-panel">
    <div class="cart-panel__header">
      <div>
        <h2>{{ messages.cartTitle }}</h2>
        <p>{{ itemCount }} {{ messages.cartItemsLabel }}</p>
      </div>
      <button
        type="button"
        class="cart-panel__close"
        :aria-label="messages.closeCart"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>

    <div v-if="items.length === 0" class="cart-panel__empty">
      <p>{{ messages.cartEmpty }}</p>
    </div>

    <ul v-else class="cart-panel__items">
      <li v-for="item in items" :key="item.album.id" class="cart-panel__item">
        <div class="cart-panel__item-copy">
          <h3>{{ item.album.title }}</h3>
          <p>{{ item.album.artist.name }}</p>
          <p>{{ messages.cartQuantityLabel }}: {{ item.quantity }}</p>
        </div>

        <div class="cart-panel__item-actions">
          <span class="cart-panel__price">${{ (item.album.price * item.quantity).toFixed(2) }}</span>
          <button
            type="button"
            class="cart-panel__remove"
            :data-testid="`remove-from-cart-${item.album.id}`"
            @click="$emit('remove', item.album.id)"
          >
            {{ messages.removeFromCart }}
          </button>
        </div>
      </li>
    </ul>

    <footer class="cart-panel__footer">
      <span>{{ messages.cartTotal }}</span>
      <strong data-testid="cart-total">${{ totalPrice.toFixed(2) }}</strong>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useTranslations } from '../i18n'
import type { CartItem } from '../composables/useCart'

interface Props {
  isOpen: boolean
  items: CartItem[]
  totalPrice: number
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  remove: [albumId: number]
}>()

const messages = useTranslations()
const itemCount = computed(() => props.items.reduce((total, item) => total + item.quantity, 0))
</script>

<style scoped>
.cart-panel {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: min(24rem, calc(100vw - 2rem));
  max-height: calc(100vh - 3rem);
  padding: 1.25rem;
  border-radius: 1rem;
  background: rgba(14, 23, 41, 0.92);
  color: white;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
}

.cart-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.cart-panel__header h2,
.cart-panel__item-copy h3 {
  margin: 0;
}

.cart-panel__header p,
.cart-panel__item-copy p {
  margin: 0.25rem 0 0;
  opacity: 0.85;
}

.cart-panel__close,
.cart-panel__remove {
  border: none;
  cursor: pointer;
}

.cart-panel__close {
  background: transparent;
  color: white;
  font-size: 1.8rem;
  line-height: 1;
}

.cart-panel__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  overflow: auto;
}

.cart-panel__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.08);
}

.cart-panel__item-copy {
  flex: 1;
}

.cart-panel__item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.cart-panel__price {
  font-weight: 700;
}

.cart-panel__remove {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.cart-panel__empty {
  padding: 1rem 0;
  opacity: 0.9;
}

.cart-panel__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

@media (max-width: 768px) {
  .cart-panel {
    top: auto;
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
    width: auto;
    max-height: 70vh;
  }

  .cart-panel__item {
    flex-direction: column;
  }

  .cart-panel__item-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>