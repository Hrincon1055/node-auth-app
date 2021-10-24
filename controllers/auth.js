const { response, request } = require("express");
const Usuario = require("../models/Usuario");
const bcript = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  try {
    // Verificar email
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email",
      });
    }
    // Crear usuario con modelo
    const dbUser = new Usuario(req.body);
    // Hashear contraseña
    const salt = bcript.genSaltSync();
    dbUser.password = bcript.hashSync(password, salt);
    // Generar jwt
    const token = await generarJWT(dbUser.id, name);
    // crear el usuario
    await dbUser.save();
    // respuesta
    return res.status(200).json({
      ok: true,
      uid: dbUser.id,
      name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};
const loginUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const dbUser = await Usuario.findOne({ email });
    if (!dbUser) {
      return res.status(404).json({
        ok: false,
        msg: "El correo no existe.",
      });
    }
    // Confirmar password
    const validPassword = bcript.compareSync(password, dbUser.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "El passwor es valido.",
      });
    }
    // Generar jwt
    const token = await generarJWT(dbUser.id, dbUser.name);
    // respuesta
    return res.status(200).json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};
const revalidarToken = async (req = request, res = response) => {
  const { uid } = req;
  try {
    const dbUser = await Usuario.findById(uid);
    // Generar jwt
    const token = await generarJWT(uid, dbUser.name);
    return res.json({
      ok: true,
      uid,
      name: dbUser.name,
      email: dbUser.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};
module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
