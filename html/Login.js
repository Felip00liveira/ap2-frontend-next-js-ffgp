document.getElementById('formLogin').addEventListener('submit', function(e) {

    e.preventDefault();

    const emailDigitado = document.getElementById('email').value;
    const senhaDigitada = document.getElementById('senha').value;

    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));

    if (!usuarioSalvo) {
        alert('Nenhum usuário cadastrado!');
        return;
    }

    if (
        emailDigitado === usuarioSalvo.email &&
        senhaDigitada === usuarioSalvo.senha
    ) {
        alert('Login realizado com sucesso!');
        window.location.href = "home.html";
    } else {
        alert('Email ou senha incorretos!');
    }

});