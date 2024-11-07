import { connectOnce } from "./db";
import dotenv from 'dotenv';
dotenv.config();


async function testConnection() {
  try {
    await connectOnce();
    console.log("Conexão com MongoDB bem-sucedida");
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
  }
}

testConnection();
