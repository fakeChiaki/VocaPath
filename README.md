# VocaPath

Plataforma web de orientación vocacional para estudiantes de 3° y 4° medio. Ayuda a decidir qué carrera estudiar: explorar carreras y sus mallas, revisar universidades, comparar carreras, marcar favoritas, rendir un test vocacional, practicar pruebas tipo PAES, administrar puntajes por materia y simular la postulación a la PAES.

Este repositorio es el **frontend**. Los datos (carreras, universidades, fechas, preguntas, puntajes, favoritas) los entrega el backend, [VocaPath-backend](https://github.com/fakeChiaki/VocaPath-backend).

## Tecnologías

- **Vue 3** (Composition API + `<script setup>`) con **TypeScript**
- **Vite** como build tool y dev server
- **Tailwind CSS 4** para los estilos
- **Pinia** para el manejo de estado
- **Vue Router** para la navegación
- **Axios** para consumir la API (con renovación automática del token de acceso)

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- [pnpm](https://pnpm.io/) como gestor de paquetes (no usar npm ni yarn)
- El **backend en ejecución** (por defecto en `http://localhost:3000`). Sus instrucciones están en el README del backend.

## Puesta en marcha

```bash
pnpm install          # instalar dependencias
cp .env.example .env  # configurar la URL de la API
pnpm run dev          # servidor de desarrollo (http://localhost:5173)
pnpm run build        # build de producción a dist/
pnpm run preview      # previsualizar el build de producción
```

Variable de entorno:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3000` |

El backend debe permitir el origen del frontend (`FRONTEND_URL=http://localhost:5173` en su `.env`).

## Estructura del proyecto

```
src/
├── api/              # Cliente Axios (interceptores, renovación del token) y sesión en memoria
├── components/       # Componentes reutilizables
│   ├── careers/      # CareerCard, CareerSearchBar
│   └── layout/       # AppNavbar, UnderConstruction
├── composables/      # useCareerFilter (búsqueda de carreras)
├── router/           # Rutas y guard de autenticación
├── stores/           # Estado con Pinia (auth, catalog, favorites, scores, compare)
├── types/            # Tipos TypeScript (api.ts = respuestas del backend)
├── utils/            # Helpers de dominio (careers.ts, paes.ts)
└── views/            # Una vista por ruta
```

## Autenticación y datos

- Al iniciar sesión, el backend entrega un **token de acceso** corto que el frontend guarda **solo en memoria** (no en `localStorage`) y un **token de renovación** en una cookie `httpOnly`. Al recargar la página, la sesión se recupera con esa cookie.
- Todas las rutas exigen sesión, excepto el inicio, el login y el registro.
- El catálogo (carreras y universidades), las favoritas y los puntajes se cargan después del login y se guardan en la cuenta del usuario, no en el navegador.
- Las carreras sin puntaje de corte publicado muestran "No publicado", y el simulador lo indica en vez de calcular.
- El simulador, el test vocacional y la prueba tipo PAES calculan sus resultados en el backend.

## Integrantes y reparto

- **Sebastián Ávila** — Base del proyecto (router, stores, datos, componentes compartidos), Prueba tipo PAES, Mis Puntajes y Simulador de postulación.
- **Carlos Cienfuegos** — Fechas PAES, Landing, Test Vocacional y Comparación de carreras
- **Eduardo Krause** — Carreras, Malla de carreras, Universidades, Detalle de universidad y Favoritas.
