# eslint-plugin-mui-v7

> ESLint plugin focused on Material-UI V6 to V7 **breaking changes** with educational error messages

Automatically detect code that **BREAKS** when migrating from MUI V6 to V7 and teach developers the correct way through helpful messages with emojis and examples!

## 🎯 Philosophy

This plugin focuses on **breaking changes only** - code that will actually break when upgrading to V7. We don't warn about best practices or style preferences, just things that will cause errors.

## ✨ Features

- 🚀 **Detect Unstable_Grid2 usage** - Now promoted to stable Grid
- ⚠️ **Catch Grid2 usage** - Grid2 was renamed to Grid in V7
- 🎯 **Grid item prop detection** - Grid doesn't use `item` prop anymore, use `size` instead
- ✨ **Find moved @mui/lab components** - Alert, Skeleton, Rating, etc. are now in @mui/material
- 🔄 **Detect deprecated props** - onBackdropClick, size="normal", Hidden component
- 💡 **Theme variables suggestion** - Use `theme.vars.*` for automatic dark mode support (optional)
- 🔧 **Auto-fix available** for most rules!

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-mui-v7
```

## 🚀 Quick Start

### ESLint 9+ (Flat Config) - Recommended

```javascript
// eslint.config.js
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.recommended, // ✅ Apply all recommended rules
]
```

### Manual Configuration

```javascript
// eslint.config.js
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  {
    plugins: {
      'mui-v7': muiV7Plugin,
    },
    rules: {
      // Breaking changes - ERRORS (código quebra)
      'mui-v7/no-unstable-grid': 'error',
      'mui-v7/no-grid2-import': 'error',
      'mui-v7/no-grid-item-prop': 'error',
      'mui-v7/no-lab-imports': 'error',
      'mui-v7/no-deprecated-props': 'error',

      // Best practices - WARNINGS (sugestões)
      'mui-v7/prefer-theme-vars': 'warn',
    },
  },
]
```

### ESLint <9 (Legacy Config)

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['mui-v7'],
  rules: {
    'mui-v7/no-unstable-grid': 'error',
    'mui-v7/no-grid2-import': 'error',
    'mui-v7/no-grid-item-prop': 'error',
    'mui-v7/no-lab-imports': 'error',
    'mui-v7/no-deprecated-props': 'error',
    'mui-v7/prefer-theme-vars': 'warn',
  },
}
```

## 📋 Rules

### 🚨 Breaking Changes (Errors)

These rules detect code that **WILL BREAK** in MUI V7.

#### `mui-v7/no-unstable-grid` ✨ NEW in v1.1.0

Unstable_Grid2 was promoted to stable Grid in V7.

```typescript
// ❌ Breaks in V7
import Grid from '@mui/material/Unstable_Grid2'
import Grid2 from '@mui/material/Unstable_Grid2'

// ✅ Recommended
import { Grid } from '@mui/material'
```

#### `mui-v7/no-grid2-import`

Grid2 was renamed to Grid in V7.

```typescript
// ❌ Breaks in V7
import Grid2 from '@mui/material/Grid2'
import { grid2Classes } from '@mui/material/Grid2'

// ✅ Recommended
import { Grid } from '@mui/material'
import { gridClasses } from '@mui/material'
```

#### `mui-v7/no-grid-item-prop`

Grid doesn't use `item` prop anymore, use `size` instead.

```typescript
// ❌ Breaks in V7
<Grid item xs={12} sm={6} md={4}>
  Content
</Grid>

// ✅ Works in V7
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
  Content
</Grid>
```

#### `mui-v7/no-lab-imports`

Components moved from @mui/lab to @mui/material.

```typescript
// ❌ Breaks in V7
import { Alert } from '@mui/lab'
import { Skeleton } from '@mui/lab'

// ✅ Recommended
import { Alert } from '@mui/material'
import { Skeleton } from '@mui/material'
```

**Moved components:** Alert, AlertTitle, Autocomplete, AvatarGroup, Pagination, PaginationItem, Rating, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon, TabContext, TabList, TabPanel, Timeline*, ToggleButton, ToggleButtonGroup, TreeView, TreeItem

#### `mui-v7/no-deprecated-props`

Detects props removed in V7.

