# language: pt

Funcionalidade: Cadastro de usuários no sistema GIPE

  Cenário: Usuário realiza cadastro completo
    Dado que o usuário está na página de cadastro
    Quando o usuário seleciona o campo "Selecione a DRE" com "DRE CAPELA DO SOCORRO"
    E o usuário seleciona o campo "Digite o nome da UE" com "AURELIO BUARQUE DE HOLANDA FERREIRA"
    E o usuário preenche o campo "Qual o seu nome completo" com "João da Silva"
    E o usuário preenche o campo "Qual o seu CPF" com "504.235.010-11"
    E o usuário clica no botão Avançar
    Então o sistema deve mostrar a próxima tela para continuar o cadastro

