// module to generate random chars (for e.g. as value for the JWT Key environment (.env) var)
import crypto from 'crypto';

const charQuantity = 256;
const stringEncodingFormat = 'base64';

const randomBytes = crypto.randomBytes(charQuantity);

const randomChars = randomBytes.toString(stringEncodingFormat);
console.log(randomChars);