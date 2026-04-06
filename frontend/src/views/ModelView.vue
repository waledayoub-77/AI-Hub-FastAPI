<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchModelById, useModel } from '../services/api'

const route = useRoute()
const model = ref(null)
const input = ref('')
const output = ref('')
const loadingModel = ref(true)
const runningModel = ref(false)
const error = ref('')

const modelId = computed(() => route.params.id)

async function loadModel() {
  loadingModel.value = true
  error.value = ''
  output.value = ''

  try {
    model.value = await fetchModelById(modelId.value)
  } catch (err) {
    error.value = err.message || 'Failed to load model details.'
  } finally {
    loadingModel.value = false
  }
}

async function runModel() {
  if (!model.value || !input.value.trim()) {
    return
  }

  runningModel.value = true
  error.value = ''

  try {
    const response = await useModel(model.value.key, input.value)
    output.value = response.output || ''
  } catch (err) {
    error.value = err.message || 'Failed to run model.'
  } finally {
    runningModel.value = false
  }
}

watch(modelId, loadModel)
onMounted(loadModel)
</script>

<template>
  <section>
    <RouterLink
      v-if="model?.category_id"
      :to="`/category/${model.category_id}`"
      class="back-link"
    >
      Back to Models
    </RouterLink>

    <p v-if="loadingModel" class="status">Loading model details...</p>
    <p v-if="error" class="status error">{{ error }}</p>

    <div v-if="model && !loadingModel" class="panel">
      <h1>{{ model.name }}</h1>
      <p class="page-intro">{{ model.description }}</p>
      <p class="meta">Model type: {{ model.type }} | Key: {{ model.key }}</p>

      <label class="label" for="model-input">Input</label>
      <textarea
        id="model-input"
        v-model="input"
        rows="8"
        placeholder="Write your prompt or text here..."
      />

      <button class="action" :disabled="runningModel" @click="runModel">
        {{ runningModel ? 'Running...' : 'Run Model' }}
      </button>

      <div v-if="output" class="result">
        <h2>Result</h2>

        <img
          v-if="model.key === 'image-generator' && output.startsWith('http')"
          :src="output"
          alt="Generated AI output"
          class="generated-image"
        />

        <img
          v-else-if="model.key === 'image-generator' && output.startsWith('data:image')"
          :src="output"
          alt="Generated AI output"
          class="generated-image"
        />

        <p v-else>{{ output }}</p>
      </div>
    </div>
  </section>
</template>
