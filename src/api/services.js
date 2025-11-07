import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export default {
  // Treinos
  getTreinos() {
    return apiClient.get('/treinos')
  },

  // Equipamentos
  getEquipamentos() {
    return apiClient.get('/equipamentos')
  },
  getManutencoes() {
    return apiClient.get('/equipamentos/manutencoes')
  },

  // Alunos
  getAlunos() {
    return apiClient.get('/alunos')
  },
  getListaAlunos() {
    return apiClient.get('/alunos')
  },
  getAluno(id) {
    return apiClient.get(`/alunos/${id}`)
  },
  adicionarAluno(aluno) {
    return apiClient.post('/alunos', aluno)
  },
  atualizarAluno(id, aluno) {
    return apiClient.put(`/alunos/${id}`, aluno)
  },
  deletarAluno(id) {
    return apiClient.delete(`/alunos/${id}`)
  },
  getNovosAlunos() {
    return apiClient.get('/alunos/novos')
  },

  // Frequência
  getFrequencia() {
    return apiClient.get('/frequencia')
  },

  // Instrutores
  getInstrutores() {
    return apiClient.get('/instrutores')
  }
}