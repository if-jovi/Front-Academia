<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Editar Treino</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/treinos')"
      />
    </div>

    <q-card v-if="treino" class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarAlteracoes" class="q-gutter-md">
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
              label="Salvar Alterações"
              color="primary"
              :loading="carregando"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <div v-else class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-md">Carregando dados do treino...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import treinosService from '../api/treinosService'
import alunosService from '../api/alunosService'

export default {
  name: 'TreinosEdit',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const carregando = ref(false)
    const treino = ref(null)
    const opcoesAlunos = ref([])

    onMounted(async () => {
      const id = route.params.id
      if (id) {
        await carregarTreino(id)
        await carregarAlunos()
      }
    })

    async function carregarAlunos() {
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
    }

    async function carregarTreino(id) {
      carregando.value = true
      try {
        const dadosTreino = await treinosService.getTreino(id)
        if (dadosTreino) {
          treino.value = { ...dadosTreino }
        } else {
          $q.notify({
            color: 'negative',
            message: 'Treino não encontrado',
            icon: 'report_problem'
          })
          router.push('/app/treinos')
        }
      } catch {
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar dados do treino',
          icon: 'report_problem'
        })
        router.push('/app/treinos')
      } finally {
        carregando.value = false
      }
    }

    async function salvarAlteracoes() {
      if (!treino.value) return

      carregando.value = true
      try {
        await treinosService.atualizarTreino(treino.value.id_treino, treino.value)

        $q.notify({
          color: 'positive',
          message: 'Treino atualizado com sucesso',
          icon: 'check'
        })

        router.push('/app/treinos')
      } catch (error) {
        console.error('Erro ao salvar alterações do treino:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao atualizar treino',
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
      carregarTreino,
      salvarAlteracoes
    }
  }
}
</script>
