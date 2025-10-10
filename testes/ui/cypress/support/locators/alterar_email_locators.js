class Alterar_Email_Localizadores {
  botao_alterar_email() {
    return "//button[contains(normalize-space(text()), 'Alterar e-mail')]"; 
    
  }

  imput_email() {
    return 'input[placeholder="Digite o seu e-mail corporativo"]';
  }
}

export default Alterar_Email_Localizadores;