# language: pt

@consulta_filtro @smoke @regression
Funcionalidade: Consulta por Filtro
  Como usuário autorizado do sistema GIPE
  Eu quero filtrar ocorrencia
  Para que o sistema retorne apenas ocorrência referente ao Filtro

  Contexto: Acesso ao sistema com usuário autenticado
    Dado que eu acesso o sistema
    E eu efetuo login com RF

  @consulta @listagem
  Cenário: Consultar listagem de ocorrências cadastradas no sistema
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @consulta @filtro @periodo
  Cenário: Consulta por Período
    Dado que o usuário valida o texto "Histórico de ocorrência registradas"
    E o usuário valida e clica no botão "Filtrar"
    E o usuário valida os títulos dos campos "Período"
    E o usuário valida os títulos dos campos "Tipo de Ocorrência"
    E o usuário valida os títulos dos campos "Status"
    Quando o usuário preenche o campo Data Inicial com "01 10 2025"
    E o usuário preenche o campo Data Final com "01 11 2025"
    E clica fora do Campo 
    Então o usuário valida a existencia do botão "Filtrar" do painel
    E clica no botão "Filtrar" do painel para Completa consulta

  @filtro @tipo_ocorrencia
  Cenário: Consulta por Tipo de Ocorrencia
    Dado que o usuário valida o texto "Histórico de ocorrência registradas"
    E o usuário valida e clica no botão "Filtrar"
    E o usuário valida os títulos dos campos "Período"
    E o usuário valida os títulos dos campos "Tipo de Ocorrência"
    Quando o usuário clica no campo "Tipo de Ocorrência" e seleciona "Agressão física"
    E clica fora do Campo 
    Então o usuário valida a existencia do botão "Filtrar" do painel
    E clica para Completa consulta

  @consulta @filtro @status
  Cenário: Consulta por Status
    Dado que o usuário valida o texto "Histórico de ocorrência registradas"
    E o usuário valida e clica no botão "Filtrar"
    E o usuário valida os títulos dos campos "Período"
    E o usuário valida os títulos dos campos "Status"
    Quando o usuário clica no campo "Status" e seleciona "Finalizada"
    E clica fora do Campo 
    Então o usuário valida a existencia do botão "Filtrar" do painel
    E clica para Completa consulta



