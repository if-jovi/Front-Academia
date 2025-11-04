const routes = [
 
  { path: '/', component: () => import('pages/LoginPage.vue') },

  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/app/dashboard' }, // Redireciona para o caminho completo
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/DashboardPage.vue') }
    ]
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
  ]

  export default routes
