import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    default: "", // opzionale
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["user", "admin"],
    default: "user", // default per chi si registra
  },
  credito: { type: Number, default: 0 }, // campo credito aggiunto
  note: { type: String, default: "NOTE" }, // campo note aggiunto
});

// Cifra la password prima di salvare
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Confronta la password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema, "users");
export default User;
