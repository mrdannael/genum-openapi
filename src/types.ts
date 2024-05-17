export interface Options {
  input: string;
  exclude?: string[];
  prefix?: string;
  suffix?: string | boolean;
  normalize?: boolean;
  uppercase?: boolean;
  prenum?: string;
  output: string;
  customReplacers?: string;
}

export interface Replacer {
  regExp: RegExp;
  replaceWith: string;
}
