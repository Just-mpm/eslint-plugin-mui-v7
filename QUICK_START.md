# 🚀 Quick Start - Publicar no npm

## ⚡ Modo Rápido (5 minutos)

### 1. Fazer login no npm

```bash
npm login
```

### 2. Publicar

```bash
cd eslint-plugin-mui-v7-package
npm publish
```

✅ **Pronto!** Seu plugin está no npm!

---

## 📦 Como Instalar (para outros usuários)

```bash
npm install --save-dev eslint-plugin-mui-v7
```

### Configurar no projeto

```javascript
// eslint.config.js
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  {
    plugins: {
      'mui-v7': muiV7Plugin,
    },
    rules: {
      'mui-v7/no-deep-imports': 'error',
      'mui-v7/no-grid2-import': 'error',
      'mui-v7/no-lab-imports': 'error',
      'mui-v7/no-grid-item-prop': 'error',
      'mui-v7/no-deprecated-props': 'error',
      'mui-v7/no-old-grid-import': 'warn',
      'mui-v7/prefer-theme-vars': 'warn',
    },
  },
]
```

### Rodar

```bash
npm run lint
```

---

## 🔄 Atualizar Versão

### Bug fix (1.0.0 → 1.0.1)

```bash
npm version patch
npm publish
```

### Nova feature (1.0.0 → 1.1.0)

```bash
npm version minor
npm publish
```

### Breaking change (1.0.0 → 2.0.0)

```bash
npm version major
npm publish
```

---

## 🎯 Checklist Completo

### Antes da primeira publicação:

- [ ] Criar conta no npm: https://www.npmjs.com/signup
- [ ] Fazer login: `npm login`
- [ ] Verificar nome disponível: `npm view eslint-plugin-mui-v7`
- [ ] Testar localmente: `npm link`
- [ ] Dry-run: `npm publish --dry-run`
- [ ] Publicar: `npm publish`

### Para atualizações:

- [ ] Fazer mudanças no código
- [ ] Testar localmente
- [ ] Incrementar versão: `npm version patch`
- [ ] Commit: `git add . && git commit -m "fix: ..."
- [ ] Push: `git push && git push --tags`
- [ ] Publicar: `npm publish`

---

## 🌐 Links Úteis

- **npm Registry:** https://www.npmjs.com/package/eslint-plugin-mui-v7
- **GitHub Repo:** https://github.com/Just-mpm/eslint-plugin-mui-v7
- **npm Docs:** https://docs.npmjs.com/

---

## 📞 Suporte

- GitHub Issues: https://github.com/Just-mpm/eslint-plugin-mui-v7/issues
- Email: studio.kodaai@gmail.com

---

**Criado por:** Matheus (Koda AI Studio) + Claude Code
