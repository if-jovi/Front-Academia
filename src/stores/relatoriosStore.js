import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import relatoriosService from '../api/relatoriosService'

export const useRelatoriosStore = defineStore('relatorios', () => {
  const relatorios = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  // Getters
  const relatoriosAtivos = computed(() => relatorios.value.filter(relatorio => relatorio.status === 'Ativo'))
  const totalRelatorios = computed(() => relatorios.value.length)

  // Actions
  async function buscarRelatorios() {
    carregando.value = true
    erro.value = null
    try {
      const response = await relatoriosService.getListaRelatorios()
      relatorios.value = response.data
    } catch (error) {
      erro.value = 'Erro ao buscar relatórios'
      console.error('Erro ao buscar relatórios:', error)
      relatorios.value = []
    } finally {
      carregando.value = false
    }
  }

  async function buscarRelatorioPorId(id) {
    carregando.value = true
    erro.value = null
    try {
      const response = await relatoriosService.getRelatorio(id)
      return response.data
    } catch (error) {
      erro.value = 'Erro ao buscar relatório'
      console.error('Erro ao buscar relatório:', error)
      return null
    } finally {
      carregando.value = false
    }
  }

  async function adicionarRelatorio(relatorio) {
    carregando.value = true
    erro.value = null
    try {
      const response = await relatoriosService.adicionarRelatorio(relatorio)
      relatorios.value.push(response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Erro ao adicionar relatório'
      erro.value = errorMessage
      console.error('Erro ao adicionar relatório:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function atualizarRelatorio(id, relatorioAtualizado) {
    carregando.value = true
    erro.value = null
    try {
      const response = await relatoriosService.atualizarRelatorio(id, relatorioAtualizado)
      const index = relatorios.value.findIndex(relatorio => relatorio.id === id)
      if (index !== -1) {
        relatorios.value[index] = response.data
      }
      return response.data
    } catch (error) {
      erro.value = 'Erro ao atualizar relatório'
      console.error('Erro ao atualizar relatório:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function deletarRelatorio(id) {
    carregando.value = true
    erro.value = null
    try {
      await relatoriosService.deletarRelatorio(id)
      relatorios.value = relatorios.value.filter(relatorio => relatorio.id !== id)
    } catch (error) {
      erro.value = 'Erro ao deletar relatório'
      console.error('Erro ao deletar relatório:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  return {
    relatorios,
    carregando,
    erro,
    relatoriosAtivos,
    totalRelatorios,
    buscarRelatorios,
    buscarRelatorioPorId,
    adicionarRelatorio,
    atualizarRelatorio,
    deletarRelatorio
  }
})
