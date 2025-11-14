<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none text-weight-bold text-primary">Relatórios</h4>
        <p class="text-grey-7 q-mt-sm">Visualize e analise os dados da academia</p>
      </div>
      <q-btn
        color="primary"
        icon="refresh"
        label="Atualizar"
        @click="carregarRelatorios"
        :loading="carregando"
        unelevated
        class="q-px-lg"
      />
    </div>

    <div class="row q-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="relatorio in relatorios" :key="relatorio.id">
        <q-card class="relatorio-card cursor-pointer" @click="abrirRelatorio(relatorio)">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-medium">{{ relatorio.titulo }}</div>
            <q-space />
            <q-badge :color="getStatusColor(relatorio.status)" :label="relatorio.status" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-caption text-grey-7 q-mb-sm">{{ relatorio.tipo }}</div>
            <div class="text-body2">{{ relatorio.conteudo }}</div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Período: {{ relatorio.periodo }}
            </div>
            <div class="text-caption text-grey-6">
              Criado em: {{ formatarData(relatorio.dataCriacao) }}
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-md">
            <q-btn flat dense color="primary" icon="visibility" label="Visualizar" />
            <q-btn flat dense color="secondary" icon="download" label="Exportar" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Modal de Visualização do Relatório -->
    <q-dialog v-model="dialogRelatorio" maximized>
      <q-card class="relatorio-modal">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h5 text-weight-bold">{{ relatorioSelecionado?.titulo }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-gutter-md q-mb-md">
            <q-chip color="primary" text-color="white" icon="category">
              {{ relatorioSelecionado?.tipo }}
            </q-chip>
            <q-chip :color="getStatusColor(relatorioSelecionado?.status)" text-color="white">
              {{ relatorioSelecionado?.status }}
            </q-chip>
          </div>

          <div class="text-body1 q-mb-md">
            <strong>Período:</strong> {{ relatorioSelecionado?.periodo }}
          </div>

          <div class="text-body1">
            <strong>Conteúdo:</strong>
          </div>
          <div class="relatorio-conteudo q-pa-md q-mt-sm bg-grey-1 rounded-borders">
            {{ relatorioSelecionado?.conteudo }}
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Fechar" v-close-popup />
          <q-btn color="primary" label="Exportar PDF" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import relatoriosService from '../api/relatoriosService'

export default {
  name: 'RelatoriosPage',
  setup() {
    const $q = useQuasar()

    const relatorios = ref([])
    const carregando = ref(false)
    const dialogRelatorio = ref(false)
    const relatorioSelecionado = ref(null)

    onMounted(() => {
      carregarRelatorios()
    })

    async function carregarRelatorios() {
      carregando.value = true
      try {
        const response = await relatoriosService.getListaRelatorios()
        relatorios.value = response.data
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error)
        $q.notify({
          color: 'negative',
          message: 'Erro ao carregar relatórios',
          icon: 'report_problem'
        })
      } finally {
        carregando.value = false
      }
    }

    function getStatusColor(status) {
      switch (status) {
        case 'Ativo':
          return 'positive'
        case 'Inativo':
          return 'negative'
        default:
          return 'grey'
      }
    }

    function formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR')
    }

    function abrirRelatorio(relatorio) {
      relatorioSelecionado.value = relatorio
      dialogRelatorio.value = true
    }

    return {
      relatorios,
      carregando,
      dialogRelatorio,
      relatorioSelecionado,
      carregarRelatorios,
      getStatusColor,
      formatarData,
      abrirRelatorio
    }
  }
}
</script>

<style scoped>
.relatorio-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.relatorio-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.relatorio-modal {
  min-height: 80vh;
}

.relatorio-conteudo {
  min-height: 200px;
  white-space: pre-wrap;
}
</style>
