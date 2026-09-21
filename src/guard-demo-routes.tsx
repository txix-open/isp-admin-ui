import { Alert, Card, Space, Typography } from 'antd'
import { PermissionKeysType } from 'isp-admin-ui-kit'
import { Outlet } from 'react-router-dom'

const missingModule = '__guard_demo_missing_module__'
const childModule = '__guard_demo_child__'
const permissions = [PermissionKeysType.profile_view]
const home = '/guard-demo/open'

const cases = [
  { title: 'Контроль: страница без требований', url: home + '?guardMock=empty', expected: 'Страница открывается даже при пустом списке модулей.' },
  { title: '1. Родитель: отсутствующий модуль', url: '/guard-demo/nested?guardMock=empty', expected: 'Родитель должен блокироваться.' },
  { title: '1. Относительный дочерний маршрут', url: '/guard-demo/nested/42?guardMock=empty', expected: 'Тоже должен блокироваться. Сейчас открывается: полный путь ребёнка не учитывается.' },
  { title: '2. Статический маршрут после динамического', url: '/guard-demo/ranked/special?guardMock=empty', expected: 'Должен блокироваться. Сейчас guard выбирает /ranked/:id без требований, хотя роутер открывает /ranked/special.' },
  { title: '2. Статический маршрут после wildcard', url: '/guard-demo/wildcard/special?guardMock=empty', expected: 'Должен блокироваться. Сейчас guard выбирает /wildcard/* без требований.' },
  { title: '3. Ребёнок требует B, родитель требует A', url: '/guard-demo/inherited/child?guardMock=child', expected: 'API возвращает только активный B. Страница должна блокироваться из-за отсутствующего A, но сейчас открывается вместе с родителем.' },
  { title: '4. Ошибка загрузки модулей (503)', url: '/guard-demo/blocked?guardMock=error', expected: 'Нужны ошибка проверки и кнопка повтора. Сейчас показывается «Недостаточно модулей»; также возможен глобальный toast.' },
  { title: '5. Сохранение меню и шапки', url: '/guard-demo/blocked?guardMock=empty', expected: 'Должно блокироваться только содержимое страницы. Сейчас меню и шапка исчезают.' },
  { title: '5. Загрузка на странице без требований', url: home + '?guardMock=slow', expected: 'Страница без требований не должна ждать список модулей. Сейчас весь экран занят спиннером 8 секунд.' }
]

const DemoPage = ({ title, expected }: { title: string; expected: string }) => (
  <Card title={title} style={{ margin: 24 }}>
    <Space direction="vertical" size="large">
      <Alert type="warning" showIcon message="Тестовый компонент смонтирован" description={expected} />
      <a href={home}>Вернуться к списку проверок</a>
    </Space>
  </Card>
)

const Parent = () => (
  <>
    <Card title="Родительский компонент смонтирован" style={{ margin: 24 }}>
      Родитель требует модуль {missingModule}. При его отсутствии этот компонент не должен монтироваться.
    </Card>
    <Outlet />
  </>
)

export const guardDemoRoutes = [
  {
    route: home, key: home, label: 'Guard: все проверки', permissions,
    element: (
      <Card title="Проверка ModuleGuard — замечания 1–5" style={{ margin: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert type="info" showIcon message="Локальные тестовые сценарии"
            description="Ссылки перезагружают страницу, чтобы очистить кэш запроса. Только ответ списка модулей подменяется на время выбранного сценария; авторизация остаётся настоящей. Без guardMock используется реальный API. Если меню исчезло, вернитесь кнопкой браузера «Назад». Видимость пунктов меню регулируется profile_view." />
          {cases.map((item) => (
            <div key={item.title}>
              <Typography.Title level={5}><a href={item.url}>{item.title}</a></Typography.Title>
              <Typography.Paragraph>{item.expected}</Typography.Paragraph>
            </div>
          ))}
          <a href="/profile">Завершить проверку и открыть профиль</a>
        </Space>
      </Card>
    )
  },
  {
    route: '/guard-demo/blocked', key: '/guard-demo/blocked', label: 'Guard: блокировка', permissions,
    requiredModules: [missingModule],
    element: <DemoPage title="Защищённая страница" expected="При отсутствии тестового модуля этот контент не должен отображаться." />
  },
  {
    route: '/guard-demo/nested', key: '/guard-demo/nested', label: 'Guard: вложенность', permissions,
    requiredModules: [missingModule], element: <Parent />,
    children: [{
      route: ':id', key: 'guard-demo-relative-child', label: 'Относительный ребёнок', permissions,
      element: <DemoPage title="1. Относительный ребёнок" expected="Отсутствует родительский модуль, но guard пропускает страницу /nested/42." />
    }]
  },
  {
    route: '/guard-demo/ranked/:id', key: '/guard-demo/ranked/:id', label: 'Guard: динамический', permissions,
    element: <DemoPage title="Динамический маршрут" expected="Это контрольный динамический маршрут без требований." />
  },
  {
    route: '/guard-demo/ranked/special', key: '/guard-demo/ranked/special', label: 'Guard: статический', permissions,
    requiredModules: [missingModule],
    element: <DemoPage title="2. Роутер выбрал статический маршрут" expected="Guard проверил динамический маршрут без требований. Эта страница должна быть заблокирована." />
  },
  {
    route: '/guard-demo/wildcard/*', key: '/guard-demo/wildcard/*', label: 'Guard: wildcard', permissions,
    element: <DemoPage title="Wildcard" expected="Это контрольный wildcard без требований." />
  },
  {
    route: '/guard-demo/wildcard/special', key: '/guard-demo/wildcard/special', label: 'Guard: после wildcard', permissions,
    requiredModules: [missingModule],
    element: <DemoPage title="2. Статический маршрут после wildcard" expected="Guard проверил wildcard без требований. Эта страница должна быть заблокирована." />
  },
  {
    route: '/guard-demo/inherited', key: '/guard-demo/inherited', label: 'Guard: наследование', permissions,
    requiredModules: [missingModule], element: <Parent />,
    children: [{
      route: '/guard-demo/inherited/child', key: '/guard-demo/inherited/child', label: 'Ребёнок с модулем B', permissions,
      requiredModules: [childModule],
      element: <DemoPage title="3. Требования родителя потеряны" expected="В ответе есть только модуль ребёнка B. Родительский A отсутствует, поэтому оба компонента должны быть заблокированы." />
    }]
  }
]
