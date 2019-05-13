const jwt = require('jwt-simple');

const getToken = (data = null, secret = 'deeZnutsequ@ls') => {
    payload = data || { status: 'dummy object' };

   /*  if (null != data && undefined != data && (data instanceof Object)) {
        payload = data;
    } */

    const token = jwt.encode(payload, secret);

    return { token };
};

const validateToken = (token, secret) => { 
    const decoded = jwt.decode(token, secret);

    return decoded;
};

module.exports = {
    getToken,
    validateToken
};