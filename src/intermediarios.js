const { contas } = require('./bancodedados');

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({"mensagem": "A senha do banco deverá ser informada!"})
    }
    
    if (senha_banco !== 'Cubos123Bank') {
        return res.status(401).json({"mensagem": "A senha do banco informada é inválida!"})
    }

    next();
}

const validarDados = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({"mensagem": "Todos os campos deverão ser informados"})
    }

    const contaEncontrada = contas.find((conta) => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    });
    
    if (contaEncontrada) {
        return res.status(400).json({"mensagem": "Já existe uma conta com o cpf ou e-mail informado!"})
    }

    next();
}

const validacoesSaldoExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({"mensagem": "O número da conta e a senha deverão ser informados!"})
    }

    const contaEncontrada = contas.find((conta => conta.numero === Number(numero_conta)));

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"});
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(401).json({"mensagem": "A senha é inválida!"})
    }

    next;
}


module.exports = {
    validarSenha,
    validarDados,
    validacoesSaldoExtrato
}