import mongoose from "mongoose";

let isConnected = false;

export const connectOnce = async () => {
  if (isConnected) {
    console.log("Já está conectado ao MongoDB.");
    return;
  }

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    console.log("Conexão MongoDB ativa detectada a partir de uma conexão existente.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    // Retentar a conexão após 5 segundos
    setTimeout(connectOnce, 5000);
  }

  mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("Conexão ao MongoDB estabelecida.");
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log("Conexão com MongoDB perdida.");
  });

  mongoose.connection.on("error", (error) => {
    isConnected = false;
    console.error("Erro de conexão com MongoDB:", error);
  });
};
