# language: pt

@gestao_pessoas @gipe
Funcionalidade: Gestão de usuários - Perfil GIPE
  Como usuário com perfil GIPE
  Eu quero acessar e gerenciar usuários do sistema
  Para cadastrar, inativar e reativar perfis de usuários

  Contexto: Autenticação no sistema
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do sistema

  @skip @cadastro_perfil @diretor
  Cenário: Cadastrar novo perfil de Diretor na rede Direta
    Quando acesso o menu de Gestão
    E seleciono a opção "Gestão de pessoa usuária"
    Então visualizo a página de Gestão de usuários
    E visualizo as abas "Pendências de aprovação", "Perfis ativos" e "Perfis inativos"
    Quando clico no botão "Cadastrar pessoa usuária"
    Então visualizo o formulário de cadastro de perfil
    Quando preencho o campo "Rede" com "Direta"
    E preencho o campo "Cargo" com "Diretor(a)"
    E valido a existência e preencho o campo "Nome completo" com um nome aleatório
    E valido a existência e preencho o campo "CPF" com um CPF válido
    E valido a existência e preencho o campo "RF" com um RF válido de 7 dígitos
    E valido a existência e preencho o campo "E-mail" com um e-mail válido
    E seleciono uma "Diretoria Regional" aleatória
    E seleciono uma "Unidade Educacional" disponível
    Então visualizo os botões "Cancelar" e "Cadastrar perfil"
    Quando clico no botão "Cadastrar perfil"
    Então o sistema exibe o modal de confirmação de cadastro
    E visualizo a mensagem "Ao cadastrar a pessoa usuária, o perfil será registrado no CoreSSO"
    E visualizo os botões "Cancelar" e "Cadastrar pessoa usuária" no modal
    Quando confirmo o cadastro clicando em "Cadastrar pessoa usuária"
    Então o sistema redireciona para a tela de Gestão de usuários
    E o novo perfil é cadastrado com sucesso

  @skip @cadastro_completo_autoservico
  Cenário: Realizar cadastro de novo usuário via autoserviço (sem autenticação prévia)
    Dado que acesso a página de cadastro direto
    E o usuário valida a existência do campo "Selecione a DRE"
    E o usuário seleciona o campo "Selecione a DRE" com "DIRETORIA REGIONAL DE EDUCACAO IPIRANGA"
    E o usuário valida a existência do campo "Digite o nome da UE"
    E o usuário seleciona o campo "Digite o nome da UE" com "ABRAO HUCK, DR."
    E informo meus dados pessoais com informações válidas
    E submeto o formulário de cadastro
    Então devo ser direcionado para a próxima etapa do cadastro
    E meus dados devem ser registrados no sistema

  @skip @consultar_pendencias
  Cenário: Consultar perfis pendentes de aprovação
    Quando acesso o menu de Gestão
    E seleciono a opção "Gestão de pessoa usuária"
    Então visualizo a página de Gestão de usuários
    E visualizo as abas "Pendências de aprovação", "Perfis ativos" e "Perfis inativos"
    Quando acesso a aba "Pendências de aprovação"
    Então visualizo os perfis aguardando aprovação
    E cada perfil exibe os dados "CPF", "E-mail", "Diretoria Regional", "Unidade Educacional" e "Data da solicitação"
    E cada perfil possui os botões "Recusar" e "Aprovar"

  @skip @recusar_perfil
  Cenário: Recusar solicitação de cadastro de perfil pendente
    Quando acesso o menu de Gestão
    E seleciono a opção "Gestão de pessoa usuária"
    Então visualizo a página de Gestão de usuários
    Quando acesso a aba "Pendências de aprovação"
    Então visualizo os perfis aguardando aprovação
    Quando clico no botão "Recusar" do primeiro perfil pendente
    Então o sistema exibe o modal de recusa de solicitação
    E visualizo o título "Recusar solicitação" no modal
    E visualizo a mensagem de confirmação de recusa
    E visualizo o campo "Motivo de recusa"
    Quando preencho o motivo da recusa
    E visualizo os botões "Cancelar" e "Recusar perfil" no modal de recusa
    Quando confirmo a recusa clicando em "Recusar perfil"
    Então o sistema redireciona para a tela de Gestão de usuários
    E a solicitação é recusada com sucesso

  @skip @inativar_perfil
  Cenário: Inativar perfil de usuário ativo
    Quando acesso o menu de Gestão
    E seleciono a opção "Gestão de pessoa usuária"
    Então visualizo a página de Gestão de usuários
    E visualizo as abas "Pendências de aprovação", "Perfis ativos" e "Perfis inativos"
    Quando acesso a aba "Perfis ativos"
    E filtro pela "Diretoria Regional" "DRE CAPELA DO SOCORRO"
    E filtro pela "Unidade Educacional" "CEGRS"
    Então visualizo a listagem de perfis ativos
    E valido a existência do texto "Ação" no cabeçalho da tabela
    Quando clico no botão visualizar do usuário
    Então visualizo a página de edição de perfil
    Quando clico no botão "Inativar perfil"
    Então o sistema exibe o modal de inativação de perfil
    E visualizo a mensagem de confirmação de inativação
    E visualizo os botões "Cancelar" e "Inativar perfil" no modal
    Quando confirmo a inativação clicando em "Inativar perfil"
    Então o sistema redireciona para a tela de Gestão de usuários
    E o perfil é inativado com sucesso

  @skip @reativar_perfil
  Cenário: Reativar perfil de usuário inativo
    Quando acesso o menu de Gestão
    E seleciono a opção "Gestão de pessoa usuária"
    Então visualizo a página de Gestão de usuários
    E visualizo as abas "Pendências de aprovação", "Perfis ativos" e "Perfis inativos"
    Quando acesso a aba "Perfis inativos"
    E filtro pela "Diretoria Regional" "DRE CAPELA DO SOCORRO"
    E filtro pela "Unidade Educacional" "CEGRS"
    Então visualizo a listagem de perfis inativos
    E valido a existência do texto "Ação" no cabeçalho da tabela
    Quando clico no botão visualizar do usuário inativo
    Então visualizo a página de edição de perfil
    Quando clico no botão "Reativar perfil"
    Então o sistema exibe o modal de reativação de perfil
    E visualizo a mensagem de confirmação de reativação
    E visualizo os botões "Cancelar" e "Reativar perfil" no modal
    Quando confirmo a reativação clicando em "Reativar perfil"
    Então o sistema redireciona para a tela de Gestão de usuários
    E o perfil é reativado com sucesso

