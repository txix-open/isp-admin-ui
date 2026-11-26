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

### Проверка совместимости зависимостей

После обновления зависимостей выполните `npm ci`, `npm run lint`, `npm run build`
и `npm run test:dependencies`. Последняя команда собирает отдельную проверочную
страницу. Запустите `npm run preview -- --outDir build/dependency-smoke --port 4174`
и откройте `http://localhost:4174/tests/dependency-smoke.html`.
Успешный результат — `Dependency checks passed`. Проверяются DOMPurify, Mermaid
(включая формулы), KaTeX, JSON Schema/RJSF, ReDoc, Router и JSON worker Monaco.
Страница проверки не входит в основную production-сборку.

В `overrides` закреплены исправленные DOMPurify и KaTeX без обновления Monaco и
Mermaid на новые основные версии. Overrides minimatch/glob относятся к инструментам
разработки. Вендорная версия `isp-admin-ui-kit` поддерживает Router 7.
React остаётся в ветке 18. Вместо всех Node-полифилов подключаются только Buffer/process и браузерные реализации path/http/url,
необходимые парсерам JSON Schema/OpenAPI и ReDoc. Криптографические полифилы удалены.

### Вендорный пакет isp-admin-ui-kit

`npm ci` устанавливает UI-kit из `vendor/isp-admin-ui-kit-1.16.0.tgz`. Архив
собран из коммита `abbe2f3` репозитория `isp-admin-ui-kit`.

Для обновления запустите `npm run build:prod` в репозитории UI-kit и упакуйте
сборку командой `npm pack --pack-destination /путь/к/isp-admin-ui/vendor`.
В `isp-admin-ui` установите новый архив через `npm install ./vendor/<имя-архива>.tgz`
и сохраните его вместе с обновлёнными `package.json` и `package-lock.json`.
