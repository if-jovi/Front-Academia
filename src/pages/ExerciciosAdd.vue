<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Adicionar Novo Exercício</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/exercicios')"
      />
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarExercicio" class="q-gutter-md">
          <q-select
            v-model="exercicio.id_maquina"
            :options="opcoesMaquinas"
            option-value="id"
            option-label="nome_maquina"
            label="Máquina *"
            outlined
            emit-value
            map-options
            :rules="[val => val || 'Máquina é obrigatória']"
          />

          <q-input
            v-model="exercicio.grupo_muscular"
            label="Grupo Muscular *"
            outlined
            :rules="[val => val && val.length > 0 || 'Grupo muscular é obrigatório']"
          />

          <q-input
            v-model="exercicio.equipamento_necessario"
            label="Equipamento Necessário"
            outlined
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              @click="$router.push('/app/exercicios')"
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
import exerciciosService from '../api/exerciciosService'
import maquinasService from '../api/maquinasService'

export default {
  name: 'ExerciciosAdd',
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const carregando = ref(false)
    const opcoesMaquinas = ref([])

    const exercicio = reactive({
      id_maquina: null,
      grupo_muscular: '',
      equipamento_necessario: ''
    })

    onMounted(async () => {
      try {
        const response = await maquinasService.getListaMaquinas()
        opcoesMaquinas.value = response.data
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar lista de máquinas',
          icon: 'report_problem'
        })
      }
    })

    async function salvarExercicio() {
      carregando.value = true
      try {
        // Gerar ID único
        const novoId = Date.now()
        const exercicioParaSalvar = {
          ...exercicio,
          id_exercicio: novoId
        }

        await exerciciosService.adicionarExercicio(exercicioParaSalvar)

        $q.notify({
          color: 'positive',
          message: 'Exercício adicionado com sucesso',
          icon: 'check'
        })

        router.push('/app/exercicios')
      } catch (error) {
        console.error('Erro ao salvar exercício:', error)
        let errorMessage = 'Erro ao adicionar exercício'

        if (error.response?.status === 400) {
          errorMessage = 'Dados inválidos enviados'
        } else if (error.response?.status === 409) {
          errorMessage = 'Exercício já existe'
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
      exercicio,
      opcoesMaquinas,
      salvarExercicio
    }
  }
}
</script>
