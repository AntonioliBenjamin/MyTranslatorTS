const axios = require("axios");
const apiKeyTrad = process.env.API_KEY;

async function translate(text, targetLanguage) {
  const encodedParams = new URLSearchParams();
  encodedParams.append("q", text);
  encodedParams.append("target", targetLanguage);

  const options = {
    method: "POST",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": `${apiKeyTrad}`,
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
    data: encodedParams,
  };

  const response = await axios.request(options);
  return response.data;
}
//ok
module.exports = translate;
//export default translate