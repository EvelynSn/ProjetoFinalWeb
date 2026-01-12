<template>
  <div class="disciplinas-container">
    <div class="page-header">
      <h1>Catálogo de disciplinas</h1>
      <button class="btn-primary" @click="showAddModal = true">
        <span>➕</span>
        Nova disciplina
      </button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>NOME</th>
            <th>HORAS</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="disciplina in disciplinas" :key="disciplina.id">
            <td class="disciplina-nome">{{ disciplina.nome }}</td>
            <td>{{ disciplina.horas }}</td>
            <td class="actions">
              <button class="btn-icon" @click="editDisciplina(disciplina)" title="Editar">
                ✏️
              </button>
              <button class="btn-icon btn-danger" @click="deleteDisciplina(disciplina.id)" title="Excluir">
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
          <h3>{{ editingDisciplina ? 'Editar Disciplina' : 'Nova Disciplina' }}</h3>
          <button class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveDisciplina">
            <div class="form-group">
              <label>Nome *</label>
              <input v-model="form.nome" type="text" required>
            </div>
            <div class="form-group">
              <label>Horas *</label>
              <input v-model="form.horas" type="number" required min="1">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                {{ editingDisciplina ? 'Atualizar' : 'Salvar' }}
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

const disciplinas = ref([]);
const showAddModal = ref(false);
const editingDisciplina = ref(null);
const form = ref({
  nome: '',
  horas: ''
});

const loadDisciplinas = async () => {
  try {
    const response = await api.get("/disciplinas");
    disciplinas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar disciplinas:", error);
  }
};

const editDisciplina = (disciplina) => {
  editingDisciplina.value = disciplina;
  form.value = { ...disciplina };
  showAddModal.value = true;
};

const saveDisciplina = async () => {
  try {
    if (editingDisciplina.value) {
      await api.put(`/disciplinas/${editingDisciplina.value.id}`, form.value);
    } else {
      await api.post("/disciplinas", form.value);
    }
    closeModal();
    loadDisciplinas();
  } catch (error) {
    console.error("Erro ao salvar disciplina:", error);
  }
};

const deleteDisciplina = async (id) => {
  if (confirm("Tem certeza que deseja excluir esta disciplina?")) {
    try {
      await api.delete(`/disciplinas/${id}`);
      loadDisciplinas();
    } catch (error) {
      console.error("Erro ao excluir disciplina:", error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingDisciplina.value = null;
  form.value = {
    nome: '',
    horas: ''
  };
};

onMounted(loadDisciplinas);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

.disciplinas-container {
  padding: 32px;
  background: #fdfffe;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Page Header - Estilo Dashboard */
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

/* Botão Primário Roxo com Efeito Shimmer */
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

/* Tabela e Container */
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

.disciplina-nome {
  font-weight: 600;
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
  width: 500px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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
}
</style>