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
  // Relatórios
  getListaRelatorios() {
    return apiAcademia.get('/relatorios')
  },
  getRelatorio(id) {
    return apiAcademia.get(`/relatorios/${id}`)
  },
  adicionarRelatorio(relatorio) {
    return apiAcademia.post('/relatorios', relatorio)
  },
  atualizarRelatorio(id, relatorio) {
    return apiAcademia.put(`/relatorios/${id}`, relatorio)
  },
  deletarRelatorio(id) {
    return apiAcademia.delete(`/relatorios/${id}`)
  }
}
