 <template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Lista de Treinos</h5>
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
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            @click="abrirDialogExercicios(props.row)"
          >
            <q-tooltip>Ver Exercícios Detalhados</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="edit"
            color="orange"
            @click="$router.push(`/app/treinos/editar/${props.row.id_treino}`)"
          >
            <q-tooltip>Editar Treino</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="delete"
            color="negative"
            @click="confirmarDelecao(props.row)"
          >
            <q-tooltip>Deletar Treino</q-tooltip>
          </q-btn>
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

    <q-dialog v-model="dialogExercicios" maximized>
      <q-card>
        <q-card-section>
          <div class="row items-center">
            <q-avatar icon="fitness_center" color="primary" text-color="white" />
            <span class="q-ml-sm text-h6">
              Exercícios do Treino: {{ treinoSelecionado?.nome_treino }}
            </span>
          </div>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="getExerciciosDoTreino(treinoSelecionado?.id_treino || 0)"
            :columns="colunasExerciciosDetalhadas"
            row-key="id_treino_exercicio"
            flat
            bordered
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:no-data>
              <div class="text-grey-6 text-center q-pa-lg">
                Nenhum exercício encontrado para este treino
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
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
import exerciciosService from '../api/exerciciosService'
import maquinasService from '../api/maquinasService'

export default {
  name: 'TreinosList',
  setup() {
    const $q = useQuasar()

    const treinos = ref([])
    const alunos = ref([])
    const treinosExercicios = ref([])
    const exercicios = ref([])
    const maquinas = ref([])
    const carregando = ref(false)
    const erro = ref(null)
    const dialogConfirmacao = ref(false)
    const treinoParaDeletar = ref(null)
    const dialogExercicios = ref(false)
    const treinoSelecionado = ref(null)

    const filtroNome = ref('')
    const filtroData = ref('')
    const filtroAluno = ref(null)

    const alunosOptions = computed(() => {
      return alunos.value.map(aluno => ({
        id_aluno: aluno.id,
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
        const filtroAno = filtroData.value.substring(0, 4) // Extrai o ano da data selecionada
        filtrados = filtrados.filter(treino =>
          treino.data_treino.startsWith(filtroAno)
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
      }
    ]



    const colunasExerciciosDetalhadas = [
      {
        name: 'nome_exercicio',
        label: 'Nome do Exercício',
        align: 'left',
        field: row => getNomeExercicio(row.id_exercicio)
      },
      {
        name: 'grupo_muscular',
        label: 'Grupo Muscular',
        align: 'left',
        field: row => getGrupoMuscular(row.id_exercicio)
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
        name: 'observacoes',
        label: 'Observações',
        align: 'left',
        field: 'observacoes'
      }
    ]

    onMounted(async () => {
      await Promise.all([
        carregarTreinos(),
        carregarAlunos(),
        carregarTreinosExercicios(),
        carregarExercicios(),
        carregarMaquinas()
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

    async function carregarExercicios() {
      try {
        const response = await exerciciosService.getListaExercicios()
        exercicios.value = response.data
      } catch (error) {
        console.error('Erro ao buscar exercícios:', error)
      }
    }

    async function carregarMaquinas() {
      try {
        const response = await maquinasService.getListaMaquinas()
        maquinas.value = response.data
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error)
      }
    }

    function getNomeAluno(idAluno) {
      const aluno = alunos.value.find(a => a.id === idAluno)
      return aluno ? aluno.nome : 'N/A'
    }

    function getNomeExercicio(idExercicio) {
      const exercicio = exercicios.value.find(e => e.id === idExercicio)
      if (exercicio) {
        const maquina = maquinas.value.find(m => m.id === exercicio.id_maquina)
        const nomeMaquina = maquina ? maquina.nome_maquina : 'N/A'
        return `${nomeMaquina} - ${exercicio.grupo_muscular}`
      }
      return `Exercício ${idExercicio}`
    }

    function getGrupoMuscular(idExercicio) {
      const exercicio = exercicios.value.find(e => e.id === idExercicio)
      return exercicio ? exercicio.grupo_muscular : 'N/A'
    }

    function getExerciciosDoTreino(idTreino) {
      return treinosExercicios.value.filter(te => String(te.id_treino) === String(idTreino))
    }

    function filtrarPorData() {
      // A lógica de filtro já está no computed treinosFiltrados
    }

    function isValidDateOrYear(val) {
      // Check if it's a valid year (YYYY)
      if (/^\d{4}$/.test(val)) {
        const year = parseInt(val, 10)
        return year >= 1900 && year <= 2100
      }
      // Check if it's a valid date (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const date = new Date(val)
        return !isNaN(date.getTime()) && date.toISOString().startsWith(val)
      }
      return false
    }

    function confirmarDelecao(treino) {
      treinoParaDeletar.value = treino
      dialogConfirmacao.value = true
    }

    async function deletarTreino() {
      if (!treinoParaDeletar.value) return

      try {
        // Primeiro, buscar e deletar todos os exercícios associados ao treino
        const exerciciosResponse = await treinosService.deletarExerciciosDoTreino(treinoParaDeletar.value.id_treino)
        const exerciciosDoTreino = exerciciosResponse.data

        // Deletar cada exercício associado
        for (const exercicio of exerciciosDoTreino) {
          await treinosService.deletarTreinoExercicio(exercicio.id)
        }

        // Depois, deletar o treino
        await treinosService.deletarTreino(treinoParaDeletar.value.id_treino)

        // Atualizar a lista local
        treinos.value = treinos.value.filter(t => t.id_treino !== treinoParaDeletar.value.id_treino)

        dialogConfirmacao.value = false
        treinoParaDeletar.value = null
        $q.notify({
          color: 'positive',
          message: 'Treino e exercícios associados deletados com sucesso',
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

    function abrirDialogExercicios(treino) {
      treinoSelecionado.value = treino
      dialogExercicios.value = true
    }

    return {
      treinos,
      carregando,
      dialogConfirmacao,
      treinoParaDeletar,
      dialogExercicios,
      treinoSelecionado,
      filtroNome,
      filtroData,
      filtroAluno,
      alunosOptions,
      treinosFiltrados,
      colunas,
      colunasExerciciosDetalhadas,
      carregarTreinos,
      confirmarDelecao,
      deletarTreino,
      filtrarPorData,
      isValidDateOrYear,
      getExerciciosDoTreino,
      abrirDialogExercicios
    }
  }
}
</script>
