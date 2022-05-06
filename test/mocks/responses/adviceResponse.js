const adviceResponse = {
  status: 200,
  data: {
    total_results: '1',
    query: 'love',
    slips: [
      {
        id: 101,
        advice: "Alway do anything for love, but don't do that.",
        date: '2015-12-08',
      },
    ],
  },
};

const adviceResponseNotFound = {
  data: {
    message: { text: 'No advice slips found matching that search term.' },
  },
};

export { adviceResponse, adviceResponseNotFound };
