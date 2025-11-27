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
  // Máquinas
  getListaMaquinas() {
    return apiAcademia.get('/maquinas')
  },
  getMaquina(id) {
    return apiAcademia.get(`/maquinas/${id}`)
  },
  adicionarMaquina(maquina) {
    // Remove any id before sending to avoid errors
    const data = { ...maquina };
    delete data.id;
    return apiAcademia.post('/maquinas', data)
  },
  atualizarMaquina(id, maquina) {
    return apiAcademia.put(`/maquinas/${id}`, maquina)
  },
  deletarMaquina(id) {
    return apiAcademia.delete(`/maquinas/${id}`)
  }
}
