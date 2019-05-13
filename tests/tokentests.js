const { getToken, validateToken } = require('../custom_modules/TokenManager');
const { log } = require('../custom_modules/log');

log(`\n\t\tThe Token\n\t${JSON.stringify(getToken())}`);
log(`\n\t\tDecoded Token\n${JSON.stringify(validateToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdGF0dXMiOiJkdW1teSBvYmplY3QifQ.XWBN7bDd_fRUCrgMxye5BHcvmKBgqsqnHnDKNBoYnvw', 'deeZnutsequ@ls'))}`);