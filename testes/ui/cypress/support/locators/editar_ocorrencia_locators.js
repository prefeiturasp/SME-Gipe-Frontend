class Editar_Ocorrencia_Localizadores {
  titulo_listagem() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div/h1'
  }
  
  area_scroll_main() {
    return '/html/body/div/div/div[2]/main'
  }
  
  btn_visualizar() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div/div[2]/div[1]/div/table/tbody/tr[2]/td[6]/div/a'
  }
  
  btn_visualizar_svg() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div/div[2]/div[1]/div/table/tbody/tr[2]/td[6]/div/a/svg'
  }
  
  btn_visualizar_alternativo() {
    return '//tbody/tr[1]//a[contains(@class, "border-[#086397]")]'
  }
  
  btn_visualizar_css() {
    return 'tbody tr:first-child td:nth-child(6) a'
  }
  
  titulo_cadastro_ocorrencia() {
    return '//p[contains(text(), "Cadastro de ocorrência")] | //h1[contains(text(), "Cadastro de ocorrência")] | //h2[contains(text(), "Cadastro de ocorrência")]'
  }
  
  // Alternativa: seletor CSS mais flexível
  titulo_cadastro_ocorrencia_css() {
    return 'p, h1, h2'  // Usado com contains.text
  }
  
  label_quando_aconteceu() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/label'
  }
  
  label_furto_roubo() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[3]/label'
  }
  
  btn_proximo_primeira_aba() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[4]/button[2]'
  }
  
  label_tipo_ocorrencia() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/label'
  }
  
  btn_selecionar_tipos() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/button'
  }
  
  opcao_acidentes_transporte() {
    return '//span[contains(text(), "Acidentes no Transporte Escolar")]'
  }
  
  opcao_agressao_fisica() {
    return '/html/body/div[2]/div/div/div[2]/div/div[2]/span'
  }
  
  opcao_agressao_fisica_contra_funcionario() {
    return '/html/body/div[2]/div/div/div[2]/div/div[3]/span'
  }
  
  opcao_intolerancia_religiosa() {
    return '//span[contains(text(), "Intolerância Religiosa")]'
  }
  
  label_descreva_ocorrencia() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/label'
  }
  
  campo_descricao() {
    return '//textarea[contains(@id, "form-item")]'
  }
  
  label_smart_sampa() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[3]/label'
  }
  
  btn_proximo_segunda_aba() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[4]/button[2]'
  }
  
  btn_voltar() {
    return '/html/body/div/div/div[2]/main/div/div[1]/a'
  }
}

export default Editar_Ocorrencia_Localizadores
