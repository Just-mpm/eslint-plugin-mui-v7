# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
