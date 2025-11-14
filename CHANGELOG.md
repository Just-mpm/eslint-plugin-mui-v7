# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-11-14 - Major Update! 🎉

### Added
- ✨ **New Rule: `no-deprecated-imports`**: Detects and auto-fixes deprecated imports
  - `createMuiTheme` → `createTheme`
  - `experimentalStyled` → `styled`
- ✨ **New Rule: `prefer-slots-api`**: Recommends `slots`/`slotProps` over `components`/`componentsProps`
- ✅ **Comprehensive test suite**: 50+ test cases covering all rules
- 🧪 **Test scripts**: `npm test` and `npm run test:watch`

### Changed
- 🔧 **Enhanced `no-deprecated-props`**: Now detects `Modal.onBackdropClick` and `PigmentHidden` component
- 🔧 **Auto-fix for `InputLabel size="normal"`**: Now automatically fixes to `size="medium"`
- 🔧 **Smart auto-fix for `no-grid-item-prop`**: Converts `<Grid item xs={12} sm={6}>` → `<Grid size={{ xs: 12, sm: 6 }}>`
- 🔧 **Improved `no-grid2-import` fix**: Properly renames `Grid2` → `Grid` and `grid2Classes` → `gridClasses`
- 🔧 **Better `no-unstable-grid` handling**: Correctly converts default imports to named imports
- 🛡️ **Added optional chaining (`?.`)**: Safer AST navigation prevents potential crashes
- 📦 **Updated package.json**: Version bump to 1.3.0, added test scripts
- 🔄 **prepublishOnly hook**: Tests run automatically before publishing

### Fixed
- 🐛 Fixed potential crashes when AST nodes are missing properties
- 🐛 Improved autofix reliability for Grid-related rules

### Why This Release?
This is a **major feature release** that addresses all missing breaking changes from MUI V7 migration guide! We've added detection for deprecated imports (`createMuiTheme`, `experimentalStyled`), expanded component detection (`Modal.onBackdropClick`, `PigmentHidden`), and significantly improved auto-fix capabilities. Most importantly, we now have a **comprehensive test suite** ensuring plugin reliability!

---

## [1.2.1] - 2025-10-30

### Changed
- ✨ Enhanced `no-lab-imports` UX: Now shows **all moved components** in error messages
- 📝 Before: `Este componente foi movido` (showed only first component)
- 🎯 Now: `3 componente(s) movido(s)` with complete list: `Alert, Autocomplete, Rating`

### Why This Release?
Better user experience - developers can see all problematic imports at once instead of fixing them one by one!

---

## [1.2.0] - 2025-10-30

### Changed
- ⚡ **Performance optimization for `no-lab-imports`**: O(n×m) → O(n)
  - Replaced `Array.includes()` with `Set.has()` for O(1) lookup
- ⚡ **Performance optimization for `prefer-theme-vars`**: Added WeakMap cache
  - Eliminates duplicate `getText()` calls for the same node
- 🧹 Improved code readability with optional chaining and early returns
- 📊 Moved `MOVED_COMPONENTS` to module scope to avoid recreation on every rule invocation
- 🏗️ Formalized AST traversal depth tracking with `MAX_DEPTH` constant
- 💾 Added source text caching to prevent redundant file reads

### Why This Release?
Performance improvements and code quality! The plugin now runs faster and is more maintainable.

---

## [1.1.0] - 2025-01-27

### Added
- ✨ New rule `no-unstable-grid`: Detects Unstable_Grid2 usage (promoted to stable Grid in V7)

### Changed
- 🎯 **BREAKING PHILOSOPHY**: Plugin now focuses exclusively on breaking changes (code that actually breaks in V7)
- 📝 All import examples now show recommended style: `import { Grid } from '@mui/material'`
- 📦 Updated plugin description: "focused on Material-UI V6 to V7 breaking changes"
- 🏷️ Changed rule categories from "Best Practices" to "Breaking Changes" for core rules
- 📋 Reorganized configs with clear comments (breaking changes vs best practices)
- 📚 Complete README rewrite focusing on breaking changes philosophy

### Removed
- ❌ Rule `no-deep-imports`: Not a breaking change in V7 (deep imports still work)
- ❌ Rule `no-old-grid-import`: Confusing and not a breaking change

### Why This Release?
This release refocuses the plugin on what matters most: **code that will actually break** when upgrading to MUI V7. We removed rules that warned about best practices but didn't cause runtime errors. The plugin is now more useful and less annoying!

---

## [1.0.0] - 2025-01-26

### Added
- Initial release of eslint-plugin-mui-v7
- Rule `no-deep-imports`: Detect deprecated deep imports
- Rule `no-grid2-import`: Detect Grid2 usage (renamed to Grid in V7)
- Rule `no-lab-imports`: Detect components moved from @mui/lab
- Rule `no-grid-item-prop`: Detect Grid `item` prop usage
- Rule `no-deprecated-props`: Detect deprecated props (onBackdropClick, size="normal", Hidden)
- Rule `no-old-grid-import`: Suggest migrating from old Grid
- Rule `prefer-theme-vars`: Recommend using theme.vars for CSS variables
- Auto-fix support for most rules
- Educational error messages with emojis and examples
- ESM and CommonJS support
- Recommended and strict configurations

### Features
- 🎓 Educational messages teach the "why" behind each error
- 🔧 Auto-fix available for most rules
- 📦 Support for both ESLint 9+ (flat config) and legacy config
- 🌍 Dual package (ESM + CommonJS)
- ⚡ Zero dependencies (peer dependency: eslint >=8.0.0)

---

## Template for Future Releases

## [Unreleased]

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes

---

**Legend:**
- Added: New features
- Changed: Changes in existing functionality
- Deprecated: Soon-to-be removed features
- Removed: Removed features
- Fixed: Bug fixes
- Security: Vulnerability fixes
