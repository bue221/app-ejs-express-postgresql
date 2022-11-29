// Libreria de generacion de rutas para node
import { Router } from "express";
// Libreria de postgres para node
import pkg from "pg";
const { Pool } = pkg;

// Es la conexión a la base de datos
const pool = new Pool({
  user: "admin", // se cambia segun entorno
  database: "testdb", // se cambia segun entorno
  password: "admin", // se cambia segun entorno
  port: 5432,
});

// rutas
const router = Router();

// rutas de vistas
router.get("/", (req, res) => {
  const sql = "SELECT * FROM persona";

  pool.query(sql, (error, results) => {
    if (error) {
      throw error;
    }
    res.render("personas", { data: results?.rows });
  });
});

router.get("/crear", (req, res) => {
  res.render("crear");
});

router.get("/editar/:id", (req, res) => {
  let id = req.params.id;
  const sql = `SELECT * FROM persona where cedula='${id}'`;

  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.render("editar", { info: results?.rows[0] });
  });
});

// Rutas de logica

router.post("/crearP", (req, res) => {
  const { cedula, apellido, correo, nombre, telefono } = req.body; // obtengo data que venga desde el formulario de crear
  const sql = `INSERT INTO persona(cedula,apellido,correo,nombre,telefono) VALUES(${cedula},${apellido},${correo},${nombre},${telefono});`; // query de sql
  // Ejecucion de la query
  pool.query(sql, (error, _) => {
    if (error) {
      console.log(error);
    }
  });
  // apenas se termine de ejecutar la query se envia a la tabla
  res.redirect("/");
});

router.put("/editarP/:id", (req, res) => {
  let id = req.params.id;
  const { cedula, apellido, correo, nombre, telefono } = req.body; // obtengo data que venga desde el formulario de crear
  const sql = `UPDATE personas
SET cedula = ${cedula}, apellido = ${apellido}, correo = ${correo}, nombre = ${nombre}, telefono = ${telefono}
WHERE cedula = '${id}';`; // query de sql
  // Ejecucion de la query
  pool.query(sql, (error, _) => {
    if (error) {
      throw error;
    }
  });
  // apenas se termine de ejecutar la query se envia a la tabla
  res.redirect("/");
});

export default router;
