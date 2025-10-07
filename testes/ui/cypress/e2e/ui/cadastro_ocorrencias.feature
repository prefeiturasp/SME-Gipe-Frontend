# language: pt
Funcionalidade: Consulta de ocorrências

  Cenário: Usuário realiza uma consulta de ocorrências
    Dado que o usuário realizou o login com sucesso
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  Cenário: Usuário cadastra ocorrência
    Dado que o usuário realizou o login com sucesso
    Quando o usuário está na página principal do sistema
    E que o usuário está na página de listagem de ocorrências
    E o usuário clica no botão nova ocorrência
    E o usuário preenche os campos da ocorrência
    # Então o sistema deve exibir apenas as ocorrências com status Em andamento

