import { Router } from "express";
import { server } from "../Server";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", (req, res) => {
  return res.send("Bem vindo");
});

// rota de auth/login com jwt
const secretKey = "1234";
const refreshSecret = "4321";
server.post("/generate-token", (req, res) => {
  const { email, guid } = req.body;

  if (!email || !guid) {
    return res.status(400).json({ message: "E-mail e GUID são obrigatórios." });
  }
  const payload = {
    email: email,
    guid: guid,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  return res.status(200).json({ token: token });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//rota para fazer o refresh token

router.post("/auth/refresh", (req, res) => {
  const { refresh } = req.body;

  if (!refresh) {
    return res.status(400).json({ message: "Refresh token não fornecido" });
  }
  try {
    const decoded = jwt.verify(refresh, refreshSecret);
    const newAccessToken = jwt.sign({ user: decoded }, secretKey, {
      expiresIn: "15m",
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Refresh token inválido" });
  }
});

export { router };
