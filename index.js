const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/config");
// const path = require("path");
require("dotenv").config();
// Crear el servidor
const app = express();
// Base de datos
dbConnection();
// Directorio publico
app.use(express.static("public"));
// cors
app.use(cors());
// Lectura y parseo del body
app.use(express.json());
// Rutas
app.use("/api/auth", require("./routes/auth"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "public/index.htm"));
// });
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
