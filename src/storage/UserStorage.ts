import { dbUser } from "../databases";

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userId: string;
  };

export class UserStorage {
    save(user: User) {
      dbUser.set(user.email, user);
    }
  
    getByEmail(email: string) {
      return dbUser.get(email);
    }
  }