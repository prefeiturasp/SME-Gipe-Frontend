# language: pt

@skip @gipe_unitario @unitario @componentes
Funcionalidade: Testes Unitários de Componentes GIPE
  Como desenvolvedor
  Eu quero testar componentes isolados
  Para garantir que cada funcionalidade funciona corretamente de forma independente

  # ====== TESTES DE VALIDAÇÃO ======

  @unitario @validacao @rf
  Cenário: Validar função de formatação de RF
    Dado que tenho uma função de validação de RF
    Quando chamo com RF válido
    Então a função deve retornar true
    E o RF deve estar no formato correto

  @unitario @validacao @rf
  Cenário: Validar rejeição de RF inválido
    Dado que tenho uma função de validação de RF
    Quando chamo com RF inválido
    Então a função deve retornar false
    E mensagem de erro deve ser apropriada

  @unitario @validacao @email
  Cenário: Validar função de validação de email
    Dado que tenho uma função de validação de email
    Quando chamo com email válido
    Então a função deve retornar true
    Quando chamo com email inválido
    Então a função deve retornar false

  @unitario @validacao @data
  Cenário: Validar função de validação de data
    Dado que tenho uma função de validação de data
    Quando chamo com data válida
    Então a função deve retornar true
    Quando chamo com data inválida
    Então a função deve retornar false

  @unitario @validacao @telefone
  Cenário: Validar função de validação de telefone
    Dado que tenho uma função de validação de telefone
    Quando chamo com telefone válido
    Então a função deve retornar true
    Quando chamo com telefone inválido
    Então a função deve retornar false

  # ====== TESTES DE FORMATAÇÃO ======

  @unitario @formatacao @moeda
  Cenário: Validar formatação de valores monetários
    Dado que tenho uma função de formatação de moeda
    Quando chamo com valor numérico
    Então o valor deve ser formatado com 2 casas decimais
    E separador de milhares deve estar presente

  @unitario @formatacao @data
  Cenário: Validar formatação de datas
    Dado que tenho uma função de formatação de data
    Quando chamo com data ISO
    Então a data deve estar em formato pt-BR
    E o resultado deve ser legível

  @unitario @formatacao @cpf
  Cenário: Validar formatação de CPF
    Dado que tenho uma função de formatação de CPF
    Quando chamo com CPF sem formatação
    Então o CPF deve estar formatado como XXX.XXX.XXX-XX
    E validação deve ocorrer automaticamente

  @unitario @formatacao @cep
  Cenário: Validar formatação de CEP
    Dado que tenho uma função de formatação de CEP
    Quando chamo com CEP sem formatação
    Então o CEP deve estar formatado como XXXXX-XXX
    E separador deve estar no local correto

  # ====== TESTES DE PROCESSAMENTO DE DADOS ======

  @unitario @processamento @array
  Cenário: Validar função de filtro de array
    Dado que tenho um array com múltiplos elementos
    Quando aplico filtro
    Então apenas elementos que atendem critério são retornados
    E array original não deve ser modificado

  @unitario @processamento @busca
  Cenário: Validar função de busca em lista
    Dado que tenho uma lista de ocorrências
    Quando busco por termo específico
    Então resultados devem conter o termo
    E busca deve ser case-insensitive

  @unitario @processamento @ordenacao
  Cenário: Validar função de ordenação
    Dado que tenho um array desordenado
    Quando aplico ordenação alfabética
    Então elementos devem estar em ordem correta
    E array original não deve ser afetado

  @unitario @processamento @paginacao
  Cenário: Validar função de cálculo de paginação
    Dado que tenho 100 registros
    Quando calculo paginação com 10 items por página
    Então número total de páginas deve ser 10
    E índices devem estar corretos

  # ====== TESTES DE TRANSFORMAÇÃO ======

  @unitario @transformacao @json
  Cenário: Validar parsing de JSON
    Dado que tenho uma string JSON válida
    Quando converto para objeto
    Então objeto deve ter as propriedades corretas
    E tipos de dados devem ser mantidos

  @unitario @transformacao @csv
  Cenário: Validar parsing de CSV
    Dado que tenho dados em formato CSV
    Quando converto para array de objetos
    Então cabeçalhos devem ser usados como chaves
    E valores devem estar corretos

  @unitario @transformacao @html
  Cenário: Validar sanitização de HTML
    Dado que tenho string HTML com tags maliciosas
    Quando sanitizo a string
    Então apenas tags seguras devem permanecer
    E atributos perigosos devem ser removidos

  # ====== TESTES DE CÁLCULO ======

  @unitario @calculo @idade
  Cenário: Validar cálculo de idade
    Dado que tenho uma data de nascimento
    Quando calculo a idade
    Então resultado deve estar correto
    E ano bissexto deve ser considerado

  @unitario @calculo @diferenca-data
  Cenário: Validar cálculo de diferença de datas
    Dado que tenho duas datas
    Quando calculo diferença em dias
    Então resultado deve estar em dias corretos
    E horário deve ser considerado se necessário

  @unitario @calculo @percentual
  Cenário: Validar cálculo de percentual
    Dado que tenho valor e percentual
    Quando calculo o percentual
    Então resultado deve estar correto
    E casas decimais devem estar apropriadas

  # ====== TESTES DE STRING ======

  @unitario @string @truncar
  Cenário: Validar truncagem de string
    Dado que tenho uma string longa
    Quando trunco com 50 caracteres
    Então resultado deve ter 50 caracteres
    E "..." deve ser adicionado ao final

  @unitario @string @replace
  Cenário: Validar substituição de caracteres
    Dado que tenho uma string com caracteres especiais
    Quando substituo caracteres
    Então caracteres devem ser replacados corretamente
    E string original não deve ser afetada

  @unitario @string @split
  Cenário: Validar divisão de string
    Dado que tenho uma string separada por vírgula
    Quando divido por vírgula
    Então resultado deve ser array com elementos corretos
    E espaços em branco devem ser tratados

  @unitario @string @case
  Cenário: Validar conversão de case
    Dado que tenho uma string mista
    Quando converto para UPPERCASE
    Então todos caracteres devem estar maiúsculos
    Quando converto para lowercase
    Então todos caracteres devem estar minúsculos

  # ====== TESTES DE OBJETO ======

  @unitario @objeto @propriedade
  Cenário: Validar acesso a propriedade de objeto
    Dado que tenho um objeto
    Quando acesso propriedade existente
    Então valor deve ser retornado corretamente
    Quando acesso propriedade não existente
    Então undefined deve ser retornado

  @unitario @objeto @clone
  Cenário: Validar clonagem de objeto
    Dado que tenho um objeto
    Quando faço clone profundo
    Então novo objeto não deve compartilhar referências
    E modificações não devem afetar original

  @unitario @objeto @merge
  Cenário: Validar merge de objetos
    Dado que tenho dois objetos
    Quando faço merge
    Então propriedades de ambos devem estar presentes
    E objetos originais não devem ser modificados

  # ====== TESTES DE FUNÇÃO ======

  @unitario @funcao @callback
  Cenário: Validar execução de callback
    Dado que tenho uma função que aceita callback
    Quando chamo com callback definido
    Então callback deve ser executado
    E argumentos devem ser passados corretamente

  @unitario @funcao @promise
  Cenário: Validar promise é retornada
    Dado que tenho uma função async
    Quando chamo a função
    Então promise deve ser retornada
    E resultado deve ser resolvido corretamente

  @unitario @funcao @timeout
  Cenário: Validar timeout de função
    Dado que tenho uma função com timeout
    Quando tempo limite é excedido
    Então função deve ser cancelada
    E erro apropriado deve ser lançado
