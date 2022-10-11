import bcrypt from 'bcrypt';

async function generatePassword(password) {
  return await bcrypt.hash(password, parseInt(process.env.saltRounds));
}

export {
  generatePassword
};