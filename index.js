/**
 * ESLint Plugin para MUI V7 - Foca em Breaking Changes
 *
 * Detecta automaticamente código que QUEBRA na migração V6 → V7
 * e fornece mensagens educativas para corrigir.
 *
 * @version 1.5.0
 * @created 2025-01-26
 * @updated 2025-11-14
 * @author Matheus (Koda AI Studio) + Claude Code
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

// Define moved components at module scope to avoid recreation on every rule invocation
// ⚠️ LISTA OFICIAL do codemod MUI v7.0.0/lab-removed-components
// Fonte: https://github.com/mui/material-ui/blob/master/packages/mui-codemod/README.md
const MOVED_COMPONENTS = new Set([
  'Alert', 'AlertTitle',
  'Autocomplete',
  'AvatarGroup',
  'Pagination', 'PaginationItem',
  'Rating',
  'Skeleton',
  'SpeedDial', 'SpeedDialAction', 'SpeedDialIcon',
  'ToggleButton', 'ToggleButtonGroup',
  // ❌ NÃO INCLUÍDOS (ainda em @mui/lab ou movidos para MUI X):
  // - TabContext, TabList, TabPanel → Ainda em @mui/lab
  // - Timeline* (7 componentes) → Ainda em @mui/lab
  // - TreeView, TreeItem → Movidos para @mui/x-tree-view
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
                const fixes = [fixer.replaceText(node.source, '"@mui/material"')];

                // Renomeia Grid2 → Grid e grid2Classes → gridClasses
                node.specifiers.forEach(spec => {
                  if (spec.type === 'ImportDefaultSpecifier') {
                    // import Grid2 from '@mui/material/Grid2' → import { Grid } from '@mui/material'
                    const localName = spec.local.name;
                    if (localName === 'Grid2') {
                      fixes.push(fixer.replaceText(spec, '{ Grid }'));
                    } else {
                      // Mantém o alias: import MyGrid from ... → import { Grid as MyGrid } from ...
                      fixes.push(fixer.replaceText(spec, `{ Grid as ${localName} }`));
                    }
                  } else if (spec.type === 'ImportSpecifier') {
                    const importedName = spec.imported.name;
                    if (importedName === 'grid2Classes') {
                      fixes.push(fixer.replaceText(spec.imported, 'gridClasses'));
                    } else if (importedName === 'Grid2') {
                      fixes.push(fixer.replaceText(spec.imported, 'Grid'));
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
          '   <Grid item xs={12} sm={6}>\n\n' +
          '✅ Forma nova (V7):\n' +
          '   <Grid size={12}> ou <Grid size={{ "{"}xs: 12, sm: 6{"}"}  }}>\n\n' +
          '💡 A nova sintaxe é mais limpa e poderosa!\n' +
          '   Você pode usar: size, offset, spacing responsivo e mais.',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      const sourceCode = context.getSourceCode();

      return {
        JSXOpeningElement(node) {
          if (node.name?.name === 'Grid') {
            // Verifica se é um Grid container (não deve reportar erro)
            const hasContainerProp = node.attributes.some(
              attr => attr.type === 'JSXAttribute' && attr.name?.name === 'container'
            );

            // Grid container pode ter breakpoint props (xs, sm, etc) sem problema
            if (hasContainerProp) return;

            const itemProp = node.attributes.find(
              attr => attr.type === 'JSXAttribute' && attr.name?.name === 'item'
            );

            const breakpointProps = node.attributes.filter(
              attr => attr.type === 'JSXAttribute' &&
                ['xs', 'sm', 'md', 'lg', 'xl'].includes(attr.name?.name)
            );

            if (itemProp || breakpointProps.length > 0) {
              context.report({
                node,
                messageId: 'gridItemProp',
                fix(fixer) {
                  // 🔒 SAFETY CHECK: Não faz autofix se houver spread props
                  // Spread props podem conter item/xs/sm/etc e sobrescrever nosso fix
                  const hasSpreadProps = node.attributes.some(
                    attr => attr.type === 'JSXSpreadAttribute'
                  );

                  if (hasSpreadProps) {
                    // Apenas reporta o problema, sem autofix (muito arriscado)
                    return null;
                  }

                  const fixes = [];
                  const propsToRemove = [];

                  // Adiciona prop item para remoção
                  if (itemProp) {
                    propsToRemove.push(itemProp);
                  }

                  // Só faz autofix de breakpoints se forem valores literais simples
                  if (breakpointProps.length > 0) {
                    // Verifica se todos os valores são literais simples
                    const allSimpleLiterals = breakpointProps.every(prop => {
                      if (!prop.value) return false;
                      // Literal direto: xs="12" ou xs={12}
                      if (prop.value.type === 'Literal') return true;
                      // JSXExpressionContainer com Literal: xs={12}
                      if (prop.value.type === 'JSXExpressionContainer' &&
                          prop.value.expression?.type === 'Literal') return true;
                      return false;
                    });

                    if (allSimpleLiterals) {
                      // Extrai valores
                      const breakpointValues = breakpointProps.map(prop => {
                        const name = prop.name.name;
                        let value;

                        if (prop.value.type === 'Literal') {
                          value = prop.value.value;
                        } else if (prop.value.type === 'JSXExpressionContainer') {
                          value = prop.value.expression.value;
                        }

                        return { name, value };
                      });

                      // Adiciona props de breakpoint para remoção
                      propsToRemove.push(...breakpointProps);

                      // Remove todas as props (incluindo espaços)
                      propsToRemove.forEach((prop, index) => {
                        const sourceCodeText = sourceCode.getText();
                        let start = prop.range[0];
                        let end = prop.range[1];

                        // Remove espaço antes da prop
                        while (start > 0 && /\s/.test(sourceCodeText[start - 1])) {
                          start--;
                        }

                        fixes.push(fixer.removeRange([start, end]));
                      });

                      // Cria a nova prop size
                      let sizeValue;
                      if (breakpointValues.length === 1) {
                        // Caso simples: size={12}
                        const { value } = breakpointValues[0];
                        sizeValue = `size={${JSON.stringify(value)}}`;
                      } else {
                        // Múltiplos breakpoints: size={{ xs: 12, sm: 6 }}
                        const objPairs = breakpointValues
                          .map(({ name, value }) => `${name}: ${JSON.stringify(value)}`)
                          .join(', ');
                        sizeValue = `size={{ ${objPairs} }}`;
                      }

                      // Insere a prop size após a tag de abertura
                      const insertPosition = node.name.range[1];
                      fixes.push(fixer.insertTextAfterRange([insertPosition, insertPosition], ` ${sizeValue}`));
                    }
                  } else if (itemProp) {
                    // Apenas remove a prop item (sem adicionar size)
                    const sourceCodeText = sourceCode.getText();
                    let start = itemProp.range[0];
                    let end = itemProp.range[1];

                    // Remove espaço antes da prop
                    while (start > 0 && /\s/.test(sourceCodeText[start - 1])) {
                      start--;
                    }

                    fixes.push(fixer.removeRange([start, end]));
                  }

                  return fixes.length > 0 ? fixes : null;
                },
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
        description: 'Detecta props e componentes depreciados no MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        onBackdropClick: '🔄 {{ component }}.onBackdropClick foi removido no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <{{ component }} onBackdropClick={handleClick}>\n\n' +
          '✅ Forma nova (V7):\n' +
          '   <{{ component }} onClose={(event, reason) => {\n' +
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

        pigmentHiddenComponent: '👻 PigmentHidden component foi removido no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   <PigmentHidden xlUp><Paper /></PigmentHidden>\n\n' +
          '✅ Opção 1 - Use sx prop:\n' +
          '   <Paper sx={{ display: { xl: "none" } }} />\n\n' +
          '✅ Opção 2 - Use useMediaQuery:\n' +
          '   const hidden = useMediaQuery(theme => theme.breakpoints.up("xl"))\n' +
          '   return hidden ? null : <Paper />',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          const componentName = node.name?.name;
          if (!componentName) return;

          // Dialog.onBackdropClick e Modal.onBackdropClick
          if (componentName === 'Dialog' || componentName === 'Modal') {
            const hasOnBackdropClick = node.attributes.some(
              attr => attr.type === 'JSXAttribute' &&
                attr.name?.name === 'onBackdropClick'
            );

            if (hasOnBackdropClick) {
              context.report({
                node,
                messageId: 'onBackdropClick',
                data: { component: componentName },
              });
            }
          }

          // InputLabel size="normal"
          if (componentName === 'InputLabel') {
            node.attributes.forEach(attr => {
              if (attr.type === 'JSXAttribute' &&
                  attr.name?.name === 'size' &&
                  attr.value &&
                  attr.value.type === 'Literal' &&
                  attr.value.value === 'normal') {
                context.report({
                  node: attr,
                  messageId: 'inputLabelNormal',
                  fix(fixer) {
                    return fixer.replaceText(attr.value, '"medium"');
                  },
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

          // PigmentHidden component
          if (componentName === 'PigmentHidden') {
            context.report({
              node,
              messageId: 'pigmentHiddenComponent',
            });
          }
        },
      };
    },
  },

  'no-deprecated-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detecta imports depreciados no MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        createMuiTheme: '🎨 createMuiTheme foi removido no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import { createMuiTheme } from "@mui/material/styles"\n\n' +
          '✅ Forma nova (V7):\n' +
          '   import { createTheme } from "@mui/material/styles"\n\n' +
          '💡 A funcionalidade é idêntica, apenas o nome mudou!',

        experimentalStyled: '🎨 experimentalStyled foi removido no V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import { experimentalStyled } from "@mui/material/styles"\n\n' +
          '✅ Forma nova (V7):\n' +
          '   import { styled } from "@mui/material/styles"\n\n' +
          '💡 O styled agora é estável e totalmente suportado!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta imports de @mui/material/styles
          if (source === '@mui/material/styles' || source === '@mui/material') {
            node.specifiers.forEach(spec => {
              if (spec.type === 'ImportSpecifier') {
                const importedName = spec.imported.name;

                // createMuiTheme → createTheme
                if (importedName === 'createMuiTheme') {
                  context.report({
                    node: spec,
                    messageId: 'createMuiTheme',
                    fix(fixer) {
                      return fixer.replaceText(spec.imported, 'createTheme');
                    },
                  });
                }

                // experimentalStyled → styled
                if (importedName === 'experimentalStyled') {
                  context.report({
                    node: spec,
                    messageId: 'experimentalStyled',
                    fix(fixer) {
                      return fixer.replaceText(spec.imported, 'styled');
                    },
                  });
                }
              }
            });
          }
        },
      };
    },
  },

  'no-deep-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Deep imports quebram no MUI V7 devido ao novo exports field',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        deepImport: '📦 Deep imports não funcionam mais no MUI V7!\n\n' +
          '🔧 Forma antiga (V6):\n' +
          '   import {{ importName }} from "{{ source }}"\n\n' +
          '✅ Forma nova (V7):\n' +
          '   import { {{ importName }} } from "{{ suggestedSource }}"\n\n' +
          '💡 O MUI V7 usa exports field no package.json, que bloqueia deep imports.',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta deep imports do MUI (mais de um nível de profundidade)
          // Exemplo: @mui/material/styles/createTheme
          const muiDeepImportRegex = /^@mui\/(material|system|joy)\/([^/]+)\/(.+)$/;
          const match = source.match(muiDeepImportRegex);

          if (match) {
            const [, package_, componentDir, deepPath] = match;
            const suggestedSource = `@mui/${package_}`;

            // Infere o nome do componente a partir do diretório (ex: Button de /Button/...)
            const importName = componentDir;
            const localName = node.specifiers[0]?.local?.name || importName;

            context.report({
              node,
              messageId: 'deepImport',
              data: {
                source,
                suggestedSource,
                importName,
              },
              fix(fixer) {
                const fixes = [fixer.replaceText(node.source, `"${suggestedSource}"`)];

                // Converte default import para named import
                if (node.specifiers[0]?.type === 'ImportDefaultSpecifier') {
                  // Se o nome local é igual ao nome importado, usa sintaxe simples
                  if (importName === localName) {
                    fixes.push(fixer.replaceText(node.specifiers[0], `{ ${importName} }`));
                  } else {
                    fixes.push(fixer.replaceText(node.specifiers[0], `{ ${importName} as ${localName} }`));
                  }
                }

                return fixes;
              },
            });
          }
        },
      };
    },
  },

  'prefer-slots-api': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Recomenda usar slots/slotProps ao invés de components/componentsProps',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        useSlots: '🔧 A API components/componentsProps foi depreciada!\n\n' +
          '⚠️ Forma antiga (depreciada):\n' +
          '   <TextField components={{"{"}...{"}"}  componentsProps={{"{"}...{"}"} } />\n\n' +
          '✅ Forma nova (recomendada):\n' +
          '   <TextField slots={{"{"}...{"}"}  slotProps={{"{"}...{"}"} } />\n\n' +
          '💡 A nova API é mais consistente e flexível!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          const deprecatedProps = node.attributes.filter(
            attr => attr.type === 'JSXAttribute' &&
              (attr.name?.name === 'components' || attr.name?.name === 'componentsProps')
          );

          if (deprecatedProps.length > 0) {
            context.report({
              node,
              messageId: 'useSlots',
              fix(fixer) {
                // Renomeia cada prop depreciada
                return deprecatedProps.map(attr => {
                  if (attr.name.name === 'components') {
                    return fixer.replaceText(attr.name, 'slots');
                  } else if (attr.name.name === 'componentsProps') {
                    return fixer.replaceText(attr.name, 'slotProps');
                  }
                }).filter(Boolean);
              },
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
      fixable: 'code',
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
            fix(fixer) {
              // Transforma: theme.palette.* → theme.vars.palette.*
              // node.object.object é 'theme'
              // node.object.property é 'palette'
              const themeNode = node.object.object;

              // Insere '.vars' após 'theme'
              const insertPosition = themeNode.range[1];
              return fixer.insertTextAfterRange(
                [insertPosition, insertPosition],
                '.vars'
              );
            },
          });
        },
      };
    },
  },

  'no-grid-legacy': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Grid antigo foi renomeado para GridLegacy no MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        gridLegacyImport: '⚠️ O Grid antigo foi depreciado e renomeado para GridLegacy!\n\n' +
          '🔧 Você está usando:\n' +
          '   import Grid from "@mui/material/Grid"\n\n' +
          '✅ Opção 1 - Continuar usando Grid antigo (temporário):\n' +
          '   import { GridLegacy as Grid } from "@mui/material"\n\n' +
          '✅ Opção 2 - Migrar para o novo Grid (recomendado):\n' +
          '   import { Grid } from "@mui/material"\n' +
          '   // Use size={{ "{"}xs: 12{"}"} }} ao invés de item xs={12}\n\n' +
          '💡 O novo Grid é mais poderoso e usa a prop `size`!\n' +
          '   Veja: https://mui.com/material-ui/migration/upgrade-to-grid-v2/',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detecta import direto do Grid antigo: import Grid from '@mui/material/Grid'
          if (source === '@mui/material/Grid') {
            context.report({
              node,
              messageId: 'gridLegacyImport',
              fix(fixer) {
                // Sugestão de fix: trocar para GridLegacy
                const fixes = [fixer.replaceText(node.source, '"@mui/material"')];

                // Renomeia import default para GridLegacy as Grid
                if (node.specifiers.length > 0 && node.specifiers[0].type === 'ImportDefaultSpecifier') {
                  const localName = node.specifiers[0].local.name;
                  if (localName === 'Grid') {
                    fixes.push(fixer.replaceText(node.specifiers[0], '{ GridLegacy as Grid }'));
                  } else {
                    // Mantém o alias customizado
                    fixes.push(fixer.replaceText(node.specifiers[0], `{ GridLegacy as ${localName} }`));
                  }
                }

                return fixes;
              },
            });
          }
        },
      };
    },
  },
};

// Exporta o plugin (ESM e CommonJS compatível)
const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
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
        'mui-v7/no-deprecated-imports': 'error',
        'mui-v7/no-deep-imports': 'error',
        'mui-v7/no-grid-legacy': 'error',
        // Best practices - WARNINGS (sugestões)
        'mui-v7/prefer-slots-api': 'warn',
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
        'mui-v7/no-deprecated-imports': 'error',
        'mui-v7/no-deep-imports': 'error',
        'mui-v7/no-grid-legacy': 'error',
        // Best practices - ERRORS também no strict
        'mui-v7/prefer-slots-api': 'error',
        'mui-v7/prefer-theme-vars': 'error',
      },
    },
  },
};

export default plugin;
