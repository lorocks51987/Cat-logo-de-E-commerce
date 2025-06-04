<template>
  <div class="min-h-screen bg-slate-900 py-8">
    <div class="container mx-auto px-4">
      <!-- Seção de Filtros -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Filtro de Categoria -->
        <select v-model="selectedCategory" class="select-style">
          <option value="">Todas as Categorias</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <!-- Filtro de Marca -->
        <select v-model="selectedBrand" class="select-style">
          <option value="">Todas as Marcas</option>
          <option v-for="brand in brands" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>

        <!-- Ordenação -->
        <select v-model="sortBy" class="select-style">
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="name-asc">Nome A-Z</option>
          <option value="name-desc">Nome Z-A</option>
        </select>

        <!-- Busca -->
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar produtos..." 
          class="select-style"
        />
      </div>

      <!-- Estado de Carregamento -->
      <div v-if="loading" class="loading-spinner">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Lista de Produtos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>

      <!-- Paginação -->
      <div v-if="!loading && filteredProducts.length > 0" class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <!-- Botão Anterior -->
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-button"
          >
            Anterior
          </button>
          
          <!-- Números das Páginas -->
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'pagination-button',
              currentPage === page ? 'pagination-button-active' : ''
            ]"
          >
            {{ page }}
          </button>

          <!-- Botão Próximo -->
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-button"
          >
            Próximo
          </button>
        </div>
      </div>

      <!-- Mensagem de Nenhum Resultado -->
      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-12">
        <p class="text-slate-400 text-lg">Nenhum produto encontrado</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '../components/ProductCard.vue'
import Swal from 'sweetalert2'

// Estado da aplicação
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const sortBy = ref('price-asc')
const currentPage = ref(1)
const itemsPerPage = 12

// Listas de filtros
const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(p => p.category))
  return Array.from(uniqueCategories).sort()
})

const brands = computed(() => {
  const uniqueBrands = new Set(products.value.map(p => p.brand))
  return Array.from(uniqueBrands).sort()
})

// Filtragem e ordenação dos produtos
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // Aplicar filtros de busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }

  // Aplicar filtros de categoria e marca
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }
  if (selectedBrand.value) {
    filtered = filtered.filter(p => p.brand === selectedBrand.value)
  }

  // Aplicar ordenação
  switch (sortBy.value) {
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break
    case 'name-asc': filtered.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'name-desc': filtered.sort((a, b) => b.title.localeCompare(a.title)); break
  }

  // Aplicar paginação
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

// Cálculo do total de páginas
const totalPages = computed(() => {
  const total = Math.ceil(products.value.length / itemsPerPage)
  return total > 0 ? total : 1
})

// Funções principais
const fetchProducts = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products')
    products.value = response.data.products
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    showError('Não foi possível carregar os produtos.')
  } finally {
    loading.value = false
  }
}

const addToCart = (product) => {
  // Verificar estoque
  if (product.stock === 0) {
    showError('Produto fora de estoque')
    return
  }

  // Obter carrinho atual
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existingItem = cart.find(item => item.id === product.id)

  // Atualizar quantidade ou adicionar novo item
  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      showError('Quantidade máxima em estoque atingida')
      return
    }
    existingItem.quantity++
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    })
  }

  // Salvar carrinho e mostrar mensagem
  localStorage.setItem('cart', JSON.stringify(cart))
  showSuccess('Produto adicionado ao carrinho')
}

// Funções auxiliares
const showError = (message) => {
  Swal.fire({
    title: 'Erro',
    text: message,
    icon: 'error',
    confirmButtonColor: '#3B82F6',
    background: '#1F2937',
    color: '#F3F4F6'
  })
}

const showSuccess = (message) => {
  Swal.fire({
    title: 'Sucesso!',
    text: message,
    icon: 'success',
    confirmButtonColor: '#3B82F6',
    background: '#1F2937',
    color: '#F3F4F6'
  })
}

// Inicialização
onMounted(fetchProducts)
</script>

<style scoped>
/* Estilos dos elementos */
.select-style {
  @apply bg-slate-800 text-slate-50 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none;
}

.loading-spinner {
  @apply flex justify-center items-center min-h-[60vh];
}

.pagination-button {
  @apply px-4 py-2 bg-slate-800 text-slate-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors;
}

.pagination-button-active {
  @apply bg-blue-600 text-white;
}
</style> 