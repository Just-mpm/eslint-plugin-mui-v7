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
- 🔄 **Detect deprecated props** - onBackdropClick, size="normal", Hidden/PigmentHidden components
- 🎨 **Catch deprecated imports** - createMuiTheme, experimentalStyled
- 📦 **Deep imports detection** - Deep imports break in V7 due to exports field
- ⚠️ **GridLegacy detection** - Catch old Grid imports that are now deprecated
- 🔧 **Components/componentsProps deprecation** - Suggests slots/slotProps API
- 💡 **Theme variables suggestion** - Use `theme.vars.*` for automatic dark mode support (optional)
- 🔧 **Auto-fix available** for 10/10 rules (100%)! 🎯

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
      'mui-v7/no-deprecated-imports': 'error',
      'mui-v7/no-deep-imports': 'error',
      'mui-v7/no-grid-legacy': 'error',

      // Best practices - WARNINGS (sugestões)
      'mui-v7/prefer-slots-api': 'warn',
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
    'mui-v7/no-deprecated-imports': 'error',
    'mui-v7/no-deep-imports': 'error',
    'mui-v7/no-grid-legacy': 'error',
    'mui-v7/prefer-slots-api': 'warn',
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

#### `mui-v7/no-grid-item-prop` ✨ IMPROVED in v1.3.0

Grid doesn't use `item` prop anymore, use `size` instead. Now with **auto-fix**!

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

**Moved components:** Alert, AlertTitle, Autocomplete, AvatarGroup, Pagination, PaginationItem, Rating, Skeleton, SpeedDial, SpeedDialAction, SpeedDialIcon, ToggleButton, ToggleButtonGroup

**Still in @mui/lab:** LoadingButton, Masonry, TabContext, TabList, TabPanel, Timeline (and related components)

**Moved to MUI X:** TreeView and TreeItem moved to @mui/x-tree-view (not @mui/material)

#### `mui-v7/no-deprecated-props` ✨ IMPROVED in v1.3.0

Detects props and components removed in V7.

```typescript
// ❌ Dialog.onBackdropClick - REMOVED
<Dialog onBackdropClick={handleClick}>

// ❌ Modal.onBackdropClick - REMOVED (NEW!)
<Modal onBackdropClick={handleClick}>

// ✅ Use onClose with reason check
<Dialog onClose={(event, reason) => {
  if (reason === 'backdropClick') {
    // Your logic here
  }
}}>

// ❌ InputLabel size="normal" - RENAMED
<InputLabel size="normal">

// ✅ Use size="medium" (with auto-fix!)
<InputLabel size="medium">

// ❌ Hidden component - REMOVED
<Hidden xlUp><Paper /></Hidden>

// ❌ PigmentHidden component - REMOVED (NEW!)
<PigmentHidden xlUp><Paper /></PigmentHidden>

// ✅ Use sx prop
<Paper sx={{ display: { xl: 'none' } }} />

// ✅ Or use useMediaQuery
const hidden = useMediaQuery(theme => theme.breakpoints.up('xl'))
return hidden ? null : <Paper />
```

#### `mui-v7/no-deprecated-imports` ✨ NEW in v1.3.0

Detects deprecated imports removed in V7.

```typescript
// ❌ createMuiTheme - REMOVED
import { createMuiTheme } from '@mui/material/styles'

// ✅ Use createTheme (with auto-fix!)
import { createTheme } from '@mui/material/styles'

// ❌ experimentalStyled - REMOVED
import { experimentalStyled } from '@mui/material/styles'

// ✅ Use styled (with auto-fix!)
import { styled } from '@mui/material/styles'
```

#### `mui-v7/no-deep-imports` ✨ NEW in v1.4.0

Detects deep imports that break in V7 due to the exports field.

```typescript
// ❌ Deep imports don't work anymore
import Button from '@mui/material/Button/Button'

// ✅ Use main entry point (with auto-fix!)
import { Button } from '@mui/material'
```

#### `mui-v7/no-grid-legacy` ✨ NEW in v1.4.0

Detects old Grid imports that are now deprecated.

```typescript
// ❌ Old Grid import (now GridLegacy)
import Grid from '@mui/material/Grid'

// ✅ Option 1: Keep using old Grid temporarily (with auto-fix!)
import { GridLegacy as Grid } from '@mui/material'

// ✅ Option 2: Migrate to new Grid (recommended!)
import { Grid } from '@mui/material'
// Use size={{ xs: 12 }} instead of item xs={12}
```

