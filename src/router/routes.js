const routes = [
 
  { path: '/', component: () => import('pages/LoginPage.vue') },

  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/app/dashboard' }, // Redireciona para o caminho completo
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      {
        path: 'alunos',
        component: () => import('pages/AlunosPage.vue'),
        children: [
          { path: '', name: 'alunos-lista', component: () => import('pages/AlunosList.vue') },
          { path: 'adicionar', name: 'alunos-adicionar', component: () => import('pages/AlunosAdd.vue') },
          { path: 'editar/:id', name: 'alunos-editar', component: () => import('pages/AlunosEdit.vue') }
        ]
      },
      {
        path: 'treinos',
        component: () => import('pages/TreinosPage.vue'),
        children: [
          { path: '', name: 'treinos-lista', component: () => import('pages/TreinosList.vue') },
          { path: 'adicionar', name: 'treinos-adicionar', component: () => import('pages/TreinosAdd.vue') },
          { path: 'editar/:id', name: 'treinos-editar', component: () => import('pages/TreinosEdit.vue') }
        ]
      },
      {
        path: 'maquinas',
        component: () => import('pages/MaquinasPage.vue'),
        children: [
          { path: '', name: 'maquinas-lista', component: () => import('pages/MaquinasList.vue') },
          { path: 'adicionar', name: 'maquinas-adicionar', component: () => import('pages/MaquinasAdd.vue') },
          { path: 'editar/:id', name: 'maquinas-editar', component: () => import('pages/MaquinasEdit.vue') }
        ]
      },
      {
        path: 'exercicios',
        component: () => import('pages/ExerciciosPage.vue'),
        children: [
          { path: '', name: 'exercicios-lista', component: () => import('pages/ExerciciosList.vue') },
          { path: 'adicionar', name: 'exercicios-adicionar', component: () => import('pages/ExerciciosAdd.vue') },
          { path: 'editar/:id', name: 'exercicios-editar', component: () => import('pages/ExerciciosEdit.vue') }
        ]
      },
      {
        path: 'relatorios',
        name: 'relatorios',
        component: () => import('pages/RelatoriosPage.vue')
      }
    ]
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
  ]

  export default routes
