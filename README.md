# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname
  }
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
1

## Стенд с локальной библиотекой

В `isp-admin-ui-kit` выполните `npm run pack:stand`, скопируйте созданный
архив в `vendor/` этого проекта и установите его (укажите актуальную версию):

```bash
npm install ./vendor/isp-admin-ui-kit-1.11.0.tgz
```

Закоммитьте архив, package.json и package-lock.json. После замены архива
повторите npm install, чтобы обновить checksum в lock-файле. Деплой обычный:
основной Dockerfile копирует vendor до npm ci, Dockerfile.dit — вместе с проектом.
Файл vendor/.gitkeep сохраняет каталог в Git даже без архивов. Если зависимость
указывает на архив, этот архив обязателен. Для возврата на npm выполните
`npm install isp-admin-ui-kit@<version>` с нужной опубликованной версией.
