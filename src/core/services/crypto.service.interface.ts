export interface ICryptoService {
  generateRandomString(length: number): string;
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
