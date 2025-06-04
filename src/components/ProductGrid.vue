<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Filtros e Ordenação -->
    <div class="mb-8 flex flex-col sm:flex-row gap-4">
      <!-- Categorias -->
      <div class="relative">
        <select
          v-model="selectedCategory"
          @change="handleCategoryChange"
          class="appearance-none bg-slate-800 text-slate-50 px-4 py-2 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
        >
          <option value="">Todas as Categorias</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Ordenação -->
      <div class="relative">
        <select
          v-model="sortBy"
          @change="handleSort"
          class="appearance-none bg-slate-800 text-slate-50 px-4 py-2 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
        >
          <option value="">Ordenar por</option>
          <option value="price-asc">Menor Preço</option>
          <option value="price-desc">Maior Preço</option>
          <option value="title-asc">Nome A-Z</option>
          <option value="title-desc">Nome Z-A</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Grid de Produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="handleAddToCart" />
    </div>

    <!-- Paginação -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center space-x-2">
      <button
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-xl bg-slate-800 text-slate-50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      
      <button
        v-for="page in totalPages"
        :key="page"
        @click="handlePageChange(page)"
        :class="[
          'px-4 py-2 rounded-xl transition-colors',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-50 hover:bg-slate-700'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-xl bg-slate-800 text-slate-50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  sortBy: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['category-change', 'add-to-cart', 'page-change', 'sort'])

const sortBy = ref(props.sortBy)
const selectedCategory = ref(props.selectedCategory)

watch(() => props.sortBy, (newValue) => {
  sortBy.value = newValue
})

watch(() => props.selectedCategory, (newValue) => {
  selectedCategory.value = newValue
})

const handleCategoryChange = () => {
  emit('category-change', selectedCategory.value)
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSort = () => {
  emit('sort', sortBy.value)
}
</script>