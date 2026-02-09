# GrocerEase Web Portal

This is the web portal for GrocerEase, built using React + Vite.

---

# Development

**Important Instructions For Source Control**:

- Create **branch** for every development/fixes tasks
  - For feature development create a branch with prefix `feat/`
  - For bug fixes create a branch with prefix `fix/`
- DO NOT push on **master or staging** branches directly, instead create a PRs.
- DO NOT merge any PRs into **master** before review.
- Before any branch creation from **staging** branch, make sure to pull the latest changes

## Start Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/Amr-Elharery/GrocerEase_web.git
cd GrocerEase_web
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
# or
yarn start
```
---

# How to create branch and start working

1. Create branch from staging branch
   ```bash
   git switch staging
   git pull origin staging
   git switch -c feat/your-feature-name
   ```
2. After completing your work, push your branch to remote
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin feat/your-feature-name
   ```
3. Create a Pull Request (PR) from your branch to staging branch on GitHub for review and merging.

4. After PR is approved and merged, switch back to staging branch and pull the latest changes
   ```bash
   git switch staging
   git pull origin staging
   ```

---

# Notes

- Please make sure to follow the above instructions carefully to maintain a clean and organized workflow.

- Feel free to reach out if you have any questions or need assistance!

- Good luck Team!

---

Best Regards,
Amr Elharery

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
