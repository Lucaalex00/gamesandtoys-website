import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Utente non trovato" });
      }

      req.user = user; // Ora hai accesso a tutto: _id, email, category, name...

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Non autorizzato, token non valido: " + error });
    }
  } else {
    return res.status(401).json({ message: "Token mancante" });
  }
};

export default protect;
