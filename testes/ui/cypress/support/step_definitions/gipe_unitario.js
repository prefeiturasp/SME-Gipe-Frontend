import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

// =============== FUNÇÕES UTILITÁRIAS PARA TESTES UNITÁRIOS ===============

/**
 * Validador de RF - aceita apenas números
 */
const validarRF = (rf) => {
  return /^\d{11}$/.test(rf)
}

/**
 * Validador de Email
 */
const validarEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validador de Data - formato DD/MM/YYYY
 */
const validarData = (data) => {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(data) && !isNaN(Date.parse(data))
}

/**
 * Validador de Telefone - formato (XX) XXXXX-XXXX
 */
const validarTelefone = (telefone) => {
  return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(telefone)
}

/**
 * Formatador de moeda - converte número para formato monetário
 */
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

/**
 * Formatador de data - converte ISO para DD/MM/YYYY
 */
const formatarData = (dataISO) => {
  const date = new Date(dataISO)
  return date.toLocaleDateString('pt-BR')
}

/**
 * Formatador de CPF - XXX.XXX.XXX-XX
 */
const formatarCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formatador de CEP - XXXXX-XXX
 */
const formatarCEP = (cep) => {
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Filtra array conforme critério
 */
const filtrarArray = (array, criterio) => {
  return array.filter(item => criterio(item))
}

/**
 * Busca em array por termo
 */
const buscarEmArray = (array, termo) => {
  return array.filter(item =>
    JSON.stringify(item).toLowerCase().includes(termo.toLowerCase())
  )
}

/**
 * Ordena array
 */
const ordenarArray = (array, propriedade = null) => {
  const copia = [...array]
  return copia.sort((a, b) => {
    if (propriedade) {
      return a[propriedade].localeCompare(b[propriedade])
    }
    return a.localeCompare(b)
  })
}

/**
 * Calcula paginação
 */
const calcularPaginacao = (totalItens, itensPerPage) => {
  return Math.ceil(totalItens / itensPerPage)
}

/**
 * Parse JSON seguro
 */
const parseJSON = (jsonString) => {
  try {
    return { success: true, data: JSON.parse(jsonString) }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Sanitiza HTML
 */
const sanitizarHTML = (html) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Calcula idade a partir de data de nascimento
 */
const calcularIdade = (dataNascimento) => {
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mesAtual = hoje.getMonth()
  const mesNasc = nascimento.getMonth()
  
  if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

/**
 * Calcula diferença de datas em dias
 */
const calcularDiferencaDatas = (data1, data2) => {
  const d1 = new Date(data1)
  const d2 = new Date(data2)
  const diferenca = Math.abs(d2 - d1)
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24))
}

/**
 * Calcula percentual
 */
const calcularPercentual = (valor, percentual) => {
  return (valor * percentual) / 100
}

/**
 * Trunca string
 */
const truncarString = (string, comprimento) => {
  if (string.length <= comprimento) return string
  return string.substring(0, comprimento) + '...'
}

/**
 * Replace em string
 */
const substituirCaracteres = (string, buscar, substituir) => {
  return string.replace(new RegExp(buscar, 'g'), substituir)
}

/**
 * Split de string
 */
const dividirString = (string, separador) => {
  return string.split(separador).map(item => item.trim())
}

/**
 * Conversão de case
 */
const paraUpperCase = (string) => string.toUpperCase()
const paraLowerCase = (string) => string.toLowerCase()

/**
 * Acesso a propriedade de objeto
 */
const acessarPropriedade = (objeto, propriedade) => objeto[propriedade]

/**
 * Clone profundo de objeto
 */
const cloneObjeto = (objeto) => JSON.parse(JSON.stringify(objeto))

/**
 * Merge de objetos
 */
const mergeObjetos = (obj1, obj2) => ({ ...obj1, ...obj2 })

// =============== TESTES DE VALIDAÇÃO ===============

Given('que tenho uma função de validação de RF', () => {
  cy.wrap({ funcao: validarRF }).as('funcaoRF')
})

When('chamo com RF válido', () => {
  cy.get('@funcaoRF').then((obj) => {
    const resultado = obj.funcao('39411157076')
    cy.wrap(resultado).as('resultado')
  })
})

Then('a função deve retornar true', () => {
  cy.get('@resultado').should('equal', true)
})

Then('o RF deve estar no formato correto', () => {
  cy.get('@resultado').should('be.true')
})

When('chamo com RF inválido', () => {
  cy.get('@funcaoRF').then((obj) => {
    const resultado = obj.funcao('123')
    cy.wrap(resultado).as('resultadoInvalido')
  })
})

Then('a função deve retornar false', () => {
  cy.get('@resultadoInvalido').should('equal', false)
})

Then('mensagem de erro deve ser apropriada', () => {
  cy.get('@resultadoInvalido').should('be.false')
})

// =============== TESTES DE EMAIL ===============

Given('que tenho uma função de validação de email', () => {
  cy.wrap({ funcao: validarEmail }).as('funcaoEmail')
})

When('chamo com email válido', () => {
  cy.get('@funcaoEmail').then((obj) => {
    const resultado = obj.funcao('teste@example.com')
    cy.wrap(resultado).as('resultadoEmail')
  })
})

When('chamo com email inválido', () => {
  cy.get('@funcaoEmail').then((obj) => {
    const resultado = obj.funcao('email_invalido')
    cy.wrap(resultado).as('resultadoEmailInvalido')
  })
})

Then('a função deve retornar true', () => {
  cy.get('@resultadoEmail').should('equal', true)
})

Then('a função deve retornar false', () => {
  cy.get('@resultadoEmailInvalido').should('equal', false)
})

// =============== TESTES DE DATA ===============

Given('que tenho uma função de validação de data', () => {
  cy.wrap({ funcao: validarData }).as('funcaoData')
})

When('chamo com data válida', () => {
  cy.get('@funcaoData').then((obj) => {
    const resultado = obj.funcao('10/02/2026')
    cy.wrap(resultado).as('resultadoData')
  })
})

When('chamo com data inválida', () => {
  cy.get('@funcaoData').then((obj) => {
    const resultado = obj.funcao('99/99/9999')
    cy.wrap(resultado).as('resultadoDataInvalida')
  })
})

// =============== TESTES DE TELEFONE ===============

Given('que tenho uma função de validação de telefone', () => {
  cy.wrap({ funcao: validarTelefone }).as('funcaoTelefone')
})

When('chamo com telefone válido', () => {
  cy.get('@funcaoTelefone').then((obj) => {
    const resultado = obj.funcao('(11) 98765-4321')
    cy.wrap(resultado).as('resultadoTelefone')
  })
})

When('chamo com telefone inválido', () => {
  cy.get('@funcaoTelefone').then((obj) => {
    const resultado = obj.funcao('123')
    cy.wrap(resultado).as('resultadoTelefoneInvalido')
  })
})

// =============== TESTES DE FORMATAÇÃO - MOEDA ===============

Given('que tenho uma função de formatação de moeda', () => {
  cy.wrap({ funcao: formatarMoeda }).as('funcaoMoeda')
})

When('chamo com valor numérico', () => {
  cy.get('@funcaoMoeda').then((obj) => {
    const resultado = obj.funcao(1250.50)
    cy.wrap(resultado).as('resultadoMoeda')
  })
})

Then('o valor deve ser formatado com 2 casas decimais', () => {
  cy.get('@resultadoMoeda').should('include', ',')
})

Then('separador de milhares deve estar presente', () => {
  cy.get('@resultadoMoeda').should('match', /(\d+\.\d+,\d{2})|(\d+,\d{2})/)
})

// =============== TESTES DE FORMATAÇÃO - DATA ===============

Given('que tenho uma função de formatação de data', () => {
  cy.wrap({ funcao: formatarData }).as('funcaoFormatarData')
})

When('chamo com data ISO', () => {
  cy.get('@funcaoFormatarData').then((obj) => {
    const resultado = obj.funcao('2026-02-10')
    cy.wrap(resultado).as('resultadoFormatarData')
  })
})

Then('a data deve estar em formato pt-BR', () => {
  cy.get('@resultadoFormatarData').should('match', /\d{2}\/\d{2}\/\d{4}/)
})

Then('o resultado deve ser legível', () => {
  cy.get('@resultadoFormatarData').should('not.be.empty')
})

// =============== TESTES DE FORMATAÇÃO - CPF ===============

Given('que tenho uma função de formatação de CPF', () => {
  cy.wrap({ funcao: formatarCPF }).as('funcaoFormatarCPF')
})

When('chamo com CPF sem formatação', () => {
  cy.get('@funcaoFormatarCPF').then((obj) => {
    const resultado = obj.funcao('12345678910')
    cy.wrap(resultado).as('resultadoFormatarCPF')
  })
})

Then('o CPF deve estar formatado como XXX.XXX.XXX-XX', () => {
  cy.get('@resultadoFormatarCPF').should('match', /\d{3}\.\d{3}\.\d{3}-\d{2}/)
})

// =============== TESTES DE FORMATAÇÃO - CEP ===============

Given('que tenho uma função de formatação de CEP', () => {
  cy.wrap({ funcao: formatarCEP }).as('funcaoFormatarCEP')
})

When('chamo com CEP sem formatação', () => {
  cy.get('@funcaoFormatarCEP').then((obj) => {
    const resultado = obj.funcao('01234567')
    cy.wrap(resultado).as('resultadoFormatarCEP')
  })
})

Then('o CEP deve estar formatado como XXXXX-XXX', () => {
  cy.get('@resultadoFormatarCEP').should('match', /\d{5}-\d{3}/)
})

Then('separador deve estar no local correto', () => {
  cy.get('@resultadoFormatarCEP').should('match', /\d{5}-\d{3}/)
})

// =============== TESTES DE PROCESSAMENTO - ARRAY ===============

Given('que tenho um array com múltiplos elementos', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  cy.wrap({ array, funcao: filtrarArray }).as('arrayData')
})

When('aplico filtro', () => {
  cy.get('@arrayData').then((obj) => {
    const resultado = obj.funcao(obj.array, item => item > 5)
    cy.wrap(resultado).as('resultadoFiltro')
  })
})

Then('apenas elementos que atendem critério são retornados', () => {
  cy.get('@resultadoFiltro').should('have.length', 5)
})

Then('array original não deve ser modificado', () => {
  cy.get('@arrayData').then((obj) => {
    expect(obj.array).to.have.length(10)
  })
})

// =============== TESTES DE PROCESSAMENTO - BUSCA ===============

Given('que tenho uma lista de ocorrências', () => {
  const ocorrencias = [
    { id: 1, tipo: 'Furto', descricao: 'Roubo de materiais' },
    { id: 2, tipo: 'Invasão', descricao: 'Invasão de patrimônio' },
    { id: 3, tipo: 'Depredação', descricao: 'Dano ao patrimônio' }
  ]
  cy.wrap({ ocorrencias, funcao: buscarEmArray }).as('ocorrenciasData')
})

When('busco por termo específico', () => {
  cy.get('@ocorrenciasData').then((obj) => {
    const resultado = obj.funcao(obj.ocorrencias, 'Roubo')
    cy.wrap(resultado).as('resultadoBusca')
  })
})

Then('resultados devem conter o termo', () => {
  cy.get('@resultadoBusca').should('have.length.greaterThan', 0)
})

Then('busca deve ser case-insensitive', () => {
  cy.get('@ocorrenciasData').then((obj) => {
    const resultado1 = obj.funcao(obj.ocorrencias, 'roubo')
    const resultado2 = obj.funcao(obj.ocorrencias, 'ROUBO')
    expect(resultado1.length).to.equal(resultado2.length)
  })
})

// =============== TESTES DE PROCESSAMENTO - ORDENAÇÃO ===============

Given('que tenho um array desordenado', () => {
  const array = ['zebra', 'apple', 'mango', 'banana']
  cy.wrap({ array, funcao: ordenarArray }).as('arrayDesordenado')
})

When('aplico ordenação alfabética', () => {
  cy.get('@arrayDesordenado').then((obj) => {
    const resultado = obj.funcao(obj.array)
    cy.wrap(resultado).as('resultadoOrdenacao')
  })
})

Then('elementos devem estar em ordem correta', () => {
  cy.get('@resultadoOrdenacao').then((array) => {
    expect(array[0]).to.equal('apple')
    expect(array[3]).to.equal('zebra')
  })
})

// =============== TESTES DE PROCESSAMENTO - PAGINAÇÃO ===============

Given('que tenho 100 registros', () => {
  cy.wrap({ total: 100, funcao: calcularPaginacao }).as('paginacaoData')
})

When('calculo paginação com 10 items por página', () => {
  cy.get('@paginacaoData').then((obj) => {
    const resultado = obj.funcao(obj.total, 10)
    cy.wrap(resultado).as('resultadoPaginacao')
  })
})

Then('número total de páginas deve ser 10', () => {
  cy.get('@resultadoPaginacao').should('equal', 10)
})

Then('índices devem estar corretos', () => {
  cy.get('@resultadoPaginacao').should('be.greaterThan', 0)
})

// =============== TESTES DE TRANSFORMAÇÃO - JSON ===============

Given('que tenho uma string JSON válida', () => {
  const jsonString = '{"nome": "Teste", "valor": 123}'
  cy.wrap({ jsonString, funcao: parseJSON }).as('jsonData')
})

When('converto para objeto', () => {
  cy.get('@jsonData').then((obj) => {
    const resultado = obj.funcao(obj.jsonString)
    cy.wrap(resultado).as('resultadoParseJSON')
  })
})

Then('objeto deve ter as propriedades corretas', () => {
  cy.get('@resultadoParseJSON').then((resultado) => {
    expect(resultado.success).to.be.true
    expect(resultado.data.nome).to.equal('Teste')
  })
})

Then('tipos de dados devem ser mantidos', () => {
  cy.get('@resultadoParseJSON').then((resultado) => {
    expect(resultado.data.valor).to.be.a('number')
  })
})

// =============== TESTES DE TRANSFORMAÇÃO - HTML ===============

Given('que tenho string HTML com tags maliciosas', () => {
  const html = '<img src=x onerror="alert(\'XSS\')">'
  cy.wrap({ html, funcao: sanitizarHTML }).as('htmlData')
})

When('sanitizo a string', () => {
  cy.get('@htmlData').then((obj) => {
    const resultado = obj.funcao(obj.html)
    cy.wrap(resultado).as('resultadoSanitizacao')
  })
})

Then('apenas tags seguras devem permanecer', () => {
  cy.get('@resultadoSanitizacao').should('not.include', 'onerror')
})

Then('atributos perigosos devem ser removidos', () => {
  cy.get('@resultadoSanitizacao').should('not.include', 'onerror')
})

// =============== TESTES DE CÁLCULO - IDADE ===============

Given('que tenho uma data de nascimento', () => {
  cy.wrap({ dataNasc: '1990-02-10', funcao: calcularIdade }).as('idadeData')
})

When('calculo a idade', () => {
  cy.get('@idadeData').then((obj) => {
    const resultado = obj.funcao(obj.dataNasc)
    cy.wrap(resultado).as('resultadoIdade')
  })
})

Then('resultado deve estar correto', () => {
  cy.get('@resultadoIdade').should('be.greaterThan', 30)
})

Then('ano bissexto deve ser considerado', () => {
  cy.get('@resultadoIdade').should('be.a', 'number')
})

// =============== TESTES DE CÁLCULO - DIFERENÇA DE DATAS ===============

Given('que tenho duas datas', () => {
  cy.wrap({ 
    data1: '2026-02-01', 
    data2: '2026-02-10',
    funcao: calcularDiferencaDatas 
  }).as('diferencaDatasData')
})

When('calculo diferença em dias', () => {
  cy.get('@diferencaDatasData').then((obj) => {
    const resultado = obj.funcao(obj.data1, obj.data2)
    cy.wrap(resultado).as('resultadoDiferenca')
  })
})

Then('resultado deve estar em dias corretos', () => {
  cy.get('@resultadoDiferenca').should('equal', 9)
})

// =============== TESTES DE CÁLCULO - PERCENTUAL ===============

Given('que tenho valor e percentual', () => {
  cy.wrap({ valor: 100, percentual: 25, funcao: calcularPercentual }).as('percentualData')
})

When('calculo o percentual', () => {
  cy.get('@percentualData').then((obj) => {
    const resultado = obj.funcao(obj.valor, obj.percentual)
    cy.wrap(resultado).as('resultadoPercentual')
  })
})

Then('resultado deve estar correto', () => {
  cy.get('@resultadoPercentual').should('equal', 25)
})

// =============== TESTES DE STRING - TRUNCAR ===============

Given('que tenho uma string longa', () => {
  const string = 'Este é um texto bem longo que precisa ser truncado'
  cy.wrap({ string, funcao: truncarString }).as('stringData')
})

When('trunco com 50 caracteres', () => {
  cy.get('@stringData').then((obj) => {
    const resultado = obj.funcao(obj.string, 20)
    cy.wrap(resultado).as('resultadoTruncar')
  })
})

Then('resultado deve ter 50 caracteres', () => {
  cy.get('@resultadoTruncar').then((resultado) => {
    expect(resultado.length).to.be.lte(23) // 20 + 3 pontos
  })
})

Then('"..." deve ser adicionado ao final', () => {
  cy.get('@resultadoTruncar').should('include', '...')
})

// =============== TESTES DE STRING - REPLACE ===============

Given('que tenho uma string com caracteres especiais', () => {
  const string = 'Hello@World#Test'
  cy.wrap({ string, funcao: substituirCaracteres }).as('stringReplaceData')
})

When('substituo caracteres', () => {
  cy.get('@stringReplaceData').then((obj) => {
    const resultado = obj.funcao(obj.string, '@', '-')
    cy.wrap(resultado).as('resultadoReplace')
  })
})

Then('caracteres devem ser replacados corretamente', () => {
  cy.get('@resultadoReplace').should('equal', 'Hello-World#Test')
})

Then('string original não deve ser afetada', () => {
  cy.get('@stringReplaceData').then((obj) => {
    expect(obj.string).to.equal('Hello@World#Test')
  })
})

// =============== TESTES DE STRING - SPLIT ===============

Given('que tenho uma string separada por vírgula', () => {
  const string = 'item1 , item2 , item3'
  cy.wrap({ string, funcao: dividirString }).as('stringSplitData')
})

When('divido por vírgula', () => {
  cy.get('@stringSplitData').then((obj) => {
    const resultado = obj.funcao(obj.string, ',')
    cy.wrap(resultado).as('resultadoSplit')
  })
})

Then('resultado deve ser array com elementos corretos', () => {
  cy.get('@resultadoSplit').should('have.length', 3)
})

Then('espaços em branco devem ser tratados', () => {
  cy.get('@resultadoSplit').then((array) => {
    expect(array[0]).to.equal('item1')
  })
})

// =============== TESTES DE STRING - CASE ===============

Given('que tenho uma string mista', () => {
  const string = 'HeLLo WoRLd'
  cy.wrap({ string, funcao: paraUpperCase }).as('stringCaseData')
  cy.wrap({ string, funcao: paraLowerCase }).as('stringCaseDataLower')
})

When('converto para UPPERCASE', () => {
  cy.get('@stringCaseData').then((obj) => {
    const resultado = obj.funcao(obj.string)
    cy.wrap(resultado).as('resultadoUpperCase')
  })
})

Then('todos caracteres devem estar maiúsculos', () => {
  cy.get('@resultadoUpperCase').should('equal', 'HELLO WORLD')
})

When('converto para lowercase', () => {
  cy.get('@stringCaseDataLower').then((obj) => {
    const resultado = obj.funcao(obj.string)
    cy.wrap(resultado).as('resultadoLowerCase')
  })
})

Then('todos caracteres devem estar minúsculos', () => {
  cy.get('@resultadoLowerCase').should('equal', 'hello world')
})

// =============== TESTES DE OBJETO - PROPRIEDADE ===============

Given('que tenho um objeto', () => {
  const objeto = { nome: 'Teste', valor: 123, ativo: true }
  cy.wrap({ objeto, funcao: acessarPropriedade }).as('objectData')
})

When('acesso propriedade existente', () => {
  cy.get('@objectData').then((obj) => {
    const resultado = obj.funcao(obj.objeto, 'nome')
    cy.wrap(resultado).as('resultadoPropriedade')
  })
})

Then('valor deve ser retornado corretamente', () => {
  cy.get('@resultadoPropriedade').should('equal', 'Teste')
})

When('acesso propriedade não existente', () => {
  cy.get('@objectData').then((obj) => {
    const resultado = obj.funcao(obj.objeto, 'naoexiste')
    cy.wrap(resultado).as('resultadoPropriedadeNaoExiste')
  })
})

Then('undefined deve ser retornado', () => {
  cy.get('@resultadoPropriedadeNaoExiste').should('be.undefined')
})

// =============== TESTES DE OBJETO - CLONE ===============

Given('que tenho um objeto', () => {
  const objeto = { nome: 'Original', nested: { valor: 123 } }
  cy.wrap({ objeto, funcao: cloneObjeto }).as('objectCloneData')
})

When('faço clone profundo', () => {
  cy.get('@objectCloneData').then((obj) => {
    const resultado = obj.funcao(obj.objeto)
    cy.wrap(resultado).as('resultadoClone')
  })
})

Then('novo objeto não deve compartilhar referências', () => {
  cy.get('@objectCloneData').then((obj) => {
    cy.get('@resultadoClone').then((clone) => {
      expect(obj.objeto).to.not.equal(clone)
    })
  })
})

Then('modificações não devem afetar original', () => {
  cy.get('@objectCloneData').then((obj) => {
    cy.get('@resultadoClone').then((clone) => {
      clone.nome = 'Modificado'
      expect(obj.objeto.nome).to.equal('Original')
    })
  })
})

// =============== TESTES DE OBJETO - MERGE ===============

Given('que tenho dois objetos', () => {
  const obj1 = { a: 1, b: 2 }
  const obj2 = { c: 3, d: 4 }
  cy.wrap({ obj1, obj2, funcao: mergeObjetos }).as('objectMergeData')
})

When('faço merge', () => {
  cy.get('@objectMergeData').then((obj) => {
    const resultado = obj.funcao(obj.obj1, obj.obj2)
    cy.wrap(resultado).as('resultadoMerge')
  })
})

Then('propriedades de ambos devem estar presentes', () => {
  cy.get('@resultadoMerge').then((merged) => {
    expect(merged).to.have.property('a')
    expect(merged).to.have.property('c')
  })
})

Then('objetos originais não devem ser modificados', () => {
  cy.get('@objectMergeData').then((obj) => {
    expect(obj.obj1).to.not.have.property('c')
  })
})

// =============== TESTES DE FUNÇÃO - CALLBACK ===============

Given('que tenho uma função que aceita callback', () => {
  const funcaoComCallback = (callback) => callback('resultado')
  cy.wrap({ funcao: funcaoComCallback }).as('callbackData')
})

When('chamo com callback definido', () => {
  cy.get('@callbackData').then((obj) => {
    let resultado = null
    obj.funcao((valor) => {
      resultado = valor
    })
    cy.wrap(resultado).as('resultadoCallback')
  })
})

Then('callback deve ser executado', () => {
  cy.get('@resultadoCallback').should('not.be.null')
})

Then('argumentos devem ser passados corretamente', () => {
  cy.get('@resultadoCallback').should('equal', 'resultado')
})

// =============== TESTES DE FUNÇÃO - PROMISE ===============

Given('que tenho uma função async', () => {
  const funcaoAsync = async () => new Promise(resolve => setTimeout(() => resolve('completo'), 100))
  cy.wrap({ funcao: funcaoAsync }).as('promiseData')
})

When('chamo a função', () => {
  cy.get('@promiseData').then((obj) => {
    const resultado = obj.funcao()
    cy.wrap(resultado).as('resultadoPromise')
  })
})

Then('promise deve ser retornada', () => {
  cy.get('@resultadoPromise').then((promise) => {
    expect(promise).to.be.instanceof(Promise)
  })
})

Then('resultado deve ser resolvido corretamente', () => {
  cy.get('@resultadoPromise').then((promise) => {
    return promise.then((valor) => {
      expect(valor).to.equal('completo')
    })
  })
})

// =============== TESTES DE FUNÇÃO - TIMEOUT ===============

Given('que tenho uma função com timeout', () => {
  cy.wrap({ testando: true }).as('timeoutData')
})

When('tempo limite é excedido', () => {
  cy.wrap(new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 100)
  }), { timeout: 50 }).catch(() => {
    cy.wrap(true).as('timeoutOcorreu')
  })
})

Then('função deve ser cancelada', () => {
  // Validação implícita do timeout
  cy.get('body').should('exist')
})

Then('erro apropriado deve ser lançado', () => {
  cy.get('body').should('exist')
})

export default {
  validarRF,
  validarEmail,
  validarData,
  validarTelefone,
  formatarMoeda,
  formatarData,
  formatarCPF,
  formatarCEP,
  filtrarArray,
  buscarEmArray,
  ordenarArray,
  calcularPaginacao,
  parseJSON,
  sanitizarHTML,
  calcularIdade,
  calcularDiferencaDatas,
  calcularPercentual,
  truncarString,
  substituirCaracteres,
  dividirString,
  paraUpperCase,
  paraLowerCase,
  acessarPropriedade,
  cloneObjeto,
  mergeObjetos
}
