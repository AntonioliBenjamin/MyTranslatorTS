import { Translation } from "../storage/InMemoryTranslationStorage";

export interface TranslationStorage {
    save(user: string, text: Object[]): void,
    getById(userId: string): Translation[]
}