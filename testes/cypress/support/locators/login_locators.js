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
}

export default Login_Gipe_Localizadores;
