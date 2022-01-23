const jwt = require('jsonwebtoken');
const { prompt } = require('enquirer');
const { cyan, yellow, magenta, bold, green } = require('colorette');
const { v4: uuidv4 } = require('uuid');

main();

async function main() {
  console.log(
    cyan(`
┌─────────────────────────┐
│ Degen API Key Generator │
└─────────────────────────┘
`)
  );
  const { description, secret, env } = await getInput();
  const key = generateApiKey(secret, `[${env}] ${description}`);
  console.log(
    green(
      `\nSuccess! ` +
        yellow(
          `The key below can now be used as an 'X-API-KEY' header for the environment you configured it for:\n\n`
        ) +
        bold(magenta(key))
    ) + '\n'
  );
}

async function getInput() {
  return await prompt([
    {
      type: 'input',
      name: 'description',
      validate: (val) =>
        val?.length <= 80
          ? true
          : `[!] Description must be less than ${bold('80')} characters.`,
      message: `Input a ${bold(
        'short description'
      )} of what this API Key is for:`,
    },
    {
      type: 'input',
      name: 'secret',
      message: `Input the ${bold('JWT Secret')} of the ${bold(
        'target env'
      )} for this API Key:`,
    },
    {
      type: 'select',
      name: 'env',
      message: `Select the ${bold('environment')} this key is for:`,
      choices: ['local', 'nonprod', 'prod'],
    },
  ]);
}

function generateApiKey(secret, info) {
  return jwt.sign(
    {
      id: uuidv4(),
      info: info,
    },
    secret,
    { expiresIn: '99 years' }
  );
}
