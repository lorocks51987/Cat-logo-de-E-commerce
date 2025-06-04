<template>
  <div class="min-h-screen bg-slate-900 py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="product" class="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <!-- Imagens do Produto -->
          <div class="space-y-4">
            <div class="aspect-square rounded-lg overflow-hidden bg-slate-900">
              <img 
                :src="selectedImage || product.thumbnail" 
                :alt="product.title"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="grid grid-cols-4 gap-4">
              <button 
                v-for="image in product.images" 
                :key="image"
                @click="selectedImage = image"
                class="aspect-square rounded-lg overflow-hidden bg-slate-900 hover:ring-2 hover:ring-blue-500 transition-all"
                :class="{ 'ring-2 ring-blue-500': selectedImage === image }"
              >
                <img :src="image" :alt="product.title" class="w-full h-full object-contain" />
              </button>
            </div>
          </div>

          <!-- Informações do Produto -->
          <div class="space-y-6">
            <div>
              <h1 class="text-3xl font-bold text-slate-50 mb-2">{{ product.title }}</h1>
              <p class="text-2xl font-bold text-blue-500">R$ {{ product.price.toFixed(2) }}</p>
            </div>

            <div class="space-y-2">
              <p class="text-slate-400">
                <span class="text-slate-300">Categoria:</span> {{ product.category }}
              </p>
              <p class="text-slate-400">
                <span class="text-slate-300">Marca:</span> {{ product.brand }}
              </p>
              <p class="text-slate-400">
                <span class="text-slate-300">Estoque:</span> {{ product.stock }} unidades
              </p>
            </div>

            <div>
              <h2 class="text-xl font-semibold text-slate-50 mb-2">Descrição</h2>
              <p class="text-slate-300 leading-relaxed">{{ product.description }}</p>
            </div>

            <div class="pt-4">
              <button
                @click="addToCart"
                :disabled="product.stock === 0"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
              >
                {{ product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-slate-400 text-lg">Produto não encontrado</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const selectedImage = ref(null)

const fetchProduct = async () => {
  try {
    const response = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = response.data
    selectedImage.value = response.data.thumbnail
  } catch (error) {
    console.error('Erro ao carregar produto:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!product.value || product.value.stock === 0) return

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existingItem = cart.find(item => item.id === product.value.id)

  if (existingItem) {
    if (existingItem.quantity >= product.value.stock) {
      Swal.fire({
        title: 'Erro',
        text: 'Quantidade máxima em estoque atingida',
        icon: 'error',
        confirmButtonColor: '#3B82F6',
        background: '#1F2937',
        color: '#F3F4F6'
      })
      return
    }
    existingItem.quantity++
  } else {
    cart.push({
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      thumbnail: product.value.thumbnail,
      quantity: 1
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  
  Swal.fire({
    title: 'Sucesso!',
    text: 'Produto adicionado ao carrinho',
    icon: 'success',
    confirmButtonColor: '#3B82F6',
    background: '#1F2937',
    color: '#F3F4F6'
  })
}

onMounted(fetchProduct)
</script> 