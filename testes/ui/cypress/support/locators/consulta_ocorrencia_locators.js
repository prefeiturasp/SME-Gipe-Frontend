class Consulta_Ocorrencia_Localizadores {
  
  titulo_historico_ocorrencias() {
    return 'h1.text-\\[24px\\].font-bold.text-\\[\\#42474a\\]';
  }

  titulo_historico_texto() {
    return 'h1:contains("Histórico de ocorrências registradas")';
  }

  campo_acao() {
    return 'div.font-semibold.text-gray-700:contains("Ação")';
  }

  campo_acao_alt() {
    return '[class*="font-semibold"]:contains("Ação")';
  }

  btn_visualizar() {
    return 'tbody tr:first-child td:last-child a[href*="cadastrar-ocorrencia"] svg';
  }

  btn_visualizar_completo() {
    return 'body > div > div > div.flex.flex-col.flex-1.overflow-hidden > main > div > div:nth-child(3) > div > div:nth-child(3) > div.rounded-md.border.border-gray-300 > div > table > tbody > tr:nth-child(1) > td:last-child > div > a > svg';
  }

  btn_visualizar_robusto() {
    return 'a[href*="/dashboard/cadastrar-ocorrencia/"] svg';
  }

  link_visualizar() {
    return 'a[href*="/dashboard/cadastrar-ocorrencia/"]';
  }

  campo_quando_ocorrencia() {
    return 'label.peer-disabled\\:cursor-not-allowed.peer-disabled\\:opacity-70.text-\\[\\#42474a\\].text-\\[14px\\].font-bold[for*="form-item"]';
  }

  campo_quando_ocorrencia_texto() {
    return 'label:contains("Quando a ocorrência aconteceu?")';
  }

  campo_quando_ocorrencia_alt() {
    return 'label[class*="text-"][class*="font-bold"]:contains("Quando a ocorrência aconteceu?")';
  }

  tabela_ocorrencias() {
    return 'div.rounded-md.border.border-gray-300 table';
  }

  primeira_linha_tabela() {
    return 'tbody tr:first-child';
  }

  linhas_tabela() {
    return 'tbody tr';
  }

  cabecalho_tabela() {
    return 'thead tr';
  }

  area_dashboard() {
    return 'main[class*="flex"]';
  }

  container_ocorrencias() {
    return 'div.flex.flex-col.flex-1.overflow-hidden';
  }
}

export default Consulta_Ocorrencia_Localizadores;