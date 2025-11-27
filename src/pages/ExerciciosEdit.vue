<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <h5 class="text-h5">Editar Exercício</h5>
      <q-btn
        flat
        color="grey-7"
        icon="arrow_back"
        label="Voltar"
        @click="$router.push('/app/exercicios')"
      />
    </div>

    <q-card v-if="exercicio" class="q-mt-md">
      <q-card-section>
        <q-form @submit="salvarAlteracoes" class="q-gutter-md">
          <q-select
            v-model="exercicio.id_maquina"
            :options="opcoesMaquinas"
            option-value="id_maquina"
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
      <p class="q-mt-md">Carregando dados do exercício...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useExerciciosStore } from '../stores/exerciciosStore'
import maquinasService from '../api/maquinasService'

export default {
  name: 'ExerciciosEdit',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const exerciciosStore = useExerciciosStore()

    const exercicio = ref(null)
    const opcoesMaquinas = ref([])

    const carregando = computed(() => exerciciosStore.carregando)

    onMounted(async () => {
      const id = route.params.id
      if (id) {
        await carregarExercicio(id)
        await carregarMaquinas()
      }
    })

    async function carregarMaquinas () {
      try {
        const response = await maquinasService.getListaMaquinas()
        opcoesMaquinas.value = response.data.map(m => ({ label: m.nome_maquina, value: m.id }))
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar lista de máquinas',
          icon: 'report_problem'
        })
      }
    }

    async function carregarExercicio (id) {
      const dadosExercicio = await exerciciosStore.buscarExercicioPorId(id)
      if (dadosExercicio) {
        exercicio.value = { ...dadosExercicio }
      } else {
        $q.notify({
          color: 'negative',
          message: 'Exercício não encontrado',
          icon: 'report_problem'
        })
        router.push('/app/exercicios')
      }
    }

    async function salvarAlteracoes () {
      if (!exercicio.value) return

      try {
        await exerciciosStore.atualizarExercicio(exercicio.value.id, exercicio.value)
        $q.notify({
          color: 'positive',
          message: 'Exercício atualizado com sucesso',
          icon: 'check'
        })
        router.push('/app/exercicios')
      } catch (error) {
        console.error('Erro ao salvar alterações do exercício:', error)
        $q.notify({
          color: 'negative',
          message: exerciciosStore.erro || 'Erro ao atualizar exercício',
          icon: 'report_problem'
        })
      }
    }

    return {
      carregando,
      exercicio,
      opcoesMaquinas,
      salvarAlteracoes
    }
  }
}
</script>
