<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header com contador do carrinho -->
    <Header :cart-count="cartItemCount" />
    
    <!-- Conteúdo principal com padding para o header fixo -->
    <main class="container mx-auto px-4 pt-24 pb-8">
      <router-view 
        @add-to-cart="addToCart"
        @remove-from-cart="removeFromCart"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Header from './components/Header.vue'
import Swal from 'sweetalert2'

// Estado do carrinho
const cartItems = ref([])

// Computed property para calcular o total de itens no carrinho
const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// Carregar itens do carrinho do localStorage ao montar o componente
onMounted(() => {
  loadCartItems()
})

// Observar mudanças no localStorage para manter o estado sincronizado
watch(() => localStorage.getItem('cart'), (newValue) => {
  if (newValue) {
    cartItems.value = JSON.parse(newValue)
  }
})

// Funções de gerenciamento do carrinho
const loadCartItems = () => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
}

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

// Função para adicionar ou atualizar itens no carrinho
const addToCart = (product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)

  if (existingItem) {
    // Se o item já existe, aumenta a quantidade
    const newQuantity = existingItem.quantity + 1
    if (newQuantity <= product.stock) {
      existingItem.quantity = newQuantity
      saveCart()
      Swal.fire({
        title: 'Produto Atualizado!',
        text: 'A quantidade foi atualizada no carrinho.',
        icon: 'success',
        confirmButtonColor: '#3B82F6',
        background: '#1E293B',
        color: '#F8FAFC',
        buttonsStyling: true,
        customClass: {
          confirmButton: '!bg-blue-600 hover:!bg-blue-700'
        }
      })
    } else {
      Swal.fire({
        title: 'Erro!',
        text: 'Quantidade indisponível em estoque.',
        icon: 'error',
        confirmButtonColor: '#EF4444',
        background: '#1E293B',
        color: '#F8FAFC',
        buttonsStyling: true,
        customClass: {
          confirmButton: '!bg-red-500 hover:!bg-red-600'
        }
      })
    }
  } else {
    // Se o item não existe, adiciona ao carrinho
    cartItems.value.push({
      ...product,
      quantity: 1
    })
    saveCart()
    Swal.fire({
      title: 'Produto Adicionado!',
      text: 'O produto foi adicionado ao seu carrinho.',
      icon: 'success',
      confirmButtonColor: '#3B82F6',
      background: '#1E293B',
      color: '#F8FAFC',
      buttonsStyling: true,
      customClass: {
        confirmButton: '!bg-blue-600 hover:!bg-blue-700'
      }
    })
  }
}

// Função para remover item do carrinho
const removeFromCart = (itemId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== itemId)
  saveCart()
}
</script>

<style>
/* Estilos globais */
body {
  @apply bg-slate-900 text-slate-50;
}
</style>
