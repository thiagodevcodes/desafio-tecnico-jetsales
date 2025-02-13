<div align="center">
    <h1>
        Desafio Técnico - Desenvolvimento Web Jr (Jetsales)
    </h1>
</div>

## ⚡ Funcionalidades

- **Disparo automático de mensagens:**  O sistema disponibiliza um endpoint que recebe uma requisição e então envia automaticamente a mensage recebida para o número informado;

- **Registro de Logs:** Quando uma mensagem é disparada, o registro da ação é salvo no banco de dados contendo os dados: telefone, mensagem e status; 

## ⚙️ Resolução:

- O desafio técnico foi implementado com uma arquitetura que inclui um serviço frontend e um backend dividido em duas partes: **Producer** e **Consumer**.

- O **Frontend** serve como interface com o usuário, gerando um QR code para acesso ao WhatsApp. Após a autenticação, ele envia uma requisição para o endpoint `/send-message`, que aciona o backend.

- O **Backend** é composto por duas partes:
    - O Producer recebe a mensagem, valida os dados de entrada (telefone e conteúdo da mensagem) e os publica na fila `messageQueue` do **RabbitMQ**.

    - O Consumer fica monitorando essa fila e, quando novas mensagens chegam, as processa, executando o endpoint da API do WhatsApp para enviar a mensagem. Além disso, registra essa ação no banco de dados **PostgreSql**.


## 🛠️ Tecnologias Utilizadas

### Para o Backend :

- Node.js: Execução de JavaScript no servidor;
- Express: Framework para APIs em Node.js;
- RabbitMQ: Mensageria entre sistemas;
- whatsapp-web.js: Integração com WhatsApp;
- PostgreSQL: Banco de dados relacional;

### Para o Frontend :
- Javascript: Linguagem de programação;
- React: Biblioteca para UI;
- Axios/Fetch: Cliente HTTP;
- Vite: Ferramenta de build;
- HTML: Estrutura de conteúdo web;

## 📌 Pré-requisitos
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas :

- [Node.js](https://nodejs.org/en)
- [RabbitMq](https://www.rabbitmq.com/docs/download)
- [PostgreSql](https://www.postgresql.org/download/)

## 🚀 Iniciar Projeto
#### Para o projeto funcionar corretamente, é preciso que o RabbitMq e PostgreSql esteja sendo executado;

### Instalação :
    # Clone este repositório
    $ git clone https://github.com/thiagodevcodes/desafio-tecnico-jetsales

### Iniciando Servidor (Backend) :
    # Acesse a pasta do producer do projeto no terminal/cmd
    Na pasta raiz do projeto execute
    $ cd producer

    # Instale as dependências do projeto
    $ npm i

    # Crie o arquivo .env com os campos abaixo
    @"
    RABBITMQ_URL= {URL DE CONEXÃO COM O RABBITMQ} Ex. amqp://localhost
    QUEUE_NAME={NOME DA FILA DO RABBITMQ} Ex. messageQueue
    "@ | Out-File -Encoding utf8 .env


    # Aplicação executada na porta 4000
    $ node index.js
###
    # Acesse a pasta do consumer do projeto no terminal/cmd
    # Na pasta raiz do projeto execute
    $ cd consumer

    # Crie um arquivo ".env" com os campos abaixo
    @"
    DB_USER={SEU USUÁRIO DO BANCO DE DADOS} Ex. postgres
    DB_HOST={SEU HOST } Ex. localhost
    DB_NAME={NOME DO SEU BANCO DE DADOS}
    DB_PASSWORD={SENHA DO SEU BANCO DE DADOS}
    DB_PORT={PORTA PARA ACESSO AO BANCO} Ex. 5432
    RABBITMQ_URL= {URL DE CONEXÃO COM O RABBITMQ} Ex. amqp://localhost
    QUEUE_NAME={NOME DA FILA DO RABBITMQ} Ex. messageQueue
    "@ | Out-File -Encoding utf8 .env

    # Instale as dependências do projeto
    $ npm i

    # Aplicação executada na porta 3000
    $ node index.js
    

### Iniciando o Cliente web (Frontend) :
    # Acesse a pasta do servidor do projeto no terminal/cmd
    # Na pasta raiz do projeto execute
    $ cd frontend

    # Instale as dependências do projeto
    $ npm i

    # Execute a aplicação
    $ npm run dev
####
    # O cliente iniciará na porta: 5173
    # Acesse: http://localhost:5173
