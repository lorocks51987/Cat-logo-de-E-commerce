<template>
  <div>
    <!-- Botão Voltar para Home (visível quando uma categoria está selecionada ou há busca) -->
    <div v-if="selectedCategory || route.query.q" class="container mx-auto px-4 py-4">
      <button @click="goToHome" class="text-primary hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
        Voltar para Todos os Produtos
      </button>
    </div>

    <ProductGrid 
      :products="products" 
      :categories="formattedCategories" 
      :selected-category="selectedCategory"
      :current-page="currentPage"
      :total-pages="totalPages"
      :sort-by="sortBy"
      @category-change="handleCategoryChange" 
      @add-to-cart="handleAddToCart"
      @page-change="handlePageChange"
      @sort="handleSort"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductGrid from '../components/ProductGrid.vue'
import Swal from 'sweetalert2'

const emit = defineEmits(['add-to-cart'])
const route = useRoute()
const router = useRouter()

const products = ref([])
const categories = ref([])
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 12
const totalProducts = ref(0)
const sortBy = ref('')

const formattedCategories = computed(() => {
  return categories.value.map(category => ({
    value: category.slug,
    label: category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, ' ')
  }))
})

const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage)
})

const loadCategories = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
    Swal.fire('Erro!', 'Não foi possível carregar as categorias.', 'error')
  }
}

const loadProducts = async () => {
  try {
    const skip = (currentPage.value - 1) * itemsPerPage
    let url = 'https://dummyjson.com/products'
    
    if (selectedCategory.value) {
      url = `https://dummyjson.com/products/category/${selectedCategory.value}`
    } else if (route.query.q) {
      url = 'https://dummyjson.com/products/search'
      const response = await axios.get(`${url}?q=${route.query.q}&skip=${skip}&limit=${itemsPerPage}`)
      products.value = response.data.products
      totalProducts.value = response.data.total
      return
    }

    const response = await axios.get(`${url}?skip=${skip}&limit=${itemsPerPage}`)
    products.value = response.data.products
    totalProducts.value = response.data.total
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    products.value = []
    totalProducts.value = 0
    Swal.fire('Erro!', 'Não foi possível carregar os produtos.', 'error')
  }
}

watch(selectedCategory, () => {
  currentPage.value = 1
  loadProducts()
})

watch(
  () => route.query.q,
  (newSearchTerm, oldSearchTerm) => {
    if (newSearchTerm !== oldSearchTerm) {
      currentPage.value = 1
      loadProducts()
    }
  }
)

watch(sortBy, () => {
  if (sortBy.value) {
    const [field, order] = sortBy.value.split('-')
    products.value.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1
      } else {
        return a[field] < b[field] ? 1 : -1
      }
    })
  }
})

const handleCategoryChange = (category) => {
  selectedCategory.value = category
  if (category) {
    router.push({ query: { ...route.query, category } })
  } else {
    const query = { ...route.query }
    delete query.category
    router.push({ query })
  }
  currentPage.value = 1
  loadProducts()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadProducts()
}

const handleSort = (sort) => {
  sortBy.value = sort
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>