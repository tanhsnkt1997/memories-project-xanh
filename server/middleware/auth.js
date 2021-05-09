import jwt from "jsonwebtoken";

//wants to like a post
//click the like button => auth middleware(NEXT) check has permission like => like controllers
//sau khi đăng nhập hoặc đăng kí => nhận đc token =>action like ,...=> kiểm tra token có hợp lệ hay k
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //token > 500 => gooogle
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");
      console.log("decode data trong middleware", decodedData)
      req.userId = decodedData?.id;
    } else {
      //google
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; //sub: id phân biệt ng dùng google
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Error token" });
    // console.log(error);
  }
};

export default auth;
