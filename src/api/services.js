import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3003'
})

// Serviços para o Dashboard
export default {
  // Dados dos treinos
  async getTreinos() {
    try {
      const response = await api.get('/treinos')
      const treinos = response.data

      // Processa dados para o gráfico semanal
      const agendados = { Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sab: 0, Dom: 0 }
      const realizados = { Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sab: 0, Dom: 0 }

      treinos.forEach(treino => {
        const dia = new Date(treino.data_treino).toLocaleDateString('pt-BR', { weekday: 'short' })
        const diaKey = dia.charAt(0).toUpperCase() + dia.slice(1, 3)

        if (diaKey in agendados) {
          agendados[diaKey]++
          // Simula que 80% dos treinos foram realizados
          if (Math.random() > 0.2) realizados[diaKey]++
        }
      })

      return {
        data: {
          agendados,
          realizados
        }
      }
    } catch (error) {
      console.error('Erro ao buscar treinos:', error)
      throw error
    }
  },

  // Dados dos equipamentos
  async getEquipamentos() {
    try {
      const response = await api.get('/maquinas')
      const maquinas = response.data

      const status = {
        ativas: 0,
        manutencao: 0,
        reservadas: 0
      }

      maquinas.forEach(maquina => {
        if (maquina.em_manutencao) {
          status.manutencao++
        } else {
          status.ativas++
        }
      })

      return {
        data: {
          status
        }
      }
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error)
      throw error
    }
  },

  // Dados dos alunos
  async getAlunos() {
    try {
      const response = await api.get('/alunos')
      const alunos = response.data

      const total = alunos.length
      const ativos = alunos.filter(aluno => aluno.ativo).length

      // Novos alunos por mês (últimos 6 meses)
      const novos = {}
      const hoje = new Date()
      for (let i = 5; i >= 0; i--) {
        const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
        const chave = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`
        novos[chave] = 0
      }

      alunos.forEach(aluno => {
        const dataCadastro = new Date(aluno.data_cadastro)
        const chave = `${dataCadastro.getFullYear()}-${String(dataCadastro.getMonth() + 1).padStart(2, '0')}`
        if (chave in novos) {
          novos[chave]++
        }
      })

      return {
        data: {
          total,
          ativos,
          novos
        }
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error)
      throw error
    }
  },

  // Dados de frequência
  async getFrequencia() {
    try {
      // Simula dados de frequência por horário
      const horarios = {
        '6h': 2,
        '8h': 15,
        '10h': 8,
        '12h': 5,
        '14h': 12,
        '16h': 18,
        '18h': 25,
        '20h': 22,
        '22h': 3
      }

      return {
        data: {
          horarios
        }
      }
    } catch (error) {
      console.error('Erro ao buscar frequência:', error)
      throw error
    }
  }
}
