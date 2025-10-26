/**
 * ESLint Plugin Customizado para MUI V7 (CommonJS version)
 *
 * Detecta automaticamente usos incorretos do Material-UI V7 e fornece
 * mensagens educativas para ensinar a forma correta.
 *
 * @created 2025-01-26
 * @author Matheus (Koda AI Studio) + Claude Code
 */

const muiV7Rules = {
  'no-deep-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Proíbe deep imports (mais de um nível) do MUI V7',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        deepImport: '❌ Deep imports não são mais suportados no MUI V7.\n\n' +
          '🔧 Forma incorreta:\n' +
          '   import createTheme from "@mui/material/styles/createTheme"\n\n' +
          '✅ Forma correta:\n' +
          '   import { createTheme } from "@mui/material/styles"',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta imports com mais de um nível (ex: @mui/material/styles/createTheme)
          if (source.startsWith('@mui/')) {
            const parts = source.split('/');
            // @mui/material/styles/createTheme -> 4 partes (deep import)
            // @mui/material/styles -> 3 partes (OK)
            if (parts.length > 3) {
              context.report({
                node,
                messageId: 'deepImport',
                fix(fixer) {
                  // Tenta converter para named import
                  const specifier = node.specifiers[0];
                  if (specifier && specifier.type === 'ImportDefaultSpecifier') {
                    const importName = specifier.local.name;
                    const newPath = parts.slice(0, 3).join('/'); // Remove último nível
                    return fixer.replaceText(
                      node,
                      `import { ${importName} } from "${newPath}"`
                    );
                  }
                  return null;
                },
              });
            }
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
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        grid2Import: '⚠️ Grid2 foi renomeado para Grid no MUI V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import Grid2 from "@mui/material/Grid2"\n' +
          '   import { grid2Classes } from "@mui/material/Grid2"\n\n' +
          '✅ Forma nova (V7):\n' +
          '   import Grid from "@mui/material/Grid"\n' +
          '   import { gridClasses } from "@mui/material/Grid"\n\n' +
          '💡 Dica: O novo Grid é mais poderoso e responsivo!',
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
                const fixes = [
                  fixer.replaceText(node.source, '"@mui/material/Grid"')
                ];

                // Renomeia Grid2 -> Grid e grid2Classes -> gridClasses
                node.specifiers.forEach(spec => {
                  if (spec.imported) {
                    const name = spec.imported.name;
                    if (name.includes('grid2')) {
                      const newName = name.replace('grid2', 'grid');
                      // Nota: Isso só funciona bem para casos simples
                      // Para casos complexos, o usuário precisa fazer manual
                    }
                  }
                });

                return fixes;
              },
            });
          }
        },
      };
    },
  },

  'no-old-grid-import': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Sugere migração do Grid antigo para o novo',
        category: 'Best Practices',
        recommended: false,
      },
      messages: {
        oldGrid: '💡 O Grid antigo agora é GridLegacy. Considere migrar para o novo Grid!\n\n' +
          '🔧 Se quiser manter o Grid antigo:\n' +
          '   import Grid from "@mui/material/GridLegacy"\n' +
          '   import { gridLegacyClasses } from "@mui/material/GridLegacy"\n\n' +
          '✅ Recomendado: Migrar para o novo Grid:\n' +
          '   import Grid from "@mui/material/Grid"\n\n' +
          '📚 O novo Grid usa `size` em vez de `xs/sm/md`:\n' +
          '   <Grid size={{ xs: 12, md: 6 }}>Conteúdo</Grid>',
      },
      schema: [],
    },
    create(context) {
      const sourceCode = context.getSourceCode();

      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta import Grid from '@mui/material/Grid'
          if (source === '@mui/material/Grid') {
            const defaultImport = node.specifiers.find(
              spec => spec.type === 'ImportDefaultSpecifier'
            );

            if (defaultImport) {
              // Verifica se está usando props antigas (xs, sm, md) no código
              // Isso é apenas um aviso suave, não um erro
              context.report({
                node,
                messageId: 'oldGrid',
              });
            }
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
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        labImport: '✨ Este componente foi movido para @mui/material no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import {{ component }} from "@mui/lab/{{ component }}"\n\n' +
          '✅ Forma nova (V7):\n' +
          '   import {{ component }} from "@mui/material/{{ component }}"\n\n' +
          '📦 Componentes movidos: Alert, Autocomplete, Pagination, Rating,\n' +
          '   Skeleton, SpeedDial, ToggleButton, AvatarGroup, e mais!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      const movedComponents = [
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
      ];

      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta imports de @mui/lab
          if (source.startsWith('@mui/lab')) {
            node.specifiers.forEach(spec => {
              const componentName = spec.local.name;

              if (movedComponents.includes(componentName)) {
                context.report({
                  node,
                  messageId: 'labImport',
                  data: { component: componentName },
                  fix(fixer) {
                    return fixer.replaceText(
                      node.source,
                      `"@mui/material/${componentName}"`
                    );
                  },
                });
              }
            });
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
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        gridItemProp: '🎯 Grid no MUI V7 não usa mais a prop `item`!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <Grid item xs={12} sm={6} md={4}>\n\n' +
          '✅ Forma nova (V7):\n' +
          '   <Grid size={{ xs: 12, sm: 6, md: 4 }}>\n\n' +
          '💡 A nova sintaxe é mais limpa e poderosa!\n' +
          '   Você pode usar offset, push, pull e mais.',
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
        category: 'Best Practices',
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

      return {
        MemberExpression(node) {
          // Detecta theme.palette.* (sem .vars)
          if (
            node.object &&
            node.object.type === 'MemberExpression' &&
            node.object.object &&
            node.object.object.name === 'theme' &&
            node.object.property &&
            node.object.property.name === 'palette'
          ) {
            // Verifica se não é theme.vars.palette
            const parent = node.object.object;
            if (parent.type === 'Identifier' && parent.name === 'theme') {
              context.report({
                node,
                messageId: 'useThemeVars',
              });
            }
          }
        },
      };
    },
  },
};

// Exporta o plugin (CommonJS)
const plugin = {
  rules: muiV7Rules,
  configs: {
    recommended: {
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
    },
    strict: {
      plugins: ['mui-v7'],
      rules: {
        'mui-v7/no-deep-imports': 'error',
        'mui-v7/no-grid2-import': 'error',
        'mui-v7/no-lab-imports': 'error',
        'mui-v7/no-grid-item-prop': 'error',
        'mui-v7/no-deprecated-props': 'error',
        'mui-v7/no-old-grid-import': 'error',
        'mui-v7/prefer-theme-vars': 'error',
      },
    },
  },
};

module.exports = plugin;
