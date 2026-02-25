# PRD - Gestión JM - Gastos Compartidos

## Original Problem Statement
Reconstruir app "Gestión JM – Gastos Compartidos" porque el workspace original se perdió. La app debe gestionar gastos compartidos entre familia con login PIN, balance 50/50, transferencias, reintegros, y ser PWA instalable. Deploy en Vercel (no Emergent pago).

## User Personas
1. **Mariano (Padre)** - Admin completo, puede editar todo y gestionar transferencias
2. **Gabriela (Madre)** - Admin completo, mismos permisos que Mariano
3. **Juan Martín (Colaborador)** - Solo puede crear gastos y editar los propios, no puede gestionar transferencias

## Core Requirements
- Login con PIN de 4 dígitos (sesión persistente en localStorage)
- Gestión de gastos: crear, editar, eliminar
- División 50/50 automática entre Mariano y Gabriela
- Sistema de reintegros cuando Juan Martín paga
- Registro de transferencias entre usuarios
- Balance mensual con deudas calculadas
- PWA instalable en Android/iOS
- Preparado para migración a Firebase

## What's Been Implemented (Feb 25, 2026)

### ✅ Completed
- Login con PIN (Mariano: 1234, Gabriela: 4321, Juan Martín: 1111)
- Pantalla de inicio con balance mensual y selector de mes
- Tarjeta "Mes cerrado" cuando cuentas equilibradas
- Formulario de nuevo gasto con todas las categorías
- Lista de gastos agrupada por mes con búsqueda y filtros
- Edición y eliminación de gastos (según permisos)
- Toggle de reintegro con preview automático
- Sección de transferencias (solo padres pueden crear)
- Cambio de PIN en ajustes
- Sección de cuenta con permisos visibles
- Cierre de sesión
- PWA: manifest.webmanifest, service-worker.js, offline.html, iconos
- Botón "Instalar app" para beforeinstallprompt
- README con instrucciones de deploy en Vercel
- Build de producción exitoso

### 🔲 Pending/Future
- [ ] Migración a Firebase (Firestore + Storage)
- [ ] Subida de comprobantes (imágenes)
- [ ] Notificaciones push
- [ ] Exportar datos a CSV/Excel
- [ ] Gráficos de gastos por categoría

## Tech Stack
- Frontend: React 19 + TailwindCSS + CRACO
- Persistencia: localStorage (capa de abstracción lista para Firebase)
- PWA: Service Worker + manifest

## Files Structure
```
/app/frontend/
├── public/
│   ├── icons/ (icon-192x192.png, icon-512x512.png)
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   └── offline.html
├── src/
│   ├── components/ (LoginScreen, HomeTab, ExpensesTab, ExpenseForm, SettingsTab, AlertsTab, BottomNav, InstallButton)
│   ├── context/ (AuthContext)
│   ├── services/ (storageService, calculationService)
│   ├── App.js
│   └── index.js
└── README.md (instrucciones Vercel)
```

## Next Tasks (P0)
1. Usuario sube a GitHub repo "GestionJM"
2. Usuario importa en Vercel y configura
3. Probar instalación PWA en Android/iOS

## Next Tasks (P1)
- Agregar Firebase cuando usuario lo solicite
- Implementar alertas de reintegros pendientes
