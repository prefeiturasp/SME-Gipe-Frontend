# language: pt
Funcionalidade: Login

  Contexto:
    Dado que eu acesso o sistema

  Esquema do Cenário: Acesso ao sistema "<cenario>"
    Quando eu insiro o RF "<rf>" e senha "<senha>" válidos
    E clico no botão de acessar
    Então o resultado esperado para "<cenario>" deve ser exibido

    Exemplos:
      | cenario             | rf       | senha      |
      | Login válido padrão | 7210418  | Sgp@12345  |
      | Login inválido      | 7210418  | Sgp@123    |
