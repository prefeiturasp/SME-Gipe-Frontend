# language: pt

@consulta_ocorrencia @validacao
Funcionalidade: Consulta de Ocorrência

  Como um usuário do sistema SME Gipe
  Eu quero consultar ocorrências registradas
  Para visualizar os detalhes das ocorrências no sistema

  Contexto:
    Dado que o usuário realizou o login com sucesso

  @skip@consulta @visualizacao @smoke
  Cenário: Usuário visualiza ocorrência registrada
    Quando o usuário está na página principal do sistema
    E localiza e valida o título "Histórico de ocorrências registradas"
    E localiza e valida o campo "Ação"
    E clica em "Visualizar"
    Então o sistema exibe o resultado e valida o campo "Quando a ocorrência aconteceu?"

  @skip@consulta @negativo
  Cenário: Validar elementos obrigatórios na página de consulta
    Quando o usuário está na página principal do sistema
    Então o título "Histórico de ocorrências registradas" deve estar visível
    E o campo "Ação" deve estar presente na tabela
    E deve existir pelo menos uma ocorrência listada