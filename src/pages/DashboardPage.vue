<template>
  <q-page class="q-pa-md bg-grey-1" style="min-height: 100vh;">
    <div class="row justify-center">
      <div class="col-12 col-xl-10">
        <div class="q-mb-lg">
          <div class="row items-center q-mb-md">
            <div class="col">
              <h4 class="text-h4 q-my-none text-weight-bold text-primary">
                <q-icon name="dashboard" class="q-mr-sm" />
                Dashboard da Academia
              </h4>
              <p class="text-grey-7 q-mt-sm">Visão geral do desempenho e estatísticas</p>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="refresh"
                label="Atualizar"
                @click="loadAllData"
                :loading="loading"
                unelevated
                class="q-px-lg"
                size="md"
              />
            </div>
          </div>
        </div>

        <!-- Cards com informações principais -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card bg-gradient-primary text-white">
              <q-card-section>
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h6">{{ cardData.totalAlunos }}</div>
                    <div class="text-caption">Total de Alunos</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="people" size="2rem" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card bg-gradient-success text-white">
              <q-card-section>
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h6">{{ cardData.alunosAtivos }}</div>
                    <div class="text-caption">Ativos Hoje</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="person_add" size="2rem" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card bg-gradient-warning text-white">
              <q-card-section>
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h6">{{ cardData.aulasHoje }}</div>
                    <div class="text-caption">Aulas Hoje</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="event" size="2rem" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card bg-gradient-info text-white">
              <q-card-section>
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h6">{{ cardData.novosNoMes }}</div>
                    <div class="text-caption">Novos este mês</div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="trending_up" size="2rem" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

    <!-- Gráficos -->
    <div class="row q-col-gutter-md">
      <!-- Gráfico de treinos do dia -->
      <div class="col-12 col-md-8">
        <ChartCard
          title="Treinos da Semana"
          subtitle="Agendados vs. Realizados"
          :labels="weeklyLabels"
          :datasets="weeklyDatasets"
          type="line"
          :height="220"
          :options="{
            plugins: {
              legend: {
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }"
        />
      </div>

      <!-- Status das Máquinas -->
      <div class="col-12 col-md-4">
        <ChartCard
          title="Status dos Equipamentos"
          subtitle="Visão Geral"
          :labels="equipmentLabels"
          :datasets="equipmentDatasets"
          type="doughnut"
          :height="220"
          :options="{
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <!-- Novos alunos por mês -->
      <div class="col-12 col-md-6">
        <ChartCard
          title="Novos Alunos por Mês"
          subtitle="Últimos 6 meses"
          :labels="monthlyLabels"
          :datasets="monthlyDatasets"
          type="bar"
          :height="220"
          :options="{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }"
        />
      </div>

      <!-- Horários mais frequentados -->
      <div class="col-12 col-md-6">
        <ChartCard
          title="Horários Mais Frequentados"
          subtitle="Média diária"
          :labels="hourlyLabels"
          :datasets="hourlyDatasets"
          type="bar"
          :height="220"
          :options="{
            plugins: {
              legend: {
                display: false
              }
            }
          }"
        />
      </div>
    </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ChartCard from 'components/ChartCard.vue'
import apiService from 'src/api/services'

const $q = useQuasar()

