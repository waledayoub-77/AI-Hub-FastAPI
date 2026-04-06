<script setup>
import { onMounted, ref } from 'vue'
import { fetchCategories } from '../services/api'

const categories = ref([])
const loading = ref(true)
const error = ref('')

async function loadCategories() {
  loading.value = true
  error.value = ''

  try {
    categories.value = await fetchCategories()
  } catch (err) {
    error.value = err.message || 'Failed to load categories.'
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>

<template>
  <section>
    <h1>Categories</h1>
    <p class="page-intro">Pick a category to explore available AI tools.</p>

    <p v-if="loading" class="status">Loading categories...</p>
    <p v-if="error" class="status error">{{ error }}</p>

    <div v-if="!loading && !error" class="grid">
      <RouterLink
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="card"
      >
        <h2>{{ category.name }}</h2>
        <p>{{ category.description || 'No description available.' }}</p>
      </RouterLink>
    </div>
  </section>
</template>
