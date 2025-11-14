<template>
  <q-page class="q-pa-md bg-grey-1" style="min-height: 100vh;">
    <div class="row justify-center">
      <div class="col-12 col-xl-10">
        <div class="q-mb-lg">
          <div class="row items-center q-mb-md">
            <div class="col">
              <h4 class="text-h4 q-my-none text-weight-bold text-primary">
                <q-icon name="event" class="q-mr-sm" />
                Gerenciamento de Treinos
              </h4>
              <p class="text-grey-7 q-mt-sm">Organize e gerencie os treinos dos alunos</p>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="add"
                label="Novo Treino"
                @click="$router.push('/app/treinos/adicionar')"
                unelevated
                class="q-px-lg"
                size="md"
              />
            </div>
          </div>

          <!-- Cards de Estatísticas -->
          <div class="row q-gutter-md q-mb-lg">
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stat-card bg-gradient-primary text-white">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-h6">{{ stats.totalTreinos }}</div>
                      <div class="text-caption">Total de Treinos</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="event" size="2rem" />
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
                      <div class="text-h6">{{ stats.treinosHoje }}</div>
                      <div class="text-caption">Treinos Hoje</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="today" size="2rem" />
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
                      <div class="text-h6">{{ stats.alunosAtivos }}</div>
                      <div class="text-caption">Alunos Ativos</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="people" size="2rem" />
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
                      <div class="text-h6">{{ stats.mediaExercicios }}</div>
                      <div class="text-caption">Média Exercícios/Treino</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="fitness_center" size="2rem" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <router-view />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import treinosService from '../api/treinosService'
import alunosService from '../api/alunosService'

export default {
  name: 'TreinosPage',
  setup() {
    const stats = ref({
      totalTreinos: 0,
      treinosHoje: 0,
      alunosAtivos: 0,
      mediaExercicios: 0
    })

    onMounted(async () => {
      await carregarEstatisticas()
    })

    async function carregarEstatisticas() {
      try {
        const [treinosRes, alunosRes] = await Promise.all([
          treinosService.getListaTreinos(),
          alunosService.getListaAlunos()
        ])

        const treinos = treinosRes.data
        const alunos = alunosRes.data

        stats.value.totalTreinos = treinos.length
        stats.value.alunosAtivos = alunos.filter(a => a.status === 'Ativo').length

        const hoje = new Date().toISOString().split('T')[0]
        stats.value.treinosHoje = treinos.filter(t => t.data_treino === hoje).length

        // Calcular média de exercícios por treino (simulado)
        stats.value.mediaExercicios = Math.round(Math.random() * 5 + 3)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }

    return {
      stats
    }
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #388e3c, #66bb6a);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #f57c00, #ffb74d);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #0288d1, #4fc3f7);
}
</style>
