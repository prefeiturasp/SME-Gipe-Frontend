# language: pt

Funcionalidade: Fluxo esqueci a senha no sistema GIPE
  Contexto: Acesso à tela de esqueci a senha
    Dado que eu acesso o sistema

  Cenário: Fluxo esqueci a senha com RF válido
    Quando o usuário clica no link "Esqueci minha senha"
    E o usuário preenche o campo RF com "7210418"
    E clica no botão continuar
    Então o sistema deve mostrar a mensagem "Seu link de recuperação de senha foi enviado para wil**********@spassu.com.br."

  Cenário: Fluxo esqueci a senha com RF incorreto
    Quando o usuário clica no link "Esqueci minha senha"
    E o usuário preenche o campo RF com "0000000"
    E clica no botão continuar
    Então o sistema deve mostrar a mensagem "Usuário ou RF não encontrado"