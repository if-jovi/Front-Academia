<template>
  <q-card class="chart-card">
    <q-card-section>
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2">{{ title }}</div>
        <div class="text-caption">{{ subtitle }}</div>
      </div>
      <canvas ref="canvasRef" :width="width" :height="height"></canvas>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  type: { type: String, default: 'bar' },
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  options: { type: Object, default: () => ({ responsive: true, maintainAspectRatio: false }) },
  width: { type: [Number, String], default: '400' },
  height: { type: [Number, String], default: '200' }
})

const canvasRef = ref(null)
let chartInstance = null

function createChart() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: props.datasets
    },
    options: props.options
  })
}

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
  chartInstance = null
})

// Re-create when data changes
watch(() => [props.labels, props.datasets, props.type, props.options], () => {
  createChart()
}, { deep: true })
</script>

<style scoped>
.chart-card { height: 100%; }
canvas { width: 100% !important; height: 220px !important; max-height: 220px; }
</style>
