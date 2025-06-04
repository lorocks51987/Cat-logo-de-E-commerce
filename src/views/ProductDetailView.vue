<template>
  <div>
    <!-- Botão Voltar para Home -->
    <div class="container mx-auto px-4 py-4">
      <button @click="goToHome" class="text-primary hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
        Voltar para Todos os Produtos
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button @click="loadProduct"
        class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors duration-300">
        Tentar Novamente
      </button>
    </div>

    <ProductDetail v-else :product="product" @add-to-cart="handleAddToCart" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductDetail from '../components/ProductDetail.vue'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const error = ref(null)

const emit = defineEmits(['add-to-cart'])

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar o produto. Por favor, tente novamente.'
    console.error('Erro ao carregar produto:', err)
    Swal.fire('Erro!', 'Não foi possível carregar o produto.', 'error')
  } finally {
    loading.value = false
  }
}

const handleAddToCart = (productData) => {
  emit('add-to-cart', productData)
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  loadProduct()
})
</script>