let { contas } = require('../bancodedados');
const validarConta = require('../intermediarios');
let numeroContaNova = 1;

const listarContas = (req, res) => {
    return res.status(200).json(contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const saldo = 0;

    contas.push({
        numero: numeroContaNova++,
        saldo,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    })
    
    return res.status(200).send();
}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const contaEncontrada = req.contaEncontrada;

    const { usuario } = contaEncontrada;

    usuario.nome = nome;
    usuario.cpf = cpf;
    usuario.data_nascimento = data_nascimento;
    usuario.telefone = telefone;
    usuario.email = email;
    usuario.senha = senha;

    return res.status(200).send();
}

const excluirConta = (req, res) => {
    const contaEncontrada = req.contaEncontrada;

    if (contaEncontrada.saldo !== 0) {
        return res.status(400).json({"mensagem": "A conta só pode ser removida se o saldo for zero!"});
    }

    contas = contas.filter(conta => conta.numero !== Number(contaEncontrada.numero))

    return res.status(200).send();
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta
}