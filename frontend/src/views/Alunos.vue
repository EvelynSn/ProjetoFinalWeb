<template>
  <div class="alunos-container">
    <div class="page-header">
      <h1>Gerenciar Alunos</h1>
      <button class="btn-primary" @click="showAddModal = true">
        <span>➕</span>
        Novo Aluno
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>NOME</th>
            <th>MATRÍCULA</th>
            <th>CURSO</th>
            <th>EMAIL</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aluno in alunos" :key="aluno.id">
            <td>{{ aluno.nome }}</td>
            <td>{{ aluno.matricula }}</td>
            <td>{{ cursoAluno(aluno.curso_id) }}</td>
            <td>{{ aluno.email }}</td>
            <td class="actions">
              <button class="btn-icon" @click="editAluno(aluno)" title="Editar">✏️</button>
              <button class="btn-icon btn-danger" @click="deleteAluno(aluno.id)" title="Excluir">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingAluno ? "Editar Aluno" : "Novo Aluno" }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAluno">
            
            <div class="form-group">
              <label>Nome *</label>
              <input 
                v-model="form.nome" 
                type="text" 
                @input="validateNome"
                :class="{ 'input-error': errors.nome }"
                placeholder="Ex: João Silva"
                required 
              />
              <span v-if="errors.nome" class="error-text">{{ errors.nome }}</span>
            </div>

            <div class="form-group">
              <label>Matrícula *</label>
              <input 
                v-model="form.matricula" 
                type="text" 
                maxlength="6"
                @input="validateMatricula"
                :class="{ 'input-error': errors.matricula }"
                placeholder="000000"
                required 
              />
              <span v-if="errors.matricula" class="error-text">{{ errors.matricula }}</span>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input v-model="form.email" type="email" required />
            </div>

            <div class="form-group">
              <label>Curso</label>
              <select v-model="form.curso_id">
                <option value="">Selecione um curso</option>
                <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                  {{ curso.nome }}
                </option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="hasErrors">
                {{ editingAluno ? "Atualizar" : "Salvar" }}
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

const alunos = ref([]);
const cursos = ref([]);
const showAddModal = ref(false);
const editingAluno = ref(null);

const form = ref({
  nome: "",
  matricula: "",
  email: "",
  curso_id: "",
});

const errors = ref({
  nome: "",
  matricula: ""
});

// Bloqueia o botão de salvar se houver mensagens de erro
const hasErrors = computed(() => {
  return errors.value.nome !== "" || errors.value.matricula !== "";
});

// --- FUNÇÕES DE VALIDAÇÃO EM TEMPO REAL ---

const validateNome = () => {
  const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
  if (!nomeRegex.test(form.value.nome)) {
    errors.value.nome = "O nome deve conter apenas letras.";
  } else {
    errors.value.nome = "";
  }
};

const validateMatricula = () => {
  const apenasNumeros = /^\d*$/;
  
  if (!apenasNumeros.test(form.value.matricula)) {
    errors.value.matricula = "A matrícula deve conter apenas números.";
  } else if (form.value.matricula.length > 0 && form.value.matricula.length !== 6) {
    errors.value.matricula = "A matrícula precisa ter exatamente 6 números.";
  } else {
    errors.value.matricula = "";
  }
};

// --- LÓGICA DE DADOS ---

const loadAlunos = async () => {
  try {
    const response = await api.get("/alunos");
    alunos.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
  }
};

function cursoAluno(cursoId) {
  const curso = cursos.value.find(c => c.id == cursoId);
  return curso ? curso.nome : 'Curso não encontrado';
}

const loadCursos = async () => {
  try {
    const response = await api.get("/cursos");
    cursos.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
  }
};

const editAluno = (aluno) => {
  editingAluno.value = aluno;
  form.value = { ...aluno };
  showAddModal.value = true;
};

const saveAluno = async () => {
  // Re-valida antes de enviar por segurança
  validateNome();
  validateMatricula();

  if (hasErrors.value) return;

  try {
    if (editingAluno.value) {
      await api.put(`/alunos/${editingAluno.value.id}`, form.value);
    } else {
      await api.post("/alunos", form.value);
    }
    closeModal();
    loadAlunos();
  } catch (error) {
    console.error("Erro ao salvar aluno:", error);
    alert("Erro ao salvar. Verifique se a matrícula já existe.");
  }
};

const deleteAluno = async (id) => {
  if (confirm("Tem certeza que deseja excluir este aluno?")) {
    try {
      await api.delete(`/alunos/${id}`);
      loadAlunos();
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingAluno.value = null;
  form.value = { nome: "", matricula: "", email: "", curso_id: "" };
  errors.value = { nome: "", matricula: "" };
};

onMounted(() => {
  loadCursos();
  loadAlunos();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

.alunos-container {
  padding: 32px;
  background: #fdfffe;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

/* Estilos de Erro */
.error-text {
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
  display: block;
}

.input-error {
  border-color: #ff4d4d !important;
  background-color: #fffafa !important;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Restante do CSS padronizado */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  color: #000;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
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
}

.btn-primary:hover:not(:disabled) {
  background: #5f4fd1;
  transform: translateY(-3px);
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
  color: #6c5ce7;
  font-size: 12px;
  text-transform: uppercase;
}

.data-table td {
  padding: 18px 20px;
  border-bottom: 1px solid #f8f9fa;
  font-size: 14px;
}

.btn-icon {
  background: #f3f0ff;
  color: #6c5ce7;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-icon:hover {
  background: #6c5ce7;
  color: white;
}

.btn-icon.btn-danger {
  color: #ff6b6b;
  background: #fff0f0;
}

.btn-icon.btn-danger:hover {
  background: #ff6b6b;
  color: white;
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
  width: 500px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4a4a4a;
}

.form-group input,
.form-group select {
  width: 100%;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #6c5ce7;
  background: white;
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