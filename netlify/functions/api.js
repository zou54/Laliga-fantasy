const https = require('https');

exports.handler = async function(event) {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  const params = event.queryStringParameters || {};
  const TOKEN = params.token || '';
  const path = params.path || '/competitions/PD/standings';
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.football-data.org',
      path: `/v4${path}`,
      method: 'GET',
      headers: { 'X-Auth-Token': TOKEN, 'Accept': 'application/json' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: CORS, body: data }));
    });
    req.on('error', e => resolve({ statusCode: 500, headers: CORS, body: JSON.stringify({ message: e.message }) }));
    req.end();
  });
};
