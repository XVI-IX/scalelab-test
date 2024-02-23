interface Context {
  username?: string;
  url?: string;
  emails?: string[];
  subject?: string;
  content?: string;
}

export interface EmailData {
  to?: string;
  data: Context;
}
