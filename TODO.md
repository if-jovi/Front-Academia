# TODO - Implementação da Rota dos Alunos com CRUD

## Passos a Executar

- [x] Modificar `src/router/routes.js` para adicionar rotas filhos sob `/app/alunos` para lista, adicionar e editar.
- [x] Criar `src/pages/AlunosPage.vue` com `<router-view />` para conteúdo aninhado.
- [x] Criar `src/stores/students.js` para gerenciar dados dos alunos (array de objetos com id, nome, email, etc.).
- [x] Criar `src/pages/AlunosList.vue` com uma tabela listando alunos e botões para adicionar, editar, deletar.
- [x] Criar `src/pages/AlunosAdd.vue` com um formulário para adicionar um novo aluno.
- [x] Criar `src/pages/AlunosEdit.vue` com um formulário para editar um aluno existente.
- [x] Atualizar `src/api/db.json` para incluir um array detalhado de alunos.
- [x] Atualizar `src/api/services.js` para incluir métodos CRUD para alunos.
- [x] Testar navegação e operações CRUD.
- [x] Garantir que o menu esquerdo permaneça visível em todas as sub-páginas.
