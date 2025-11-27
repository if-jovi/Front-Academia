<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Adicionar Nova Máquina</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/maquinas')"
      />
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarMaquina" class="q-gutter-md">
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
import maquinasService from '../api/maquinasService'

export default {
  name: 'MaquinasAdd',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const carregando = ref(false)

    const maquina = reactive({
      nome_maquina: '',
      tipo_maquina: '',
      em_manutencao: false
    })

    const opcoesTipo = [
      'Cardio',
      'Musculação'
    ]

    const opcoesManutencao = [
      { label: 'Ativa', value: false },
      { label: 'Em Manutenção', value: true }
    ]

    async function salvarMaquina() {
      carregando.value = true
      try {
        // Gerar ID único
        const novoId = Date.now()
        const maquinaParaSalvar = {
          ...maquina,
          id: novoId
        }

        console.log('Payload a ser enviado para API:', JSON.stringify(maquinaParaSalvar, null, 2))

        await maquinasService.adicionarMaquina(maquinaParaSalvar)

        $q.notify({
          color: 'positive',
          message: 'Máquina adicionada com sucesso',
          icon: 'check'
        })

        router.push('/app/maquinas')
      } catch (error) {
        console.error('Erro ao salvar máquina:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao adicionar máquina',
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
      salvarMaquina
    }
  }
}
</script>
