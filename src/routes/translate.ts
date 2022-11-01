const express = require("express");
const router = express.Router();
const search = require("../functions/seach");
import axios from "axios";
import { Translation, TranslationStorage } from "../storage/TranslationStorage";
const apiKeyTrad = process.env.API_KEY;

class TranslationGateway {
  async translate(text: string , targetLanguage: string)  {
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
}

const translationStorage = new TranslationStorage();
const translationGateway = new TranslationGateway();

router.post("/", async (req, res) => {
  const body = {
    text: req.body.text,
    language: req.body.language,
    email: req.body.email,
  };

  const userId = req.user.uuid;

  const isAlreadyTranslated = search(userId, body.text);
  if (isAlreadyTranslated) {
    return res.send({
      originalText: body.text,
      translatedText: isAlreadyTranslated.translation,
      userId: userId,
    });
  }

  const translation = await translationGateway.translate(body.text, body.language);
  const translatedText = translation.data.translations[0].translatedText;
  const savedTranslation: Translation = {
    originalText: body.text,
    translation: translatedText,
    language: body.language,
  };

  const hasAlreadySavedTranslation =
    translationStorage.getTranslationById(userId);
  
    
  if (hasAlreadySavedTranslation) {
    hasAlreadySavedTranslation.push(savedTranslation);
    translationStorage.saveTranslation(userId, hasAlreadySavedTranslation);
  } else {
    translationStorage.saveTranslation(userId, [savedTranslation]);
  }
  return res.send({
    translatedText: translatedText,
  });
});

export default router;
