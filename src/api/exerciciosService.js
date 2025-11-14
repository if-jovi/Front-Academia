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
  // Exercícios
  getListaExercicios() {
    return apiAcademia.get('/exercicios')
  },
  getExercicio(id) {
    return apiAcademia.get(`/exercicios/${id}`)
  },
  adicionarExercicio(exercicio) {
    return apiAcademia.post('/exercicios', exercicio)
  },
  atualizarExercicio(id, exercicio) {
    return apiAcademia.put(`/exercicios/${id}`, exercicio)
  },
  deletarExercicio(id) {
    return apiAcademia.delete(`/exercicios/${id}`)
  }
}
