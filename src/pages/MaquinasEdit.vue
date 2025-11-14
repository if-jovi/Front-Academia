<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Editar Máquina</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/maquinas')"
      />
    </div>

    <q-card v-if="maquina" class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarAlteracoes" class="q-gutter-md">
          <q-input
            v-model="maquina.nome_maquina"
            label="Nome da Máquina *"
            outlined
            :rules="[val => val && val.length > 0 || 'Nome da máquina é obrigatório']"
          />

          <q-select
            v-model="maquina.tipo_maquina"
            :options="opcoesTipo"
            label="Tipo da Máquina *"
            outlined
            emit-value
            map-options
            :rules="[val => val && val.length > 0 || 'Tipo da máquina é obrigatório']"
          />

          <q-select
            v-model="maquina.em_manutencao"
            :options="opcoesManutencao"
            option-value="value"
            option-label="label"
            label="Status de Manutenção *"
            outlined
            emit-value
            map-options
            :rules="[val => val !== null || 'Status de manutenção é obrigatório']"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              @click="$router.push('/app/maquinas')"
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
      <p class="q-mt-md">Carregando dados da máquina...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import maquinasService from '../api/maquinasService'

export default {
  name: 'MaquinasEdit',
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const carregando = ref(false)
    const maquina = ref(null)

    const opcoesTipo = [
      'Cardio',
      'Musculação'
    ]

    const opcoesManutencao = [
      { label: 'Ativa', value: false },
      { label: 'Em Manutenção', value: true }
    ]

    onMounted(async () => {
      const id = route.params.id
      if (id) {
        await carregarMaquina(id)
      }
    })

    async function carregarMaquina(id) {
      carregando.value = true
      try {
        const dadosMaquina = await maquinasService.getMaquina(id)
        if (dadosMaquina) {
          maquina.value = { ...dadosMaquina }
        } else {
          $q.notify({
            color: 'negative',
            message: 'Máquina não encontrada',
            icon: 'report_problem'
          })
          router.push('/app/maquinas')
        }
      } catch {
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar dados da máquina',
          icon: 'report_problem'
        })
        router.push('/app/maquinas')
      } finally {
        carregando.value = false
      }
    }

    async function salvarAlteracoes() {
      if (!maquina.value) return

      carregando.value = true
      try {
        await maquinasService.atualizarMaquina(maquina.value.id_maquina, maquina.value)

        $q.notify({
          color: 'positive',
          message: 'Máquina atualizada com sucesso',
          icon: 'check'
        })

        router.push('/app/maquinas')
      } catch (error) {
        console.error('Erro ao salvar alterações da máquina:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao atualizar máquina',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    return {
      carregando,
      maquina,
      opcoesTipo,
      opcoesManutencao,
      carregarMaquina,
      salvarAlteracoes
    }
  }
}
</script>
