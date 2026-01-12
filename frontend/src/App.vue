<template>
  <div id="app">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style>
#app {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
}

.main-content {
  flex: 1;
  height: 100vh; /* Altura fixa da tela */
  overflow-y: auto; /* aqui terá scroll se o conteúdo for grande */
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; 
  
}
</style>