# eslint-plugin-mui-v7

> ESLint plugin for Material-UI v7 with educational and friendly error messages

Automatically detect incorrect usage of Material-UI V7 and teach developers the right way through helpful messages with emojis and examples!

## ✨ Features

- ❌ **Detect deprecated deep imports** - No more `import createTheme from '@mui/material/styles/createTheme'`
- ❌ **Catch Grid2 usage** - Grid2 was renamed to Grid in V7
- ❌ **Find moved @mui/lab components** - Alert, Skeleton, Rating, etc. are now in @mui/material
- ❌ **Detect deprecated props** - onBackdropClick, size="normal", Hidden component
- ❌ **Grid item prop detection** - Grid doesn't use `item` prop anymore, use `size` instead
- ⚠️ **Theme variables suggestion** - Use `theme.vars.*` for automatic dark mode support
- 🔧 **Auto-fix available** for most rules!

## 📦 Installation

```bash
npm install --save-dev eslint-plugin-mui-v7
```

## 🚀 Usage

### ESLint 9+ (Flat Config)

```javascript
// eslint.config.js
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  {
    plugins: {
      'mui-v7': muiV7Plugin,
    },
    rules: {
      // Errors (block code)
      'mui-v7/no-deep-imports': 'error',
      'mui-v7/no-grid2-import': 'error',
      'mui-v7/no-lab-imports': 'error',
      'mui-v7/no-grid-item-prop': 'error',
      'mui-v7/no-deprecated-props': 'error',

      // Warnings (suggest improvements)
      'mui-v7/no-old-grid-import': 'warn',
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
    'mui-v7/no-deep-imports': 'error',
    'mui-v7/no-grid2-import': 'error',
    'mui-v7/no-lab-imports': 'error',
    'mui-v7/no-grid-item-prop': 'error',
    'mui-v7/no-deprecated-props': 'error',
    'mui-v7/no-old-grid-import': 'warn',
    'mui-v7/prefer-theme-vars': 'warn',
  },
}
```

### Using Recommended Config

```javascript
// eslint.config.js
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.recommended, // Applies all recommended rules
]
```

## 📋 Rules

### 🚨 Error Rules (Must Fix)

#### `mui-v7/no-deep-imports`

Deep imports with more than one level are not supported in MUI V7.

```typescript
// ❌ Bad
import createTheme from '@mui/material/styles/createTheme'

// ✅ Good
import { createTheme } from '@mui/material/styles'
```

#### `mui-v7/no-grid2-import`

Grid2 was renamed to Grid in V7.

```typescript
// ❌ Bad
import Grid2 from '@mui/material/Grid2'

// ✅ Good
import Grid from '@mui/material/Grid'
```

#### `mui-v7/no-lab-imports`

Components moved from @mui/lab to @mui/material.

```typescript
// ❌ Bad
import Alert from '@mui/lab/Alert'
import Skeleton from '@mui/lab/Skeleton'

// ✅ Good
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
```

**Moved components:** Alert, AlertTitle, Autocomplete, AvatarGroup, Pagination, PaginationItem, Rating, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon, TabContext, TabList, TabPanel, Timeline*, ToggleButton, ToggleButtonGroup, TreeView, TreeItem

#### `mui-v7/no-grid-item-prop`

Grid doesn't use `item` prop anymore, use `size` instead.

```typescript
// ❌ Bad
<Grid item xs={12} md={6}>
  Content
</Grid>

// ✅ Good
<Grid size={{ xs: 12, md: 6 }}>
  Content
</Grid>
```

#### `mui-v7/no-deprecated-props`

Detects deprecated props in various components.

```typescript
// ❌ Bad: Dialog.onBackdropClick
<Dialog onBackdropClick={handleClick}>

// ✅ Good
<Dialog onClose={(event, reason) => {
  if (reason === 'backdropClick') {
    // Your logic here
  }
}}>

// ❌ Bad: InputLabel size="normal"
<InputLabel size="normal">

// ✅ Good
<InputLabel size="medium">

// ❌ Bad: Hidden component
<Hidden xlUp><Paper /></Hidden>

// ✅ Good: Use sx prop
<Paper sx={{ display: { xl: 'none' } }} />

// ✅ Good: Use useMediaQuery
const hidden = useMediaQuery(theme => theme.breakpoints.up('xl'))
return hidden ? null : <Paper />
```

### ⚠️ Warning Rules (Suggestions)

#### `mui-v7/no-old-grid-import`

Suggests migrating from old Grid to the new one.

```typescript
// ⚠️ If you want to keep old Grid
import Grid from '@mui/material/GridLegacy'

// ✅ Recommended: Migrate to new Grid
import Grid from '@mui/material/Grid'
```

#### `mui-v7/prefer-theme-vars`

When using `cssVariables: true`, use `theme.vars.*` for automatic dark mode support.

```typescript
// ⚠️ Warning (doesn't change with dark mode)
const Custom = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
}))

// ✅ Good (changes automatically with dark mode)
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
   Você pode usar offset, push, pull e mais.
```

## 🔧 Configuration Options

### Severity Levels

```javascript
rules: {
  'mui-v7/no-deep-imports': 'error',  // Blocks code
  'mui-v7/no-deep-imports': 'warn',   // Shows warning
  'mui-v7/no-deep-imports': 'off',    // Disables rule
}
```

### Recommended Config

```javascript
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.recommended, // All errors + warnings
]
```

### Strict Config

```javascript
import muiV7Plugin from 'eslint-plugin-mui-v7'

export default [
  muiV7Plugin.configs.strict, // Everything as error
]
```

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

**Keywords:** eslint, mui, material-ui, mui-v7, react, typescript, linter, code-quality
