interface Config {
  adminMail: string[];
  JWT_SECRET: string;
  RESET_SECRET: string;
  URL: string;
  EMAIL_PASS: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
}

const config: Config = {
  adminMail: String(process.env.ADMIN_MAIL).split(' '),
  JWT_SECRET: process.env.JWT_SECRET,
  RESET_SECRET: process.env.RESET_SECRET,
  URL: process.env.URL,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
};

export default config;
