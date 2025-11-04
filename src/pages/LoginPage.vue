<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-page">
        <div class="login-inner">
          <div class="left">
            <q-card class="p-card">
              <div class="welcome-title">Bem Vindo!</div>
              <div class="welcome-subtitle">Insira suas credenciais para acessar sua conta</div>
              <LoginForm />
            </q-card>
          </div>

          <div class="right" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.login-inner {
  width: 92%;
  max-width: 1100px;
  display: flex;
  background: transparent;
}
.left {
  flex: 1;
  display: flex;
  align-items: center;
}
  .right {
  width: 48%;
  background-image: url('../src/assets/login-illustration.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-left: 24px;
}
.p-card {
  width: 100%;
  max-width: 540px;
  padding: 32px;
  border-radius: 8px;
}
.welcome-title {
  font-size: 36px;
  font-weight: 700;
}
.welcome-subtitle {
  color: #666;
  margin-top: 8px;
}

@media (max-width: 900px) {
  .login-inner { flex-direction: column }
  .right { width: 100%; height: 260px; margin-left: 0; margin-top: 16px }
}
</style>