/**
 * Edge Cases Test Suite
 * Testa cenários complexos que podem ocorrer em produção
 */

const { RuleTester } = require('eslint');
const plugin = require('../index.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

console.log('🧪 Testing Edge Cases...\n');

// =============================================================================
// Test 1: Grid com spread props
// =============================================================================
console.log('Testing Grid with spread props...');
try {
  ruleTester.run('no-grid-item-prop-spread', plugin.rules['no-grid-item-prop'], {
    valid: [],
    invalid: [
      {
        code: '<Grid {...props} item xs={12}>Content</Grid>',
        errors: [{ messageId: 'gridItemProp' }],
        // Não deve ter autofix (muito arriscado)
      },
    ],
  });
  console.log('✅ Grid with spread props - PASSED');
} catch (error) {
  console.log('❌ Grid with spread props - FAILED:', error.message);
}

// =============================================================================
// Test 2: Grid com props dinâmicas
// =============================================================================
console.log('\nTesting Grid with dynamic props...');
try {
  ruleTester.run('no-grid-item-prop-dynamic', plugin.rules['no-grid-item-prop'], {
    valid: [],
    invalid: [
      {
        code: '<Grid item xs={colSize}>Content</Grid>',
        errors: [{ messageId: 'gridItemProp' }],
        // Autofix não deve funcionar (não é literal)
      },
    ],
  });
  console.log('✅ Grid with dynamic props - PASSED');
} catch (error) {
  console.log('❌ Grid with dynamic props - FAILED:', error.message);
}

// =============================================================================
// Test 3: Grid com expressões complexas
// =============================================================================
console.log('\nTesting Grid with complex expressions...');
try {
  ruleTester.run('no-grid-item-prop-complex', plugin.rules['no-grid-item-prop'], {
    valid: [],
    invalid: [
      {
        code: '<Grid item xs={isMobile ? 12 : 6}>Content</Grid>',
        errors: [{ messageId: 'gridItemProp' }],
        // Autofix não deve funcionar
      },
    ],
  });
  console.log('✅ Grid with complex expressions - PASSED');
} catch (error) {
  console.log('❌ Grid with complex expressions - FAILED:', error.message);
}

// =============================================================================
// Test 4: Grid com boolean props
// =============================================================================
console.log('\nTesting Grid with boolean item prop...');
try {
  ruleTester.run('no-grid-item-prop-boolean', plugin.rules['no-grid-item-prop'], {
    valid: [],
    invalid: [
      {
        code: '<Grid item>Content</Grid>',
        errors: [{ messageId: 'gridItemProp' }],
        output: '<Grid>Content</Grid>',
      },
    ],
  });
  console.log('✅ Grid with boolean item prop - PASSED');
} catch (error) {
  console.log('❌ Grid with boolean item prop - FAILED:', error.message);
}

// =============================================================================
// Test 5: Múltiplas regras no mesmo componente
// =============================================================================
console.log('\nTesting multiple deprecated props on TextField...');
try {
  ruleTester.run('prefer-slots-api-multiple', plugin.rules['prefer-slots-api'], {
    valid: [],
    invalid: [
      {
        code: '<TextField label="Test" components={obj} componentsProps={props} variant="outlined" />',
        errors: [{ messageId: 'useSlots' }],
        output: '<TextField label="Test" slots={obj} slotProps={props} variant="outlined" />',
      },
    ],
  });
  console.log('✅ Multiple deprecated props - PASSED');
} catch (error) {
  console.log('❌ Multiple deprecated props - FAILED:', error.message);
}

// =============================================================================
// Test 6: Grid com props em ordem aleatória
// =============================================================================
console.log('\nTesting Grid with random prop order...');
try {
  ruleTester.run('no-grid-item-prop-order', plugin.rules['no-grid-item-prop'], {
    valid: [],
    invalid: [
      {
        code: '<Grid md={4} item sm={6} xs={12}>Content</Grid>',
        errors: [{ messageId: 'gridItemProp' }],
        output: '<Grid size={{ md: 4, sm: 6, xs: 12 }}>Content</Grid>',
      },
    ],
  });
  console.log('✅ Grid with random prop order - PASSED');
} catch (error) {
  console.log('❌ Grid with random prop order - FAILED:', error.message);
}

// =============================================================================
// Test 7: Nested Grid components
// =============================================================================
console.log('\nTesting nested Grid components...');
try {
  ruleTester.run('no-grid-item-prop-nested', plugin.rules['no-grid-item-prop'], {
    valid: [
      {
        code: `
          <Grid container>
            <Grid size={12}>
              <Grid container>
                <Grid size={6}>Nested</Grid>
              </Grid>
            </Grid>
          </Grid>
        `,
      },
    ],
    invalid: [],
  });
  console.log('✅ Nested Grid components - PASSED');
} catch (error) {
  console.log('❌ Nested Grid components - FAILED:', error.message);
}

// =============================================================================
// Test 8: Deep imports com diferentes pacotes
// =============================================================================
console.log('\nTesting deep imports from different packages...');
try {
  ruleTester.run('no-deep-imports-packages', plugin.rules['no-deep-imports'], {
    valid: [
      { code: 'import { Button } from "@mui/material"' },
      { code: 'import { styled } from "@mui/system"' },
    ],
    invalid: [
      {
        code: 'import { createTheme } from "@mui/material/styles/createTheme"',
        errors: [{ messageId: 'deepImport' }],
        output: 'import { createTheme } from "@mui/material"',
      },
    ],
  });
  console.log('✅ Deep imports from different packages - PASSED');
} catch (error) {
  console.log('❌ Deep imports from different packages - FAILED:', error.message);
}

// =============================================================================
// Test 9: Props com valores string vs number
// =============================================================================
console.log('\nTesting Grid with string and number values...');
try {
  ruleTester.run('no-grid-item-prop-types', plugin.rules['no-grid-item-prop'], {
    valid: [],
    invalid: [
      {
        code: '<Grid item xs="12" sm={6}>Content</Grid>',
        errors: [{ messageId: 'gridItemProp' }],
        output: '<Grid size={{ xs: "12", sm: 6 }}>Content</Grid>',
      },
    ],
  });
  console.log('✅ Grid with mixed value types - PASSED');
} catch (error) {
  console.log('❌ Grid with mixed value types - FAILED:', error.message);
}

// =============================================================================
// Test 10: Components com line breaks
// =============================================================================
console.log('\nTesting components with line breaks...');
try {
  ruleTester.run('prefer-slots-api-multiline', plugin.rules['prefer-slots-api'], {
    valid: [],
    invalid: [
      {
        code: `<TextField
          label="Test"
          components={obj}
          componentsProps={props}
        />`,
        errors: [{ messageId: 'useSlots' }],
        output: `<TextField
          label="Test"
          slots={obj}
          slotProps={props}
        />`,
      },
    ],
  });
  console.log('✅ Components with line breaks - PASSED');
} catch (error) {
  console.log('❌ Components with line breaks - FAILED:', error.message);
}

console.log('\n📊 Edge Cases Testing Complete!');
