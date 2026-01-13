<template>
  <div class="cursos-container">
    <div class="page-header">
      <div>
        <h1>Cursos</h1>
        <p>Gerencie os cursos oferecidos pela instituição</p>
      </div>
      <button 
        class="btn-primary" 
        @click="showAddModal = true"
      >
        <span>➕</span>
        Novo curso
      </button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>NOME</th>
            <th>CÓDIGO</th>
            <th>HORAS</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in cursos" :key="curso.id">
            <td>{{ curso.nome }}</td>
            <td>{{ curso.codigo }}</td>
            <td>{{ curso.horas }}h</td>
            <td class="actions">
              <button 
                class="btn-icon" 
                @click="editCurso(curso)" 
                title="Editar"
              >
                ✏️
              </button>
              <button 
                class="btn-icon btn-danger" 
                @click="deleteCurso(curso.id)" 
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
          <h3>{{ editingCurso ? 'Editar Curso' : 'Novo Curso' }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCurso">
            
            <div class="form-group">
              <label>Nome *</label>
              <input 
                v-model="form.nome" 
                type="text" 
                title="Informe o nome completo do curso"
                required
              >
            </div>

            <div class="form-group">
              <label>Código *</label>
              <input 
                v-model="form.codigo" 
                type="text" 
                title="Digite o código identificador do curso"
                required
              >
            </div>

            <div class="form-group">
              <label>Carga Horária (Horas) *</label>
              <input 
                v-model.number="form.horas" 
                type="number" 
                @input="validateHoras"
                :class="{ 'input-error': errors.horas }"
                title="A carga horária total deve ser entre 2400 e 7200 horas"
                placeholder="Ex: 3000"
                required
              >
              <span v-if="errors.horas" class="error-text">
                {{ errors.horas }}
              </span>
            </div>

            <div class="modal-actions">
              <button 
                type="button" 
                class="btn-secondary" 
                @click="closeModal"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn-primary" 
                :disabled="hasErrors"
              >
                {{ editingCurso ? 'Atualizar' : 'Salvar' }}
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

const cursos = ref([]);
const showAddModal = ref(false);
const editingCurso = ref(null);
const form = ref({
  nome: '',
  codigo: '',
  horas: ''
});

// Estado de erros para validação
const errors = ref({
  horas: ''
});

// Computada para validar se o formulário pode ser enviado
const hasErrors = computed(() => {
  return errors.value.horas !== "" || form.value.horas === "" || form.value.nome === "";
});

// Validação em tempo real da carga horária
const validateHoras = () => {
  const h = form.value.horas;
  if (h === "" || h === null) {
    errors.value.horas = "";
  } else if (h < 2400) {
    errors.value.horas = "A carga horária mínima é de 2400 horas.";
  } else if (h > 7200) {
    errors.value.horas = "A carga horária máxima é de 7200 horas.";
  } else {
    errors.value.horas = "";
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

const editCurso = (curso) => {
  editingCurso.value = curso;
  form.value = { ...curso };
  showAddModal.value = true;
};

const saveCurso = async () => {
  validateHoras();
  if (hasErrors.value) return;

  try {
    if (editingCurso.value) {
      await api.put(`/cursos/${editingCurso.value.id}`, form.value);
    } else {
      await api.post("/cursos", form.value);
    }
    closeModal();
    loadCursos();
  } catch (error) {
    console.error("Erro ao salvar curso:", error);
  }
};

const deleteCurso = async (id) => {
  if (confirm("Tem certeza que deseja excluir este curso?")) {
    try {
      await api.delete(`/cursos/${id}`);
      loadCursos();
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingCurso.value = null;
  form.value = {
    nome: '',
    codigo: '',
    horas: ''
  };
  errors.value = {
    horas: ''
  };
};

onMounted(loadCursos);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

.cursos-container {
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
  align-items: flex-start;
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  color: #000000;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 0;
  color: #718096;
  font-size: 15px;
  font-weight: 500;
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

.btn-primary:hover:not(:disabled) {
  background: #5f4fd1;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
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
  font-size: 13px;
  color: #6c5ce7;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.data-table td {
  padding: 18px 20px;
  border-bottom: 1px solid #f8f9fa;
  color: #1a1a1a;
  font-size: 15px;
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

.error-text {
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  font-weight: 500;
}

.input-error {
  border-color: #ff4d4d !important;
  background-color: #fffafa !important;
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
  border: none;
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

.form-group input {
  width: 100%;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus {
  border-color: #6c5ce7;
  outline: none;
  background: white;
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