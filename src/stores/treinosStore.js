import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import treinosService from '../api/treinosService'

export const useTreinosStore = defineStore('treinos', () => {
  const treinos = ref([])
  const treinosExercicios = ref([]) // Novo estado
  const carregando = ref(false)
  const erro = ref(null)

  // Getters
  const treinosAtivos = computed(() => treinos.value) // Sem filtro por status, pois treinos não têm campo status
  const totalTreinos = computed(() => treinos.value.length)
  const totalTreinosExercicios = computed(() => treinosExercicios.value.length)

  // Actions
  async function buscarTreinos() {
    carregando.value = true
    erro.value = null
    try {
      const [treinosRes, treinosExerciciosRes] = await Promise.all([
        treinosService.getListaTreinos(),
        treinosService.getTreinosExercicios()
      ])
      treinos.value = treinosRes.data
      treinosExercicios.value = treinosExerciciosRes.data
    } catch (error) {
      erro.value = 'Erro ao buscar dados de treinos'
      console.error('Erro ao buscar dados de treinos:', error)
      treinos.value = []
      treinosExercicios.value = []
    } finally {
      carregando.value = false
    }
  }

  async function buscarTreinoPorId(id) {
    carregando.value = true
    erro.value = null
    try {
      const response = await treinosService.getTreino(id)
      return response.data
    } catch (error) {
      erro.value = 'Erro ao buscar treino'
      console.error('Erro ao buscar treino:', error)
      return null
    } finally {
      carregando.value = false
    }
  }

  async function adicionarTreino(treino) {
    carregando.value = true
    erro.value = null
    try {
      const response = await treinosService.adicionarTreino(treino)
      treinos.value.push(response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Erro ao adicionar treino'
      erro.value = errorMessage
      console.error('Erro ao adicionar treino:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function atualizarTreino(id, treinoAtualizado) {
    carregando.value = true
    erro.value = null
    try {
      const response = await treinosService.atualizarTreino(id, treinoAtualizado)
      const index = treinos.value.findIndex(treino => treino.id === id)
      if (index !== -1) {
        treinos.value[index] = response.data
      }
      return response.data
    } catch (error) {
      erro.value = 'Erro ao atualizar treino'
      console.error('Erro ao atualizar treino:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function deletarTreino(id) {
    carregando.value = true
    erro.value = null
    try {
      await treinosService.deletarTreino(id)
      treinos.value = treinos.value.filter(treino => treino.id !== id)
    } catch (error) {
      erro.value = 'Erro ao deletar treino'
      console.error('Erro ao deletar treino:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  return {
    treinos,
    treinosExercicios,
    carregando,
    erro,
    treinosAtivos,
    totalTreinos,
    totalTreinosExercicios,
    buscarTreinos,
    buscarTreinoPorId,
    adicionarTreino,
    atualizarTreino,
    deletarTreino
  }
})
