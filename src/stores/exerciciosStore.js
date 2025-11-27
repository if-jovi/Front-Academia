import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import exerciciosService from '../api/exerciciosService'

export const useExerciciosStore = defineStore('exercicios', () => {
  const exercicios = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  // Getters
  const exerciciosAtivos = computed(() => exercicios.value) // sem filtro por status pois não existe campo status
  const totalExercicios = computed(() => exercicios.value.length)

  // Actions
  async function buscarExercicios() {
    carregando.value = true
    erro.value = null
    try {
      const response = await exerciciosService.getListaExercicios()
      exercicios.value = response.data
    } catch (error) {
      erro.value = 'Erro ao buscar exercícios'
      console.error('Erro ao buscar exercícios:', error)
      exercicios.value = []
    } finally {
      carregando.value = false
    }
  }

  async function buscarExercicioPorId(id) {
    carregando.value = true
    erro.value = null
    try {
      const response = await exerciciosService.getExercicio(id)
      return response.data
    } catch (error) {
      erro.value = 'Erro ao buscar exercício'
      console.error('Erro ao buscar exercício:', error)
      return null
    } finally {
      carregando.value = false
    }
  }

  async function adicionarExercicio(exercicio) {
    carregando.value = true
    erro.value = null
    try {
      const response = await exerciciosService.adicionarExercicio(exercicio)
      exercicios.value.push(response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Erro ao adicionar exercício'
      erro.value = errorMessage
      console.error('Erro ao adicionar exercício:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function atualizarExercicio(id, exercicioAtualizado) {
    carregando.value = true
    erro.value = null
    try {
      const response = await exerciciosService.atualizarExercicio(id, exercicioAtualizado)
      const index = exercicios.value.findIndex(exercicio => exercicio.id === id)
      if (index !== -1) {
        exercicios.value[index] = response.data
      }
      return response.data
    } catch (error) {
      erro.value = 'Erro ao atualizar exercício'
      console.error('Erro ao atualizar exercício:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function deletarExercicio(id) {
    carregando.value = true
    erro.value = null
    try {
      await exerciciosService.deletarExercicio(id)
      exercicios.value = exercicios.value.filter(exercicio => exercicio.id !== id)
    } catch (error) {
      erro.value = 'Erro ao deletar exercício'
      console.error('Erro ao deletar exercício:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  return {
    exercicios,
    carregando,
    erro,
    exerciciosAtivos,
    totalExercicios,
    buscarExercicios,
    buscarExercicioPorId,
    adicionarExercicio,
    atualizarExercicio,
    deletarExercicio
  }
})
