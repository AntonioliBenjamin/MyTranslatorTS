import { db } from "../databases";


export type Translation = {
  originalText: string;
  translation: string;
  language: string;
};

export class TranslationStorage {
  saveTranslation(userId: string, translation: Translation | Translation[]) {
    db.set(userId, translation);
  }

  getTranslationById(userId: string) {
    return db.get(userId);
  }
}
