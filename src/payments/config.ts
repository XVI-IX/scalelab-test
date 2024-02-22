interface Config {
  PAYSTACK_KEY: string;
  URL: string;
  TRANSACTION_FEE: number;
}

const config: Config = {
  PAYSTACK_KEY: process.env.PAYSTACK_KEY,
  URL: process.env.URL,
  TRANSACTION_FEE: Number(process.env.TRANSACTION_FEE),
};

export default config;
