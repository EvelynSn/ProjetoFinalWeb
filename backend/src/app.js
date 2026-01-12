const express = require("express");
const cors = require("cors");

require("./models"); // 🔥 ESSENCIAL (carrega relações)

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/alunos", require("./routes/alunos.routes"));
app.use("/professores", require("./routes/professores.routes"));
app.use("/cursos", require("./routes/cursos.routes"));
app.use("/disciplinas", require("./routes/disciplinas.routes"));
app.use("/turmas", require("./routes/turmas.routes"));
app.use("/matriculas", require("./routes/matriculas.routes"));

module.exports = app;