### 💡 Best Practices (Warnings)

These are suggestions, not breaking changes.

#### `mui-v7/prefer-slots-api` ✨ NEW in v1.3.0

Recommends using slots/slotProps instead of components/componentsProps.

```typescript
// ⚠️ Deprecated (still works but will be removed)
<TextField
  components={{ Input: CustomInput }}
  componentsProps={{ input: { className: 'custom' } }}
/>

// ✅ Recommended: New slots API
<TextField
  slots={{ input: CustomInput }}
  slotProps={{ input: { className: 'custom' } }}
/>
```

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

### v1.3.0 (2025-11-14) - Major Update! 🎉

#### New Rules
- ✨ **no-deprecated-imports**: Detects `createMuiTheme` and `experimentalStyled` (with auto-fix!)
- ✨ **prefer-slots-api**: Recommends `slots`/`slotProps` over `components`/`componentsProps`

#### Enhanced Rules
- 🔧 **no-deprecated-props**: Now detects `Modal.onBackdropClick` and `PigmentHidden` component
- 🔧 **no-deprecated-props**: Auto-fix for `InputLabel size="normal"` → `size="medium"`
- 🔧 **no-grid-item-prop**: Smart auto-fix that converts breakpoint props to `size` object
- 🔧 **no-grid2-import**: Improved fix that properly renames `Grid2` → `Grid` and `grid2Classes` → `gridClasses`
- 🔧 **no-unstable-grid**: Better handling of default imports

#### Code Quality
- ✅ Added comprehensive test suite with 50+ test cases
- 🛡️ Added optional chaining (`?.`) for safer AST navigation
- 📦 Updated package.json with proper test scripts
- 🔄 Updated to run tests before publishing (`prepublishOnly`)

### v1.2.1 (2025-10-30)

#### UX Improvements
- ✨ Enhanced `no-lab-imports` to show **all moved components** in error messages
- 📝 Before: `Este componente foi movido` (showed only first component)
- 🎯 Now: `3 componente(s) movido(s)` with complete list: `Alert, Autocomplete, Rating`

### v1.2.0 (2025-10-30)

#### Performance
- ⚡ Optimized `no-lab-imports`: O(n×m) → O(n) using Set lookup instead of Array.includes
- ⚡ Optimized `prefer-theme-vars`: Added WeakMap cache for getText() calls to eliminate duplicate I/O
- 🧹 Improved code readability with optional chaining and early returns
- 📊 Moved `MOVED_COMPONENTS` to module scope to avoid recreation on every rule invocation

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

## ⚠️ Known Limitations

This plugin has some limitations to ensure safe and reliable autofixes:

### 1. **Spread Props are Not Auto-Fixed**

When a component has spread props (`{...props}`), the autofix is disabled to avoid potential issues:

```tsx
// ❌ Plugin detects the issue but WON'T auto-fix (safe!)
<Grid {...props} item xs={12}>Content</Grid>

// Why? If props contains { item: true, xs: 6 }, the spread would override our fix
```

**Solution:** Fix manually or remove the spread props first.

### 2. **Dynamic Props are Not Auto-Fixed**

Complex expressions and variables are not auto-fixed:

```tsx
// ❌ Plugin detects but WON'T auto-fix (safe!)
<Grid item xs={isMobile ? 12 : 6}>Content</Grid>
<Grid item xs={colSize}>Content</Grid>
```

**Solution:** These require manual migration to `size` prop.

### 3. **Cross-File Dependencies**

The plugin cannot detect issues that span multiple files:

```tsx
// File 1: component-props.ts
export const gridProps = { item: true, xs: 12 }

// File 2: Component.tsx - Plugin won't detect this!
<Grid {...gridProps}>Content</Grid>
```

**Solution:** Run the plugin on all files and review spread props carefully.

### 4. **Best Practices vs Breaking Changes**

The plugin focuses on **breaking changes only**. Some MUI best practices are not enforced:

- ✅ Detects: Code that **breaks** in V7
- ❌ Doesn't detect: Deprecated but still working code (unless it's in the migration path)

### 🔗 For Complex Cases

For complex migrations, consider using MUI's official codemods:

```bash
# Official MUI codemods
npx @mui/codemod v7.0.0/grid-props <path>
npx @mui/codemod v7.0.0/lab-removed-components <path>
```

**This plugin complements the codemods by providing continuous validation!**

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
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

**Keywords:** eslint, mui, material-ui, mui-v7, react, typescript, linter, code-quality, migration, breaking-changes
