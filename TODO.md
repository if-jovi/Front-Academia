# Remover ControllerAlunos e Integrar Lógica Diretamente nas Páginas

## Passos para Remoção do Controller

- [ ] Editar AlunosList.vue: Remover import do useStudentsController, adicionar import do alunosService, gerenciar estado local (alunos, carregando, erro), substituir chamadas do store por chamadas diretas ao serviço.
- [ ] Editar AlunosAdd.vue: Remover import do useStudentsController, adicionar import do alunosService, gerenciar estado local, substituir adicionarAluno por chamada direta ao serviço.
- [ ] Editar AlunosEdit.vue: Remover import do useStudentsController, adicionar import do alunosService, gerenciar estado local, substituir buscarAlunoPorId e atualizarAluno por chamadas diretas ao serviço.
- [ ] Deletar arquivo ControllerAlunos.js.
- [ ] Testar as páginas para garantir que listagem, adição, edição e deleção funcionem corretamente.

## Motivo da Mudança
- Simplificar a arquitetura removendo uma camada intermediária (store) quando o estado não precisa ser compartilhado globalmente.
- Cada página gerencia seu próprio estado local, chamando diretamente o alunosService.
- Melhor para projetos pequenos onde o estado dos alunos não é usado em múltiplos componentes simultaneamente.
