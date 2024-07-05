export interface Options {
  input: string;
  exclude?: string[];
  prefix?: string;
  suffix?: string | boolean;
  normalize?: boolean;
  normalizeNames?: boolean;
  normalizeKeys?: boolean;
  uppercase?: boolean;
  uppercaseNames?: boolean;
  uppercaseKeys?: boolean;
  prenum?: string;
  output: string;
  customReplacers?: string;
  withParent?: boolean;
}

export interface Replacer {
  regExp: RegExp;
  replaceWith: string;
}
