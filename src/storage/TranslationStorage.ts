import { db } from "../databases";


export type Translation = {
  originalText: string;
  translation: string;
  language: string;
};

export class TranslationStorage {
  save(userId: string, translation: Translation[]) {
    db.set(userId, translation);
  }

  getById(userId: string) {
    return db.get(userId);
  }
}
