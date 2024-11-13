// src/pages/api/user/indexEmail.js

const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
    <style>
        body { background-color: #ffffff; color: #000000; font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; }
        .header { background-color: #000000; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #ffffff; color: #333333; }
        .token { font-weight: bold; font-size: 1.2em; color: #333333; }
        .footer { background-color: #DAFD00; color: #000000; padding: 10px; text-align: center; }
        .logo { max-width: 100%; height: auto; }
        .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #DAFD00; color: #000000; text-decoration: none; font-weight: bold; border-radius: 5px; }
        .button:hover { background-color: #b8c800; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header com logo e título -->
        <div class="header">
            <img src="https://media.licdn.com/dms/image/v2/D4D1BAQGzamC8NiJEhQ/company-background_10000/company-background_10000/0/1654550588153/mapmarketplaces_cover?e=2147483647&v=beta&t=XpKrj-evAMd3SY4OUnF0UjBc-7aZ7kEugnjDuwBZhJ8" alt="Logo" width="420" class="logo">
            <h1>Recuperação de Senha</h1>
        </div>

        <!-- Conteúdo do e-mail com o token -->
        <div class="content">
            <p>Olá,</p>
            <p>Você solicitou a recuperação da sua senha. Utilize o seguinte token para redefinir sua senha:</p>
            <p class="token">{{TOKEN}}</p>
            <p>Se você não solicitou a alteração, ignore este e-mail. O token expirará em 1 hora.</p>
            <a href="{{RESET_URL}}" class="button">Redefinir Senha</a>
        </div>  

        <!-- Rodapé com logo e informações adicionais -->
        <div class="footer">
            <p>Equipe de Suporte</p>
        </div>
    </div>
</body>
</html>
`;

export default htmlContent;
