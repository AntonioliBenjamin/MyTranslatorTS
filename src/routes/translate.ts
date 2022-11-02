const express = require("express");
const router = express.Router();
const search = require("../functions/seach");
import { TranslationGateway } from "../gateways/TranslationGateway";
import { Translation, TranslationStorage } from "../storage/TranslationStorage";

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

  const translatedText = await translationGateway.translate(body.text, body.language);
  const savedTranslation: Translation = {
    originalText: body.text,
    translation: translatedText,
    language: body.language,
  };

  const hasAlreadySavedTranslation =
    translationStorage.getById(userId);
  
    
  if (hasAlreadySavedTranslation) {
    hasAlreadySavedTranslation.push(savedTranslation);
    translationStorage.save(userId, hasAlreadySavedTranslation);
  } else {
    translationStorage.save(userId, [savedTranslation]);
  }
  return res.send({
    originalText: body.text,
    language: body.language,
    translatedText: translatedText,
  });
});

export default router;
