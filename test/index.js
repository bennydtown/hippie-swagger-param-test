var hippie = require('hippie-swagger')
var swagger = require('../swagger.json')
var SwaggerParser = require('swagger-parser')

var app = require('../app')

function testEndpoint (app, apiDefinition, done) {
  hippie(app, swagger, { errorOnExtraParameters: false })
    .post('/')
    .send({dummy: "foo"})
    .form()
    .header('User-Agent', 'hippie')
    .expectStatus(200)
    .end(done)
}

describe('Test /', function () {
  it('Test Without dereferencing swagger first', function (done) {
    testEndpoint(app, swagger, done)
  })

  it('Test with dereferencing swagger first', function (done) {
    SwaggerParser.dereference(swagger, {}, function (err, dereferencedSwagger) {
      testEndpoint(app, dereferencedSwagger, done)
    })
  })
})
