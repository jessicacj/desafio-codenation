const axios = require('axios');

async function getData() {
  return await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=e8f6ac17942668b515c27525920c005b8d2ec264');
}

async function saveData(form) {
  return await axios.post('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=e8f6ac17942668b515c27525920c005b8d2ec264', form, {
    headers: form.getHeaders()
  }).then(r => {
    console.log(r.data);
  })
}

module.exports = { getData, saveData };