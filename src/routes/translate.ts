const express = require('express');
const router = express.Router();
const search = require('../functions/seach');
const translate = require('../functions/translate');
//const {db} = require('../../databases')
import {db} from '../databases'

type translate = {

}


router.post("/", async (req, res) => {
    const body = {
      text: req.body.text,
      language: req.body.language,
      email: req.body.email,
    };
  
    const userData = req.user.userId ;
    const userId = userData.uuid;
    //const userId = req.user.userId

    const isAlreadyTranslated = search(userId, body.text);
    if (isAlreadyTranslated) {
      return res.send({
        originalText: body.text,
        translatedText: isAlreadyTranslated.translation,
        uuid: userId,
      });
    }
    const translation = await translate(body.text, body.language);
    const translatedText = translation.data.translations[0].translatedText;
    const savedTranslation = {
      originalText: body.text,
      translation: translatedText,
      language: body.language,
    };
  
    const hasAlreadySavedTranslation = db.get(userId);
    if (hasAlreadySavedTranslation) {
      hasAlreadySavedTranslation.push(savedTranslation);
      db.set(userId, hasAlreadySavedTranslation);
    } else {
      db.set(userId, [savedTranslation]);
    }
  
    return res.send({
      originalText: body.text,
      translatedText: translatedText,
      uuid: userId,
    });
  });

  //module.exports = router;
  export default router;