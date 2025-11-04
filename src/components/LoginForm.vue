<template>
  <div class="q-pa-md login-form-root">
    <div class="header row items-center justify-center q-mb-md">
      <q-avatar size="86px" class="q-mb-sm">
        <q-icon name="person" size="46px" />
      </q-avatar>
    </div>

    <q-form class="q-gutter-md">
      <q-input label="Endereço de E-mail" type="email" placeholder="Enter your email" outlined dense />

      <q-input label="Senha" placeholder="Senha" outlined dense type="password" />

      <div class="row justify-between q-mt-sm">
        <div></div>
        <a href="#" class="text-primary cursor-pointer" @click.prevent="onForgotPassword">Esqueceu a senha?</a>
      </div>

      <q-btn
        type="button"
        @click="goToDashboard"
        unelevated
        color="primary"
        class="login-btn q-mt-md"
        label="Entrar"
      />

      <div class="row items-center q-my-md">
        <div style="flex:1" class="hr" />
        <div class="q-px-sm text-caption">Ou</div>
        <div style="flex:1" class="hr" />
      </div>

      <div class="row q-gutter-sm">
        <q-btn outline class="social-btn" label="Login com o Google">
          <template #append>
            <span style="margin-left:6px">🌐</span>
          </template>
        </q-btn>
        <q-btn outline class="social-btn" label="Login com o Apple">
          <template #append>
            <span style="margin-left:6px">🍎</span>
          </template>
        </q-btn>
      </div>

      <div class="text-center q-mt-lg">
        Não tem uma conta? <a href="#" class="text-primary">Registrar</a>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
  console.log('Navegando para o dashboard...')
  router.push('/app/dashboard').catch(err => {
    console.error('Erro na navegação:', err)
  })
}

function onForgotPassword() {
  alert('Função de recuperação de senha em desenvolvimento')
}
</script>

<style scoped>
.login-btn {
  width: 100%;
  border-radius: 12px;
  background-color: #153a9a;
  color: white;
  height: 48px;
  font-size: 16px;
}
.hr { height: 1px; background:#e0e0e0 }
.social-btn { 
  flex: 1; 
  justify-content: center; 
  border-radius: 8px;
  height: 42px;
}
.q-checkbox { font-size: 14px }
</style>