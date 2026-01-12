import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Alunos from "../views/Alunos.vue";
import Professores from "../views/professores.vue";
import Disciplinas from "../views/disciplinas.vue";
import Cursos from "../views/Cursos.vue";
import Turmas from "../views/Turmas.vue";
import Matriculas from "../views/Matriculas.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Dashboard },
    { path: "/alunos", component: Alunos },
    { path: "/professores", component: Professores },
    { path: "/disciplinas", component: Disciplinas },
    { path: "/cursos", component: Cursos },
    { path: "/turmas", component: Turmas },
    { path: "/matriculas", component: Matriculas },
  ],
});
