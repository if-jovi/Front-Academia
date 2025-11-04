<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Academia - Sistema de Gestão</q-toolbar-title>
        
        <q-btn flat round dense icon="person" class="q-ml-sm">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/">
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Menu Principal
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Visão Geral',
    icon: 'dashboard',
    link: '/app/dashboard'
  },
  {
    title: 'Alunos',
    caption: 'Gerenciar Alunos',
    icon: 'people',
    link: '/app/alunos'
  },
  {
    title: 'Máquinas',
    caption: 'Gerenciar Equipamentos',
    icon: 'fitness_center',
    link: '/app/maquinas'
  },
  {
    title: 'Exercícios',
    caption: 'Gerenciar Exercícios',
    icon: 'directions_run',
    link: '/app/exercicios'
  },
  {
    title: 'Treinos',
    caption: 'Gerenciar Treinos',
    icon: 'event',
    link: '/app/treinos'
  },
  {
    title: 'Relatórios',
    caption: 'Visualizar Relatórios',
    icon: 'insert_chart',
    link: '/app/relatorios'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
