const express = require('express');
const { validarSenha, validarDados } = require('./intermediarios');
const { listarContas, criarConta, atualizarUsuario, excluirConta, depositar, sacar, transferir, consultarSaldo, emitirExtrato } = require('./controladores/contas_bancarias');

const rotas = express();

rotas.get('/contas', validarSenha, listarContas);
rotas.post('/contas', validarDados, criarConta);
rotas.put('/contas/:numeroConta/usuario', validarDados, atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/contas/transacoes/depositar', depositar);
rotas.post('/contas/transacoes/sacar', sacar);
rotas.post('/contas/transacoes/transferir', transferir);
rotas.get('/contas/saldo', consultarSaldo);
rotas.get('/contas/extrato', emitirExtrato);

module.exports = rotas;