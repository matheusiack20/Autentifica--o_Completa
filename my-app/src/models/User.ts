import mongoose, { Schema, Document, Model } from "mongoose";
import argon2 from "argon2";

// Interface para tipagem do documento User
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  image: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

// Interface para o modelo User, que inclui o método estático
interface IUserModel extends Model<IUser> {
  findUserWithPassword: (email: string, password: string) => Promise<IUser | null>;
}

// Definição do Schema do User
const userSchema = new Schema<IUser>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      validate: {
        validator: function (v: string) {
          return /\S+@\S+\.\S+/.test(v); // Validação simples para o formato de email
        },
        message: props => `${props.value} não é um email válido!`
      }
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "user" },
    image: { type: String, default: "/Generic_avatar.png" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
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
  try {
    const user = await this.findOne({ email });

    if (!user) return null;

    const isValid = await argon2.verify(user.password, password.trim()); // Verifica se a senha fornecida é válida
    if (!isValid) return null;

    return user;
  } catch (error) {
    console.error("Erro ao encontrar usuário com a senha:", error);
    return null; // Ou lançar erro dependendo da sua estratégia de tratamento de erro
  }
};

// Hook para hashear a senha antes de salvar o usuário
userSchema.pre('save', async function(next) {
  const user = this as IUser;
  if (user.isModified('password')) {
    user.password = await argon2.hash(user.password); // Hash da senha antes de salvar
  }
  next();
});

// Verifica se o modelo já está registrado para evitar sobrescrever
const User = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
