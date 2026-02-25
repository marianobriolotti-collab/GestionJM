# Gestión JM - Gastos Compartidos

Aplicación mobile-first para gestionar gastos compartidos entre familia.

## 🚀 Quick Start

```bash
cd frontend
yarn install
yarn start
```

## 📱 Características

- 🔐 Login con PIN de 4 dígitos
- 👥 3 usuarios: Mariano, Gabriela, Juan Martín
- 💰 Gestión de gastos con división 50/50
- 📊 Balance mensual automático
- 💸 Registro de transferencias
- 🔄 Sistema de reintegros
- 📱 PWA instalable
- 🌙 Diseño dark mode

## 👤 Usuarios por defecto

| Usuario | PIN | Rol |
|---------|-----|-----|
| Mariano | 1234 | Admin |
| Gabriela | 4321 | Admin |
| Juan Martín | 1111 | Colaborador |

## 🛠 Stack

- React 19 + TailwindCSS
- Create React App (CRACO)
- localStorage (preparado para Firebase)
- PWA con Service Worker

## 📦 Deploy en Vercel

1. Importá el repo en [vercel.com](https://vercel.com)
2. Configurá:
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   - **Node.js**: 18.x
3. Deploy!

Ver instrucciones detalladas en [frontend/README.md](frontend/README.md)

## 📁 Estructura

```
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   ├── manifest.webmanifest
│   │   ├── service-worker.js
│   │   └── offline.html
│   └── src/
│       ├── components/
│       ├── context/
│       ├── services/
│       └── App.js
└── README.md
```

## 🔜 Migración a Firebase

La app está preparada. Solo modificar `storageService.js` para usar Firestore.

---

**Licencia**: Uso privado - Familia JM
