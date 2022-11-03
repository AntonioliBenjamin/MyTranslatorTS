import { db } from "../databases";
import { TranslationStorage } from "../interface/TranslationStorage";


export type Translation = {
  originalText: string;
  translation: string;
  language: string;
};

export class InMemoryTranslationStorage implements TranslationStorage {
  save(userId: string, translation: Translation[]): void {
    db.set(userId, translation);
  }

  getById(userId: string): Translation[] {
    return db.get(userId);
  }

}
