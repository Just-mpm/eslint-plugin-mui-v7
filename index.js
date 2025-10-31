/**
 * ESLint Plugin para MUI V7 - Foca em Breaking Changes
 *
 * Detecta automaticamente código que QUEBRA na migração V6 → V7
 * e fornece mensagens educativas para corrigir.
 *
 * @version 1.2.1
 * @created 2025-01-26
 * @updated 2025-10-30
 * @author Matheus (Koda AI Studio) + Claude Code
 */

// Define moved components at module scope to avoid recreation on every rule invocation
const MOVED_COMPONENTS = new Set([
  'Alert', 'AlertTitle',
  'Autocomplete',
  'AvatarGroup',
  'Pagination', 'PaginationItem',
  'Rating',
  'Skeleton',
  'SpeedDial', 'SpeedDialAction', 'SpeedDialIcon',
  'TabContext', 'TabList', 'TabPanel',
  'Timeline', 'TimelineConnector', 'TimelineContent', 'TimelineDot',
  'TimelineItem', 'TimelineOppositeContent', 'TimelineSeparator',
  'ToggleButton', 'ToggleButtonGroup',
  'TreeView', 'TreeItem',
]);

const muiV7Rules = {
  'no-unstable-grid': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Unstable_Grid2 foi promovido para Grid no MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        unstableGrid: '🚀 Unstable_Grid2 foi promovido para Grid estável no MUI V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import Grid from "@mui/material/Unstable_Grid2"\n' +
          '   import Grid2 from "@mui/material/Unstable_Grid2"\n\n' +
          '✅ Forma nova (V7):\n' +
          '   import { Grid } from "@mui/material"\n\n' +
          '💡 O Grid agora é estável e usa a prop `size`!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          if (source === '@mui/material/Unstable_Grid2') {
            context.report({
              node,
              messageId: 'unstableGrid',
              fix(fixer) {
                return fixer.replaceText(node.source, '"@mui/material"');
              },
            });
          }
        },
      };
    },
  },

  'no-grid2-import': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Grid2 foi renomeado para Grid no MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        grid2Import: '⚠️ Grid2 foi renomeado para Grid no MUI V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import Grid2 from "@mui/material/Grid2"\n' +
          '   import { grid2Classes } from "@mui/material/Grid2"\n\n' +
          '✅ Recomendado:\n' +
          '   import { Grid } from "@mui/material"\n' +
          '   import { gridClasses } from "@mui/material"\n\n' +
          '💡 O novo Grid é mais poderoso e usa a prop `size`!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          if (source === '@mui/material/Grid2') {
            context.report({
              node,
              messageId: 'grid2Import',
              fix(fixer) {
                return fixer.replaceText(node.source, '"@mui/material"');
              },
            });
          }
        },
      };
    },
  },

  'no-lab-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Componentes movidos de @mui/lab para @mui/material',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        labImport: '✨ {{ count }} componente(s) movido(s) para @mui/material no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import { {{ components }} } from "@mui/lab"\n\n' +
          '✅ Recomendado:\n' +
          '   import { {{ components }} } from "@mui/material"\n\n' +
          '📦 Todos os componentes movidos: Alert, Autocomplete, Pagination, Rating,\n' +
          '   Skeleton, SpeedDial, ToggleButton, AvatarGroup, e mais!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta imports de @mui/lab
          if (source.startsWith('@mui/lab')) {
            // Collect ALL moved components (O(n) with Set.has O(1) lookup)
            const movedComponentsList = node.specifiers
              .filter(spec => MOVED_COMPONENTS.has(spec.local.name))
              .map(spec => spec.local.name);

            if (movedComponentsList.length > 0) {
              context.report({
                node,
                messageId: 'labImport',
                data: {
                  components: movedComponentsList.join(', '),
                  count: movedComponentsList.length,
                },
                fix(fixer) {
                  return fixer.replaceText(node.source, '"@mui/material"');
                },
              });
            }
          }
        },
      };
    },
  },

  'no-grid-item-prop': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Grid não usa mais a prop `item`, agora usa `size`',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        gridItemProp: '🎯 Grid no MUI V7 não usa mais a prop `item`!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <Grid item xs={12} sm={6} md={4}>\n\n' +
          '✅ Forma nova (V7):\n' +
          '   <Grid size={{ xs: 12, sm: 6, md: 4 }}>\n\n' +
          '💡 A nova sintaxe é mais limpa e poderosa!\n' +
          '   Você pode usar: size, offset, spacing responsivo e mais.',
      },
      schema: [],
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          if (node.name.name === 'Grid') {
            const hasItemProp = node.attributes.some(
              attr => attr.type === 'JSXAttribute' && attr.name.name === 'item'
            );

            const hasBreakpointProps = node.attributes.some(
              attr => attr.type === 'JSXAttribute' &&
                ['xs', 'sm', 'md', 'lg', 'xl'].includes(attr.name.name)
            );

            if (hasItemProp || hasBreakpointProps) {
              context.report({
                node,
                messageId: 'gridItemProp',
              });
            }
          }
        },
      };
    },
  },

  'no-deprecated-props': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detecta props depreciadas no MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        onBackdropClick: '🔄 Dialog.onBackdropClick foi removido no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <Dialog onBackdropClick={handleClick}>\n\n' +
          '✅ Forma nova (V7):\n' +
          '   <Dialog onClose={(event, reason) => {\n' +
          '     if (reason === "backdropClick") {\n' +
          '       // Sua lógica aqui\n' +
          '     }\n' +
          '   }}>',

        inputLabelNormal: '📏 InputLabel.size="normal" foi renomeado!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <InputLabel size="normal">\n\n' +
          '✅ Forma nova (V7):\n' +
          '   <InputLabel size="medium">',

        hiddenComponent: '👻 Hidden component foi removido no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <Hidden xlUp><Paper /></Hidden>\n\n' +
          '✅ Opção 1 - Use sx prop:\n' +
          '   <Paper sx={{ display: { xl: "none" } }} />\n\n' +
          '✅ Opção 2 - Use useMediaQuery:\n' +
          '   const hidden = useMediaQuery(theme => theme.breakpoints.up("xl"))\n' +
          '   return hidden ? null : <Paper />',
      },
      schema: [],
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          const componentName = node.name.name;

          // Dialog.onBackdropClick
          if (componentName === 'Dialog') {
            const hasOnBackdropClick = node.attributes.some(
              attr => attr.type === 'JSXAttribute' &&
                attr.name.name === 'onBackdropClick'
            );

            if (hasOnBackdropClick) {
              context.report({
                node,
                messageId: 'onBackdropClick',
              });
            }
          }

          // InputLabel size="normal"
          if (componentName === 'InputLabel') {
            node.attributes.forEach(attr => {
              if (attr.type === 'JSXAttribute' &&
                  attr.name.name === 'size' &&
                  attr.value &&
                  attr.value.type === 'Literal' &&
                  attr.value.value === 'normal') {
                context.report({
                  node: attr,
                  messageId: 'inputLabelNormal',
                });
              }
            });
          }

          // Hidden component
          if (componentName === 'Hidden') {
            context.report({
              node,
              messageId: 'hiddenComponent',
            });
          }
        },
      };
    },
  },

  'prefer-theme-vars': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Recomenda uso de theme.vars para CSS variables',
        category: 'Best Practices',
        recommended: false,
      },
      messages: {
        useThemeVars: '💡 Quando `cssVariables: true`, use theme.vars!\n\n' +
          '⚠️ Forma que NÃO muda com dark mode:\n' +
          '   color: theme.palette.text.primary\n\n' +
          '✅ Forma que muda automaticamente:\n' +
          '   color: theme.vars.palette.text.primary\n\n' +
          '📚 Benefícios: Performance + Dark mode automático!',
      },
      schema: [],
    },
    create(context) {
      const sourceCode = context.getSourceCode();

      /**
       * Verifica se o node está dentro de um ternário que checa theme.vars
       * Exemplo: theme.vars ? `${theme.vars.palette.primary.main}` : `${theme.palette.primary.main}`
       */
      function isInsideThemeVarsConditional(node) {
        let current = node;
        let depth = 0;
        const MAX_DEPTH = 10;

        // Sobe até MAX_DEPTH níveis na árvore AST procurando por ConditionalExpression
        while (current.parent && depth < MAX_DEPTH) {
          current = current.parent;
          depth++;

          // Se encontrar um ternário (ConditionalExpression)
          if (current.type === 'ConditionalExpression') {
            const test = current.test;
            // Verifica se o teste é "theme.vars"
            if (
              test?.type === 'MemberExpression' &&
              test.object?.name === 'theme' &&
              test.property?.name === 'vars'
            ) {
              return true; // Ignora warnings quando dentro de ternário com theme.vars
            }
          }
        }

        return false;
      }

      /**
       * Cache for source text to avoid multiple getText calls for the same node
       */
      const sourceTextCache = new WeakMap();

      /**
       * Verifica se está dentro de uma função sx que usa theme.vars!
       * Exemplo: sx={(theme) => ({ background: `${theme.vars!.palette...}` })}
       */
      function isUsingNonNullAssertion(node) {
        if (!node.parent) return false;

        let sourceText = sourceTextCache.get(node.parent);
        if (sourceText === undefined) {
          sourceText = sourceCode.getText(node.parent);
          sourceTextCache.set(node.parent, sourceText);
        }

        // Procura por theme.vars! (non-null assertion)
        return sourceText.includes('theme.vars!');
      }

      return {
        MemberExpression(node) {
          // Detecta theme.palette.* (sem .vars)
          // Optimized: use optional chaining and early returns
          if (node.object?.type !== 'MemberExpression') return;
          if (node.object.object?.name !== 'theme') return;
          if (node.object.property?.name !== 'palette') return;

          // Verifica se não é theme.vars.palette
          const parent = node.object.object;
          if (parent.type !== 'Identifier' || parent.name !== 'theme') return;

          // Ignora se estiver dentro de um ternário que checa theme.vars
          if (isInsideThemeVarsConditional(node)) return;

          // Ignora se já está usando theme.vars! (non-null assertion)
          if (isUsingNonNullAssertion(node)) return;

          context.report({
            node,
            messageId: 'useThemeVars',
          });
        },
      };
    },
  },
};

// Exporta o plugin (ESM e CommonJS compatível)
const plugin = {
  rules: muiV7Rules,
  configs: {
    recommended: {
      plugins: ['mui-v7'],
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
    strict: {
      plugins: ['mui-v7'],
      rules: {
        // Breaking changes - ERRORS
        'mui-v7/no-unstable-grid': 'error',
        'mui-v7/no-grid2-import': 'error',
        'mui-v7/no-grid-item-prop': 'error',
        'mui-v7/no-lab-imports': 'error',
        'mui-v7/no-deprecated-props': 'error',
        // Best practices - ERRORS também no strict
        'mui-v7/prefer-theme-vars': 'error',
      },
    },
  },
};

export default plugin;
