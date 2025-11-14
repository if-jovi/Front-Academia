import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import alunosService from '../api/alunosService'

export const useAlunosStore = defineStore('alunos', () => {
  const alunos = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  // Getters
  const alunosAtivos = computed(() => alunos.value.filter(aluno => aluno.status === 'Ativo'))
  const totalAlunos = computed(() => alunos.value.length)

  // Actions
  async function buscarAlunos() {
    carregando.value = true
    erro.value = null
    try {
      const response = await alunosService.getListaAlunos()
      alunos.value = response.data
    } catch (error) {
      erro.value = 'Erro ao buscar alunos'
      console.error('Erro ao buscar alunos:', error)
      alunos.value = []
    } finally {
      carregando.value = false
    }
  }

  async function buscarAlunoPorId(id) {
    carregando.value = true
    erro.value = null
    try {
      const response = await alunosService.getAluno(id)
      return response.data
    } catch (error) {
      erro.value = 'Erro ao buscar aluno'
      console.error('Erro ao buscar aluno:', error)
      return null
    } finally {
      carregando.value = false
    }
  }

  async function adicionarAluno(aluno) {
    carregando.value = true
    erro.value = null
    try {
      const response = await alunosService.adicionarAluno(aluno)
      alunos.value.push(response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          'Erro ao adicionar aluno'
      erro.value = errorMessage
      console.error('Erro ao adicionar aluno:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function atualizarAluno(id, alunoAtualizado) {
    carregando.value = true
    erro.value = null
    try {
      const response = await alunosService.atualizarAluno(id, alunoAtualizado)
      const index = alunos.value.findIndex(aluno => aluno.id === id)
      if (index !== -1) {
        alunos.value[index] = response.data
      }
      return response.data
    } catch (error) {
      erro.value = 'Erro ao atualizar aluno'
      console.error('Erro ao atualizar aluno:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  async function deletarAluno(id) {
    carregando.value = true
    erro.value = null
    try {
      await alunosService.deletarAluno(id)
      alunos.value = alunos.value.filter(aluno => aluno.id !== id)
    } catch (error) {
      erro.value = 'Erro ao deletar aluno'
      console.error('Erro ao deletar aluno:', error)
      throw error
    } finally {
      carregando.value = false
    }
  }

  return {
    alunos,
    carregando,
    erro,
    alunosAtivos,
    totalAlunos,
    buscarAlunos,
    buscarAlunoPorId,
    adicionarAluno,
    atualizarAluno,
    deletarAluno
  }
})
