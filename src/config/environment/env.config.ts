interface Config {
  adminMail: string[];
}

const config: Config = {
  adminMail: process.env.ADMIN_MAIL.split(','),
};

export default config;
