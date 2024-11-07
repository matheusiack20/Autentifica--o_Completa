import mongoose, { Schema, Document } from "mongoose";
import argon2 from "argon2";

// Interface para tipagem do modelo User
interface IUser extends Document {
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

// Definição do Schema do User
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" },
    image: { type: String, default: "/Generic_avatar.png" },
  },
  {
    timestamps: true, // Cria os campos createdAt e updatedAt automaticamente
  }
);

// Middleware para hash de senha antes de salvar
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  // Se a senha foi modificada ou é um novo usuário
  if (!user.isModified("password")) return next();

  try {
    // Cria o hash da senha com salting
    const hashedPassword = await argon2.hash(user.password);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar a senha fornecida com a armazenada
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as IUser;
  return argon2.verify(user.password, password);
};

// Função para encontrar o usuário e verificar a senha
userSchema.statics.findUserWithPassword = async function (
  email: string,
  password: string
): Promise<IUser | null> {
  const user = await this.findOne({ email });

  if (!user) return null;

  const isValid = await argon2.verify(user.password, password.trim()); // Verifica se a senha fornecida é válida
  if (!isValid) return null;

  return user;
};

// Verifica se o modelo já está registrado para evitar sobrescrever
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
