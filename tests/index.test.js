/**
 * Testes para eslint-plugin-mui-v7
 *
 * @version 1.3.0
 * @author Matheus (Koda AI Studio) + Claude Code
 */

import { RuleTester } from 'eslint';
import plugin from '../index.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

console.log('🧪 Running ESLint Plugin MUI V7 Tests...\n');

// =============================================================================
// Test: no-unstable-grid
// =============================================================================

console.log('Testing no-unstable-grid...');
ruleTester.run('no-unstable-grid', plugin.rules['no-unstable-grid'], {
  valid: [
    { code: 'import { Grid } from "@mui/material"' },
    { code: 'import Grid from "@mui/material"' },
  ],
  invalid: [
    {
      code: 'import Grid from "@mui/material/Unstable_Grid2"',
      errors: [{ messageId: 'unstableGrid' }],
      output: 'import Grid from "@mui/material"',
    },
  ],
});

// =============================================================================
// Test: no-grid2-import
// =============================================================================

console.log('Testing no-grid2-import...');
ruleTester.run('no-grid2-import', plugin.rules['no-grid2-import'], {
  valid: [
    { code: 'import { Grid } from "@mui/material"' },
    { code: 'import { gridClasses } from "@mui/material"' },
  ],
  invalid: [
    {
      code: 'import Grid2 from "@mui/material/Grid2"',
      errors: [{ messageId: 'grid2Import' }],
      output: 'import { Grid } from "@mui/material"',
    },
    {
      code: 'import { grid2Classes } from "@mui/material/Grid2"',
      errors: [{ messageId: 'grid2Import' }],
      output: 'import { gridClasses } from "@mui/material"',
    },
  ],
});

// =============================================================================
// Test: no-lab-imports
// =============================================================================

console.log('Testing no-lab-imports...');
ruleTester.run('no-lab-imports', plugin.rules['no-lab-imports'], {
  valid: [
    { code: 'import { Alert } from "@mui/material"' },
    { code: 'import { LoadingButton } from "@mui/lab"' }, // LoadingButton não foi movido
  ],
  invalid: [
    {
      code: 'import { Alert } from "@mui/lab"',
      errors: [{ messageId: 'labImport' }],
      output: 'import { Alert } from "@mui/material"',
    },
    {
      code: 'import { Alert, Skeleton, Rating } from "@mui/lab"',
      errors: [{ messageId: 'labImport' }],
      output: 'import { Alert, Skeleton, Rating } from "@mui/material"',
    },
  ],
});

// =============================================================================
// Test: no-grid-item-prop
// =============================================================================

console.log('Testing no-grid-item-prop...');
ruleTester.run('no-grid-item-prop', plugin.rules['no-grid-item-prop'], {
  valid: [
    { code: '<Grid container spacing={2}>Content</Grid>' },
    { code: '<Box xs={12}>Content</Box>' },
  ],
  invalid: [
    {
      code: '<Grid item xs={12}>Content</Grid>',
      errors: [{ messageId: 'gridItemProp' }],
    },
    {
      code: '<Grid xs={12}>Content</Grid>',
      errors: [{ messageId: 'gridItemProp' }],
    },
  ],
});

// =============================================================================
// Test: no-deprecated-props
// =============================================================================

console.log('Testing no-deprecated-props...');
ruleTester.run('no-deprecated-props', plugin.rules['no-deprecated-props'], {
  valid: [
    { code: '<Dialog onClose={handler}>Content</Dialog>' },
    { code: '<Modal onClose={handler}>Content</Modal>' },
    { code: '<InputLabel size="medium">Label</InputLabel>' },
  ],
  invalid: [
    {
      code: '<Dialog onBackdropClick={handler}>Content</Dialog>',
      errors: [{ messageId: 'onBackdropClick' }],
    },
    {
      code: '<Modal onBackdropClick={handler}>Content</Modal>',
      errors: [{ messageId: 'onBackdropClick' }],
    },
    {
      code: '<InputLabel size="normal">Label</InputLabel>',
      errors: [{ messageId: 'inputLabelNormal' }],
      output: '<InputLabel size="medium">Label</InputLabel>',
    },
    {
      code: '<Hidden xlUp><Paper /></Hidden>',
      errors: [{ messageId: 'hiddenComponent' }],
    },
    {
      code: '<PigmentHidden xlUp><Paper /></PigmentHidden>',
      errors: [{ messageId: 'pigmentHiddenComponent' }],
    },
  ],
});

// =============================================================================
// Test: no-deprecated-imports
// =============================================================================

console.log('Testing no-deprecated-imports...');
ruleTester.run('no-deprecated-imports', plugin.rules['no-deprecated-imports'], {
  valid: [
    { code: 'import { createTheme } from "@mui/material/styles"' },
    { code: 'import { styled } from "@mui/material/styles"' },
  ],
  invalid: [
    {
      code: 'import { createMuiTheme } from "@mui/material/styles"',
      errors: [{ messageId: 'createMuiTheme' }],
      output: 'import { createTheme } from "@mui/material/styles"',
    },
    {
      code: 'import { experimentalStyled } from "@mui/material/styles"',
      errors: [{ messageId: 'experimentalStyled' }],
      output: 'import { styled } from "@mui/material/styles"',
    },
  ],
});

// =============================================================================
// Test: prefer-slots-api
// =============================================================================

console.log('Testing prefer-slots-api...');
ruleTester.run('prefer-slots-api', plugin.rules['prefer-slots-api'], {
  valid: [
    { code: '<TextField />' },
    { code: '<TextField label="Test" />' },
  ],
  invalid: [
    {
      code: '<TextField components={obj} />',
      errors: [{ messageId: 'useSlots' }],
    },
    {
      code: '<TextField componentsProps={obj} />',
      errors: [{ messageId: 'useSlots' }],
    },
  ],
});

// =============================================================================
// Test: prefer-theme-vars
// =============================================================================

console.log('Testing prefer-theme-vars...');
ruleTester.run('prefer-theme-vars', plugin.rules['prefer-theme-vars'], {
  valid: [
    { code: 'const color = theme.vars.palette.primary.main' },
    { code: 'const text = theme.typography.h1' },
  ],
  invalid: [
    {
      code: 'const color = theme.palette.primary.main',
      errors: [{ messageId: 'useThemeVars' }],
    },
  ],
});

console.log('\n✅ Todos os testes passaram com sucesso!');
