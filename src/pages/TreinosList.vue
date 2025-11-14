<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Lista de Treinos</h5>
      <q-btn
        color="primary"
        icon="add"
        label="Adicionar Treino"
        @click="$router.push('/app/treinos/adicionar')"
      />
    </div>

    <div class="row q-gutter-md q-mb-md">
      <q-input
        v-model="filtroNome"
        label="Filtrar por Nome do Treino"
        outlined
        clearable
        class="col-4"
      />
      <q-input
        v-model="filtroData"
        label="Filtrar por Data do Treino"
        type="date"
        outlined
        clearable
        class="col-3"
        @input="filtrarPorData"
      />
      <q-select
        v-model="filtroAluno"
        :options="alunosOptions"
        label="Filtrar por Aluno"
        outlined
        clearable
        emit-value
        map-options
        class="col-4"
        option-value="id_aluno"
        option-label="nome"
      />
    </div>

    <q-table
      :rows="treinosFiltrados"
      :columns="colunas"
      row-key="id_treino"
      :loading="carregando"
      :pagination="{ rowsPerPage: 10 }"
      class="q-mt-md"
      @row-click="expandirTreino"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            @click.stop="$router.push(`/app/treinos/editar/${props.row.id_treino}`)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click.stop="confirmarDelecao(props.row)"
          >
            <q-tooltip>Deletar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-expand="props">
        <q-td :props="props" colspan="100%">
          <div class="q-pa-md">
            <h6 class="text-h6 q-mb-md">Exercícios do Treino</h6>
            <q-table
              :rows="getExerciciosDoTreino(props.row.id_treino)"
              :columns="colunasExercicios"
              row-key="id_treino_exercicio"
              flat
              bordered
              :pagination="{ rowsPerPage: 5 }"
            >
              <template v-slot:no-data>
                <div class="text-grey-6 text-center q-pa-lg">
                  Nenhum exercício encontrado para este treino
                </div>
              </template>
            </q-table>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogConfirmacao">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Tem certeza que deseja deletar o treino "{{ treinoParaDeletar?.nome_treino }}"?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Deletar"
            color="negative"
            @click="deletarTreino"
            :loading="carregando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import treinosService from '../api/treinosService'
import alunosService from '../api/alunosService'

export default {
  name: 'TreinosList',
  setup() {
    const $q = useQuasar()

    const treinos = ref([])
    const alunos = ref([])
    const treinosExercicios = ref([])
    const carregando = ref(false)
    const erro = ref(null)
    const dialogConfirmacao = ref(false)
    const treinoParaDeletar = ref(null)

    const filtroNome = ref('')
    const filtroData = ref('')
    const filtroAluno = ref(null)

    const alunosOptions = computed(() => {
      return alunos.value.map(aluno => ({
        id_aluno: aluno.id_aluno,
        nome: aluno.nome
      }))
    })

    const treinosFiltrados = computed(() => {
      let filtrados = treinos.value

      if (filtroNome.value) {
        filtrados = filtrados.filter(treino =>
          treino.nome_treino.toLowerCase().includes(filtroNome.value.toLowerCase())
        )
      }

      if (filtroData.value) {
        filtrados = filtrados.filter(treino =>
          treino.data_treino === filtroData.value
        )
      }

      if (filtroAluno.value) {
        filtrados = filtrados.filter(treino =>
          treino.id_aluno === filtroAluno.value
        )
      }

      return filtrados
    })

    const colunas = [
      {
        name: 'nome_treino',
        required: true,
        label: 'Nome do Treino',
        align: 'left',
        field: 'nome_treino',
        sortable: true
      },
      {
        name: 'nome_aluno',
        label: 'Aluno',
        align: 'left',
        field: row => getNomeAluno(row.id_aluno),
        sortable: true
      },
      {
        name: 'data_treino',
        label: 'Data do Treino',
        align: 'left',
        field: 'data_treino',
        sortable: true,
        format: val => val ? new Date(val).toLocaleDateString('pt-BR') : ''
      },
      {
        name: 'horario',
        label: 'Horário',
        align: 'left',
        field: row => `${row.data_inicio} - ${row.data_fim}`,
        sortable: false
      },
      {
        name: 'observacoes',
        label: 'Observações',
        align: 'left',
        field: 'observacoes'
      },
      {
        name: 'actions',
        label: 'Ações',
        align: 'center'
      },
      {
        name: 'expand',
        label: '',
        align: 'center'
      }
    ]

    const colunasExercicios = [
      {
        name: 'nome_exercicio',
        label: 'Exercício',
        align: 'left',
        field: row => getNomeExercicio(row.id_exercicio)
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
      }
    ]

    onMounted(async () => {
      await Promise.all([
        carregarTreinos(),
        carregarAlunos(),
        carregarTreinosExercicios()
      ])
    })

    async function carregarTreinos() {
      carregando.value = true
      try {
        const response = await treinosService.getListaTreinos()
        treinos.value = response.data
      } catch (error) {
        erro.value = 'Erro ao buscar treinos'
        console.error('Erro ao buscar treinos:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar treinos',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    async function carregarAlunos() {
      try {
        const response = await alunosService.getListaAlunos()
        alunos.value = response.data
      } catch (error) {
        console.error('Erro ao buscar alunos:', error)
      }
    }

    async function carregarTreinosExercicios() {
      try {
        // Como não temos um serviço específico, vamos buscar do db.json
        const response = await fetch('http://localhost:3003/treinos_exercicios')
        treinosExercicios.value = await response.json()
      } catch (error) {
        console.error('Erro ao buscar treinos_exercicios:', error)
      }
    }

    function getNomeAluno(idAluno) {
      const aluno = alunos.value.find(a => a.id_aluno === idAluno)
      return aluno ? aluno.nome : 'N/A'
    }

    function getNomeExercicio(idExercicio) {
      // Como não temos os exercícios carregados, vamos buscar dinamicamente
      // Por enquanto, retorna o ID
      return `Exercício ${idExercicio}`
    }



    function expandirTreino(props) {
      props.expand = !props.expand
    }

    function filtrarPorData() {
      // A lógica de filtro já está no computed treinosFiltrados
    }

    function confirmarDelecao(treino) {
      treinoParaDeletar.value = treino
      dialogConfirmacao.value = true
    }

    async function deletarTreino() {
      if (!treinoParaDeletar.value) return

      try {
        await treinosService.deletarTreino(treinoParaDeletar.value.id_treino)
        treinos.value = treinos.value.filter(t => t.id_treino !== treinoParaDeletar.value.id_treino)
        dialogConfirmacao.value = false
        treinoParaDeletar.value = null
        $q.notify({
          color: 'positive',
          message: 'Treino deletado com sucesso',
          icon: 'check'
        })
      } catch (error) {
        console.error('Erro ao deletar treino:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao deletar treino',
          icon: 'report_problem'
        })
      }
    }

    return {
      treinos,
      carregando,
      dialogConfirmacao,
      treinoParaDeletar,
      filtroNome,
      filtroData,
      filtroAluno,
      alunosOptions,
      treinosFiltrados,
      colunas,
      colunasExercicios,
      carregarTreinos,
      confirmarDelecao,
      deletarTreino,
      expandirTreino,
      filtrarPorData
    }
  }
}
</script>
