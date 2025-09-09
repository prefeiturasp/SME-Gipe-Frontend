class Alterar_Email_Localizadores {
  botao_alterar_email() {
    return "/html/body/div/div/div[2]/main/div[2]/div/div[2]/form/div[1]/div[2]/div/button";
    
  }

  imput_email() {
    return 'input[placeholder="Digite o seu e-mail corporativo"]';
  }

  botao_salvar_email() {
    return '//*[@id="radix-:ra:"]/form/div[2]/button[2]';
  }

  mensagem_email_cadastrado() {
    return '//*[@id="radix-:ra:"]/form/div[1]/div[2]/span';
  }

  botao_cancelar() {
    return '//*[@id="radix-:ra:"]/form/div[1]/div[2]/span';
  }
}

export default Alterar_Email_Localizadores;