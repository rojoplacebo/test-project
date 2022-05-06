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
        const { advice: createdAdvice } = await Advice.query().insert({
          api_id: 992135,
          advice,
        });

        return res.send(createdAdvice);
      }
    })
    .catch((err) => res.send(err));
});

export default router;
