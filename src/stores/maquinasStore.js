import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import maquinasService from '../api/maquinasService'

export const useMaquinasStore = defineStore('maquinas', () => {
  const maquinas = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  // Getters
  const maquinasAtivas = computed(() => maquinas.value.filter(maquina => maquina.status === 'Ativa'))
  const totalMaquinas = computed(() => maquinas.value.length)

  // Actions
  async function buscarMaquinas() {
    carregando.value = true
    erro.value = null
    try {
      const response = await maquinasService.getListaMaquinas()
      maquinas.value = response.data
    } catch (error) {
      erro.value = 'Erro ao buscar máquinas'
      console.error('Erro ao buscar máquinas:', error)
      maquinas.value = []
    } finally {
      carregando.value = false
    }
  }

  async function buscarMaquinaPorId(id) {
    carregando.value = true
    erro.value = null
    try {
      const response = await maquinasService.getMaquina(id)
      return response.data
    } catch (error) {
      erro.value = 'Erro ao buscar máquina'
      console.error('Erro ao buscar máquina:', error)
      return null
    } finally {
      carregando.value = false
    }
  }

  async function adicionarMaquina(maquina) {
    carregando.value = true
    erro.value = null
    try {
      const response = await maquinasService.adicionarMaquina(maquina)
      maquinas.value.push(response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Erro ao adicionar máquina'
      erro.value = errorMessage
      console.error('Erro ao adicionar máquina:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function atualizarMaquina(id, maquinaAtualizada) {
    carregando.value = true
    erro.value = null
    try {
      const response = await maquinasService.atualizarMaquina(id, maquinaAtualizada)
      const index = maquinas.value.findIndex(maquina => maquina.id === id)
      if (index !== -1) {
        maquinas.value[index] = response.data
      }
      return response.data
    } catch (error) {
      erro.value = 'Erro ao atualizar máquina'
      console.error('Erro ao atualizar máquina:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function deletarMaquina(id) {
    carregando.value = true
    erro.value = null
    try {
      await maquinasService.deletarMaquina(id)
      maquinas.value = maquinas.value.filter(maquina => maquina.id !== id)
    } catch (error) {
      erro.value = 'Erro ao deletar máquina'
      console.error('Erro ao deletar máquina:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  return {
    maquinas,
    carregando,
    erro,
    maquinasAtivas,
    totalMaquinas,
    buscarMaquinas,
    buscarMaquinaPorId,
    adicionarMaquina,
    atualizarMaquina,
    deletarMaquina
  }
})
