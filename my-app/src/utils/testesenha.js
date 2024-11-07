import argon2 from 'argon2';
const testPassword = "12121212"; // Senha que foi fornecida
const storedHash = "$argon2id$v=19$m=65536,t=3,p=4$gAPv6PBe5Hwl1lqcq6atVA$mOkhvtfytAfGIGYD/Sguk4VkGkfMiAJKTOjJ7IFIJIU"; // Hash que foi armazenado no banco

const isValid = await argon2.verify(storedHash, testPassword);
console.log("Senha válida:", isValid);
