const jwt = require('jsonwebtoken')

const secret = 'test';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //this distingushes bt google auth token and jwt token--lower than 500 and its our token not googles
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      //we create the req.userId in this middleware and thus controllers that come next in the chain will have access to it

      req.userId = decodedData?.id;
    } else {
        //this is for google auth
      decodedData = jwt.decode(token);
        //this is from google to, sub rep a given user id
      req.userId = decodedData?.sub;
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = auth