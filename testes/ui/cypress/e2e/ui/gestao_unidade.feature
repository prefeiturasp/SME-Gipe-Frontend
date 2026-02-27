# language: pt

@gestao_pessoas @gipe
Funcionalidade: Gestão de unidade - Perfil GIPE
  Como usuário com perfil GIPE
  Eu quero acessar e gerenciar unidades do sistema
  Para cadastrar,consulta, inativar e reativar unidades

  Contexto: Autenticação no sistema
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do sistema

@consultar_unidades
Cenário: Consultar Unidades
  Quando acesso o menu de Gestão
  E clica na opção "Gestão de unidades Educacionais"
  Então visualizo a página de Gestão de Unidades Educacionais
  E visualizo as abas "Unidades Educacionais ativas" e "Unidades Educacionais inativas"

@skip @cadastro_unidade_indireta
Cenário: Cadastrar nova unidade (indireta)
  Quando acesso o menu de Gestão
  E clica na opção "Gestão de unidades Educacionais"
  Então visualizo a página de Gestão de Unidades Educacionais
  E visualizo as abas "Unidades Educacionais ativas" e "Unidades Educacionais inativas"
  Quando clico no botão Cadastrar Unidade Educacional
  Então valido a existência do título Cadastrar Unidade Educacional

@skip @inativar_unidade
Cenário: Inativar Unidade Educacional
  Quando acesso o menu de Gestão
  E clica na opção "Gestão de unidades Educacionais"
  Então visualizo a página de Gestão de Unidades Educacionais
  E visualizo as abas "Unidades Educacionais ativas" e "Unidades Educacionais inativas"
  Quando acesso a aba de unidades "Unidades Educacionais ativas"
  E valida a existencia do texto "Você pode filtrar as UEs por Diretorias Regionais (DREs)."
  E valida o titulo "Diretoria Regional"
  E clica no campo
  E seleciona no filtro a unidades pela "DRE CAPELA DO SOCORRO"
  Então visualizo a listagem de Unidades Educacionais
  E valido a existência da tabela com as colunas "Unidade Educacional" "Etapa/modalidade" "Tipo" "Código EOL" "Diretoria Regional" "Sigla DRE" "Ação"
  E procura na coluna "Unidade Educacional" a unidade educacional "CEAT"
  E navega ate a coluna "Ação" e valido a existência do botão "visualizar" da Unidade "CEAT"
  Quando clico no botão visualizar da unidade "CEAT"
  Então visualizo a página de Editar Unidade Educacional
  E Valida a existencia do botão "Inativar Unidade Educacional"
  Quando clico no botão "Inativar Unidade Educacional"
  Então o sistema exibe o modal de Inativação de Unidade Educacional
  E valida a existência do titulo " Inativação de Unidade Educacional"
  E visualizo a mensagem de confirmação de inativação " Ao inativar o perfil da unidade educacional, não será mais possível vincular novas intercorrências a ela e as pessoas dessa UE deixarão de ter acesso ao GIPE. Tem certeza de que deseja continuar? "
  E valida o texto "Motivo da inativação da UE*"
  E Preecnhe o Campo com mensagens aleatorios
  E visualizo os botões "Cancelar" e "Inativar Unidade Educacional" no modal
  Quando confirmo a inativação clicando em "Inativar Unidade Educacional"
  Então o sistema redireciona para a tela de Gestão de usuários
  E o perfil é inativado com sucesso

@skip @reativar_unidade
Cenário: Reativar Unidade Educacional
  Quando acesso o menu de Gestão
  E clica na opção "Gestão de unidades Educacionais"
  Então visualizo a página de Gestão de Unidades Educacionais
  Quando acesso a aba de unidades "Unidades Educacionais inativas"
  E valida a existencia do texto "Você pode filtrar as UEs por Diretorias Regionais (DREs)."
  E valida o titulo "Diretoria Regional"
  E clica no campo
  E seleciona no filtro a unidades pela "DRE CAPELA DO SOCORRO"
  Então visualizo a listagem de Unidades Educacionais
  E valido a existência da tabela com as colunas "Unidade Educacional" "Etapa/modalidade" "Tipo" "Código EOL" "Diretoria Regional" "Sigla DRE" "Ação"
  E procura na coluna "Unidade Educacional" a unidade educacional "CEAT"
  E navega ate a coluna "Ação" e valido a existência do botão "visualizar" da Unidade "CEAT"
  Quando clico no botão "visualizar" da unidade "CEAT"
  Então visualizo a página de Editar Unidade Educacional
  E Valida a existencia do botão "Reativar Unidade Educacional"
  Quando clico no botão "Reativar Unidade Educacional"
  Então o sistema exibe o modal de Reativação de Unidade Educacional
  E valida a existência do titulo de reativação " Reativação de Unidade Educacional"
  E visualizo a mensagem de confirmação de reativação " Ao reativar o perfil da unidade educacional, novas intercorrências poderão ser vinculadas a ela. Além disso, as pessoas dessa UE terão acesso ao GIPE novamente. Tem certeza de que deseja continuar? "
  E valida o texto de reativação "Motivo da Reativação da UE*"
  E Preecnhe o Campo de reativação com mensagens aleatorios
  E visualizo os botões de reativação "Cancelar" e "Reativar Unidade Educacional" no modal
  Quando confirmo a reativação clicando em "Reativar Unidade Educacional"
  Então o sistema redireciona para a tela de Gestão de usuários
  E o perfil é reativado com sucesso
