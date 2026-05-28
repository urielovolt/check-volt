# Check Volt

PWA de checklist con interfaz tipo Tinder para **Crepería María**. Permite verificar ingredientes y equipo antes de salir a vender o ir de compras, deslizando tarjetas: izquierda para confirmar, derecha para dejar pendiente.

**App en vivo:** https://urielovolt.github.io/check-volt/

## Características

- Dos modos: **Día de Compra** (29 productos) y **Salir a Venta** (43 artículos)
- Gestos tipo Tinder con botones de respaldo
- Vibración haptica en cada acción
- Sesión persistente en `localStorage` (resume donde quedó)
- Funciona offline (Service Worker)
- Instalable en pantalla de inicio (PWA)
- Confeti al completar la lista

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- vite-plugin-pwa
- canvas-confetti

## Desarrollo

```bash
npm install
npm run dev      # localhost:5173
npm run build    # genera dist/
```

## Deploy

Push a `main` dispara GitHub Actions y republica automáticamente en GitHub Pages.

---

Desarrollado por [@urielovolt](https://github.com/urielovolt)
