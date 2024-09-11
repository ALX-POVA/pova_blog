import globals from "globals";


export default [
  {languageOptions: { globals: globals.node },
//   env: {
//     es2021: true,      // Modern JS (ES6+)
//     node: true,        // For Node.js environment
// },
extends: [
    'eslint:recommended', // Base recommended ESLint rules
    'plugin:node/recommended', // Recommended rules for Node.js
    'plugin:import/errors',    // Manage ES6 imports
    'plugin:import/warnings',
    'plugin:promise/recommended', // Enforce best practices for Promises
],
parserOptions: {
    ecmaVersion: 12,           // Use ECMAScript 2021 (ES12)
    sourceType: 'module',      // Use ECMAScript modules (import/export)
},
rules: {
    // Example rule customizations
    'no-console': 'off',       // Allow console logs (turn off if needed)
    'semi': ['error', 'always'],   // Require semicolons
    'quotes': ['error', 'single'], // Enforce single quotes
    'indent': ['error', 2],    // 2-space indentation
    'no-unused-vars': ['warn'], // Warn on unused variables
    'import/order': ['error', { // Enforce import order
      'groups': [['builtin', 'external', 'internal']],
      'newlines-between': 'always',
    }],
    'promise/always-return': 'off', // Customize Promise rules
    'promise/catch-or-return': 'warn',
},
plugins: [
    'import',  // Plugin to lint ES6+ import/export syntax
    'node',    // Plugin to help with Node.js-specific code
    'promise', // Plugin to enforce best practices for Promises
]},
  
];