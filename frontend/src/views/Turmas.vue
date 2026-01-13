<template>
  <div class="turmas-container">
    <div class="page-header">
      <h1>Gestão de Turmas</h1>
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
            <td>{{ disciplinaTurma(turma.DisciplinaId) }}</td>
            <td>{{ professorTurma(turma.ProfessorId) }}</td>
            <td>{{ turma.semestre }}</td>
            <td>{{ cursoTurma(turma.CursoId) }}</td>
            <td>{{ turma.horario }}</td>
            <td>{{ turma.vagasDisponiveis }}/{{ turma.vagasTotal }}</td>
            <td class="actions">
              <button class="btn-icon" @click="editTurma(turma)" title="Editar">✏️</button>
              <button class="btn-icon btn-danger" @click="deleteTurma(turma.id)" title="Excluir">🗑️</button>
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
                <option v-for="d in disciplinas" :key="d.id" :value="d.id">{{ d.nome }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Professor *</label>
              <select v-model="form.ProfessorId" required>
                <option value="">Selecione um professor</option>
                <option v-for="p in professores" :key="p.id" :value="p.id">{{ p.nome }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Curso *</label>
              <select v-model="form.CursoId" required>
                <option value="">Selecione um curso</option>
                <option v-for="c in cursos" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Semestre *</label>
              <input v-model="form.semestre" type="text" required placeholder="Ex: 2025.2" />
            </div>

            <div class="form-group">
              <label>Horário *</label>
              <input v-model="form.horario" type="text" required placeholder="Ex: Seg/Qua 08:00 - 10:00" />
            </div>

            <div class="form-group">
              <label>Total de Vagas *</label>
              <input 
                v-model.number="form.vagasTotal" 
                type="number" 
                required 
                @input="validateVagas"
                :class="{ 'input-error': errors.vagasTotal }"
                placeholder="Mínimo 15, Máximo 60"
              />
              <span v-if="errors.vagasTotal" class="error-text">{{ errors.vagasTotal }}</span>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="hasErrors">
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
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

const turmas = ref([]);
const disciplinas = ref([]);
const professores = ref([]);
const cursos = ref([]);
const showAddModal = ref(false);
const editingTurma = ref(null);

const form = ref({
  DisciplinaId: "",
  ProfessorId: "",
  CursoId: "",
  semestre: "",
  horario: "",
  vagasTotal: 15,
});

const errors = ref({
  vagasTotal: ""
});

// Computada para desabilitar o botão se houver erro
const hasErrors = computed(() => {
  return errors.value.vagasTotal !== "" || form.value.vagasTotal === "";
});

// Validação em tempo real
const validateVagas = () => {
  const v = form.value.vagasTotal;
  if (v === "" || v === null) {
    errors.value.vagasTotal = "";
  } else if (v < 15) {
    errors.value.vagasTotal = "Uma turma deve ter no mínimo 15 vagas.";
  } else if (v > 60) {
    errors.value.vagasTotal = "O limite máximo é de 60 vagas por turma.";
  } else {
    errors.value.vagasTotal = "";
  }
};

const loadTurmas = async () => {
  try {
    const response = await api.get("/turmas");
    turmas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  }
};

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
    console.error("Erro ao carregar cursos:", error);
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

function disciplinaTurma(id) {
  const d = disciplinas.value.find(item => item.id == id);
  return d ? d.nome : "N/A";
}

function cursoTurma(id) {
  const c = cursos.value.find(item => item.id == id);
  return c ? c.nome : "N/A";
}

function professorTurma(id) {
  const p = professores.value.find(item => item.id == id);
  return p ? p.nome : "Sem professor";
}

const editTurma = (turma) => {
  editingTurma.value = turma;
  form.value = {
    DisciplinaId: turma.DisciplinaId,
    ProfessorId: turma.ProfessorId,
    CursoId: turma.CursoId,
    semestre: turma.semestre,
    horario: turma.horario,
    vagasTotal: turma.vagasTotal,
  };
  showAddModal.value = true;
};

const saveTurma = async () => {
  validateVagas();
  if (hasErrors.value) return;

  try {
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
    DisciplinaId: "",
    ProfessorId: "",
    CursoId: "",
    semestre: "",
    horario: "",
    vagasTotal: 15,
  };
  errors.value.vagasTotal = "";
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
}

.btn-primary:hover:not(:disabled) {
  background: #5f4fd1;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

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
}

.btn-icon.btn-danger {
  color: #ff6b6b;
  background: #fff0f0;
}

.error-text {
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.input-error {
  border-color: #ff4d4d !important;
}

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
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #6c5ce7;
  outline: none;
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
}
</style>