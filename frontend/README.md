# Gestión JM - Gastos Compartidos

Aplicación mobile-first para gestionar gastos compartidos entre familia.

## Características

- 🔐 **Login con PIN de 4 dígitos** - Acceso rápido y seguro
- 👥 **3 usuarios**: Mariano, Gabriela, Juan Martín
- 💰 **Gestión de gastos** - Registro, edición y eliminación
- 📊 **Balance mensual** - Quién debe a quién
- 💸 **Transferencias** - Registro de pagos entre usuarios
- 🔄 **Reintegros** - Sistema automático de reintegros a Juan
- 📱 **PWA instalable** - Funciona como app nativa
- 🌙 **Modo oscuro** - Diseño moderno y elegante

## Usuarios por defecto

| Usuario | PIN |
|---------|-----|
| Mariano | 1234 |
| Gabriela | 4321 |
| Juan Martín | 1111 |

## Stack Técnico

- **Frontend**: React 19 + TailwindCSS
- **Build**: Create React App (CRACO)
- **Persistencia**: localStorage (preparado para Firebase)
- **PWA**: Service Worker + manifest.webmanifest

## Deploy en Vercel

### Pasos:

1. **Subí el código a GitHub** (si no lo hiciste)

2. **Andá a [vercel.com](https://vercel.com)** y logueate con GitHub

3. **Click en "Add New..." → "Project"**

4. **Importá el repositorio** `GestionJM`

5. **Configurá el proyecto:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (o `yarn build`)
   - **Output Directory**: `build`
   - **Node.js Version**: 18.x

6. **Click en "Deploy"**

7. ¡Listo! Tu app estará en `https://gestion-jm.vercel.app` (o similar)

### Variables de entorno (opcional)

Si en el futuro agregás Firebase:
```
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
```

## Desarrollo local

```bash
cd frontend
yarn install
yarn start
```

## Estructura del proyecto

```
frontend/
├── public/
│   ├── icons/           # Iconos PWA
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   └── offline.html
├── src/
│   ├── components/      # Componentes React
│   ├── context/         # AuthContext
│   ├── services/        # storageService, calculationService
│   ├── App.js
│   └── index.js
└── package.json
```

## Migración a Firebase (futuro)

La app está preparada para migrar a Firebase. Solo hay que:

1. Crear proyecto en Firebase Console
2. Agregar credenciales en `.env`
3. Modificar `storageService.js` para usar Firestore
4. Los componentes no necesitan cambios

## Licencia

Uso privado - Familia JM
