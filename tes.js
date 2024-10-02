var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://c8c7-103-10-66-29.ngrok-free.app/api/v1/otp/generate/code/otp',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'asxsaxs'
  },
  form: {
    'email': 'ammarjoz09@gmail.com',
    'type': 'email'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
