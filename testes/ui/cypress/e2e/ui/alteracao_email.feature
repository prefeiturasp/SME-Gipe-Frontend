# language: pt
Funcionalidade: Alteração de e-mail

  Cenário: Usuário realiza a alteração do e-mail
    Dado que o usuário realizou o login com sucesso
    E o usuário está na página principal do sistema
    E o usuário clica no botão "Meus dados"
    E quando ele clica no botão "Alterar e-mail"
    E preenche o campo E-mail com "wilson.santos5@sme.prefeitura.sp.gov.br"
    Então o sistema o sistema deve apresentar a mensagem alertando o usuário sobre a alteração do e-mail
