# 📦 Guia de Publicação - eslint-plugin-mui-v7

Guia completo para publicar o plugin no npm e mantê-lo atualizado.

---

## 🎯 Pré-requisitos

### 1. Conta no npm

```bash
# Criar conta em https://www.npmjs.com/signup

# Fazer login via CLI
npm login
```

### 2. Verificar autenticação

```bash
npm whoami
# Deve retornar seu username
```

### 3. Verificar se o nome está disponível

```bash
npm view eslint-plugin-mui-v7
# Se retornar 404, o nome está disponível!
```

---

## 🚀 Primeira Publicação

### Passo 1: Preparar o pacote

```bash
cd eslint-plugin-mui-v7-package

# Instalar dependências de desenvolvimento
npm install

# Verificar package.json
cat package.json
```

### Passo 2: Testar localmente

```bash
# Link local para testar em outro projeto
npm link

# Em outro projeto
npm link eslint-plugin-mui-v7

# Testar se funciona
npm run lint
```

### Passo 3: Publicar

```bash
# Fazer dry-run primeiro (simula publicação)
npm publish --dry-run

# Se tudo estiver OK, publicar de verdade
npm publish
```

### Passo 4: Verificar publicação

```bash
# Ver no npm
npm view eslint-plugin-mui-v7

# Ou abrir no browser
open https://www.npmjs.com/package/eslint-plugin-mui-v7
```

---

## 🔄 Atualizações

### Versionamento Semântico (SemVer)

```
MAJOR.MINOR.PATCH
  |     |     |
  |     |     └─ Bug fixes (1.0.0 → 1.0.1)
  |     └─────── New features, backward compatible (1.0.0 → 1.1.0)
  └───────────── Breaking changes (1.0.0 → 2.0.0)
```

### Exemplos:

**Patch (Bug Fix):**
```bash
# Corrigir um bug sem quebrar compatibilidade
npm version patch  # 1.0.0 → 1.0.1
npm publish
```

**Minor (Nova Feature):**
```bash
# Adicionar nova regra, sem quebrar código existente
npm version minor  # 1.0.0 → 1.1.0
npm publish
```

**Major (Breaking Change):**
```bash
# Mudar comportamento de regras existentes
npm version major  # 1.0.0 → 2.0.0
npm publish
```

---

## 📝 Checklist de Publicação

Antes de cada publicação:

- [ ] Todos os testes passando (`npm test`)
- [ ] README atualizado com mudanças
- [ ] CHANGELOG.md atualizado (opcional)
- [ ] Versão incrementada (`npm version`)
- [ ] Commit e push no Git
- [ ] Tag criada (`git tag v1.0.0`)
- [ ] Dry-run OK (`npm publish --dry-run`)

---

## 🏷️ Tags e Releases

### Criar tag no Git

```bash
# Criar tag
git tag v1.0.0

# Push da tag
git push origin v1.0.0

# Ou fazer tudo de uma vez
npm version patch && git push && git push --tags
```

### Criar Release no GitHub

1. Ir para: https://github.com/Just-mpm/eslint-plugin-mui-v7/releases
2. Clicar em "Draft a new release"
3. Selecionar a tag (ex: v1.0.0)
4. Escrever release notes
5. Publicar

---

## 📊 Monitoramento

### Ver estatísticas de downloads

```bash
npm view eslint-plugin-mui-v7

# Ou online
https://npm-stat.com/charts.html?package=eslint-plugin-mui-v7
```

### Ver versões publicadas

```bash
npm view eslint-plugin-mui-v7 versions
```

---

## 🔧 Comandos Úteis

### Desfazer publicação (cuidado!)

```bash
# Apenas nas primeiras 72 horas
npm unpublish eslint-plugin-mui-v7@1.0.0

# Deprecar versão (melhor opção)
npm deprecate eslint-plugin-mui-v7@1.0.0 "Use version 1.0.1 instead"
```

### Atualizar README sem nova versão

```bash
# Editar README.md
npm publish
# O npm atualiza o README automaticamente
```

---

## 🤖 Automação com GitHub Actions

Crie `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Configurar NPM_TOKEN:

1. Gerar token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Tipo: "Automation"
3. Adicionar em GitHub: Settings → Secrets → Actions → New secret
4. Nome: `NPM_TOKEN`

---

## 🌍 Publicar em Múltiplos Registries

### GitHub Packages

```bash
# Adicionar em package.json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}

# Publicar
npm publish
```

### Registro Privado (npm Pro)

```bash
# Criar organização no npm
npm org create @sua-org

# Atualizar package.json
{
  "name": "@sua-org/eslint-plugin-mui-v7"
}

# Publicar
npm publish --access=public
```

---

## 📚 Recursos

- **npm Docs:** https://docs.npmjs.com/
- **Semantic Versioning:** https://semver.org/
- **npm Best Practices:** https://docs.npmjs.com/cli/v9/using-npm/developers

---

## 🎓 Exemplo Completo

```bash
# 1. Fazer mudanças no código
vim index.js

# 2. Testar localmente
npm test

# 3. Atualizar versão
npm version patch  # ou minor, ou major

# 4. Commit e push
git add .
git commit -m "fix: corrigir detecção de Grid2"
git push

# 5. Push da tag
git push --tags

# 6. Publicar no npm
npm publish

# 7. Criar Release no GitHub (opcional)
# Ir para: https://github.com/Just-mpm/eslint-plugin-mui-v7/releases/new
```

---

## ⚠️ Troubleshooting

### Erro: "You do not have permission to publish"

```bash
# Verificar autenticação
npm whoami

# Fazer login novamente
npm login
```

### Erro: "Package name taken"

```bash
# Usar scope
{
  "name": "@sua-org/eslint-plugin-mui-v7"
}
```

### Erro: "Version already exists"

```bash
# Incrementar versão
npm version patch

# Ou publicar manualmente
npm publish
```

---

## 🎉 Após Publicação

1. ✅ Testar instalação: `npm install eslint-plugin-mui-v7`
2. ✅ Verificar no npm: https://www.npmjs.com/package/eslint-plugin-mui-v7
3. ✅ Compartilhar nas redes sociais
4. ✅ Adicionar badge no README:

```markdown
[![npm version](https://badge.fury.io/js/eslint-plugin-mui-v7.svg)](https://www.npmjs.com/package/eslint-plugin-mui-v7)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-mui-v7.svg)](https://www.npmjs.com/package/eslint-plugin-mui-v7)
```

---

**Criado por:** Matheus (Koda AI Studio) + Claude Code
**Data:** 2025-01-26
**Versão:** 1.0.0
