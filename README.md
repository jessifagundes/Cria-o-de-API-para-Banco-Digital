# Digital Bank API

## Sobre o projeto

O projeto Digital Bank API é uma aplicação back-end web desenvolvida para conclusão do Módulo 2 do curso de Desenolvimento Full-Stack da [Cubos Academy](https://cubos.academy/).

A aplicação, que segue o padrão REST, permite a execução das principais funcionalidades de um banco digital, como listagem das contas bancárias existentes, criação de uma nova conta, atualização dos dados dos usuários, exclusão de conta, bem como depósito, saque e transferência, bem como emissão do extrato de todas essas transações.

## Como executar

1. Clone o repositório

`git clone https://github.com/criacao-api-banco-digital.git`

2. Instale as bibliotecas

`npm install express`

`npm install -D nodemon`

`npm install date-fns`

3. Execute o servidor

`npm run`

## Projeto em execução

#### 1. Listar contas bancárias

Para listar as contas bancárias deverá ser informada senha como parâmetro de consulta:

`http://localhost:3000/contas?senha_banco=Cubos123Bank`

Exemplo de resposta:

![image](https://github.com/jessifagundes/criacao-api-banco-digital/assets/157433661/8669bf43-d97c-49e3-b85e-36d1cc207b6e)


#### 2. Criar conta bancária

`http://localhost:3000/contas`

No body da requisição deverão ser informados nome, cpf, data de nascimento, telefone, email e senha, no formato JSON, conforme exemplo abaixo:

```javascript
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

#### 3. Atualizar os dados do usuário da conta bancária

Deverá ser passado como parâmetro de rota o número da conta cujo usuário deverá ser atualizado.
As informações a serem atualizadas deverão ser passadas no body da requisição, no formato JSON, conforme exemplo anterior.

`http://localhost:3000/contas/2/usuario`

#### 4. Excluir uma conta bancária

Para exclusão da conta, também deverá ser informado o número da conta a ser excluída, como parâmetro de rota.

`http://localhost:3000/contas/2/usuario`

#### 5. Depositar em uma conta bancária

`http://localhost:3000/contas/transacoes/depositar`

No body da requisição deverão ser informados o número da conta e o valor, no formato JSON, conforme exemplo abaixo:

```javascript
{
	"numero_conta": "1",
	"valor": 1900
}
```

#### 6. Sacar de uma conta bancária

`http://localhost:3000/contas/transacoes/sacar`

No body da requisição deverão ser informados o número da conta, o valor e a senha, no formato JSON, conforme exemplo abaixo:

```javascript
{
	"numero_conta": "1",
	"valor": 1900,
    	"senha": "123456"
}
```

#### 7. Transferir valores entre contas bancárias

`http://localhost:3000/contas/transacoes/transferir`

No body da requisição deverão ser informados o número das contas de origem e destino, o valor e a senha, no formato JSON, conforme exemplo abaixo:

```javascript
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```

#### 8. Consultar saldo da conta bancária

Para consultar o saldo de determinada conta, deverá ser informado o número da respectiva conta e a senha como parâmetro de consulta:

`http://localhost:3000/contas/saldo?numero_conta=1&senha=12345`
 
#### 9. Emitir extrato bancário

Para emitir o extrato de determinada conta, deverá ser informado o número da respectiva conta e a senha como parâmetro de consulta:

`http://localhost:3000/contas/extrato?numero_conta=2&senha=12345`

Exemplo de resposta:

![image](https://github.com/jessifagundes/criacao-api-banco-digital/assets/157433661/be4d3309-6ae1-412d-9d2d-16423655a18f)
![image](https://github.com/jessifagundes/criacao-api-banco-digital/assets/157433661/ce573ac2-489e-4969-b5b3-b9a9cba5079c)

