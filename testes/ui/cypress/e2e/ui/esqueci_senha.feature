# language: pt

Funcionalidade: Fluxo esqueci a senha no sistema GIPE
  
  Cenário: Fluxo esqueci a senha com RF válido
    Dado que eu acesso o sistema GIPE
    E valido a existência do link "Esqueci minha senha"
    Quando clico no link "Esqueci minha senha"
    E valido que estou na página de recuperação de senha
    E valido a existência do campo RF ou CPF
    E preencho o campo RF com "7311559"
    E clico no botão continuar
    Então o sistema deve exibir a mensagem de confirmação
    E clico no botão continuar para voltar

  Cenário: Fluxo esqueci a senha com RF inválido
    Dado que eu acesso o sistema GIPE
    E valido a existência do link "Esqueci minha senha"
    Quando clico no link "Esqueci minha senha"
    E valido que estou na página de recuperação de senha
    E valido a existência do campo RF ou CPF
    E preencho o campo RF com "0000000"
    E clico no botão continuar
    Então o sistema deve exibir mensagem de erro "Usuário ou RF não encontrado"