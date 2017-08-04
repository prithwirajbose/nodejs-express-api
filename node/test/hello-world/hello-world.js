var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../../server');
var should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('hello-world', () => {

    var SERVICE_URL = '/service/hello-world';

    beforeEach((done) => {
        done();
    });

    /*
     * Test the /POST search
     */
    it('should get results if sent a valid request', (done) => {
        chai.request(server)
            .post(SERVICE_URL)
            .send({
                "firstName": "Prithwiraj",
                "lastName": "Bose"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('object');
                res.body.data.message.should.be.a('string');
                res.body.data.message.should.be.eql('Hello Prithwiraj Bose');
                done();
            });
    });


});