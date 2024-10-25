import User from "../../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "../../../../utils/db";

export async function GET(request, { params }) {
  // Use await para acessar params se necessário
  const nextauthParams = await params.nextauth; 
  const cookies = request.cookies; 
  const headers = request.headers; 

  // Exemplo de como acessar cookies e headers
  const myCookie = cookies.get('myCookie') || null; // Atribui null se o cookie não existir
  const myHeader = headers.get('my-header') || null; // Atribui null se o header não existir

  return NextResponse.json({
    nextauthParams,
    myCookie,
    myHeader,
  });
}

// Códigos de status HTTP
const STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validação dos dados de entrada
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios!" },
        { status: STATUS.BAD_REQUEST }
      );
    }

    await connect(); // Conecta ao banco de dados

    // Verifica se o e-mail já está cadastrado
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return NextResponse.json(
        { message: "E-mail já cadastrado!" },
        { status: STATUS.CONFLICT }
      );
    }

    // Hashing da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Usuário criado com sucesso!" },
      { status: STATUS.CREATED }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error); // Log do erro no servidor
    return NextResponse.json(
      { error: "Erro ao cadastrar usuário. Tente novamente mais tarde." },
      { status: STATUS.SERVER_ERROR }
    );
  }
}
