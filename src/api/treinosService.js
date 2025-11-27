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
  // Treinos
  getListaTreinos() {
    return apiAcademia.get('/treinos')
  },
  getTreino(id) {
    return apiAcademia.get(`/treinos/${id}`)
  },
  adicionarTreino(treino) {
    return apiAcademia.post('/treinos', treino)
  },
  atualizarTreino(id, treino) {
    return apiAcademia.put(`/treinos/${id}`, treino)
  },
  deletarTreino(id) {
    return apiAcademia.delete(`/treinos/${id}`)
  },
  // Treinos-Exercícios (para cálculo da média)
  getTreinosExercicios() {
    return apiAcademia.get('/treinos_exercicios')
  }
}
