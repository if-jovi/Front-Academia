<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Editar Aluno</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/alunos')"
      />
    </div>

    <q-card v-if="aluno" class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarAlteracoes" class="q-gutter-md">
          <q-input
            v-model="aluno.nome"
            label="Nome Completo *"
            outlined
            :rules="[val => val && val.length > 0 || 'Nome é obrigatório']"
          />

          <q-input
            v-model="aluno.email"
            label="Email *"
            type="email"
            outlined
            :rules="[
              val => val && val.length > 0 || 'Email é obrigatório',
              val => /.+@.+\..+/.test(val) || 'Email inválido'
            ]"
          />

          <q-input
            v-model="aluno.telefone"
            label="Telefone"
            outlined
            mask="(##) #####-####"
          />

          <q-input
            v-model="aluno.dataNascimento"
            label="Data de Nascimento"
            type="date"
            outlined
          />

          <q-select
            v-model="aluno.plano"
            :options="opcoesPlano"
            label="Plano *"
            outlined
            emit-value
            map-options
            :rules="[val => val && val.length > 0 || 'Plano é obrigatório']"
          />

          <q-select
            v-model="aluno.status"
            :options="opcoesStatus"
            label="Status *"
            outlined
            emit-value
            map-options
            :rules="[val => val && val.length > 0 || 'Status é obrigatório']"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              @click="$router.push('/app/alunos')"
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
      <p class="q-mt-md">Carregando dados do aluno...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import alunosService from '../api/alunosService'

export default {
  name: 'AlunosEdit',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const carregando = ref(false)
    const aluno = ref(null)

    const opcoesPlano = [
      'Básico',
      'Premium',
      'VIP'
    ]

    const opcoesStatus = [
      'Ativo',
      'Inativo'
    ]

    onMounted(async () => {
      const id = route.params.id
      if (id) {
        await carregarAluno(id)
      }
    })

    async function carregarAluno(id) {
      carregando.value = true
      try {
        const dadosAluno = await alunosService.getAluno(id)
        if (dadosAluno) {
          // Normalizar dados: mapear snake_case para camelCase e definir padrões
          aluno.value = {
            id: dadosAluno.id,
            nome: dadosAluno.nome || '',
            email: dadosAluno.email || '',
            telefone: dadosAluno.telefone || '',
            dataNascimento: dadosAluno.dataNascimento || dadosAluno.data_nascimento || '',
            plano: dadosAluno.plano || 'Básico',
            status: dadosAluno.status || 'Ativo'
          }
        } else {
          $q.notify({
            color: 'negative',
            message: 'Aluno não encontrado',
            icon: 'report_problem'
          })
          router.push('/app/alunos')
        }
      } catch {
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar dados do aluno',
          icon: 'report_problem'
        })
        router.push('/app/alunos')
      } finally {
        carregando.value = false
      }
    }

    async function salvarAlteracoes() {
      if (!aluno.value) return

      carregando.value = true
      try {
        await alunosService.atualizarAluno(route.params.id, aluno.value)

        $q.notify({
          color: 'positive',
          message: 'Aluno atualizado com sucesso',
          icon: 'check'
        })

        router.push('/app/alunos')
      } catch (error) {
        console.error('Erro ao salvar alterações do aluno na página:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao atualizar aluno',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    return {
      carregando,
      aluno,
      opcoesPlano,
      opcoesStatus,
      carregarAluno,
      salvarAlteracoes
    }
  }
}
</script>
