export interface Options {
  input: string;
  exclude?: string[];
  prefix?: string;
  suffix?: string | boolean;
  normalize?: boolean;
  uppercase?: boolean;
  output: string;
}

export interface Replacer {
  regExp: RegExp;
  replaceWith: string;
}
