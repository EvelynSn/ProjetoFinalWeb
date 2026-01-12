<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h3>UFC - Russas</h3>
    </div>
    <div class="sidebar-menu">
      <router-link to="/" class="sidebar-item">
        <span>Painel Geral</span>
      </router-link>
      <router-link to="/alunos" class="sidebar-item">
        <span>Alunos</span>
      </router-link>
      <router-link to="/professores" class="sidebar-item">
        <span>Professores</span>
      </router-link>
      <router-link to="/disciplinas" class="sidebar-item">
        <span>Disciplinas</span>
      </router-link>
      <router-link to="/cursos" class="sidebar-item">
        <span>Cursos</span>
      </router-link>
      <router-link to="/turmas" class="sidebar-item">
        <span>Turmas</span>
      </router-link>
      <router-link to="/matriculas" class="sidebar-item">
        <span>Matrículas</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');

.sidebar {
  width: 260px; 
  background: #6c5ce7;
  color: white;
  height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.sidebar-menu {
  padding: 24px 16px; 
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px; 
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px; 
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(5px);
}

.sidebar-item.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sidebar-item span {
  margin-left: 12px;
}

.sidebar-footer {
  padding: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}
</style>