<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Lista de Alunos</h5>
      <q-btn
        color="primary"
        icon="add"
        label="Adicionar Aluno"
        @click="$router.push('/app/alunos/adicionar')"
      />
    </div>

    <q-table
      :rows="alunos"
      :columns="colunas"
      row-key="id"
      :loading="carregando"
      :pagination="{ rowsPerPage: 10 }"
      class="q-mt-md"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            @click="$router.push(`/app/alunos/editar/${props.row.id}`)"
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
            Tem certeza que deseja deletar o aluno "{{ alunoParaDeletar?.nome }}"?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Deletar"
            color="negative"
            @click="deletarAluno"
            :loading="carregando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentsStore } from '../stores/students'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const studentsStore = useStudentsStore()

const alunos = ref([])
const carregando = ref(false)
const dialogConfirmacao = ref(false)
const alunoParaDeletar = ref(null)

const colunas = [
  {
    name: 'nome',
    required: true,
    label: 'Nome',
    align: 'left',
    field: 'nome',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'telefone',
    label: 'Telefone',
    align: 'left',
    field: 'telefone'
  },
  {
    name: 'plano',
    label: 'Plano',
    align: 'left',
    field: 'plano'
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: 'status'
  },
  {
    name: 'actions',
    label: 'Ações',
    align: 'center'
  }
]

onMounted(async () => {
  await carregarAlunos()
})

async function carregarAlunos() {
  carregando.value = true
  try {
    await studentsStore.buscarAlunos()
    alunos.value = studentsStore.alunos
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar alunos',
      icon: 'report_problem'
    })
  } finally {
    carregando.value = false
  }
}

function confirmarDelecao(aluno) {
  alunoParaDeletar.value = aluno
  dialogConfirmacao.value = true
}

async function deletarAluno() {
  if (!alunoParaDeletar.value) return

  try {
    await studentsStore.deletarAluno(alunoParaDeletar.value.id)
    dialogConfirmacao.value = false
    alunoParaDeletar.value = null
    $q.notify({
      color: 'positive',
      message: 'Aluno deletado com sucesso',
      icon: 'check'
    })
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Erro ao deletar aluno',
      icon: 'report_problem'
    })
  }
}
</script>
