<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Adicionar Novo Treino</h5>
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
        <q-form @submit="salvarTreino" class="q-gutter-md">
          <q-input
            v-model="treino.nome_treino"
            label="Nome do Treino *"
            outlined
            :rules="[val => val && val.length > 0 || 'Nome do treino é obrigatório']"
          />

          <q-select
            v-model="treino.id_aluno"
            :options="alunosOptions"
            option-value="id"
            option-label="nome"
            label="Aluno *"
            outlined
            emit-value
            map-options
            :rules="[val => val || 'Aluno é obrigatório']"
          />

          <q-input
            v-model="treino.data_treino"
            label="Data do Treino *"
            type="date"
            outlined
            :rules="[val => val && val.length > 0 || 'Data do treino é obrigatória']"
          />

          <div class="row q-gutter-md">
            <q-input
              v-model="treino.data_inicio"
              label="Horário de Início *"
              type="time"
              outlined
              class="col-6"
              :rules="[val => val && val.length > 0 || 'Horário de início é obrigatório']"
            />

            <q-input
              v-model="treino.data_fim"
              label="Horário de Fim *"
              type="time"
              outlined
              class="col-6"
              :rules="[val => val && val.length > 0 || 'Horário de fim é obrigatório']"
            />
          </div>

          <q-input
            v-model="treino.observacoes"
            label="Observações"
            type="textarea"
            outlined
            rows="3"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              @click="$router.push('/app/treinos')"
            />
            <q-btn
              type="submit"
              label="Salvar Treino"
              color="primary"
              :loading="carregando"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import treinosService from '../api/treinosService'
import alunosService from '../api/alunosService'

export default {
  name: 'TreinosAdd',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const carregando = ref(false)
    const alunosOptions = ref([])

    const treino = reactive({
      nome_treino: '',
      id_aluno: null,
      data_treino: '',
      data_inicio: '',
      data_fim: '',
      observacoes: ''
    })

    onMounted(async () => {
      try {
        const response = await alunosService.getListaAlunos()
        alunosOptions.value = response.data
      } catch (error) {
        console.error('Erro ao carregar alunos:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar lista de alunos',
          icon: 'report_problem'
        })
      }
    })

    async function salvarTreino() {
      carregando.value = true
      try {
        // Gerar ID único
        const novoId = Date.now()
        const treinoParaSalvar = {
          ...treino,
          id: novoId,
          id_treino: novoId
        }

        await treinosService.adicionarTreino(treinoParaSalvar)

        $q.notify({
          color: 'positive',
          message: 'Treino adicionado com sucesso',
          icon: 'check'
        })

        // Após salvar, navegar para a tela de seleção de exercícios
        router.push(`/app/treinos/${novoId}/exercicios`)
      } catch (error) {
        console.error('Erro ao salvar treino:', error)
        let errorMessage = 'Erro ao adicionar treino'

        if (error.response?.status === 400) {
          errorMessage = 'Dados inválidos enviados'
        } else if (error.response?.status === 409) {
          errorMessage = 'Treino já existe'
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.message) {
          errorMessage = error.message
        }

        $q.notify({
          color: 'negative',
          message: errorMessage,
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    return {
      carregando,
      treino,
      alunosOptions,
      salvarTreino
    }
  }
}
</script>
