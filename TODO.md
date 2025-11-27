# TODO - Correção dos CRUDs

## Problema Identificado
- IDs foram removidos do db.json para entidades além de 'alunos'
- Serviços e stores ainda esperam IDs para operações CRUD (get by id, update, delete)
- Isso causa falhas em máquinas, treinos, exercícios, treinos_exercicios e relatórios

## Plano de Correção
- [ ] Adicionar IDs únicos a todas as entidades no db.json
- [ ] Corrigir exerciciosStore.js para usar 'id' em vez de 'id_exercicio'
- [ ] Verificar se serviços precisam gerar IDs em novos registros
- [ ] Testar operações CRUD após correções

## Status
- Em andamento
