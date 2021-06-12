export interface TypeUk {
  n: string;
  e: string;
}
export interface TypePk {
  n: string;
  e: string;
  d: string;
  p: string;
  q: string;
  dmp1: string;
  dmq1: string;
  coeff: string;
}
interface keyAes {
  sigBytes: number;
  words: Array<number>;
}
export interface TypeAES {
  key: keyAes | null;
  iv: keyAes | null;
}
