/**
 * ESLint Plugin for MUI V7 - Focuses on Breaking Changes
 *
 * Automatically detects code that BREAKS when migrating from V6 → V7
 * and provides educational messages to fix it.
 *
 * @version 1.6.3
 * @created 2025-01-26
 * @updated 2025-11-14
 * @author Matheus (Koda AI Studio) + Claude Code
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

// Define moved components at module scope to avoid recreation on every rule invocation
// ⚠️ OFFICIAL LIST from MUI v7.0.0/lab-removed-components codemod
// Source: https://github.com/mui/material-ui/blob/master/packages/mui-codemod/README.md
const MOVED_COMPONENTS = new Set([
  'Alert', 'AlertTitle',
  'Autocomplete',
  'AvatarGroup',
  'Pagination', 'PaginationItem',
  'Rating',
  'Skeleton',
  'SpeedDial', 'SpeedDialAction', 'SpeedDialIcon',
  'ToggleButton', 'ToggleButtonGroup',
  // ❌ NOT INCLUDED (still in @mui/lab or moved to MUI X):
  // - TabContext, TabList, TabPanel → Still in @mui/lab
  // - Timeline* (7 components) → Still in @mui/lab
  // - TreeView, TreeItem → Moved to @mui/x-tree-view
]);

const muiV7Rules = {
  'no-grid2-import': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Grid2 was renamed to Grid in MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        grid2Import: '⚠️ Grid2 was renamed to Grid in MUI V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   import Grid2 from "@mui/material/Grid2"\n' +
          '   import { grid2Classes } from "@mui/material/Grid2"\n\n' +
          '✅ Recommended:\n' +
          '   import { Grid } from "@mui/material"\n' +
          '   import { gridClasses } from "@mui/material"\n\n' +
          '💡 The new Grid is more powerful and uses the `size` prop!',
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

                // Rename Grid2 → Grid and grid2Classes → gridClasses
                node.specifiers.forEach(spec => {
                  if (spec.type === 'ImportDefaultSpecifier') {
                    // import Grid2 from '@mui/material/Grid2' → import { Grid } from '@mui/material'
                    const localName = spec.local.name;
                    if (localName === 'Grid2') {
                      fixes.push(fixer.replaceText(spec, '{ Grid }'));
                    } else {
                      // Keep the alias: import MyGrid from ... → import { Grid as MyGrid } from ...
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
        description: 'Components moved from @mui/lab to @mui/material',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        labImport: '✨ {{ count }} component(s) moved to @mui/material in V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   import { {{ components }} } from "@mui/lab"\n\n' +
          '✅ Recommended:\n' +
          '   import { {{ components }} } from "@mui/material"\n\n' +
          '📦 All moved components: Alert, Autocomplete, Pagination, Rating,\n' +
          '   Skeleton, SpeedDial, ToggleButton, AvatarGroup, and more!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detect imports from @mui/lab
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
        description: 'Grid no longer uses the `item` prop, now uses `size`',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        gridItemProp: '🎯 Grid in MUI V7 no longer uses the `item` prop!\n\n' +
          '🔧 Old way (V6):\n' +
          '   <Grid item xs={12} sm={6}>\n\n' +
          '✅ New way (V7):\n' +
          '   <Grid size={12}> or <Grid size={{ "{"}xs: 12, sm: 6{"}"}  }}>\n\n' +
          '💡 The new syntax is cleaner and more powerful!\n' +
          '   You can use: size, offset, responsive spacing, and more.',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      const sourceCode = context.getSourceCode();

      return {
        JSXOpeningElement(node) {
          if (node.name?.name === 'Grid') {
            // Check if it's a Grid container (should not report error)
            const hasContainerProp = node.attributes.some(
              attr => attr.type === 'JSXAttribute' && attr.name?.name === 'container'
            );

            // Grid container can have breakpoint props (xs, sm, etc) without issue
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
                  // 🔒 SAFETY CHECK: Don't autofix if there are spread props
                  // Spread props may contain item/xs/sm/etc and override our fix
                  const hasSpreadProps = node.attributes.some(
                    attr => attr.type === 'JSXSpreadAttribute'
                  );

                  if (hasSpreadProps) {
                    // Only report the problem, no autofix (too risky)
                    return null;
                  }

                  const fixes = [];
                  const propsToRemove = [];

                  // Add item prop for removal
                  if (itemProp) {
                    propsToRemove.push(itemProp);
                  }

                  // Only autofix breakpoints if they are simple literal values
                  if (breakpointProps.length > 0) {
                    // Check if all values are simple literals
                    const allSimpleLiterals = breakpointProps.every(prop => {
                      if (!prop.value) return false;
                      // Direct literal: xs="12" or xs={12}
                      if (prop.value.type === 'Literal') return true;
                      // JSXExpressionContainer with Literal: xs={12}
                      if (prop.value.type === 'JSXExpressionContainer' &&
                          prop.value.expression?.type === 'Literal') return true;
                      return false;
                    });

                    if (allSimpleLiterals) {
                      // Extract values
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

                      // Add breakpoint props for removal
                      propsToRemove.push(...breakpointProps);

                      // Remove all props (including spaces)
                      propsToRemove.forEach((prop, index) => {
                        const sourceCodeText = sourceCode.getText();
                        let start = prop.range[0];
                        let end = prop.range[1];

                        // Remove space before the prop
                        while (start > 0 && /\s/.test(sourceCodeText[start - 1])) {
                          start--;
                        }

                        fixes.push(fixer.removeRange([start, end]));
                      });

                      // Create the new size prop
                      let sizeValue;
                      if (breakpointValues.length === 1) {
                        // Simple case: size={12}
                        const { value } = breakpointValues[0];
                        sizeValue = `size={${JSON.stringify(value)}}`;
                      } else {
                        // Multiple breakpoints: size={{ xs: 12, sm: 6 }}
                        const objPairs = breakpointValues
                          .map(({ name, value }) => `${name}: ${JSON.stringify(value)}`)
                          .join(', ');
                        sizeValue = `size={{ ${objPairs} }}`;
                      }

                      // Insert the size prop after the opening tag
                      const insertPosition = node.name.range[1];
                      fixes.push(fixer.insertTextAfterRange([insertPosition, insertPosition], ` ${sizeValue}`));
                    }
                  } else if (itemProp) {
                    // Only remove the item prop (without adding size)
                    const sourceCodeText = sourceCode.getText();
                    let start = itemProp.range[0];
                    let end = itemProp.range[1];

                    // Remove space before the prop
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
        description: 'Detects deprecated props and components in MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        onBackdropClick: '🔄 {{ component }}.onBackdropClick was removed in V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   <{{ component }} onBackdropClick={handleClick}>\n\n' +
          '✅ New way (V7):\n' +
          '   <{{ component }} onClose={(event, reason) => {\n' +
          '     if (reason === "backdropClick") {\n' +
          '       // Your logic here\n' +
          '     }\n' +
          '   }}>',

        inputLabelNormal: '📏 InputLabel.size="normal" was renamed!\n\n' +
          '🔧 Old way (V6):\n' +
          '   <InputLabel size="normal">\n\n' +
          '✅ New way (V7):\n' +
          '   <InputLabel size="medium">',

        hiddenComponent: '👻 Hidden component was removed in V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   <Hidden xlUp><Paper /></Hidden>\n\n' +
          '✅ Option 1 - Use sx prop:\n' +
          '   <Paper sx={{ display: { xl: "none" } }} />\n\n' +
          '✅ Option 2 - Use useMediaQuery:\n' +
          '   const hidden = useMediaQuery(theme => theme.breakpoints.up("xl"))\n' +
          '   return hidden ? null : <Paper />',

        pigmentHiddenComponent: '👻 PigmentHidden component was removed in V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   <PigmentHidden xlUp><Paper /></PigmentHidden>\n\n' +
          '✅ Option 1 - Use sx prop:\n' +
          '   <Paper sx={{ display: { xl: "none" } }} />\n\n' +
          '✅ Option 2 - Use useMediaQuery:\n' +
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

          // Dialog.onBackdropClick and Modal.onBackdropClick
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
        description: 'Detects deprecated imports in MUI V7',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        createMuiTheme: '🎨 createMuiTheme was removed in V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   import { createMuiTheme } from "@mui/material/styles"\n\n' +
          '✅ New way (V7):\n' +
          '   import { createTheme } from "@mui/material/styles"\n\n' +
          '💡 The functionality is identical, only the name changed!',

        experimentalStyled: '🎨 experimentalStyled was removed in V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   import { experimentalStyled } from "@mui/material/styles"\n\n' +
          '✅ New way (V7):\n' +
          '   import { styled } from "@mui/material/styles"\n\n' +
          '💡 styled is now stable and fully supported!',

        styledEngineProvider: '⚙️ StyledEngineProvider can no longer be imported from @mui/material!\n\n' +
          '🔧 Old way (V6):\n' +
          '   import { StyledEngineProvider } from "@mui/material"\n\n' +
          '✅ New way (V7):\n' +
          '   import { StyledEngineProvider } from "@mui/material/styles"\n\n' +
          '💡 The correct location since V5 is @mui/material/styles!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detect StyledEngineProvider being imported from @mui/material (wrong)
          if (source === '@mui/material') {
            node.specifiers.forEach(spec => {
              if (spec.type === 'ImportSpecifier' && spec.imported.name === 'StyledEngineProvider') {
                context.report({
                  node,
                  messageId: 'styledEngineProvider',
                  fix(fixer) {
                    // Change the source from '@mui/material' to '@mui/material/styles'
                    return fixer.replaceText(node.source, '"@mui/material/styles"');
                  },
                });
              }
            });
          }

          // Detect imports from @mui/material/styles
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

  'prefer-slots-api': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Recommends using slots/slotProps instead of components/componentsProps',
        category: 'Best Practices',
        recommended: true,
      },
      messages: {
        useSlots: '🔧 The components/componentsProps API was deprecated!\n\n' +
          '⚠️ Old way (deprecated):\n' +
          '   <TextField components={{"{"}...{"}"}  componentsProps={{"{"}...{"}"} } />\n\n' +
          '✅ New way (recommended):\n' +
          '   <TextField slots={{"{"}...{"}"}  slotProps={{"{"}...{"}"} } />\n\n' +
          '💡 The new API is more consistent and flexible!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      // List of MUI components that actually use components/componentsProps
      // Source: https://github.com/mui/material-ui/issues/41279
      const MUI_COMPONENTS_WITH_SLOTS = new Set([
        // Material-UI Core components
        'Accordion', 'Alert', 'Autocomplete', 'Avatar', 'AvatarGroup',
        'CardHeader', 'Checkbox', 'Dialog', 'Drawer', 'SwipeableDrawer',
        'FilledInput', 'FormControlLabel', 'Input', 'InputBase', 'OutlinedInput',
        'ListItem', 'Menu', 'MenuItem', 'MobileStepper', 'Modal',
        'NativeSelect', 'Pagination', 'PaginationItem', 'Popper',
        'Radio', 'Rating', 'Select', 'Skeleton', 'Slider',
        'Snackbar', 'SpeedDial', 'SpeedDialAction',
        'Tab', 'Tabs', 'TablePagination', 'TableSortLabel',
        'TextField', 'ToggleButton', 'ToggleButtonGroup', 'Tooltip',
        // MUI X components (DataGrid, Pickers, etc)
        'DataGrid', 'DataGridPro', 'DataGridPremium',
        'DatePicker', 'TimePicker', 'DateTimePicker',
        'MobileDatePicker', 'MobileTimePicker', 'MobileDateTimePicker',
        'DesktopDatePicker', 'DesktopTimePicker', 'DesktopDateTimePicker',
        'StaticDatePicker', 'StaticTimePicker', 'StaticDateTimePicker',
        'DateCalendar', 'MonthCalendar', 'YearCalendar',
        'DateField', 'TimeField', 'DateTimeField',
        'DateRangePicker', 'MobileDateRangePicker', 'DesktopDateRangePicker',
        'TreeView', 'TreeItem',
      ]);

      return {
        JSXOpeningElement(node) {
          const componentName = node.name?.name;

          // Only check if it's a potential MUI component (PascalCase)
          if (!componentName || !/^[A-Z]/.test(componentName)) {
            return;
          }

          // Only check components that we know use components/componentsProps
          if (!MUI_COMPONENTS_WITH_SLOTS.has(componentName)) {
            return;
          }

          const deprecatedProps = node.attributes.filter(
            attr => attr.type === 'JSXAttribute' &&
              (attr.name?.name === 'components' || attr.name?.name === 'componentsProps')
          );

          if (deprecatedProps.length > 0) {
            context.report({
              node,
              messageId: 'useSlots',
              fix(fixer) {
                // Rename each deprecated prop
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
        description: 'Recommends using theme.vars for CSS variables',
        category: 'Best Practices',
        recommended: false,
      },
      messages: {
        useThemeVars: '💡 When `cssVariables: true`, use theme.vars!\n\n' +
          '⚠️ Way that does NOT change with dark mode:\n' +
          '   color: theme.palette.text.primary\n\n' +
          '✅ Way that changes automatically:\n' +
          '   color: theme.vars.palette.text.primary\n\n' +
          '📚 Benefits: Performance + Automatic dark mode!',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      const sourceCode = context.getSourceCode();

      /**
       * Check if the node is inside a ternary that checks theme.vars
       * Example: theme.vars ? `${theme.vars.palette.primary.main}` : `${theme.palette.primary.main}`
       */
      function isInsideThemeVarsConditional(node) {
        let current = node;
        let depth = 0;
        const MAX_DEPTH = 10;

        // Go up MAX_DEPTH levels in the AST tree looking for ConditionalExpression
        while (current.parent && depth < MAX_DEPTH) {
          current = current.parent;
          depth++;

          // If a ternary (ConditionalExpression) is found
          if (current.type === 'ConditionalExpression') {
            const test = current.test;
            // Check if the test is "theme.vars"
            if (
              test?.type === 'MemberExpression' &&
              test.object?.name === 'theme' &&
              test.property?.name === 'vars'
            ) {
              return true; // Ignore warnings when inside ternary with theme.vars
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
       * Check if inside an sx function that uses theme.vars!
       * Example: sx={(theme) => ({ background: `${theme.vars!.palette...}` })}
       */
      function isUsingNonNullAssertion(node) {
        if (!node.parent) return false;

        let sourceText = sourceTextCache.get(node.parent);
        if (sourceText === undefined) {
          sourceText = sourceCode.getText(node.parent);
          sourceTextCache.set(node.parent, sourceText);
        }

        // Look for theme.vars! (non-null assertion)
        return sourceText.includes('theme.vars!');
      }

      return {
        MemberExpression(node) {
          // Detect theme.palette.* (without .vars)
          // Optimized: use optional chaining and early returns
          if (node.object?.type !== 'MemberExpression') return;
          if (node.object.object?.name !== 'theme') return;
          if (node.object.property?.name !== 'palette') return;

          // Check it's not theme.vars.palette
          const parent = node.object.object;
          if (parent.type !== 'Identifier' || parent.name !== 'theme') return;

          // Ignore if inside a ternary that checks theme.vars
          if (isInsideThemeVarsConditional(node)) return;

          // Ignore if already using theme.vars! (non-null assertion)
          if (isUsingNonNullAssertion(node)) return;

          context.report({
            node,
            messageId: 'useThemeVars',
            fix(fixer) {
              // Transform: theme.palette.* → theme.vars.palette.*
              // node.object.object is 'theme'
              // node.object.property is 'palette'
              const themeNode = node.object.object;

              // Insert '.vars' after 'theme'
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

  'no-deep-imports': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Deep imports break in MUI V7 due to new exports field',
        category: 'Breaking Changes',
        recommended: true,
      },
      messages: {
        deepImport: '📦 Deep imports no longer work in MUI V7!\n\n' +
          '🔧 Old way (V6):\n' +
          '   import {{ importName }} from "{{ source }}"\n\n' +
          '✅ New way (V7):\n' +
          '   import { {{ importName }} } from "{{ suggestedSource }}"\n\n' +
          '💡 MUI V7 uses exports field in package.json, which blocks deep imports.',
      },
      schema: [],
      fixable: 'code',
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;

          // Detect MUI deep imports (more than one level deep)
          // Example: @mui/material/styles/createTheme
          const muiDeepImportRegex = /^@mui\/(material|system|joy)\/([^/]+)\/(.+)$/;
          const match = source.match(muiDeepImportRegex);

          if (match) {
            const [, package_, componentDir, deepPath] = match;
            const suggestedSource = `@mui/${package_}`;

            // Infer component name from directory (e.g., Button from /Button/...)
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

                // Convert default import to named import
                if (node.specifiers[0]?.type === 'ImportDefaultSpecifier') {
                  // If the local name equals the imported name, use simple syntax
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
};

// Export the plugin (ESM and CommonJS compatible)
const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
  },
  rules: muiV7Rules,
  configs: {},
};

// ESLint 9+ Flat Config format (self-referencing plugin object)
plugin.configs.recommended = {
  name: 'mui-v7/recommended',
  plugins: {
    'mui-v7': plugin,
  },
  rules: {
    // Breaking changes - ERRORS (code breaks)
    'mui-v7/no-grid2-import': 'error',
    'mui-v7/no-grid-item-prop': 'error',
    'mui-v7/no-lab-imports': 'error',
    'mui-v7/no-deprecated-props': 'error',
    'mui-v7/no-deprecated-imports': 'error',
    'mui-v7/no-deep-imports': 'error',
    // Best practices - WARNINGS (suggestions)
    'mui-v7/prefer-slots-api': 'warn',
    'mui-v7/prefer-theme-vars': 'warn',
  },
};

plugin.configs.strict = {
  name: 'mui-v7/strict',
  plugins: {
    'mui-v7': plugin,
  },
  rules: {
    // Breaking changes - ERRORS
    'mui-v7/no-grid2-import': 'error',
    'mui-v7/no-grid-item-prop': 'error',
    'mui-v7/no-lab-imports': 'error',
    'mui-v7/no-deprecated-props': 'error',
    'mui-v7/no-deprecated-imports': 'error',
    'mui-v7/no-deep-imports': 'error',
    // Best practices - ERRORS also in strict mode
    'mui-v7/prefer-slots-api': 'error',
    'mui-v7/prefer-theme-vars': 'error',
  },
};

module.exports = plugin;
