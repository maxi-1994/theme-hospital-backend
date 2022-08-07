const jwt = require('jsonwebtoken'); // npm i jsonwebtoken

const getJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid: uid
        }
    
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            {
                expiresIn: '12h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

module.exports = {
    getJWT,
}