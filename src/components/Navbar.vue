<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-2xl font-bold text-primary">E-Commerce</h1>
          </div>
        </div>

        <!-- Barra de Pesquisa -->
        <div class="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
          <div class="max-w-lg w-full lg:max-w-xs">
            <div class="relative">
              <input type="text" v-model="searchQuery" @input="handleSearch"
                class="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Buscar produtos..." />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Carrinho -->
        <div class="flex items-center">
          <button @click="toggleCart"
            class="p-2 rounded-full text-gray-600 hover:text-primary focus:outline-none relative">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
              {{ cartItemCount }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  cartItemCount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['search', 'toggle-cart'])

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const toggleCart = () => {
  emit('toggle-cart')
}
</script>