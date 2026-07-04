# VocaPath

Plataforma web de orientación vocacional para estudiantes de 3° y 4° medio. Ayuda a decidir qué carrera estudiar: explorar carreras y sus mallas, revisar universidades, comparar carreras, marcar favoritas, rendir un test vocacional, practicar pruebas tipo PAES, administrar puntajes por materia y simular la postulación a la PAES.

## Tecnologías

- **Vue 3** (Composition API + `<script setup>`) con **TypeScript**
- **Vite** como build tool y dev server
- **Tailwind CSS 4** para los estilos
- **Pinia** para el manejo de estado
- **Vue Router** para la navegación
- **localStorage** para la persistencia (no hay base de datos)

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- [pnpm](https://pnpm.io/) como gestor de paquetes (no usar npm ni yarn)

## Puesta en marcha

```bash
pnpm install      # instalar dependencias
pnpm run dev      # servidor de desarrollo (http://localhost:5173)
pnpm run build    # build de producción a dist/
pnpm run preview  # previsualizar el build de producción
```

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── careers/      # CareerCard, CareerSearchBar
│   └── layout/       # AppNavbar, CacheWarning
├── composables/      # useCareerFilter (búsqueda de carreras)
├── data/             # Datos estáticos en JSON (carreras, universidades, fechas, preguntas)
├── router/           # Definición de rutas
├── stores/           # Estado con Pinia (favorites, scores, compare)
├── types/            # Tipos TypeScript
├── utils/            # Helpers de dominio (cálculos, storage)
└── views/            # Una vista por ruta
```

## Persistencia de datos

El proyecto **no tiene base de datos**: las carreras favoritas, los puntajes y los resultados de las pruebas se guardan en el **caché del navegador** (`localStorage`), con estas llaves:

| Llave | Contenido |
|-------|-----------|
| `vp_fav` | Carreras marcadas como favoritas |
| `vp_scores` | Puntajes por materia (ingresados o de pruebas rendidas) |
| `vp_paesdone` | Materias con prueba tipo PAES rendida |
| `vp_paes_answers` | Respuestas de las pruebas, para revisarlas después |
| `vp_paes_mencion` | Mención elegida en la prueba de Ciencias |

> Si se limpia el caché o se usa modo incógnito, estos datos se pierden. La aplicación advierte de esto en las secciones donde se guardan puntajes o favoritas.

## Integrantes y reparto

- **Sebastián Ávila** — Base del proyecto (router, stores, datos, componentes compartidos), Prueba tipo PAES, Mis Puntajes y Simulador de postulación.
- **Carlos Cienfuegos** — Fechas PAES, Landing, Test Vocacional y Comparación de carreras
- **Eduardo Krause** — Carreras, Malla de carreras, Universidades, Detalle de universidad y Favoritas.
