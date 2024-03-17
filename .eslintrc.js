module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': 'off', // 允许使用 console.log
    'react/prop-types': 'off', // 可选：关闭对 propTypes 的检查
    'react-hooks/rules-of-hooks': 'error', // 检查 Hooks 的使用是否正确
    'react-hooks/exhaustive-deps': 'warn' // 检查依赖项数组是否正确处理
  },
  settings: {
    react: {
      version: 'detect' // 自动检测 React 版本
    }
  }
}
