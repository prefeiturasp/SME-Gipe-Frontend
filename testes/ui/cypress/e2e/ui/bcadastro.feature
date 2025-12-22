# language: pt

Funcionalidade: Cadastro de usuários no sistema GIPE

  Contexto: Acesso à tela de cadastro
    Dado que o usuário está na página de cadastro
    E o usuário seleciona o campo "Selecione a DRE" com "DRE CAPELA DO SOCORRO"
    E o usuário seleciona o campo "Digite o nome da UE" com "AURELIO BUARQUE DE HOLANDA FERREIRA"

  Cenário: Usuário realiza cadastro completo
    Dado que o usuário está na página de cadastro
    Quando o usuário seleciona o campo "Selecione a DRE" com "DRE CAPELA DO SOCORRO"
    E o usuário seleciona o campo "Digite o nome da UE" com "AURELIO BUARQUE DE HOLANDA FERREIRA"
    E o usuário preenche o campo "Qual o seu nome completo" com "João da Silva"
    E o usuário preenche o campo "Qual o seu CPF" com "044.194.250-40"
    E o usuário preenche o campo "Qual o seu e-mail?" com "testesgipe3@sme.prefeitura.sp.gov.br"
    E o usuário clica no botão cadastrar agora
    Então o sistema deve mostrar a próxima tela para continuar o cadastro

  Cenário: Cadastro com email já cadastrado
    Dado que o usuário está na página de cadastro
    Quando o usuário seleciona o campo "Selecione a DRE" com "DRE CAPELA DO SOCORRO"
    E o usuário seleciona o campo "Digite o nome da UE" com "AURELIO BUARQUE DE HOLANDA FERREIRA"
    E o usuário preenche o campo "Qual o seu nome completo" com "João da Silva"
    E o usuário preenche o campo "Qual o seu CPF" com "045.194.250-40"
    E o usuário preenche o campo "Qual o seu e-mail?" com "testesgipe3@sme.prefeitura.sp.gov.br"
    E o usuário clica no botão cadastrar agora
    E o usuário preenche o campo "Qual o seu e-mail?" com "testesgipe3@sme.prefeitura.sp.gov.br"
    Então o sistema deve exibir a mensagem "Este e-mail já está cadastrado."

  Cenário: Cadastro com CPF já cadastrado
    Dado que o usuário está na página de cadastro
    Quando o usuário seleciona o campo "Selecione a DRE" com "DRE CAPELA DO SOCORRO"
    E o usuário seleciona o campo "Digite o nome da UE" com "AURELIO BUARQUE DE HOLANDA FERREIRA"
    E o usuário preenche o campo "Qual o seu nome completo" com "João da Silva"
    E o usuário preenche o campo "Qual o seu CPF" com "044.194.250-40"
    E o usuário preenche o campo "Qual o seu e-mail?" com "testesgipe3@sme.prefeitura.sp.gov.br"
    E o usuário clica no botão cadastrar agora
    Então o sistema deve exibir a mensagem "Já existe uma conta com este CPF."
