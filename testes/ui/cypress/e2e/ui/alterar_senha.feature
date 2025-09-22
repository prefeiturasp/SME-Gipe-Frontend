# language: pt
Funcionalidade: Alteração de senha

  @wip
  Cenário: Usuário realiza a alteração da senha
    Dado que o usuário realizou o login com sucesso
    E o usuário está na página principal do sistema
    E o usuário clica no botão "Meus dados"
    E clica no botão "Alterar senha"
    E o usuário preenche o campo Senha atual com "Ruby@142108"
    E o usuário preenche o campo Nova senha com "Sgp0418"
    E o usuário preenche o campo Confirmação da nova senha com "Sgp0418"
    E o usuário clica no botão Salvar Senha
    Então o sistema cadastrar uma nova senha para o usuário
