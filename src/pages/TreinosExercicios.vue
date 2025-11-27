<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Selecionar Exercícios - {{ treino?.nome_treino }}</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/treinos')"
      />
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Exercícios Disponíveis</div>

        <q-select
          v-model="exercicioSelecionado"
          :options="exerciciosDisponiveis"
          option-value="id"
          option-label="nome_completo"
          label="Selecionar Exercício"
          outlined
          emit-value
          map-options
          class="q-mb-md"
        />

        <div v-if="exercicioSelecionado" class="q-mb-md">
          <div class="row q-gutter-md">
            <q-input
              v-model="novoExercicio.series"
              label="Séries *"
              type="number"
              outlined
              class="col-3"
              :rules="[val => val > 0 || 'Séries é obrigatório']"
            />

            <q-input
              v-model="novoExercicio.repeticoes"
              label="Repetições *"
              type="number"
              outlined
              class="col-3"
              :rules="[val => val > 0 || 'Repetições é obrigatório']"
            />

            <q-input
              v-model="novoExercicio.carga_kg"
              label="Carga (kg)"
              type="number"
              outlined
              class="col-3"
            />

            <q-input
              v-model="novoExercicio.descanso_segundos"
              label="Descanso (segundos) *"
              type="number"
              outlined
              class="col-3"
              :rules="[val => val > 0 || 'Descanso é obrigatório']"
            />
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn
              color="primary"
              label="Adicionar ao Treino"
              @click="adicionarExercicio"
              :loading="carregando"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card v-if="exerciciosDoTreino.length > 0" class="q-mt-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Exercícios do Treino</div>

        <q-table
          :rows="exerciciosDoTreino"
          :columns="colunasExercicios"
          row-key="id_treino_exercicio"
          flat
          bordered
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="removerExercicio(props.row)"
              >
                <q-tooltip>Remover</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>

        <div class="row justify-end q-mt-md">
          <q-btn
            color="positive"
            label="Finalizar Treino"
            @click="finalizarTreino"
            unelevated
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import treinosService from '../api/treinosService'
import exerciciosService from '../api/exerciciosService'
import maquinasService from '../api/maquinasService'

export default {
  name: 'TreinosExercicios',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const carregando = ref(false)
    const treino = ref(null)
    const exercicios = ref([])
    const maquinas = ref([])
    const exerciciosDoTreino = ref([])
    const exercicioSelecionado = ref(null)

    const novoExercicio = reactive({
      series: 1,
      repeticoes: 1,
      carga_kg: 0,
      descanso_segundos: 60
    })

    const exerciciosDisponiveis = computed(() => {
      return exercicios.value.map(exercicio => ({
        id: exercicio.id,
        nome_completo: `${getNomeMaquina(exercicio.id_maquina)} - ${exercicio.grupo_muscular} (${exercicio.equipamento_necessario})`
      }))
    })

    const colunasExercicios = [
      {
        name: 'nome_exercicio',
        label: 'Exercício',
        align: 'left',
        field: row => getNomeExercicioCompleto(row.id_exercicio)
      },
      {
        name: 'series',
        label: 'Séries',
        align: 'center',
        field: 'series'
      },
      {
        name: 'repeticoes',
        label: 'Repetições',
        align: 'center',
        field: 'repeticoes'
      },
      {
        name: 'carga_kg',
        label: 'Carga (kg)',
        align: 'center',
        field: 'carga_kg',
        format: val => val ? `${val} kg` : '-'
      },
      {
        name: 'descanso_segundos',
        label: 'Descanso (seg)',
        align: 'center',
        field: 'descanso_segundos',
        format: val => val ? `${val}s` : '-'
      },
      {
        name: 'actions',
        label: 'Ações',
        align: 'center'
      }
    ]

    onMounted(async () => {
      const idTreino = route.params.id
      if (idTreino) {
        await Promise.all([
          carregarTreino(idTreino),
          carregarExercicios(),
          carregarMaquinas(),
          carregarExerciciosDoTreino(idTreino)
        ])
      }
    })

    async function carregarTreino(id) {
      try {
        const dadosTreino = await treinosService.getTreino(id)
        treino.value = dadosTreino
      } catch (error) {
        console.error('Erro ao carregar treino:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar dados do treino',
          icon: 'report_problem'
        })
      }
    }

    async function carregarExercicios() {
      try {
        const response = await exerciciosService.getListaExercicios()
        exercicios.value = response.data
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar lista de exercícios',
          icon: 'report_problem'
        })
      }
    }

    async function carregarMaquinas() {
      try {
        const response = await maquinasService.getListaMaquinas()
        maquinas.value = response.data
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error)
      }
    }

    async function carregarExerciciosDoTreino(idTreino) {
      try {
        // Buscar exercícios do treino do db.json
        const response = await fetch(`http://localhost:3003/treinos_exercicios?id_treino=${idTreino}`)
        const data = await response.json()
        exerciciosDoTreino.value = data
      } catch (error) {
        console.error('Erro ao carregar exercícios do treino:', error)
      }
    }

    function getNomeMaquina(idMaquina) {
      const maquina = maquinas.value.find(m => m.id === idMaquina)
      return maquina ? maquina.nome_maquina : 'N/A'
    }

    function getNomeExercicioCompleto(idExercicio) {
      const exercicio = exercicios.value.find(e => e.id === idExercicio)
      if (exercicio) {
        return `${getNomeMaquina(exercicio.id_maquina)} - ${exercicio.grupo_muscular}`
      }
      return `Exercício ${idExercicio}`
    }

    async function adicionarExercicio() {
      if (!exercicioSelecionado.value) return

      carregando.value = true
      try {
        const exercicioParaSalvar = {
          id_treino: route.params.id,
          id_exercicio: exercicioSelecionado.value,
          ...novoExercicio,
          id_treino_exercicio: Date.now()
        }

        // Salvar no db.json
        await fetch('http://localhost:3003/treinos_exercicios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(exercicioParaSalvar)
        })

        exerciciosDoTreino.value.push(exercicioParaSalvar)

        // Reset form
        exercicioSelecionado.value = null
        novoExercicio.series = 1
        novoExercicio.repeticoes = 1
        novoExercicio.carga_kg = 0
        novoExercicio.descanso_segundos = 60

        $q.notify({
          color: 'positive',
          message: 'Exercício adicionado ao treino',
          icon: 'check'
        })
      } catch (error) {
        console.error('Erro ao adicionar exercício:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao adicionar exercício ao treino',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    async function removerExercicio(exercicio) {
      try {
        await fetch(`http://localhost:3003/treinos_exercicios/${exercicio.id_treino_exercicio}`, {
          method: 'DELETE'
        })

        exerciciosDoTreino.value = exerciciosDoTreino.value.filter(e => e.id_treino_exercicio !== exercicio.id_treino_exercicio)

        $q.notify({
          color: 'positive',
          message: 'Exercício removido do treino',
          icon: 'check'
        })
      } catch (error) {
        console.error('Erro ao remover exercício:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao remover exercício do treino',
          icon: 'report_problem'
        })
      }
    }

    function finalizarTreino() {
      $q.notify({
        color: 'positive',
        message: 'Treino finalizado com sucesso!',
        icon: 'check'
      })
      router.push('/app/treinos')
    }

    return {
      carregando,
      treino,
      exercicioSelecionado,
      novoExercicio,
      exerciciosDisponiveis,
      exerciciosDoTreino,
      colunasExercicios,
      adicionarExercicio,
      removerExercicio,
      finalizarTreino
    }
  }
}
</script>
