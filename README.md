# Sobre o Código

Esse código foi utilizado no curso [Testando um Micro Serviço com Mocha e Chai.js](http://qaninja.io/) da QA Ninja.

# Guia de Uso com Docker

## Rede

`
docker network create --driver bridge skynet
`

## MongoDB

`
docker run --name mongo --network=skynet -d -p 27017:27017 mongo
`

## RabbitMQ

`
docker run -d --hostname rabbitmq --name rabbitmq --network=skynet -p 15672:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management
`
### Hosteando

### Windows

> Abra o prompt como Admin

`
notepad c:\windows\system32\drivers\etc\hosts
`
### Mac/Linux

> Com VIM :)
`
sudo code /etc/hosts
`

> Com VSCode
`
sudo vim /etc/hosts
`

### Acrescente as configurações

#### URL do MongoDb
`
127.0.0.1   mongo
`

#### URL do RabbitMQ
`
127.0.0.1   rabbitmq
`

#### URL do Jenkins :)
`
127.0.0.1   jenkins
`

> Não esqueça de trocar os IPS pelo Alias no código fonte :)

# Exemplo da Integração

![Alt text](docs/Treko.jpg?raw=true "Exemplo")
