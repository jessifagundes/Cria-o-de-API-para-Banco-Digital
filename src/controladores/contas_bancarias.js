const { contas, depositos, saques, transferencias } = require('../bancodedados');
const { format } = require('date-fns');
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
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const contaEncontrada = contas.find((conta => conta.numero === Number(numeroConta)));

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"})
    }

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
    const { numeroConta } = req.params;

    const indiceContaASerExcluida = contas.findIndex((conta => conta.numero === Number(numeroConta)));

    if (indiceContaASerExcluida < 0) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"});
    }

    const consultaSaldo = contas.find((conta => conta.saldo !== 0));

    if (consultaSaldo) {
        return res.status(400).json({"mensagem": "A conta só pode ser removida se o saldo for zero!"});
    }

    contas.splice(indiceContaASerExcluida, 1);

    return res.status(200).send();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({"mensagem": "O número da conta e o valor deverão ser informados!"})
    }

    const contaEncontrada = contas.find((conta => conta.numero === Number(numero_conta)));

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"});
    }

    if (valor <= 0) {
        return res.status(400).json({"mensagem": "O valor deverá ser maior que zero!"})
    }

    contaEncontrada.saldo += valor;

    depositos.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    });

    return res.status(200).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha} = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({"mensagem": "O número da conta, o valor e a senha deverão ser informados!"})
    }

    const contaEncontrada = contas.find((conta => conta.numero === Number(numero_conta)));

    if (!contaEncontrada) {
        return res.status(404).json({"mensagem": "Não existe conta com o número informado!"});
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(401).json({"mensagem": "A senha é inválida!"})
    }

    if (contaEncontrada.saldo < valor) {
        return res.status(400).json({"mensagem": "Não há saldo disponível"});
    }

    contaEncontrada.saldo -= valor;

    saques.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    });

    return res.status(200).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({"mensagem": "O número da conta de origem e destino, o valor e a senha deverão ser informados!"})
    }

    const contaOrigemEncontrada = contas.find((conta => conta.numero === Number(numero_conta_origem)));
    
    if (!contaOrigemEncontrada) {
        return res.status(404).json({"mensagem": "Conta de origem não encontrada"})
    }

    const contaDestinoEncontrada = contas.find((conta => conta.numero === Number(numero_conta_destino)));

    if (!contaDestinoEncontrada) {
        return res.status(404).json({"mensagem": "Conta de destino não encontrada"})
    }

    if (contaOrigemEncontrada.usuario.senha !== senha) {
        return res.status(401).json({"mensagem": "A senha é inválida!"})
    }

    if (contaOrigemEncontrada.saldo < valor) {
        return res.status(400).json({"mensagem": "Não há saldo disponível"});
    }

    contaOrigemEncontrada.saldo -= valor
    contaDestinoEncontrada.saldo += valor;

    transferencias.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    });

    return res.status(200).send();
}

const consultarSaldo = (req, res) => {
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

    return res.status(200).json(contaEncontrada.saldo);
}

const emitirExtrato = (req, res) => {
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

    const depositoEncontrado = depositos.find(deposito => Number(deposito.numero_conta) === contaEncontrada.numero)
    const saqueEncontrado = saques.find(saque => Number(saque.numero_conta) === contaEncontrada.numero)
    const transfEnviadaEncontrada = transferencias.find(transferencia => Number(transferencia.numero_conta_origem) === contaEncontrada.numero)
    const transfRecebidaEncontrada = transferencias.find(transferencia => Number(transferencia.numero_conta_destino) === contaEncontrada.numero)

    return res.status(200).json({
        depositos: depositoEncontrado, 
        saques: saqueEncontrado, 
        transferenciasEnviadas: transfEnviadaEncontrada,
        transferenciasRecebidas: transfRecebidaEncontrada 
    });
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato
}