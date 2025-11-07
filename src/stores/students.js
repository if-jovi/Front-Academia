import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import services from '../api/services'

export const useStudentsStore = defineStore('students', () => {
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
      const response = await services.getListaAlunos()
      alunos.value = response.data.lista
    } catch (error) {
      erro.value = 'Erro ao buscar alunos'
      console.error('Erro ao buscar alunos:', error)
    } finally {
      carregando.value = false
    }
  }

  async function buscarAlunoPorId(id) {
    carregando.value = true
    erro.value = null
    try {
      const response = await services.getAluno(id)
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
      const response = await services.adicionarAluno(aluno)
      alunos.value.push(response.data)
      return response.data
    } catch (error) {
      erro.value = 'Erro ao adicionar aluno'
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
      const response = await services.atualizarAluno(id, alunoAtualizado)
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
      await services.deletarAluno(id)
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
