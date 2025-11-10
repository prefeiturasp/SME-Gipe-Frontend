# language: pt
Funcionalidade: Adiciona Declarante Django Admin

  Cenário: Acessar Django Admin e fazer login
    Dado acesso a página de administração do Django
    Então devo ver o título "Administração do Django"
    Quando insiro as credenciais do Django Admin
    E clico no botão de login do Django "Acessar"
    Então devo ver o título "Administração do Site"
    E devo ver o módulo "Intercorrencias"
    Quando clico no módulo "Intercorrencias"
    E clico no link do Django Admin "Declarantes"
    Então devo ver o título "Selecione Declarante para modificar"
    Quando clico em adicionar novo declarante
    E preencho o campo declarante com "Testemunha Ocular"
    E clico no botão salvar declarante
    Então devo ver mensagem de sucesso

  Cenário: Adiciona Envolvidos Django Admin
    Dado acesso a página de administração do Django
    Então devo ver o título "Administração do Django"
    Quando insiro as credenciais do Django Admin
    E clico no botão de login do Django "Acessar"
    Então devo ver o título "Administração do Site"
    E devo ver o módulo "Intercorrencias"
    Quando clico no módulo "Intercorrencias"
    E clico no link do Django Admin "Envolvidos"
    Então devo ver o título "Selecione Envolvido para modificar"
    Quando clico em adicionar envolvido
    E preencho o campo Envolvidos com "Agente de Saude"
    E clico no botão salvar
    Então devo ver mensagem de sucesso
  