```typescript
// ❌ Dialog.onBackdropClick - REMOVED
<Dialog onBackdropClick={handleClick}>

// ✅ Use onClose with reason check
<Dialog onClose={(event, reason) => {
  if (reason === 'backdropClick') {
    // Your logic here
  }
}}>

// ❌ InputLabel size="normal" - RENAMED
<InputLabel size="normal">

// ✅ Use size="medium"
<InputLabel size="medium">

// ❌ Hidden component - REMOVED
<Hidden xlUp><Paper /></Hidden>

// ✅ Use sx prop
<Paper sx={{ display: { xl: 'none' } }} />

// ✅ Or use useMediaQuery
const hidden = useMediaQuery(theme => theme.breakpoints.up('xl'))
return hidden ? null : <Paper />
```

### 💡 Best Practices (Warnings)

These are suggestions, not breaking changes.

#### `mui-v7/prefer-theme-vars`

When using `cssVariables: true`, use `theme.vars.*` for better performance and automatic dark mode.

```typescript
// ⚠️ Works but doesn't change with dark mode automatically
const Custom = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
}))

// ✅ Better: Changes automatically with dark mode
const Custom = styled('div')(({ theme }) => ({
  color: theme.vars.palette.text.primary,
}))
```

## 🎓 Example Messages

The plugin provides educational messages with emojis and examples:

```
🎯 Grid no MUI V7 não usa mais a prop `item`!

🔧 Forma antiga (V6):
   <Grid item xs={12} sm={6} md={4}>

✅ Forma nova (V7):
   <Grid size={{ xs: 12, sm: 6, md: 4 }}>

💡 A nova sintaxe é mais limpa e poderosa!
   Você pode usar: size, offset, spacing responsivo e mais.
```

## 🔧 Configuration Presets

### `recommended` - Balanced (Default)

Breaking changes as **errors**, best practices as **warnings**.

```javascript
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.recommended,
]
```

### `strict` - Strict Mode

Everything as **errors** (including best practices).

```javascript
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.strict,
]
```

## 🆕 What's New

### v1.2.0 (2025-10-30)

#### Performance
- ⚡ Optimized `no-lab-imports`: O(n×m) → O(n) using Set lookup instead of Array.includes
- ⚡ Optimized `prefer-theme-vars`: Added WeakMap cache for getText() calls to eliminate duplicate I/O
- 🧹 Improved code readability with optional chaining and early returns
- 📊 Moved `MOVED_COMPONENTS` to module scope to avoid recreation on every rule invocation

#### UX Improvements
- ✨ Enhanced `no-lab-imports` to show **all moved components** in error messages
- 📝 Before: `Este componente foi movido` (showed only first component)
- 🎯 Now: `3 componente(s) movido(s)` with complete list: `Alert, Autocomplete, Rating`

#### Internal
- 🏗️ Formalized AST traversal depth tracking with MAX_DEPTH constant
- 💾 Source text caching to prevent redundant file reads

### v1.1.0 (2025-01-27)

#### Added
- ✨ New rule `no-unstable-grid` - Detects Unstable_Grid2 usage

#### Changed
- 📝 All import examples now show recommended style: `import { Grid } from '@mui/material'`
- 🎯 Refocused on breaking changes only (removed non-breaking rules)
- 📦 Updated plugin description and categories

#### Removed
- ❌ `no-deep-imports` - Not a breaking change in V7
- ❌ `no-old-grid-import` - Confusing and not a breaking change

## 📚 Migration Guide

1. Install the plugin:
```bash
npm install --save-dev eslint-plugin-mui-v7
```

2. Add to your ESLint config:
```javascript
// eslint.config.js
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.recommended,
]
```

3. Run ESLint:
```bash
npx eslint . --fix
```

4. Fix remaining issues manually (the plugin will guide you!)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Matheus Pimenta (Koda AI Studio)

## 🔗 Links

- [Material-UI V7 Migration Guide](https://mui.com/material-ui/migration/upgrade-to-v7/)
- [GitHub Repository](https://github.com/Just-mpm/eslint-plugin-mui-v7)
- [npm Package](https://www.npmjs.com/package/eslint-plugin-mui-v7)

## ❤️ Credits

Created by **Matheus Pimenta** (Koda AI Studio) + **Claude Code**

---

**Keywords:** eslint, mui, material-ui, mui-v7, react, typescript, linter, code-quality, migration, breaking-changes
