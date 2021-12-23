import { IsNumber, IsString, validateSync } from 'class-validator';

/**
 * This class is used to validate env variables. Instead of
 * using variables directly off of process.env.* pull them
 * from the AppConfig constant.
 */
export class GlobalAppConfig {
  @IsNumber()
  API_PORT: number;

  @IsString()
  DISCORD_CLIENT_ID: string;

  @IsString()
  DISCORD_CLIENT_SECRET: string;

  @IsString()
  DISCORD_TOKEN: string;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  MONGODB_DB: string;

  constructor(config: any) {
    Object.assign(this, config);
    const errors = validateSync(this);

    errors.forEach((error) => {
      console.error(
        `[!] The following env variable is either missing or did not pass validation: ${JSON.stringify(
          error?.constraints
        )}`
      );
    });

    if (
      process.env.NODE_ENV === 'development' &&
      Array.isArray(errors) &&
      errors.length > 0
    ) {
      throw new Error(
        'Missing environment variables, please refer to logs above to ensure required variables are set.'
      );
    }
  }
}

const config = {
  API_PORT: parseInt(process.env.API_PORT ?? '8080', 10),
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB ?? 'degen',
};

const testConfig = {};

/** Validated app-wide dynamic configuration object */
export const AppConfig = new GlobalAppConfig(
  process.env.NODE_ENV !== 'test' ? config : testConfig
);
