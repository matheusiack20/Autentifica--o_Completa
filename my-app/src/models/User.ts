import mongoose, { Schema, Document, Model } from "mongoose";
import argon2 from "argon2";

// Interface para tipagem do documento User
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  image: string;
  comparePassword: (password: string) => Promise<boolean>;
}

// Interface para o modelo User, que inclui o método estático
interface IUserModel extends Model<IUser> {
  findUserWithPassword: (email: string, password: string) => Promise<IUser | null>;
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

// Método para comparar a senha fornecida com a armazenada
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as IUser;
  return argon2.verify(user.password, password);
};

// Função estática para encontrar o usuário e verificar a senha
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
const User = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
