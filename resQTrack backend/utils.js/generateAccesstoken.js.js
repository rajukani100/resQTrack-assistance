const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.generateaccesstoken = async (userId) => {
  console.log(userId);

  const token = await jwt.sign({ id: userId }, process.env.SECREAT_KEY);

  return token;
};
