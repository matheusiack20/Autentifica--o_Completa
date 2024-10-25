import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Tornando opcional para usuários que se autenticam via Google ou Facebook
    role: { type: String, default: 'user' }, // Campo para armazenar o papel do usuário
    image: { type: String }, // Para armazenar a URL da imagem do perfil (opcional)
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
