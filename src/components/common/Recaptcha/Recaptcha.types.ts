interface RecaptchaInterface {
  onCheck: (_token: string) => void;
  url?: string;
  siteKey?: string;
}

export type RecaptchaProps = RecaptchaInterface;
