document.getElementById('formCadastro').addEventListener('submit', function(e) {

    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha.length < 8) {
        alert('A senha deve ter no mínimo 8 caracteres');
        return;
    }

    if (!/[A-Z]/.test(senha)) {
        alert('A senha precisa ter uma letra maiúscula');
        return;
    }

    if (!/[0-9]/.test(senha)) {
        alert('A senha precisa ter um número');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

   
    const usuario = {
        email: email,
        senha: senha
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));

    alert('Cadastro OK');

    window.location.href = "login.html";
});