<template>
  <div style="padding: 24px; font-family: system-ui, sans-serif;">
    <h1>CE-NEW-JSTS-009: Pure JavaScript Vue 3 + Koa Monolith</h1>
    <p>Runtime & Package Manager: <strong>Bun 1.3+</strong></p>
    <p>Bundler: <strong>Vite 5.3+</strong></p>
    <div style="margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
      <h3>Koa Service Health: {{ koaStatus }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      koaStatus: 'ONLINE (Port 3009)'
    };
  }
};
</script>
