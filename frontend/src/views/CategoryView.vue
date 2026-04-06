<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchModelsByCategory, getOfficialModelUrl } from '../services/api'

const route = useRoute()
const models = ref([])
const loading = ref(true)
const error = ref('')

const categoryId = computed(() => route.params.id)
const modelsWithLinks = computed(() =>
  models.value.map((model) => ({
    ...model,
    officialUrl: getOfficialModelUrl(model),
  })),
)

async function loadModels() {
  loading.value = true
  error.value = ''

  try {
    models.value = await fetchModelsByCategory(categoryId.value)
  } catch (err) {
    error.value = err.message || 'Failed to load models.'
  } finally {
    loading.value = false
  }
}

function onModelClick(event, officialUrl) {
  if (!officialUrl) {
    event.preventDefault()
  }
}

watch(categoryId, loadModels)
onMounted(loadModels)
</script>

<template>
  <section>
    <RouterLink to="/" class="back-link">Back to Categories</RouterLink>

    <h1>Models In This Category</h1>
    <p class="page-intro">Pick a model to open its official website.</p>

    <p v-if="loading" class="status">Loading models...</p>
    <p v-if="error" class="status error">{{ error }}</p>

    <div v-if="!loading && !error" class="grid">
      <a
        v-for="model in modelsWithLinks"
        :key="model.id"
        :href="model.officialUrl || '#'"
        :target="model.officialUrl ? '_blank' : null"
        :rel="model.officialUrl ? 'noopener noreferrer' : null"
        :class="['card', { 'card-disabled': !model.officialUrl }]"
        :aria-disabled="!model.officialUrl"
        :title="model.officialUrl ? `Open ${model.name} official page` : 'Official link not available'"
        @click="onModelClick($event, model.officialUrl)"
      >
        <h2>{{ model.name }}</h2>
        <p>{{ model.description || 'No description available.' }}</p>
        <span class="chip">{{ model.type }}</span>
      </a>
    </div>
  </section>
</template>