// Estados reativos para os dados
const loading = ref(true)
const weeklyLabels = ref(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'])
const weeklyDatasets = ref([
  {
    label: 'Treinos Agendados',
    data: [0, 0, 0, 0, 0, 0, 0],
    borderColor: '#1976D2',
    backgroundColor: 'rgba(25,118,210,0.15)',
    tension: 0.3,
    fill: true
  },
  {
    label: 'Treinos Realizados',
    data: [0, 0, 0, 0, 0, 0, 0],
    borderColor: '#26A69A',
    backgroundColor: 'rgba(38,166,154,0.15)',
    tension: 0.3,
    fill: true
  }
])
const monthlyLabels = ref(['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'])
const monthlyDatasets = ref([{
  label: 'Novos Alunos',
  data: [0, 0, 0, 0, 0, 0],
  backgroundColor: '#42A5F5'
}])
const equipmentLabels = ref(['Ativas', 'Em Manutenção', 'Reservadas'])
const equipmentDatasets = ref([{
  label: 'Status das Máquinas',
  data: [0, 0, 0],
  backgroundColor: ['#26A69A', '#FF7043', '#FFCA28']
}])
const hourlyLabels = ref(['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'])
const hourlyDatasets = ref([{
  label: 'Frequência por Horário',
  data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  backgroundColor: '#7E57C2'
}])

// Estados para os cards com valores iniciais
const cardData = ref({
  totalAlunos: '...',
  alunosAtivos: '...',
  aulasHoje: '...',
  novosNoMes: '...'
})

// Função para carregar dados dos treinos
async function loadTreinosData() {
  try {
    const { data } = await apiService.getTreinos()
    
    weeklyDatasets.value = [
      {
        label: 'Treinos Agendados',
        data: Object.values(data.agendados),
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25,118,210,0.15)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Treinos Realizados',
        data: Object.values(data.realizados),
        borderColor: '#26A69A',
        backgroundColor: 'rgba(38,166,154,0.15)',
        tension: 0.3,
        fill: true
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar dados dos treinos:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar dados dos treinos',
      icon: 'warning'
    })
  }
}

// Função para carregar dados dos equipamentos
async function loadEquipamentosData() {
  try {
    const { data } = await apiService.getEquipamentos()
    
    equipmentDatasets.value = [{
      label: 'Status das Máquinas',
      data: Object.values(data.status),
      backgroundColor: ['#26A69A', '#FF7043', '#FFCA28']
    }]
  } catch (error) {
    console.error('Erro ao carregar dados dos equipamentos:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar dados dos equipamentos',
      icon: 'warning'
    })
  }
}

// Função para carregar dados dos alunos
async function loadAlunosData() {
  try {
    const { data } = await apiService.getAlunos()

    // Atualiza os cards
    cardData.value = {
      totalAlunos: data.total || 0,
      alunosAtivos: data.ativos || 0,
      aulasHoje: 8, // Valor fixo para demonstração
      novosNoMes: Object.values(data.novos || {}).pop() || 0
    }

    // Atualiza o gráfico
    const novosKeys = Object.keys(data.novos || {})
    monthlyLabels.value = novosKeys.map(date => {
      const [year, month] = date.split('-')
      return new Date(year, month - 1).toLocaleString('pt-BR', { month: 'short' })
    })

    monthlyDatasets.value = [{
      label: 'Novos Alunos',
      data: Object.values(data.novos || {}),
      backgroundColor: '#42A5F5'
    }]
  } catch (error) {
    console.error('Erro ao carregar dados dos alunos:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar dados dos alunos',
      icon: 'warning'
    })
  }
}

// Função para carregar dados de frequência
async function loadFrequenciaData() {
  try {
    const { data } = await apiService.getFrequencia()
    
    hourlyLabels.value = Object.keys(data.horarios)
    hourlyDatasets.value = [{
      label: 'Frequência por Horário',
      data: Object.values(data.horarios),
      backgroundColor: '#7E57C2'
    }]
  } catch (error) {
    console.error('Erro ao carregar dados de frequência:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar dados de frequência',
      icon: 'warning'
    })
  }
}

// Carrega todos os dados
async function loadAllData() {
  loading.value = true
  
  try {
    // Inicializa os datasets com dados vazios para evitar erros
    weeklyDatasets.value = []
    monthlyDatasets.value = []
    equipmentDatasets.value = []
    hourlyDatasets.value = []
    
    // Carrega os dados
    await Promise.all([
      loadTreinosData(),
      loadEquipamentosData(),
      loadAlunosData(),
      loadFrequenciaData()
    ])
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar alguns dados do dashboard',
      icon: 'warning'
    })
  } finally {
    loading.value = false
  }
}

// Carrega dados quando o componente é montado
onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
.q-card { height: 100%; }
.chart-card { height: 100%; }

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976D2, #42A5F5);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4CAF50, #81C784);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #2196F3, #64B5F6);
}
</style>
