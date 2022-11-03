const express = require("express");
const router = express.Router();
import { TranslationGateway } from "../gateways/TranslationGateway";
import {Translation, InMemoryTranslationStorage,} from "../storage/InMemoryTranslationStorage";

const inMemoryTranslationStorage = new InMemoryTranslationStorage();
const translationGateway = new TranslationGateway(inMemoryTranslationStorage);

router.post("/", async (req, res) => {
  const body = {
    text: req.body.text,
    language: req.body.language,
    email: req.body.email,
  };

  const userId = req.user.uuid;

  const isAlreadyTranslated = translationGateway.search(userId, body.text);
  if (isAlreadyTranslated) {
    return res.send({
      originalText: body.text,
      translatedText: isAlreadyTranslated.translation,
      userId: userId,
    });
  }

  const translatedText = await translationGateway.translate(
    body.text,
    body.language,
  );

  const savedTranslation: Translation = {
    originalText: body.text,
    translation: translatedText,
    language: body.language,
  };

  const hasAlreadySavedTranslation = inMemoryTranslationStorage.getById(userId);

  if (hasAlreadySavedTranslation) {
    hasAlreadySavedTranslation.push(savedTranslation);
    inMemoryTranslationStorage.save(userId, hasAlreadySavedTranslation);
  } else {
    inMemoryTranslationStorage.save(userId, [savedTranslation]);
  }
  return res.send({
    originalText: body.text,
    language: body.language,
    translatedText: translatedText,
  });
});

export default router;