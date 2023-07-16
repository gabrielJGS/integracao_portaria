import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/App/app.module';
const fs = require('fs');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 5000 * 1000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it(
    '/boletos (POST)',
    (done) => {
      const file = fs.createReadStream('test/boletos.csv');

      request(app.getHttpServer())
        .post('/boletos')
        .attach('file', file)
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          done();
        });
    },
    5000 * 1000,
  );

  it(
    '/boletos (GET)',
    (done) => {
      request(app.getHttpServer())
        .get('/boletos')
        .query({ relatorio: 0, valor_inicial: 50 })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res.body[0].nome_sacado).toBe('JOSE DA SILVA');
          expect(res.body[1].nome_sacado).toBe('MARCOS ROBERTO');
          expect(res.body[2].nome_sacado).toBe('MARCIA CARVALHO');
          done();
        });
    },
    5000 * 1000,
  );
  it(
    '/boletos/pdf (POST)',
    (done) => {
      const file = fs.createReadStream('test/boletos.pdf');

      request(app.getHttpServer())
        .post('/boletos/pdf')
        .attach('file', file)
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res.body[0]).toContain('.pdf');
          expect(res.body[1]).toContain('.pdf');
          expect(res.body[2]).toContain('.pdf');
          done();
        });
    },
    5000 * 1000,
  );
});
