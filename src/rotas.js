const express = require('express');
const { validarSenha, validarCpfEmail, validarConta, nroContaBody, dadosBody, valorBody, senhaBody, contaSenhaQuery } = require('./intermediarios');
const { listarContas, criarConta, atualizarUsuario, excluirConta } = require('./controladores/contas');
const { depositar, sacar, transferir, consultarSaldo, emitirExtrato } = require('./controladores/transacoes')

const rotas = express();

rotas.get('/contas', validarSenha, listarContas);
rotas.post('/contas', dadosBody, validarCpfEmail, criarConta);
rotas.put('/contas/:numeroConta/usuario', dadosBody, validarConta, validarCpfEmail, atualizarUsuario);
rotas.delete('/contas/:numeroConta', validarConta, excluirConta);
rotas.post('/transacoes/depositar', nroContaBody, valorBody, depositar);
rotas.post('/transacoes/sacar', nroContaBody, valorBody, senhaBody, sacar);
rotas.post('/transacoes/transferir', valorBody, transferir);
rotas.get('/contas/saldo', contaSenhaQuery, consultarSaldo);
rotas.get('/contas/extrato', contaSenhaQuery, emitirExtrato);

module.exports = rotas;