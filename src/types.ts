export interface Options {
  input: string;
  exclude?: string[];
  suffix?: string | boolean;
  parse?: boolean;
  uppercase?: boolean;
  output: string;
}

export interface Replacer {
  regExp: RegExp;
  replaceWith: string;
}
