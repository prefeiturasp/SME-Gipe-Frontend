# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Unreleased]

---

## [0.1.0] - 2026-05-04

### Added

- Login com RF ou CPF
- Validação de e-mail restrita a domínios institucionais
- Solicitação de acesso ao sistema com envio de dados para aprovação
- Recuperação e redefinição de senha via e-mail
- Logout com encerramento de sessão
- Visualização dos dados pessoais do usuário logado
- Alteração de senha
- Alteração de e-mail com confirmação por link
- Criação de nova ocorrência com formulário em etapas:
    - Informações iniciais: data, hora, local, tipo de ocorrência e acionamento do SmartSampa
    - Detalhamento patrimonial (furto/roubo) ou interpessoal (demais tipos)
    - Informações sobre as pessoas envolvidas: dados pessoais, acompanhamento NAAPA, endereço via CEP
    - Informações finais: comunicação com segurança pública, número do processo SEI
    - Anexos: envio, visualização, download e exclusão de documentos por categoria
- Suporte a múltiplos envolvidos e múltiplas pessoas agressoras por ocorrência
- Aviso sobre restrição de envio de imagens como anexo
- Modal informativo com descrição dos tipos de ocorrência
- Encerramento da etapa da UE com protocolo gerado
- Preenchimento do formulário de detalhamento da ocorrência pela DRE
- Seleção dos órgãos acionados pela DRE
- Encerramento da etapa da DRE
- Preenchimento do formulário de categorização da ocorrência pelo GIPE
- Encerramento da etapa do GIPE
- Tabela com todas as ocorrências registradas, visível conforme o perfil do usuário
- Filtros por período, DRE, UE, status e tipo de formulário
- Ordenação por coluna
- Paginação dos resultados
- Acesso direto ao formulário de edição de cada ocorrência
- Listagem de usuários ativos, inativos e pendentes de aprovação
- Filtros por DRE, UE e status
- Aprovação e recusa de solicitações de acesso
- Cadastro e edição de usuários
- Inativação de usuário com registro de motivo
- Reativação de usuário inativo
- Consulta de dados pelo RF para preenchimento automático no cadastro
- Listagem de unidades educacionais com filtros por DRE, rede e status
- Cadastro e edição de unidades
- Consulta pelo código EOL com preenchimento automático da DRE
- Inativação de unidade com registro de motivo
- Reativação de unidade inativa
- Dashboard analítico com totais e evolução de intercorrências
- Gráficos por DRE, por tipo de ocorrência, por status e evolução mensal
- Filtros por período, DRE/UE e perfil
- Exportação do relatório em PDF com gráficos e cards de resumo
