# language: pt

Funcionalidade: Login

  Contexto:
    Dado que eu acesso o sistema

  Esquema do Cenário: Acesso ao sistema "<cenario>"
    Quando eu insiro o RF "<rf>" e senha "<senha>" válidos
    E clico no botão de acessar
    Então o resultado esperado para "<cenario>" deve ser exibido

    Exemplos:
      | cenario              | rf           | senha          |
      | Login válido padrão  | 50423501011  | Ruby@142107    |
      | Login inválido       | 6913261      | Sgp326         |
      | Senha em branco      | 6913261      |                |
      | RF em branco         |              | Sgp3261        |
      

