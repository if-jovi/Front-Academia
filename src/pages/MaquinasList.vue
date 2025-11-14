<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Lista de Máquinas</h5>
      <q-btn
        color="primary"
        icon="add"
        label="Adicionar Máquina"
        @click="$router.push('/app/maquinas/adicionar')"
      />
    </div>

    <q-input
      v-model="filtro"
      label="Filtrar Máquinas"
      outlined
      clearable
      class="q-mb-md"
    />

    <q-table
      :rows="maquinas"
      :columns="colunas"
      row-key="id_maquina"
      :filter="filtro"
      :loading="carregando"
      :pagination="{ rowsPerPage: 10 }"
      class="q-mt-md"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.em_manutencao ? 'negative' : 'positive'"
            text-color="white"
            :label="props.row.em_manutencao ? 'Em Manutenção' : 'Disponível'"
            size="sm"
          />
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
            @click="$router.push(`/app/maquinas/editar/${props.row.id_maquina}`)"
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
            Tem certeza que deseja deletar a máquina "{{ maquinaParaDeletar?.nome_maquina }}"?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Deletar"
            color="negative"
            @click="deletarMaquina"
            :loading="carregando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import maquinasService from '../api/maquinasService'

export default {
  name: 'MaquinasList',
  setup() {
    const $q = useQuasar()

    const maquinas = ref([])
    const carregando = ref(false)
    const erro = ref(null)
    const dialogConfirmacao = ref(false)
    const maquinaParaDeletar = ref(null)
    const filtro = ref('')

    const colunas = [
      {
        name: 'nome_maquina',
        required: true,
        label: 'Nome da Máquina',
        align: 'left',
        field: 'nome_maquina',
        sortable: true
      },
      {
        name: 'tipo_maquina',
        label: 'Tipo',
        align: 'left',
        field: 'tipo_maquina',
        sortable: true
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'em_manutencao'
      },
      {
        name: 'actions',
        label: 'Ações',
        align: 'center'
      }
    ]

    onMounted(async () => {
      await carregarMaquinas()
    })

    async function carregarMaquinas() {
      carregando.value = true
      try {
        const response = await maquinasService.getListaMaquinas()
        maquinas.value = response.data
      } catch (error) {
        erro.value = 'Erro ao buscar máquinas'
        console.error('Erro ao buscar máquinas:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar máquinas',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    function confirmarDelecao(maquina) {
      maquinaParaDeletar.value = maquina
      dialogConfirmacao.value = true
    }

    async function deletarMaquina() {
      if (!maquinaParaDeletar.value) return

      try {
        await maquinasService.deletarMaquina(maquinaParaDeletar.value.id_maquina)
        maquinas.value = maquinas.value.filter(m => m.id_maquina !== maquinaParaDeletar.value.id_maquina)
        dialogConfirmacao.value = false
        maquinaParaDeletar.value = null
        $q.notify({
          color: 'positive',
          message: 'Máquina deletada com sucesso',
          icon: 'check'
        })
      } catch (error) {
        console.error('Erro ao deletar máquina:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao deletar máquina',
          icon: 'report_problem'
        })
      }
    }

    return {
      maquinas,
      carregando,
      dialogConfirmacao,
      maquinaParaDeletar,
      filtro,
      colunas,
      carregarMaquinas,
      confirmarDelecao,
      deletarMaquina
    }
  }
}
</script>
