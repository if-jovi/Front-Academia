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
      }
    ]
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
  ]

  export default routes
