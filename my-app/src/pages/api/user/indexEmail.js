// src/pages/api/user/indexEmail.js
const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
    <style>
        body { background-color: #ffffff; color: #000000; font-family: Arial, sans-serif; }
        .header { background-color: #000000; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #ffffff; }
        .token { font-weight: bold; font-size: 1.2em; color: #333333; }
        .footer{ background-color: #DAFD00; color: #ffffff; padding: 20px; text-align: center; width: 100%;}
    </style>
</head>
<body>
    <div class="header">
        <img src="https://media.licdn.com/dms/image/v2/D4D1BAQGzamC8NiJEhQ/company-background_10000/company-background_10000/0/1654550588153/mapmarketplaces_cover?e=2147483647&v=beta&t=XpKrj-evAMd3SY4OUnF0UjBc-7aZ7kEugnjDuwBZhJ8" alt="Logo" width="420" style="max-width: 100%;">
        <h1>Recuperação de Senha</h1>
    </div>
    <div class="content">
        <p>Olá,</p>
        <p>Você solicitou a recuperação da sua senha! Use o seguinte token para redefinir sua senha:</p>
        <p class="token">{{TOKEN}}</p>
    </div>

    <div class="footer">
    <img src="https://media.licdn.com/dms/image/v2/D4D1BAQGzamC8NiJEhQ/company-background_10000/company-background_10000/0/1654550588153/mapmarketplaces_cover?e=2147483647&v=beta&t=XpKrj-evAMd3SY4OUnF0UjBc-7aZ7kEugnjDuwBZhJ8" alt="Logo" width="420" style="max-width: 100%;">
    </div>
</body>
</html>
`;

export default htmlContent;
