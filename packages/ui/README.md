# Central Pet — Design System

Pacote: `@central-pet/ui`

## Tokens

Arquivo: `src/tokens/tokens.css`

- Paleta brand (teal), accent (honey), neutrals, semantic (success/warning/danger/info)
- Superfícies, tipografia, espaçamento, radius, sombra, motion, z-index
- **Light Mode**: `:root` / `[data-theme='light']`
- **Dark Mode**: `[data-theme='dark']` + classe `.dark`

## Tipografia

| Papel | Família |
|-------|---------|
| Display / títulos | Fraunces |
| Corpo / UI | Source Sans 3 |

Componentes: `Heading`, `Text`, `Label`

## Componentes

### Primitives
`Button`, `Input`, `Select`, `Checkbox`, `Badge`, `Skeleton`, `Heading`, `Text`, `Label`

### Patterns
`Card`, `Alert`, `Breadcrumb`, `Table`, `Modal`, `Drawer`, `ToastProvider` / `useToast`

### Layouts
`Sidebar`, `Navbar`, `ThemeToggleButton`

### Theme
`ThemeProvider`, `useTheme`, `useThemeOptional`

## Uso

```tsx
import '@central-pet/ui/tokens.css';
import {
  ThemeProvider,
  ToastProvider,
  Button,
  Input,
  Sidebar,
  Navbar,
} from '@central-pet/ui';
```

Apps já carregam tokens em `main.tsx` e providers em `AppProviders`.

## Tailwind

Preset em `packages/config/tailwind/preset.js` mapeia tokens semânticos (`surface`, `content`, `line`, `brand`, `accent`, etc.).
