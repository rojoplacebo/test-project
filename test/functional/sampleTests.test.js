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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('works', () => {
    expect(Math.min()).toBeGreaterThan(Math.max());
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

        jest.spyOn(Advice, 'query').mockImplementationOnce(() => {
          return Model.query().resolve({
            insert: jest.fn(),
          });
        });

        const { text, statusCode } = await request(app)
          .post('/advice')
          .query('searchTerm=love')
          .send();

        expect(text).toBe("Alway do anything for love, but don't do that.");
        expect(statusCode).toBe(200);
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
});
