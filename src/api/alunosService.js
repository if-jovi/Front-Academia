import axios from 'axios'

const apiAcademia = axios.create({
  baseURL: 'http://localhost:3003',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export default {
  // Alunos
  getAlunos() {
    return apiAcademia.get('/alunos')
  },
  getListaAlunos() {
    return apiAcademia.get('/alunos')
  },
  getAluno(id) {
    return apiAcademia.get(`/alunos/${id}`)
  },
  adicionarAluno(aluno) {
    return apiAcademia.post('/alunos', aluno)
  },
  atualizarAluno(id, aluno) {
    return apiAcademia.put(`/alunos/${id}`, aluno)
  },
  deletarAluno(id) {
    return apiAcademia.delete(`/alunos/${id}`)
  },
  getNovosAlunos() {
    return apiAcademia.get('/alunos/novos')
  }
}
