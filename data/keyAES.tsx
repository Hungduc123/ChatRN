export interface TypeKeyAES {
  key: { sigBytes: number; words: Array<number> };
  iv: { sigBytes: number; words: Array<number> };
}
