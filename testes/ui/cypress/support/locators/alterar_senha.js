class Alterar_Senha_Localizadores {
  link_alterar_senha() {
    return "/html/body/div/div/div[1]/div[2]/div/div[2]/div/div/ul/li[2]/a";
    
  }

  botao_alterar_senha() {
    return "//button[contains(normalize-space(text()), 'Alterar senha')]";
  }

  imput_senha_atual() {
    return '//*[@id=":ra:-form-item"]';
  }

    imput_nova_senha() {
    return '//*[@id=":rb:-form-item"]';
  }

    imput_confirmar_nova_senha() {
    return '//*[@id=":rc:-form-item"]';
  }
  
    button_salvar_senha() {
    return '//button[contains(text(), "Salvar senha")]';
  }  

  alerta_mensagem() {
    return "//div[contains(normalize-space(text()), 'Usuário ou senha incorretos')]";
  }
}

export default Alterar_Senha_Localizadores;