// ❌ Arquivo de teste com código MUI V6 (ERRADO) para testar o plugin
// Este arquivo contém múltiplas violações que devem ser detectadas e corrigidas

import React from 'react';

// ❌ ERRO 1: Unstable_Grid2 (deve converter para Grid)
import Grid from "@mui/material";

// ❌ ERRO 2: Grid2 import (deve converter para Grid)
import { Grid } from "@mui/material";
import { gridClasses } from "@mui/material";

// ❌ ERRO 3: Componentes moved from @mui/lab
import { Alert, Skeleton, Rating } from "@mui/material";

// ❌ ERRO 4: Deprecated imports
import { createTheme, styled } from '@mui/material/styles';

// ❌ ERRO 5: Deep import (deve usar entry point)
import { Button } from "@mui/material";

// ❌ ERRO 6: GridLegacy import (Grid antigo)
import { GridLegacy as OldGrid } from "@mui/material";

function TestComponent() {
  // ❌ ERRO 7: Grid com item prop
  return (
    <div>
      <Grid size={{ xs: 12, sm: 6 }}>
        Item 1
      </Grid>

      {/* ❌ ERRO 8: Grid com breakpoint props mas sem item */}
      <Grid size={{ xs: 12, md: 8 }}>
        Item 2
      </Grid>

      {/* ❌ ERRO 9: Grid2 com props antigas */}
      <Grid2 item xs={12}>
        Grid2 Item
      </Grid2>

      {/* ❌ ERRO 10: TextField com components/componentsProps */}
      <TextField
        label="Test"
        slots={{ Input: CustomInput }}
        slotProps={{ input: { className: 'custom' } }}
      />

      {/* ❌ ERRO 11: InputLabel com size="normal" */}
      <InputLabel size="medium">Label</InputLabel>

      {/* ❌ ERRO 12: Modal com onBackdropClick */}
      <Modal onBackdropClick={handleClose}>
        Content
      </Modal>

      {/* ❌ ERRO 13: Hidden component */}
      <Hidden xlUp>
        <div>Hidden content</div>
      </Hidden>

      {/* ✅ OK: Grid container com breakpoint props (não deve dar erro) */}
      <Grid container xs={12}>
        <Grid size={6}>OK</Grid>
      </Grid>

      {/* ❌ ERRO 14: Spread props (deve detectar mas NÃO fazer autofix) */}
      <Grid {...someProps} item xs={12}>
        Spread Props
      </Grid>

      {/* ✅ OK: Grid novo (V7) - não deve dar erro */}
      <Grid size={{ xs: 12, sm: 6 }}>
        Correct V7 Grid
      </Grid>
    </div>
  );
}

// ❌ ERRO 15: Usando createMuiTheme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// ❌ ERRO 16: Usando experimentalStyled
const StyledDiv = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export default TestComponent;
