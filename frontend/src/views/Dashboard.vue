<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Visão Geral</h1>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.alunos || 0 }}</h3>
          <p>alunos ativos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👨‍🏫</div>
        <div class="stat-content">
          <h3>{{ stats.professores || 0 }}</h3>
          <p>professores ativos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <h3>{{ stats.disciplinas || 0 }}</h3>
          <p>disciplinas</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏫</div>
        <div class="stat-content">
          <h3>{{ stats.turmas || 0 }}</h3>
          <p>turmas abertas</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏫</div>
        <div class="stat-content">
          <h3>{{ stats.cursos || 0 }}</h3>
          <p>Cursos disponíveis</p>
        </div>
      </div>
    </div>

    <div class="quick-actions-section">
      <h2>Acesso rápido</h2>
      <div class="quick-actions">
        <button class="quick-action-btn" @click="goToMatriculas">
          <span>📝</span>
          Nova matrícula
        </button>
        <button class="quick-action-btn" @click="goToTurmas">
          <span>➕</span>
          Criar turma
        </button>
        <button class="quick-action-btn" @click="goToAlunos">
          <span>👤</span>
          Cadastrar aluno
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const stats = ref({});
const alunos = ref([]);
const professores = ref([]);
const disciplinas = ref([]);
const turmas = ref([]);
const cursos = ref([]);

const loadStats = async () => {
  try {
    const [
      alunosRes,
      professoresRes,
      disciplinasRes,
      turmasRes,
      cursosRes,
    ] = await Promise.all([
      api.get("/alunos"),
      api.get("/professores"),
      api.get("/disciplinas"),
      api.get("/turmas"),
      api.get("/cursos"),
    ]);

    stats.value = {
      alunos: alunosRes.data.length,
      professores: professoresRes.data.length,
      disciplinas: disciplinasRes.data.length,
      turmas: turmasRes.data.length,
      cursos: cursosRes.data.length,
    };
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
  }
};

const goToMatriculas = () => {
  router.push("/matriculas");
};

const goToTurmas = () => {
  router.push("/turmas");
};

const goToAlunos = () => {
  router.push("/alunos");
};

onMounted(async () => {
  await loadStats();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');

.dashboard {
  padding: 32px;
  background: #fdfffe;
  min-height: 100vh;
  width: 100%;           
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.dashboard-header h1 {
  margin: 0 0 32px 0;
  color: #000000;
  border-radius: 10px;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  background: #6c5ce7;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgb(255, 251, 251);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:nth-child(1)::before {
  background: transparent;
}

.stat-card:nth-child(2)::before {
  background: transparent;
}

.stat-card:nth-child(3)::before {
  background: transparent;
}

.stat-card:nth-child(4)::before {
  background: transparent;
}

.stat-card:nth-child(5)::before {
  background: transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  background: rgb(44, 150, 58);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  font-size: 40px;
  margin-right: 20px;
  filter: none;
}

.stat-content h3 {
  margin: 0 0 6px 0;
  font-size: 42px;
  font-weight: 800;
  color: #fcfdff;
  text-shadow: none;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -1px;
}

.stat-content p {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  text-transform: lowercase;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.quick-actions-section h2 {
  margin: 0 0 24px 0;
  color: #1a1a1a;
  font-size: 26px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.3px;
}

.quick-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.quick-action-btn {
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.2px;
}

.quick-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.quick-action-btn:hover::before {
  left: 100%;
}

.quick-action-btn:hover {
  background: #5f4fd1;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
}

.quick-action-btn span {
  font-size: 24px;
}
</style>