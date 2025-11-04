<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Dashboard</div>
    
    <!-- Cards com informações principais -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-subtitle2">Total de Alunos</div>
            <div class="text-h4">250</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-subtitle2">Ativos Hoje</div>
            <div class="text-h4">45</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-subtitle2">Aulas Hoje</div>
            <div class="text-h4">8</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-subtitle2">Novos este mês</div>
            <div class="text-h4">28</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Sem lógica complexa por enquanto
</script>

<style scoped>
.q-card {
  height: 100%;
}
</style>
