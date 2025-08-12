class Login_Gipe_Localizadores {

    campo_usuario() {
        return 'input[placeholder="Digite um RF ou CPF"]';
    }

    campo_senha() {
        return 'input[placeholder="Digite sua senha"]';
    }

    botao_acessar() {
        return 'button:contains("Acessar")';
    }

    mensagem_erro() {
        return 'div:contains("Usuário e/ou senha inválida")';
    }

    mensagem_erro_senha_vazia(){
        return 'div:contains("Senha é obrigatória")';
    }

    mensagem_erro_rf_vazio() {
        return 'div:contains("RF ou CPF é obrigatório")';
    }
}

export default Login_Gipe_Localizadores;
