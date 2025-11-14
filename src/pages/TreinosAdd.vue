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
          <q-select
            v-model="treino.id_aluno"
            :options="opcoesAlunos"
            option-value="id_aluno"
            option-label="nome"
            label="Aluno *"
            outlined
            emit-value
            map-options
            :rules="[val => val || 'Aluno é obrigatório']"
          />

          <q-input
            v-model="treino.nome_treino"
            label="Nome do Treino *"
            outlined
            :rules="[val => val && val.length > 0 || 'Nome do treino é obrigatório']"
          />

          <q-input
            v-model="treino.observacoes"
            label="Observações"
            type="textarea"
            outlined
            rows="3"
          />

          <q-input
            v-model="treino.data_treino"
            label="Data do Treino *"
            type="date"
            outlined
            :rules="[val => val || 'Data do treino é obrigatória']"
          />

          <q-input
            v-model="treino.data_inicio"
            label="Horário de Início *"
            type="time"
            outlined
            :rules="[val => val || 'Horário de início é obrigatório']"
          />

          <q-input
            v-model="treino.data_fim"
            label="Horário de Fim *"
            type="time"
            outlined
            :rules="[val => val || 'Horário de fim é obrigatório']"
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
              label="Salvar"
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
    const opcoesAlunos = ref([])

    const treino = reactive({
      id_aluno: null,
      nome_treino: '',
      observacoes: '',
      data_treino: '',
      data_inicio: '',
      data_fim: ''
    })

    onMounted(async () => {
      try {
        const response = await alunosService.getListaAlunos()
        opcoesAlunos.value = response.data
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
          id_treino: novoId
        }

        await treinosService.adicionarTreino(treinoParaSalvar)

        $q.notify({
          color: 'positive',
          message: 'Treino adicionado com sucesso',
          icon: 'check'
        })

        router.push('/app/treinos')
      } catch (error) {
        console.error('Erro ao salvar treino:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao adicionar treino',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    return {
      carregando,
      treino,
      opcoesAlunos,
      salvarTreino
    }
  }
}
</script>
