class Esqueci_Senha_Localizadores {
  link_esqueci_senha() {
    return '/html/body/div/div[2]/div/form/div[4]/a';
  }

  input_rf() {
    return 'input[name="username"]';
  }

  botao_continuar() {
    return 'button[type="submit"]';
  }

  alerta_mensagem() {
    return 'div.text-sm span';
  }
}

export default Esqueci_Senha_Localizadores;