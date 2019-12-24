const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedTok = jwt.verify(token, 'secretpassword123+');
    req.userData = {email: decodedTok.email, userId: decodedTok.userId};
    next();
  } catch (e) {
    res.status(401).json({message: 'Auth failed'});
  }

};
