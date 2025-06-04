<template>
  <div>
    <Cart 
      :items="cartItems" 
      @update-quantity="updateCartItemQuantity" 
      @remove-from-cart="removeCartItem" 
      @close="handleClose" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Cart from '../components/Cart.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const cartItems = ref([])

// Carregar itens do carrinho do localStorage
onMounted(() => {
  loadCartItems()
})

// Observar mudanças no localStorage
watch(() => localStorage.getItem('cart'), (newValue) => {
  if (newValue) {
    cartItems.value = JSON.parse(newValue)
  } else {
    cartItems.value = []
  }
}, { immediate: true })

const loadCartItems = () => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  } else {
    cartItems.value = []
  }
}

const updateCartItemQuantity = ({ id, quantity }) => {
  const index = cartItems.value.findIndex(item => item.id === id)
  if (index !== -1) {
    // Criar um novo array para garantir a reatividade
    const updatedItems = [...cartItems.value]
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: quantity
    }
    cartItems.value = updatedItems
    saveCart()
  }
}

const removeCartItem = (itemId) => {
  // Criar um novo array para garantir a reatividade
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  saveCart()
}

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const handleClose = () => {
  router.push('/')
}
</script> 