class DjangoAdminLocalizadores {
  // Página de login do Django Admin
  titulo_site_name() {
    return '#site-name > a'
  }
  
  input_username() {
    return '#id_username'
  }
  
  input_password() {
    return '#id_password'
  }
  
  btn_login() {
    return '//*[@id="login-form"]/div[3]/input'
  }
  
  // Página principal após login
  titulo_admin_site() {
    return '#content > h1'
  }
  
  link_modulo_intercorrencias() {
    return '#content-main > div.app-intercorrencias.module > table > caption > a'
  }
  
  link_declarantes() {
    return '#intercorrencias-declarante > a'
  }
  
  titulo_selecione_declarante() {
    return '#content > h1'
  }
  
  btn_adicionar_declarante() {
    return '#content-main > ul > li > a'
  }
  
  input_declarante() {
    return '#id_declarante'
  }
  
  btn_salvar_declarante() {
    return '#declarante_form > div > div > input.default'
  }
  
  mensagem_sucesso() {
    return '.success'
  }
  
  // ===== ENVOLVIDOS =====
  
  link_envolvidos() {
    return '#intercorrencias-envolvido > a'
  }
  
  titulo_selecione_envolvido() {
    return '//*[@id="content"]/h1'
  }
  
  btn_adicionar_envolvido() {
    return '#content-main > ul > li > a'
  }
  
  input_envolvidos() {
    return '#id_perfil_dos_envolvidos'
  }
  
  btn_salvar_envolvido() {
    return '//*[@id="envolvido_form"]/div/div/input[1]'
  }
  
  mensagem_sucesso_envolvido() {
    return '//*[@id="content-start"]/ul/li'
  }
}

const djangoAdminLocators = new DjangoAdminLocalizadores()
export default djangoAdminLocators
