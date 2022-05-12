import express from 'express';
import axios from 'axios';
import { Advice } from './app/advice/model';
import { randomIntFromInterval } from './app/helpers/helpers';

const router = express.Router();

router.get('/', (req, res) => res.send('API IS UP!'));

router.post('/advice', async (req, res) => {
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) return res.status(400).send();

  const route = `https://api.adviceslip.com/advice/search/${searchTerm}`;

  await axios
    .get(route)
    .then(async (response) => {
      if (
        response.data?.message?.text ===
        'No advice slips found matching that search term.'
      ) {
        res.status(404).send('Search term not found');
      } else {
        const advice =
          response.data.slips[
            randomIntFromInterval(1, response.data.slips.length) - 1
          ].advice;

        // TODO: replace this with the actual API key
        const { advice: createdAdvice } = await Advice.query()
          .insert({
            api_id: 992135,
            advice,
          })
          .then((data) => data)
          .catch((err) => err);

        return res.send(createdAdvice);
      }
    })
    .catch((err) => res.send(err));
});

router.delete('/advice/:id', async (req, res) => {
  const adviceId = req.params.id;

  const deleted = await Advice.query()
    .deleteById(adviceId)
    .then((response) => response)
    .catch((err) => err);
  if (deleted === 1) res.sendStatus(200);
  else res.sendStatus(404);
});

export default router;
