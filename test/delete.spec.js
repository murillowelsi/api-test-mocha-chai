import chai from "chai";
import chaiHttp from "chai-http";
import taskModel from "../models/task"

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('delete', () => {
    context('quando a tarefa existe', () => {
        let task = {
            _id: require('mongoose').Types.ObjectId(),
            title: 'Lavar a louça',
            owner: 'murillo.welsi@gmail.com',
            done: false
        }

        before((done) => {
            taskModel.insertMany([task]);
            done();
        });

        it('deve retornar 200 quando apago uma tarefa', (done) => {
            request
                .delete('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.eql({});
                    done();
                })
        });

        after((done) => {
            request
                .get('/task/' + task._id)
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res.body).to.eql({});
                    done();
                })
        });
    });

    context('quando a tarefa não existe', () => {
        it('deve retornar 404', (done) => {
            let id = require('mongoose').Types.ObjectId();

            request
                .delete('/task/' + id)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.eql({});
                    done();
                })
        });
    });
});
