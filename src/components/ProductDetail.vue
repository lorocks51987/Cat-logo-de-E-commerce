<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <!-- Imagem do Produto -->
      <div class="relative">
        <img :src="product.thumbnail" :alt="product.title" class="w-full h-96 object-contain rounded-lg" />
        <div v-if="product.stock > 0" class="absolute top-4 right-4 bg-success text-white px-3 py-1 rounded-full text-sm font-medium">
          Em estoque
        </div>
      </div>

      <!-- Informações do Produto -->
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-text mb-4">{{ product.title }}</h1>
        
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-primary mb-2">R$ {{ product.price.toFixed(2) }}</h2>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold text-text mb-2">Detalhes do Produto</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600">Categoria</p>
              <p class="font-medium">{{ formatCategory(product.category) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Marca</p>
              <p class="font-medium">{{ product.brand }}</p>
            </div>
            <div>
              <p class="text-gray-600">Estoque</p>
              <p class="font-medium">{{ product.stock }} unidades</p>
            </div>
            <div>
              <p class="text-gray-600">Avaliação</p>
              <div class="flex items-center">
                <span class="font-medium mr-2">{{ product.rating }}</span>
                <div class="flex text-yellow-400">
                  <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'text-gray-300': n > Math.round(product.rating) }" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-auto">
          <button 
            @click="handleAddToCart"
            class="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const formatCategory = (category) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}
</script>