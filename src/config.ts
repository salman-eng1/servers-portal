import dotenv from 'dotenv';
dotenv.config({});

// if (process.env.ENABLE_APM === '1') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   require('elastic-apm-node').start({
//     serviceName: 'jobber-gateway',
//     serverUrl: process.env.ELASTIC_APM_SERVER_URL,
//     secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
//     environment: process.env.NODE_ENV,
//     active: true,
//     captureBody: 'all',
//     errorOnAbortedRequests: true,
//     captureErrorLogStackTraces: 'always'
//   });
// }

class Config {
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;

  

  constructor() {
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';



}
}
export const config: Config = new Config();