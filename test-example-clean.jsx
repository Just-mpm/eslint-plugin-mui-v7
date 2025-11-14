// ❌ Arquivo de teste limpo com código MUI V6 para testar o plugin
import React from 'react';

// ❌ ERRO: Grid2 import
import { Grid } from "@mui/material";

// ❌ ERRO: Componentes do @mui/lab
import { Alert, Rating } from "@mui/material";

// ❌ ERRO: Deprecated imports
import { createTheme } from '@mui/material/styles';

// ❌ ERRO: Deep import
import { Button } from "@mui/material";

function TestComponent() {
  const theme = createMuiTheme({
    palette: {
      primary: { main: '#1976d2' },
    },
  });

  return (
    <div>
      {/* ❌ ERRO: Grid2 com item props */}
      <Grid2 item xs={12} sm={6}>
        Item with old Grid2
      </Grid2>

      {/* ❌ ERRO: TextField com components/componentsProps */}
      <TextField
        label="Test"
        slots={{ Input: CustomInput }}
        slotProps={{ input: { className: 'custom' } }}
      />

      {/* ❌ ERRO: InputLabel size="normal" */}
      <InputLabel size="medium">Old Label</InputLabel>

      {/* ✅ OK: Alert do @mui/material (será movido) */}
      <Alert severity="info">Alert from lab</Alert>

      {/* ✅ OK: Button (deep import será corrigido) */}
      <Button>Click me</Button>
    </div>
  );
}

export default TestComponent;
