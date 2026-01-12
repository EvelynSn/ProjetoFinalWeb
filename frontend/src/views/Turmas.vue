<template>
  <div class="turmas-container">
    <div class="page-header">
      <h1>Gestão de turmas</h1>
      <button class="btn-primary" @click="showAddModal = true">
        <span>➕</span>
        Nova Turma
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>DISCIPLINA</th>
            <th>PROFESSOR</th>
            <th>SEMESTRE</th>
            <th>CURSO</th>
            <th>HORÁRIO</th>
            <th>VAGAS</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="turma in turmas" :key="turma.id">
            <td>
              {{ disciplinaTurma(turma.DisciplinaId) }}
            </td>
            <td>{{ professorTurma(turma.ProfessorId) }}</td>
            <td>{{ turma.semestre }}</td>
            <td>{{ cursoTurma(turma.CursoId) }}</td>
            <td>{{ turma.horario }}</td>
            <td>{{ turma.vagasDisponiveis }}/{{ turma.vagasTotal }}</td>
            <td class="actions">
              <button class="btn-icon" @click="editTurma(turma)" title="Editar">
                ✏️
              </button>
              <button
                class="btn-icon btn-danger"
                @click="deleteTurma(turma.id)"
                title="Excluir"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingTurma ? "Editar Turma" : "Nova Turma" }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveTurma">
            <div class="form-group">
              <label>Disciplina *</label>
              <select v-model="form.DisciplinaId" required>
                <option value="">Selecione uma disciplina</option>
                <option
                  v-for="disciplina in disciplinas"
                  :key="disciplina.id"
                  :value="disciplina.id"
                >
                  {{ disciplina.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Professor *</label>
              <select v-model="form.ProfessorId" required>
                <option value="">Selecione um professor</option>
                <option
                  v-for="professor in professores"
                  :key="professor.id"
                  :value="professor.id"
                >
                  {{ professor.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Curso *</label>
              <select v-model="form.CursoId" required>
                <option value="">Selecione um curso</option>
                <option
                  v-for="curso in cursos"
                  :key="curso.id"
                  :value="curso.id"
                >
                  {{ curso.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Semestre *</label>
              <input
                v-model="form.semestre"
                type="text"
                required
                placeholder="Ex: 2025.2"
              />
            </div>
            <div class="form-group">
              <label>Horário *</label>
              <input
                v-model="form.horario"
                type="text"
                required
                placeholder="Ex: Seg/Qua 08:00 - 10:00"
              />
            </div>
            <div class="form-group">
              <label>Vagas *</label>
              <input v-model="form.vagasTotal" type="number" required min="1" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ editingTurma ? "Atualizar" : "Salvar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const turmas = ref([]);
const disciplinas = ref([]);
const professores = ref([]);
const showAddModal = ref(false);
const editingTurma = ref(null);
const cursos = ref([]);
const form = ref({
  DisciplinaId: "",
  ProfessorId: "",
  CursoId: "",
  semestre: "",
  horario: "",
  vagasTotal: 0,
});

const loadTurmas = async () => {
  try {
    const response = await api.get("/turmas");
    turmas.value = response.data;
    console.log(turmas.value);
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  }
};

function disciplinaTurma(disciplinaId) {
  const disciplina = disciplinas.value.find(
    (disciplinaa) => disciplinaa.id == disciplinaId
  );
  return disciplina != null ? disciplina.nome : "";
}
function cursoTurma(cursoId) {
  const curso = cursos.value.find((curso) => curso.id == cursoId);
  return curso ? curso.nome : "Curso não encontrado";
}

function professorTurma(professorId) {
  const professor = professores.value.find(
    (professorr) => professorr.id == professorId
  );
  return professor ? professor.nome : "Sem professor";
}

const loadDisciplinas = async () => {
  try {
    const response = await api.get("/disciplinas");
    disciplinas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar disciplinas:", error);
  }
};
const loadCursos = async () => {
  try {
    const response = await api.get("/cursos");
    cursos.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar disciplinas:", error);
  }
};

const loadProfessores = async () => {
  try {
    const response = await api.get("/professores");
    professores.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar professores:", error);
  }
};

const editTurma = (turma) => {
  editingTurma.value = turma;
  form.value = {
    disciplina_id: turma.disciplina_id || turma.disciplina?.id,
    professor_id: turma.professor_id || turma.professor?.id,
    semestre: turma.semestre,
    horario: turma.horario,
    vagas_total: turma.vagas_total || 50,
  };
  showAddModal.value = true;
};

const saveTurma = async () => {
  try {
    console.log(form.value);
    if (editingTurma.value) {
      await api.put(`/turmas/${editingTurma.value.id}`, form.value);
    } else {
      await api.post("/turmas", form.value);
    }
    closeModal();
    loadTurmas();
  } catch (error) {
    console.error("Erro ao salvar turma:", error);
  }
};

const deleteTurma = async (id) => {
  if (confirm("Tem certeza que deseja excluir esta turma?")) {
    try {
      await api.delete(`/turmas/${id}`);
      loadTurmas();
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingTurma.value = null;
  form.value = {
    disciplina_id: "",
    professor_id: "",
    semestre: "",
    horario: "",
    vagas_total: 50,
  };
};

onMounted(() => {
  loadCursos();
  loadDisciplinas();
  loadProfessores();
  loadTurmas();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

/* Container Principal */
.turmas-container {
  padding: 32px;
  background: #fdfffe;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}


.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  color: #000000;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

.btn-primary {
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  background: #5f4fd1;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

/* Tabela Estilo Card Moderno */
.table-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8f9fa;
  padding: 20px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  color: #6c5ce7;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.data-table td {
  padding: 18px 20px;
  border-bottom: 1px solid #f8f9fa;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
}

.data-table tbody tr:hover {
  background: #fdfdff;
}

/* Ações e Ícones */
.actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: #f3f0ff;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
  color: #6c5ce7;
}

.btn-icon:hover {
  background: #6c5ce7;
  color: white;
  transform: translateY(-2px);
}

.btn-icon.btn-danger {
  color: #ff6b6b;
  background: #fff0f0;
}

.btn-icon.btn-danger:hover {
  background: #ff6b6b;
  color: white;
}

/* Modal Estilizado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 24px;
  width: 550px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: none;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #1a1a1a;
}

.btn-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #a0aec0;
}

.modal-body {
  padding: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #fff;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #6c5ce7;
  outline: none;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.btn-secondary {
  background: #f8f9fa;
  color: #718096;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #edf2f7;
  color: #2d3748;
}
</style>