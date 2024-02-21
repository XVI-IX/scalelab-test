interface Context {
  username?: string;
  url?: string;
}

export interface EmailData {
  to: string;
  data: Context;
}
