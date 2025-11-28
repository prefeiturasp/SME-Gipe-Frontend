# language: pt
# PRÉ-REQUISITO: É necessário ter pelo menos uma ocorrência cadastrada no sistema
# Execute primeiro: cadast_Patrimonio.feature para garantir que há ocorrências disponíveis

@editar_ocorrencia @edicao
Funcionalidade: Edição de ocorrência após visualização

  Como um usuário do sistema SME Gipe
  Eu quero editar uma ocorrência existente
  Para atualizar as informações registradas

  Contexto:
    Dado que eu acesso o sistema
    E eu efetuo login com RF
    E estou na página principal do sistema
    
  @skip
  @edicao @positivo @smoke
  Cenário: Editar ocorrência visualizada
    Dado que estou na tela de listagem de ocorrências
    Quando clico em Visualizar
    Então o sistema exibe os detalhes da ocorrência
    Quando clico em "Próximo"
    E adiciono os tipos de ocorrência "Acidentes no Transporte Escolar" e "Intolerância Religiosa"
    E clico fora da área de seleção
    E substituo o texto do campo "Descreva a ocorrência" por "Anexos serão adicionados"
    E clico em "Próximo"
    Então o sistema deve validar e manter as alterações realizadas

  @skip @edicao @validacao
  Cenário: Validar campos obrigatórios na edição
    Dado que estou na tela de listagem de ocorrências
    Quando clico em "Visualizar"
    E clico em "Próximo"
    Então o campo "Descreva a ocorrência" deve estar presente
    E deve ser possível adicionar tipos de ocorrência