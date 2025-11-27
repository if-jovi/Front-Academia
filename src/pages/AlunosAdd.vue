<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Adicionar Novo Aluno</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/alunos')"
      />
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarAluno" class="q-gutter-md">
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
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import alunosService from '../api/alunosService'

export default {
  name: 'AlunosAdd',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const carregando = ref(false)

    const aluno = reactive({
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      plano: '',
      status: 'Ativo'
    })

    const opcoesPlano = [
      'Básico',
      'Premium',
      'VIP'
    ]

    const opcoesStatus = [
      'Ativo',
      'Inativo'
    ]

    async function salvarAluno() {
      carregando.value = true
      try {
        // Gerar ID único
        const novoId = Date.now()
        const alunoParaSalvar = {
          ...aluno,
          id: novoId,
          dataCadastro: new Date().toISOString().split('T')[0]
        }

        await alunosService.adicionarAluno(alunoParaSalvar)

        $q.notify({
          color: 'positive',
          message: 'Aluno adicionado com sucesso',
          icon: 'check'
        })

        router.push('/app/alunos')
      } catch (error) {
        console.error('Erro ao salvar aluno na página:', error)
        let errorMessage = 'Erro ao adicionar aluno'

        if (error.response?.status === 400) {
          errorMessage = 'Dados inválidos enviados'
        } else if (error.response?.status === 409) {
          errorMessage = 'Aluno já existe (email já cadastrado)'
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
      aluno,
      opcoesPlano,
      opcoesStatus,
      salvarAluno
    }
  }
}
</script>
