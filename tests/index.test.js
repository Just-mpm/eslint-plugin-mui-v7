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
    // Componentes que AINDA ESTÃO no @mui/lab (não devem gerar erro):
    { code: 'import { LoadingButton } from "@mui/lab"' },
    { code: 'import { Timeline } from "@mui/lab"' },
    { code: 'import { TimelineItem, TimelineContent } from "@mui/lab"' },
    { code: 'import { TabContext, TabList, TabPanel } from "@mui/lab"' },
    { code: 'import TabContext from "@mui/lab/TabContext"' },
    // TreeView/TreeItem foram movidos para @mui/x-tree-view (não @mui/material):
    { code: 'import { TreeView, TreeItem } from "@mui/lab"' },
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
    { code: '<Grid container xs={12}>Content</Grid>' }, // Grid container pode ter breakpoint props
    { code: '<Box xs={12}>Content</Box>' },
  ],
  invalid: [
    {
      code: '<Grid item xs={12}>Content</Grid>',
      errors: [{ messageId: 'gridItemProp' }],
      output: '<Grid size={12}>Content</Grid>',
    },
    {
      code: '<Grid xs={12}>Content</Grid>',
      errors: [{ messageId: 'gridItemProp' }],
      output: '<Grid size={12}>Content</Grid>',
    },
    {
      code: '<Grid item xs={12} sm={6}>Content</Grid>',
      errors: [{ messageId: 'gridItemProp' }],
      output: '<Grid size={{ xs: 12, sm: 6 }}>Content</Grid>',
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
    { code: 'import { StyledEngineProvider } from "@mui/material/styles"' },
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
    {
      code: 'import { StyledEngineProvider } from "@mui/material"',
      errors: [{ messageId: 'styledEngineProvider' }],
      output: 'import { StyledEngineProvider } from "@mui/material/styles"',
    },
    {
      code: 'import { Button, StyledEngineProvider } from "@mui/material"',
      errors: [{ messageId: 'styledEngineProvider' }],
      output: 'import { Button, StyledEngineProvider } from "@mui/material/styles"',
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
    { code: '<TextField slots={obj} />' },
    { code: '<TextField slotProps={obj} />' },
  ],
  invalid: [
    {
      code: '<TextField components={obj} />',
      errors: [{ messageId: 'useSlots' }],
      output: '<TextField slots={obj} />',
    },
    {
      code: '<TextField componentsProps={obj} />',
      errors: [{ messageId: 'useSlots' }],
      output: '<TextField slotProps={obj} />',
    },
    {
      code: '<TextField components={obj} componentsProps={props} />',
      errors: [{ messageId: 'useSlots' }],
      output: '<TextField slots={obj} slotProps={props} />',
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
    // Não detecta theme.palette fora de theme.vars context:
    { code: 'const bg = theme.vars.palette.background.default' },
  ],
  invalid: [
    // Caso básico - autofix
    {
      code: 'const color = theme.palette.primary.main',
      errors: [{ messageId: 'useThemeVars' }],
      output: 'const color = theme.vars.palette.primary.main',
    },
    // Múltiplas propriedades - autofix
    {
      code: 'const bg = theme.palette.background.default',
      errors: [{ messageId: 'useThemeVars' }],
      output: 'const bg = theme.vars.palette.background.default',
    },
    // Em template literal - autofix
    {
      code: 'const css = `color: ${theme.palette.text.primary}`',
      errors: [{ messageId: 'useThemeVars' }],
      output: 'const css = `color: ${theme.vars.palette.text.primary}`',
    },
    // Em objeto styled - autofix
    {
      code: 'const Box = styled("div")(({ theme }) => ({ color: theme.palette.primary.main }))',
      errors: [{ messageId: 'useThemeVars' }],
      output: 'const Box = styled("div")(({ theme }) => ({ color: theme.vars.palette.primary.main }))',
    },
    // Em sx prop - autofix
    {
      code: '<Box sx={(theme) => ({ borderColor: theme.palette.divider })} />',
      errors: [{ messageId: 'useThemeVars' }],
      output: '<Box sx={(theme) => ({ borderColor: theme.vars.palette.divider })} />',
    },
  ],
});

// =============================================================================
// Test: no-grid-legacy
// =============================================================================

console.log('Testing no-grid-legacy...');
ruleTester.run('no-grid-legacy', plugin.rules['no-grid-legacy'], {
  valid: [
    { code: 'import { Grid } from "@mui/material"' },
    { code: 'import { GridLegacy } from "@mui/material"' },
    { code: 'import { GridLegacy as Grid } from "@mui/material"' },
  ],
  invalid: [
    {
      code: 'import Grid from "@mui/material/Grid"',
      errors: [{ messageId: 'gridLegacyImport' }],
      output: 'import { GridLegacy as Grid } from "@mui/material"',
    },
    {
      code: 'import MyGrid from "@mui/material/Grid"',
      errors: [{ messageId: 'gridLegacyImport' }],
      output: 'import { GridLegacy as MyGrid } from "@mui/material"',
    },
  ],
});

// =============================================================================
// Test: no-deep-imports
// =============================================================================

console.log('Testing no-deep-imports...');
ruleTester.run('no-deep-imports', plugin.rules['no-deep-imports'], {
  valid: [
    { code: 'import { Button } from "@mui/material"' },
    { code: 'import { styled } from "@mui/system"' },
    { code: 'import Button from "@mui/material/Button"' }, // Este é permitido (apenas 1 nível)
  ],
  invalid: [
    {
      code: 'import Button from "@mui/material/Button/Button"',
      errors: [{ messageId: 'deepImport' }],
      output: 'import { Button } from "@mui/material"',
    },
    {
      code: 'import styled from "@mui/system/styled/styled"',
      errors: [{ messageId: 'deepImport' }],
      output: 'import { styled } from "@mui/system"',
    },
  ],
});

console.log('\n✅ Todos os testes passaram com sucesso!');
