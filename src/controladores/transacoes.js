const { contas, depositos, saques, transferencias } = require('../bancodedados');
const { nroContaBody, validarConta } = require('../intermediarios');
const { format } = require('date-fns');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const contaEncontradaBody = req.contaEncontradaBody;

    if (valor <= 0) {
        return res.status(400).json({"mensagem": "O valor deverá ser maior que zero!"})
    }

    contaEncontradaBody.saldo += valor;

    depositos.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    });

    return res.status(200).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body
    const contaEncontradaBody = req.contaEncontradaBody;
    
    if (contaEncontradaBody.saldo < valor) {
        return res.status(400).json({"mensagem": "Não há saldo disponível"});
    }

    contaEncontradaBody.saldo -= valor;

    saques.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    });

    return res.status(200).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({"mensagem": "O número da conta de origem deverá ser informado!"})
    }

    if (!numero_conta_destino) {
        return res.status(400).json({"mensagem": "O número da conta de destino deverá ser informado!"})
    }

    if (!senha) {
        return res.status(400).json({"mensagem": "A senha deverá ser informada!"})
    }

    const contaOrigemEncontrada = contas.find(conta => conta.numero === Number(numero_conta_origem));
    
    if (!contaOrigemEncontrada) {
        return res.status(404).json({"mensagem": "Conta de origem não encontrada"})
    }

    const contaDestinoEncontrada = contas.find(conta => conta.numero === Number(numero_conta_destino));

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
    const contaEncontradaQuery = req.contaEncontradaQuery;

    return res.status(200).json(contaEncontradaQuery.saldo);
}

const emitirExtrato = (req, res) => {
    const contaEncontradaQuery = req.contaEncontradaQuery;

    const depositoEncontrado = depositos.find(deposito => Number(deposito.numero_conta) === contaEncontradaQuery.numero)
    const saqueEncontrado = saques.find(saque => Number(saque.numero_conta) === contaEncontradaQuery.numero)
    const transfEnviadaEncontrada = transferencias.find(transferencia => Number(transferencia.numero_conta_origem) === contaEncontradaQuery.numero)
    const transfRecebidaEncontrada = transferencias.find(transferencia => Number(transferencia.numero_conta_destino) === contaEncontradaQuery.numero)

    return res.status(200).json({
        depositos: depositoEncontrado, 
        saques: saqueEncontrado, 
        transferenciasEnviadas: transfEnviadaEncontrada,
        transferenciasRecebidas: transfRecebidaEncontrada 
    });
}

module.exports = {
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato
}