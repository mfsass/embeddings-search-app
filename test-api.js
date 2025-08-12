// Simple test to verify API response structure
const http = require('http');

const postData = JSON.stringify({
  query: 'high spender',
  topK: 2
});

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing API endpoint...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  let data = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n=== API Response ===');
      console.log(JSON.stringify(response, null, 2));

      if (response.results && response.results.length > 0) {
        console.log('\n=== First Result Fields ===');
        console.log('Available fields:', Object.keys(response.results[0]));

        const firstResult = response.results[0];
        console.log('age:', firstResult.age);
        console.log('dependent_count:', firstResult.dependent_count);
        console.log('yearly_spend:', firstResult.yearly_spend);
        console.log('campaign_vouchers:', firstResult.campaign_vouchers);
        console.log('regular_vouchers:', firstResult.regular_vouchers);
        console.log('brand_count:', firstResult.brand_count);
      }
    } catch (e) {
      console.error('Failed to parse response:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
