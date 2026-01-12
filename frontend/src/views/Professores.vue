<template>
  <div class="professores-container">
    <div class="page-header">
      <h1>Menu de Professores</h1>
      <button class="btn-primary" @click="showAddModal = true">
        <span>➕</span>
        Novo Professor
      </button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>NOME</th>
            <th>SIAPE</th>
            <th>DEPARTAMENTO</th>
            <th>EMAIL</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="professor in professores" :key="professor.id">
            <td>{{ professor.nome }}</td>
            <td>{{ professor.siape }}</td>
            <td>{{ professor.departamento }}</td>
            <td>{{ professor.email }}</td>
            <td class="actions">
              <button class="btn-icon" @click="editProfessor(professor)" title="Editar">✏️</button>
              <button class="btn-icon btn-danger" @click="deleteProfessor(professor.id)" title="Excluir">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingProfessor ? 'Editar Professor' : 'Novo Professor' }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProfessor">
            
            <div class="form-group">
              <label>Nome *</label>
              <input 
                v-model="form.nome" 
                type="text" 
                @input="validateNome"
                :class="{ 'input-error': errors.nome }"
                title="Digite seu nome completo (apenas letras)"
                required
              >
              <span v-if="errors.nome" class="error-text">{{ errors.nome }}</span>
            </div>

            <div class="form-group">
              <label>SIAPE *</label>
              <input 
                v-model="form.siape" 
                type="text" 
                @input="validateSiape"
                :class="{ 'input-error': errors.siape }"
                title="Informe os números do seu código SIAPE"
                required
              >
              <span v-if="errors.siape" class="error-text">{{ errors.siape }}</span>
            </div>

            <div class="form-group">
              <label>Departamento *</label>
              <input 
                v-model="form.departamento" 
                type="text" 
                @input="validateDepartamento"
                :class="{ 'input-error': errors.departamento }"
                title="Informe o nome do departamento (apenas letras)"
                required
              >
              <span v-if="errors.departamento" class="error-text">{{ errors.departamento }}</span>
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input 
                v-model="form.email" 
                type="email" 
                title="Exemplo: professor@universidade.edu.br"
                required
              >
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="hasErrors">
                {{ editingProfessor ? 'Atualizar' : 'Salvar' }}
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

const professores = ref([]);
const showAddModal = ref(false);
const editingProfessor = ref(null);
const form = ref({
  nome: '',
  siape: '',
  departamento: '',
  email: ''
});

// Estado de erros para validação
const errors = ref({
  nome: '',
  siape: '',
  departamento: ''
});


const hasErrors = computed(() => {
  return errors.value.nome !== '' || errors.value.siape !== '' || errors.value.departamento !== '';
});


const validateNome = () => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
  if (!regex.test(form.value.nome)) {
    errors.value.nome = "O nome deve conter apenas letras.";
  } else {
    errors.value.nome = "";
  }
};

const validateSiape = () => {
  const regex = /^\d*$/;
  if (!regex.test(form.value.siape)) {
    errors.value.siape = "O SIAPE deve conter apenas números.";
  } else {
    errors.value.siape = "";
  }
};

const validateDepartamento = () => {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
  if (!regex.test(form.value.departamento)) {
    errors.value.departamento = "O departamento deve conter apenas letras.";
  } else {
    errors.value.departamento = "";
  }
};

// --- LÓGICA DA API ---

const loadProfessores = async () => {
  try {
    const response = await api.get("/professores");
    professores.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar professores:", error);
  }
};

const editProfessor = (professor) => {
  editingProfessor.value = professor;
  form.value = { ...professor };
  showAddModal.value = true;
};

const saveProfessor = async () => {
  if (hasErrors.value) return;

  try {
    if (editingProfessor.value) {
      await api.put(`/professores/${editingProfessor.value.id}`, form.value);
    } else {
      await api.post("/professores", form.value);
    }
    closeModal();
    loadProfessores();
  } catch (error) {
    console.error("Erro ao salvar professor:", error);
  }
};

const deleteProfessor = async (id) => {
  if (confirm("Tem certeza que deseja excluir este professor?")) {
    try {
      await api.delete(`/professores/${id}`);
      loadProfessores();
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingProfessor.value = null;
  form.value = { nome: '', siape: '', departamento: '', email: '' };
  errors.value = { nome: '', siape: '', departamento: '' };
};

onMounted(loadProfessores);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

.professores-container {
  padding: 32px;
  background: #fdfffe;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}


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

/* Estilos da Interface */
.page-header { display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 32px; }

.page-header h1 { margin: 0; 
  color: #1a1a1a;
   font-size: 36px; 
   font-weight: 700;
    font-family: 'Poppins', 
    sans-serif; 
    letter-spacing: -0.5px; }

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
  text-transform: uppercase;
}

.data-table td { 
  padding: 18px 20px; 
  border-bottom: 1px solid #f8f9fa; 
  color: #1a1a1a; 
  font-size: 14px; 
}

.btn-icon {
  background: #f3f0ff;
  color: #6c5ce7; 
  border: none;
  cursor: pointer;
  font-size: 18px; 
  padding: 8px 12px;
  border-radius: 10px; 
  transition: all 0.2s ease;
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

.form-group input {
  width: 100%;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f9fa;
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

/* Container Principal */
.professores-container {
  padding: 32px;
  background: #fdfffe; 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

/* Título da Página */
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


.actions {
  display: flex;
  gap: 10px;
}

.btn-icon {
  background: #f3f0ff; 
  color: #6c5ce7;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
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


.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
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
  border: none;
  overflow: hidden;
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
  transition: color 0.2s;
}

.btn-close:hover {
  color: #ff6b6b;
}

.modal-body {
  padding: 32px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus {
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
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #edf2f7;
  color: #2d3748;
}
</style>