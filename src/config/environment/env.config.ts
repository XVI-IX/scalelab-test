interface Config {
  adminMail: string[];
  JWT_SECRET: string;
}

const config: Config = {
  adminMail: process.env.ADMIN_MAIL.split(','),
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
