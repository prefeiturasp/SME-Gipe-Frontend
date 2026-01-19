class Esqueci_Senha_Localizadores {
  link_esqueci_senha() {
    return '/html/body/div/div[2]/div/form/div[4]/a';
  }

  titulo_recuperacao() {
    return 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > h1';
  }

  label_rf_cpf() {
    return 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2 > label';
  }

  input_rf() {
    return '/html/body/div/div[2]/div/form/div[2]/input';
  }

  botao_continuar() {
    return '/html/body/div/div[2]/div/form/button';
  }

  botao_continuar_final() {
    return '/html/body/div/div[2]/div/form/a';
  }

  mensagem_erro() {
    return 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.relative.w-full.rounded-lg.border.p-4.\\[\\&\\>svg\\~\\*\\]\\:pl-7.\\[\\&\\>svg\\+div\\]\\:translate-y-\\[-3px\\].\\[\\&\\>svg\\]\\:absolute.\\[\\&\\>svg\\]\\:left-4.\\[\\&\\>svg\\]\\:top-4.\\[\\&\\>svg\\]\\:text-foreground.bg-\\[rgba\\(180\\,12\\,49\\,0\\.1\\)\\].text-\\[\\#42474a\\].border-none.mt-4';
  }
}

export default Esqueci_Senha_Localizadores;