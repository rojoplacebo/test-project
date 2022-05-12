import request from 'supertest';
import { Model } from 'objection';
import axios from 'axios';

import app from 'app';
import {
  adviceResponse,
  adviceResponseNotFound,
} from '../mocks/responses/adviceResponse';
import { Advice } from '../../app/advice/model';
import 'test/helpers/dbTransaction';

jest.mock('axios');

describe('jest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  jest.spyOn(Advice, 'query').mockImplementation(() => {
    return Model.query().resolve({
      insert: jest.fn(),
      deleteById: jest.fn(() => 1),
    });
  });

  describe('POST /advice', () => {
    describe('if no query is passed', () => {
      it('returns an error', async () => {
        const { statusCode } = await request(app)
          .post('/advice')
          .send({ query: null });

        expect(statusCode).toBe(400);
      });
    });

    describe('success response', () => {
      it('should return an advice', async () => {
        axios.get.mockResolvedValueOnce(adviceResponse);

        const response = await request(app)
          .post('/advice')
          .query('searchTerm=love')
          .send();

        expect(response.text).toBe(
          "Alway do anything for love, but don't do that.",
        );
        expect(response.statusCode).toBe(200);
      });
    });

    describe('not found advice', () => {
      it('should return an advice', async () => {
        axios.get.mockResolvedValueOnce(adviceResponseNotFound);

        const { statusCode } = await request(app)
          .post('/advice')
          .query('searchTerm=locochon')
          .send();

        expect(statusCode).toBe(404);
      });
    });
  });

  describe('DELETE /advice', () => {
    describe('when deleting and existing advice should send a 200 status code', () => {
      it.only('should delete an advice', async () => {
        const resp = await request(app).delete('/advice/1').send();

        expect(resp).toBe(200);
      });
    });
  });
});
