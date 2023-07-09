const bcrypt = require("bcryptjs");

const generateUserPassword = (password) => bcrypt.hashSync(password, 10);

const cpmparePassword = (password, anotherPassword) => bcrypt.compareSync(password, anotherPassword)

console.log(cpmparePassword("Abc", "$2a$10$Iw6kxZ4E/R4AsUJoCQElwOlLQGJ7z0x5ebKgM2fgUqGdxuvzfMHV6"));


exports.generateUserPassword = generateUserPassword;
exports.cpmparePassword = cpmparePassword;