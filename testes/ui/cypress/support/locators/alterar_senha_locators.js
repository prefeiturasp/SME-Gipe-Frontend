class Alterar_Senha_Localizadores {
  link_alterar_senha() {
    return "/html/body/div/div/div[1]/div[2]/div/div[2]/div/div/ul/li[2]/a";
    
  }

  botao_alterar_senha() {
    return "//button[contains(normalize-space(text()), 'Alterar senha')]";
  }

  input_senha_atual() {
    return 'input[placeholder="Digite a senha atual"]';
  }

    input_nova_senha() {
    return 'input[placeholder="Digite a nova senha"]';
  }

    input_confirmar_nova_senha() {
    return 'input[placeholder="Digite a nova senha novamente"]';
  }
  
    button_salvar_senha() {
    return '//button[contains(text(), "Salvar senha")]';
  }  

  alerta_mensagem() {
    return "//div[contains(normalize-space(text()), 'Usuário ou senha incorretos')]";
  }
}

export default Alterar_Senha_Localizadores;