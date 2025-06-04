<template>
    <!-- Overlay com blur -->
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50">
        <!-- Modal do carrinho -->
        <div class="fixed inset-y-0 right-0 w-full max-w-md bg-slate-800 shadow-xl">
            <div class="h-full flex flex-col">
                <!-- Header do carrinho -->
                <div class="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-slate-50">Carrinho</h2>
                    <button 
                        @click="$emit('close')"
                        class="text-slate-400 hover:text-slate-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Lista de itens -->
                <div class="flex-1 overflow-y-auto p-4">
                    <div v-if="items.length === 0" class="text-center py-8">
                        <p class="text-slate-400">Seu carrinho está vazio</p>
                    </div>

                    <div v-else class="space-y-4">
                        <!-- Item do carrinho -->
                        <div 
                            v-for="item in items" 
                            :key="item.id"
                            class="flex items-center space-x-4 bg-slate-700/50 rounded-xl p-4"
                        >
                            <!-- Imagem do produto -->
                            <img 
                                :src="item.thumbnail" 
                                :alt="item.title"
                                class="w-20 h-20 object-contain bg-slate-900 rounded-lg"
                            />

                            <!-- Detalhes do produto -->
                            <div class="flex-1">
                                <h3 class="text-slate-50 font-medium line-clamp-2">{{ item.title }}</h3>
                                <p class="text-blue-500 font-bold mt-1">R$ {{ item.price.toFixed(2) }}</p>
                                
                                <!-- Controles de quantidade -->
                                <div class="flex items-center space-x-2 mt-2">
                                    <button 
                                        @click="updateQuantity(item, item.quantity - 1)"
                                        class="w-8 h-8 flex items-center justify-center bg-slate-600 text-slate-50 rounded-lg hover:bg-slate-500 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span class="text-slate-50 w-8 text-center">{{ item.quantity }}</span>
                                    <button 
                                        @click="updateQuantity(item, item.quantity + 1)"
                                        class="w-8 h-8 flex items-center justify-center bg-slate-600 text-slate-50 rounded-lg hover:bg-slate-500 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <!-- Botão remover -->
                            <button 
                                @click="removeItem(item)"
                                class="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer com total e botão de checkout -->
                <div class="p-4 border-t border-slate-700">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-slate-400">Total:</span>
                        <span class="text-xl font-bold text-blue-500">R$ {{ total.toFixed(2) }}</span>
                    </div>
                    <button 
                        @click="checkout"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Swal from 'sweetalert2'

// Props e emits
const props = defineProps({
    items: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['close', 'update-quantity', 'remove-from-cart'])

// Computed properties
const total = computed(() => {
    return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// Funções
const updateQuantity = (item, newQuantity) => {
    if (newQuantity > 0) {
        emit('update-quantity', { id: item.id, quantity: newQuantity })
    }
}

const removeItem = (item) => {
    Swal.fire({
        title: 'Remover item?',
        text: 'Tem certeza que deseja remover este item do carrinho?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#6B7280',
        background: '#1F2937',
        color: '#F3F4F6'
    }).then((result) => {
        if (result.isConfirmed) {
            emit('remove-from-cart', item.id)
            Swal.fire({
                title: 'Item Removido!',
                text: 'O item foi removido do seu carrinho.',
                icon: 'success',
                confirmButtonColor: '#3B82F6',
                background: '#1F2937',
                color: '#F3F4F6'
            })
        }
    })
}

const checkout = () => {
    Swal.fire({
        title: 'Pedido Realizado!',
        text: 'Obrigado por comprar conosco.',
        icon: 'success',
        confirmButtonColor: '#3B82F6',
        background: '#1F2937',
        color: '#F3F4F6'
    }).then(() => {
        emit('close')
    })
}
</script>