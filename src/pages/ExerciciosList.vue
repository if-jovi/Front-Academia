<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Lista de Exercícios</h5>
      <q-btn
        color="primary"
        icon="add"
        label="Adicionar Exercício"
        @click="$router.push('/app/exercicios/adicionar')"
      />
    </div>

    <q-input
      v-model="filtro"
      label="Filtrar Exercícios"
      outlined
      clearable
      class="q-mb-md"
    />

    <q-table
      :rows="exercicios"
      :columns="colunas"
      row-key="id_exercicio"
      :filter="filtro"
      :loading="carregando"
      :pagination="{ rowsPerPage: 10 }"
      class="q-mt-md"
    >
      <template v-slot:body-cell-nome_maquina="props">
        <q-td :props="props">
          {{ getNomeMaquina(props.row.id_maquina) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            @click="$router.push(`/app/exercicios/editar/${props.row.id_exercicio}`)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="confirmarDelecao(props.row)"
          >
            <q-tooltip>Deletar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogConfirmacao">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">
            Tem certeza que deseja deletar o exercício "{{ exercicioParaDeletar?.id_exercicio }}"?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Deletar"
            color="negative"
            @click="deletarExercicio"
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
import { useExerciciosStore } from '../stores/exerciciosStore'
import maquinasService from '../api/maquinasService' // Mantemos para carregar as máquinas

export default {
  name: 'ExerciciosList',
  setup () {
    const $q = useQuasar()
    const exerciciosStore = useExerciciosStore()

    const maquinas = ref([])
    const dialogConfirmacao = ref(false)
    const exercicioParaDeletar = ref(null)
    const filtro = ref('')

    const exercicios = computed(() => exerciciosStore.exercicios)
    const carregando = computed(() => exerciciosStore.carregando)

    const colunas = [
      {
        name: 'nome_maquina',
        label: 'Máquina',
        align: 'left',
        field: 'id_maquina'
      },
      {
        name: 'grupo_muscular',
        label: 'Grupo Muscular',
        align: 'left',
        field: 'grupo_muscular',
        sortable: true
      },
      {
        name: 'equipamento_necessario',
        label: 'Equipamento Necessário',
        align: 'left',
        field: 'equipamento_necessario'
      },
      {
        name: 'actions',
        label: 'Ações',
        align: 'center'
      }
    ]

    onMounted(async () => {
      await Promise.all([
        exerciciosStore.buscarExercicios(),
        carregarMaquinas()
      ])
    })

    async function carregarMaquinas () {
      try {
        const response = await maquinasService.getListaMaquinas()
        maquinas.value = response.data
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar a lista de máquinas.',
          icon: 'report_problem'
        })
      }
    }

    function confirmarDelecao (exercicio) {
      exercicioParaDeletar.value = exercicio
      dialogConfirmacao.value = true
    }

    function getNomeMaquina (idMaquina) {
      const maquina = maquinas.value.find(m => m.id === idMaquina)
      return maquina ? maquina.nome_maquina : 'N/A'
    }

    async function deletarExercicio () {
      if (!exercicioParaDeletar.value) return

      try {
        await exerciciosStore.deletarExercicio(exercicioParaDeletar.value.id)
        dialogConfirmacao.value = false
        exercicioParaDeletar.value = null
        $q.notify({
          color: 'positive',
          message: 'Exercício deletado com sucesso',
          icon: 'check'
        })
      } catch (error) {
        console.error('Erro ao deletar exercício:', error)
        $q.notify({
          color: 'negative',
          message: exerciciosStore.erro || 'Erro ao deletar exercício',
          icon: 'report_problem'
        })
      }
    }

    return {
      exercicios,
      carregando,
      dialogConfirmacao,
      exercicioParaDeletar,
      filtro,
      colunas,
      confirmarDelecao,
      deletarExercicio,
      getNomeMaquina
    }
  }
}
</script>
