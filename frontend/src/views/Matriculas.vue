<template>
  <div class="matriculas-container">
    <div class="matriculas-header">
      <h1>Menu de turmas</h1>
    </div>

    <div class="turmas-section">
      <h2 class="section-title">Turmas e alunos matriculados</h2>

      <div class="turmas-grid">
        <div
          v-for="grupo in turmasComAlunos"
          :key="grupo.turma.id"
          class="turma-card"
          @click="turmaSelecionada = grupo"
        >
          <div class="turma-header">
            <h3>Turma {{ grupo.turma.id }}</h3>
            <span class="badge"> {{ grupo.alunos.length }} alunos </span>
          </div>

          <p><strong>Semestre:</strong> {{ grupo.turma.semestre }}</p>
          <p><strong>Horário:</strong> {{ grupo.turma.horario }}</p>
        </div>
      </div>
    </div>

    <div v-if="turmaSelecionada" class="alunos-panel">
      <div class="panel-header">
        <h3>Alunos da Turma {{ turmaSelecionada.turma.id }}</h3>
        <button class="btn-close-panel" @click="turmaSelecionada = null">
          ×
        </button>
      </div>

      <div v-if="turmaSelecionada.alunos.length === 0" class="empty">
        Nenhum aluno matriculado
      </div>

      <ul class="alunos-list">
        <li
          v-for="aluno in turmaSelecionada.alunos"
          :key="aluno.id"
          class="aluno-item"
        >
          <div class="avatar">
            {{ aluno.nome.charAt(0) }}
          </div>
          <div class="aluno-info">
            <strong>{{ aluno.nome }}</strong>
            <span>Matrícula: {{ aluno.matricula }}</span>
          </div>
        </li>
      </ul>
    </div>
    <br>

    <div class="matriculas-cards">
      <div class="matricula-card">
        <div class="card-icon">📝</div>
        <div class="card-content">
          <h3>Realizar matrícula</h3>
          <p>
            Selecione um aluno e as turmas disponíveis para realizar a inscrição
            em disciplinas
          </p>
          <button class="card-btn" @click="showMatricularModal = true">
            Iniciar
          </button>
        </div>
      </div>

      <div class="matricula-card">
        <div class="card-icon">❌</div>
        <div class="card-content">
          <h3>Cancelar matrícula</h3>
          <p>
            Selecione um aluno e as turmas disponíveis para cancelar matrículas
          </p>
          <button
            class="card-btn btn-secondary"
            @click="showCancelarModal = true"
          >
            Iniciar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showMatricularModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Realizar Matrícula</h3>
          <button class="btn-close" @click="showMatricularModal = false">
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Aluno *</label>
            <select v-model="matriculaForm.aluno_id" required>
              <option value="">Selecione um aluno</option>
              <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
                {{ aluno.nome }} - {{ aluno.matricula }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Turma *</label>
            <select v-model="matriculaForm.turma_id" required>
              <option value="">Selecione uma turma</option>
              <option
                v-for="turma in turmasDisponiveis"
                :key="turma.id"
                :value="turma.id"
              >
                {{ getDisciplinaNome(turma.DisciplinaId) }} - {{ turma.horario }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="showMatricularModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn-primary"
              @click="realizarMatricula"
            >
              Confirmar Matrícula
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCancelarModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Cancelar Matrícula</h3>
          <button class="btn-close" @click="showCancelarModal = false">
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Aluno *</label>
            <select v-model="cancelarForm.aluno_id" required>
              <option value="">Selecione um aluno</option>
              <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
                {{ aluno.nome }} - {{ aluno.matricula }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Turma *</label>
            <select v-model="cancelarForm.turma_id" required>
              <option value="">Selecione uma turma matriculada</option>
              <option
                v-for="turma in turmasMatriculadas"
                :key="turma.id"
                :value="turma.id"
              >
                {{ getDisciplinaNome(turma.DisciplinaId) }} - {{ turma.horario }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="showCancelarModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn-primary btn-danger"
              @click="cancelarMatricula"
            >
              Confirmar Cancelamento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";

const alunos = ref([]);
const turmas = ref([]);
const disciplinas = ref([]); // Adicionado para buscar os nomes

const showMatricularModal = ref(false);
const showCancelarModal = ref(false);

const matriculaForm = ref({ aluno_id: "", turma_id: "" });
const cancelarForm = ref({ aluno_id: "", turma_id: "" });

const matriculas = ref([]);
const turmaSelecionada = ref(null);

const turmasComAlunos = computed(() => {
  const mapa = {};
  matriculas.value.forEach((m) => {
    const turmaId = m.Turma.id;
    if (!mapa[turmaId]) {
      mapa[turmaId] = { turma: m.Turma, alunos: [] };
    }
    if (m.status === "ATIVA") {
      mapa[turmaId].alunos.push(m.Aluno);
    }
  });
  return Object.values(mapa);
});

// Função para retornar o nome da disciplina pelo ID
const getDisciplinaNome = (id) => {
  const d = disciplinas.value.find(item => item.id == id);
  return d ? d.nome : "Turma " + id;
};

const loadAlunos = async () => {
  try {
    const response = await api.get("/alunos");
    alunos.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
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

const loadTurmas = async () => {
  try {
    const response = await api.get("/turmas");
    turmas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  }
};

const loadMatriculas = async () => {
  try {
    const response = await api.get("/matriculas");
    matriculas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar matrículas:", error);
  }
};

const turmasDisponiveis = computed(() => turmas.value);
const turmasMatriculadas = computed(() => turmas.value);

const realizarMatricula = async () => {
  try {
    await api.post("/matriculas", {
      alunoId: matriculaForm.value.aluno_id,
      turmaId: matriculaForm.value.turma_id,
    });
    alert("Matrícula realizada com sucesso!");
    showMatricularModal.value = false;
    matriculaForm.value = { aluno_id: "", turma_id: "" };
    loadMatriculas();
  } catch (error) {
    alert(error.response?.data?.error || "Erro ao matricular");
  }
};

const cancelarMatricula = async () => {
  try {
    const matricula = matriculas.value.find(
      (m) => m.AlunoId == cancelarForm.value.aluno_id && m.TurmaId == cancelarForm.value.turma_id && m.status === "ATIVA"
    );
    if (!matricula) {
      alert("Matrícula não encontrada!");
      return;
    }
    await api.put(`/matriculas/${matricula.id}/cancelar`);
    showCancelarModal.value = false;
    cancelarForm.value = { aluno_id: "", turma_id: "" };
    loadMatriculas();
    alert("Matrícula cancelada com sucesso!");
  } catch (error) {
    alert("Erro ao cancelar matrícula");
  }
};

onMounted(() => {
  loadAlunos();
  loadDisciplinas(); // Carrega as disciplinas para o select funcionar
  loadTurmas();
  loadMatriculas();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

.matriculas-container {
   min-height: 100%; 
  width: 100%;     
  margin: 0;
  padding: clamp(14px, 3vw, 20px);
  position: relative;
  padding: 32px;
  background: #fdfffe;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  color: #1a1a1a;
  
}

/* Header */
.matriculas-header h1 {
  margin: 0 0 32px 0;
  color: #000000;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

.turmas-section {
  margin-bottom: 40px;
}

.section-title {
  margin-bottom: 24px;
  font-size: 20px;
  color: #2d3436;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
}

.turmas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}


.turma-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.turma-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(108, 92, 231, 0.1);
  border-color: #6c5ce7;
}

.turma-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.turma-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.badge {
  background: #f3f0ff;
  color: #6c5ce7;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.turma-card p {
  margin: 8px 0;
  color: #636e72;
  font-size: 14px;
}

.turma-card strong {
  color: #2d3436;
}


.matriculas-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.matricula-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
}

.matricula-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(108, 92, 231, 0.12);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.card-content h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.card-content p {
  color: #718096;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
}


.card-btn {
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.card-btn:hover {
  background: #33ff18;
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.3);
}

.btn-secondary {
background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #dd0000;
  box-shadow: none;
}


.alunos-panel {
  margin: 32px 0;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-header h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.btn-close-panel {
  background: #fff0f0;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  color: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close-panel:hover {
  background: #ff6b6b;
  color: white;
}

.aluno-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 16px;
  transition: background 0.2s;
}

.aluno-item:hover {
  background: #f8f9fa;
}

.avatar {
  width: 44px;
  height: 44px;
  background: #6c5ce7;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.aluno-info strong {
  display: block;
  font-size: 15px;
}

.aluno-info span {
  font-size: 13px;
  color: #718096;
}

/* Modal Estilo Padronizado */
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
  width: 100%;
  max-width: 500px;
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
}

.modal-body {
  padding: 32px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s;
}

.form-group select:focus {
  border-color: #6c5ce7;
  outline: none;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-primary {
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
}

.btn-danger {
  background: #ff6b6b;
}


@media (max-width: 768px) {
  .matriculas-container { padding: 20px; }
  .matriculas-header h1 { font-size: 28px; }
  .turmas-grid { grid-template-columns: 1fr; }
}
</style>