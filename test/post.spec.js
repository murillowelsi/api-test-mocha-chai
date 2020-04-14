import chai from "chai";
import chaiHttp from "chai-http";
import taskModel from "../models/task"

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;
const rabbit = chai.request('http://rabbitmq:15672')

describe('post', () => {
    context('quando eu cadastro uma tarefa', () => {
        let task = { title: 'Estudar o mongoose', owner: 'murillo.welsi@gmail.com', done: false }

        before((done) => {
            rabbit
                .delete('/api/queues/%2F/tasksdev/contents')
                .auth('guest', 'guest')
                .end((err, res) => {
                    expect(res).to.has.status(204);
                    done();
                })
        });

        it('então deve retornar 200', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.data.title).to.be.an('string')
                    expect(res.body.data.owner).to.be.an('string')
                    expect(res.body.data.done).to.be.an('boolean')
                    done();
                })
        });

        it('e deve enviar uma mensagem na fila do RabbitMQ', (done) => {
            let payload = { ackmode: "ack_requeue_true", count: "1", encoding: "auto", name: "tasksdev", truncate: "50000", vhost: "/" }

            rabbit
                .post('/api/queues/%2F/tasksdev/get')
                .auth('guest', 'guest')
                .send(payload)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body[0].payload).to.contain(`Tarefa ${task.title} criada com sucesso!`);
                    done();
                })
        });
    });

    context('quando não informo o título da tarefa', () => {
        let task = { title: '', owner: 'murillo.welsi@gmail.com', done: false }

        it('então deve retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.title.message).to.eql('Oops! Title is required.');
                    done();
                })
        });
    });

    context('quando não informo o dono da tarefa', () => {
        let task = { title: 'Tarefa sem dono', owner: '', done: false }

        it('então deve retornar 400', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(400);
                    expect(res.body.errors.owner.message).to.eql('Oops! Owner is required.');
                    done();
                })
        });
    });

    context('quando a tarefa já existe', () => {
        let task = { title: "Planejar viagem para a China", owner: 'murillo.welsi@gmail.com', done: false }

        before((done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    done()
                })
        });

        it('deve retornar o erro 409', (done) => {
            request
                .post('/task')
                .send(task)
                .end((err, res) => {
                    expect(res).to.has.status(409);
                    expect(res.body.errmsg).to.include('duplicate key')
                    done();
                })
        });
    });
});