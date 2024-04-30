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

const dadosBody = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({"mensagem": "Todos os campos deverão ser informados"})
    }

    next();
}

const validarCpfEmail = (req, res, next) => {
    const { cpf, email } = req.body;
    
    const cpfEmail = contas.find(conta => conta.usuario.cpf === cpf || conta.usuario.email === email);
    
    if (cpfEmail) {
        return res.status(400).json({"mensagem": "Já existe uma conta com o cpf ou e-mail informado!"})
    }

    next();
}

const validarConta = (req, res, next) => {
    const { numeroConta } = req.params;

    const contaEncontrada = contas.find(conta => conta.numero === Number(numeroConta));

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"})
    }

    req.contaEncontrada = contaEncontrada;

    next();
}

const nroContaBody = (req, res, next) => {
    const { numero_conta } = req.body;

    if (!numero_conta) {
        return res.status(400).json({"mensagem": "O número da conta deverá ser informado!"})
    }

    const contaEncontradaBody = contas.find(conta => conta.numero === Number(numero_conta));

    if (!contaEncontradaBody) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"})
    }

    req.contaEncontradaBody = contaEncontradaBody;

    next();
}

const valorBody = (req, res, next) => {
    const { valor } = req.body;

    if (!valor) {
        return res.status(400).json({"mensagem": "O valor deverá ser informado!"})
    }

    next();
}

const senhaBody = (req, res, next) => {
    const { senha } = req.body;
    const contaEncontradaBody = req.contaEncontradaBody;

    if (!senha) {
        return res.status(400).json({"mensagem": "A senha deverá ser informada!"})
    }

    if (contaEncontradaBody.usuario.senha !== senha) {
        return res.status(401).json({"mensagem": "A senha é inválida!"})
    }

    next();
}

const contaSenhaQuery = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({"mensagem": "O número da conta deverá ser informado!"})
    }

    if (!senha) {
        return res.status(400).json({"mensagem": "A senha deverá ser informada!"})
    }

    contaEncontradaQuery = contas.find(conta => conta.numero === Number(numero_conta));

    if (!contaEncontradaQuery) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"})
    }

    req.contaEncontradaQuery = contaEncontradaQuery;

    if (senha !== contaEncontradaQuery.usuario.senha) {
        return res.status(401).json({"mensagem": "A senha é inválida!"})
    }

    next();
}

module.exports = {
    validarSenha,
    validarCpfEmail,
    validarConta,
    nroContaBody,
    dadosBody,
    valorBody,
    senhaBody,
    contaSenhaQuery
}