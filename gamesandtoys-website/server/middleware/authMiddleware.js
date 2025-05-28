import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        category: decoded.category,
      };
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Non autorizzato, token non valido " + error });
    }
  } else {
    return res.status(401).json({ message: "Non autorizzato, token mancante" });
  }
};

export default protect;
