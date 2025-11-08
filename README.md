# 📊 Project Pulse

> **Dashboard de analítica de proyectos** - Demo front-end para visualización de métricas y rendimiento de equipos

Project Pulse es un dashboard interactivo diseñado para equipos que necesitan visualizar el rendimiento de sus proyectos en tiempo real. Ofrece una vista consolidada del estado operativo: progreso, eficiencia del equipo, tiempos de entrega, riesgos y rendimiento general.

## ✨ Características

### 📈 Dashboard y Métricas
- **KPIs en tiempo real** con indicadores de tendencia (↑↓)
- **Comparación de períodos** para analizar mejoras o regresiones
- **6 tipos de gráficos interactivos**:
  - Velocidad mensual
  - Tasa de finalización
  - Crecimiento del backlog
  - Tendencias semanales
  - Distribución de estado de tareas
  - Carga de trabajo del equipo

### 🎯 Gestión de Proyectos
- **Tabla interactiva** con filtros avanzados
- **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- **Búsqueda y ordenamiento** por columnas
- **Filtros por**: fecha, equipo, estado, prioridad

### 👥 Rendimiento del Equipo
- **Visualización comparativa** de miembros del equipo
- **Métricas individuales**: velocidad, cumplimiento, productividad
- **CRUD de miembros del equipo**

### 🔔 Sistema de Alertas
- **Notificaciones en tiempo real** de riesgos y eventos
- **Categorización** por tipo (warning, error, info)
- **Timestamps relativos** (hace X minutos/horas/días)

### 🌐 Internacionalización
- **Soporte multiidioma**: Español e Inglés
- **Cambio dinámico** de idioma sin recargar

### 🎨 Experiencia de Usuario
- **Dark mode** con transiciones suaves
- **Diseño responsive** (Desktop, Tablet, Mobile)
- **Exportación a CSV** de proyectos, equipo, alertas y KPIs
- **Modales y confirmaciones** para acciones críticas
- **Estados de carga y error** con opción de reintento
- **Drill-down interactivo** en gráficos

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Core** | React | 18.3.1 |
| **Lenguaje** | TypeScript | 5.6.2 |
| **Build Tool** | Vite | 5.4.8 |
| **Estilos** | TailwindCSS | 3.4.13 |
| **Estado Global** | Zustand | 4.5.3 |
| **Tablas** | TanStack Table | 8.19.2 |
| **Gráficos** | Recharts | 2.12.7 |
| **Formularios** | React Hook Form + Zod | 7.53.0 / 3.23.8 |
| **Iconos** | Lucide React | 0.462.0 |
| **Mock API** | MSW | 2.4.9 |

## 📋 Requisitos

- **Node.js**: >= 20 (recomendado usar nvm)
- **npm**: >= 9 (incluido con Node.js 20)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd project-pulse
   ```

2. **Usar la versión correcta de Node.js**
   ```bash
   nvm use 20
   # O si no tienes nvm instalado:
   # nvm install 20
   # nvm use 20
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint en el código |
| `npm run format` | Formatea el código con Prettier |
| `npm test` | Ejecuta los tests con Vitest |

## 📁 Estructura del Proyecto

```
project-pulse/
├── src/
│   ├── components/          # Componentes React
│   │   ├── charts/         # Componentes de gráficos
│   │   └── modals/         # Modales reutilizables
│   ├── hooks/              # Custom hooks
│   ├── i18n/               # Configuración de internacionalización
│   │   └── locales/        # Archivos de traducción (en.json, es.json)
│   ├── lib/                 # Utilidades y helpers
│   │   ├── msw/            # Mock Service Worker (API simulada)
│   │   ├── csvExport.ts    # Funciones de exportación
│   │   └── validation.ts  # Esquemas de validación
│   ├── store/              # Estado global (Zustand)
│   ├── styles/            # Estilos globales
│   ├── types/              # Definiciones de TypeScript
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── dist/                    # Build de producción (generado)
├── .nvmrc                  # Versión de Node.js (20)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Funcionalidades Principales

### Dashboard Overview
- **6 KPIs principales** con indicadores de tendencia
- **Comparación de períodos** (actual vs anterior)
- **Gráficos interactivos** con drill-down
- **Visualización de métricas clave**:
  - Throughput (tareas/semana)
  - Cycle Time (días promedio)
  - On-Time Rate (%)
  - Proyectos activos
  - Tareas totales/completadas

### Gestión de Proyectos
- **Vista de tabla** con todas las columnas relevantes
- **Filtros avanzados**:
  - Rango de fechas (semana, mes, trimestre, año)
  - Miembro del equipo
  - Estado (on-track, delayed, blocked)
  - Prioridad (high, medium, low)
- **Búsqueda global** en tiempo real
- **Ordenamiento** por cualquier columna
- **CRUD completo** con validación

### Rendimiento del Equipo
- **Gráfico de barras** comparativo de velocidad
- **Tarjetas individuales** con métricas detalladas
- **Gestión de miembros** (crear, editar, eliminar)

### Exportación de Datos
- **Exportar a CSV**:
  - Proyectos (filtrados)
  - Miembros del equipo
  - Alertas
  - Todos los datos (consolidado)

## 🎨 Temas y Personalización

El proyecto incluye:
- **Dark mode** completo con paleta de colores personalizada
- **Transiciones suaves** entre temas
- **Diseño responsive** optimizado para todos los dispositivos

## 🌍 Internacionalización

El proyecto soporta múltiples idiomas:
- **Español** (es)
- **Inglés** (en)

El idioma se puede cambiar dinámicamente desde el header sin recargar la página.

## 📝 Notas Importantes

### Demo Front-end
Este es un **proyecto demo** que simula una API real usando **MSW (Mock Service Worker)**. Todos los datos son ficticios y se generan dinámicamente. Los cambios realizados (crear, editar, eliminar) se mantienen en memoria durante la sesión pero se pierden al recargar la página.

### Datos Simulados
- Los KPIs y métricas se generan con valores aleatorios dentro de rangos realistas
- Los proyectos y miembros del equipo tienen datos de ejemplo
- Las alertas se generan automáticamente

### Estado de la Aplicación
- El estado se gestiona con **Zustand** (lightweight state management)
- Los datos se "persisten" en memoria durante la sesión
- Al recargar, se vuelven a cargar los datos iniciales del mock

## 🚧 Próximas Mejoras (Roadmap)

- [ ] Autenticación simulada con roles
- [ ] Exportación a PDF
- [ ] Búsqueda global mejorada
- [ ] Filtros guardados/vistas personalizadas
- [ ] Modo presentación (ocultar UI, resaltar gráficos)
- [ ] Atajos de teclado
- [ ] Tests unitarios completos
- [ ] Storybook para documentación de componentes

## 📄 Licencia

Este proyecto es un demo para portafolio. Todos los derechos reservados.

## 👤 Autor

Desarrollado para **Marga Solutions** - Demo de dashboard analítico

---

**Nota**: Este proyecto utiliza Node.js 20. Asegúrate de tener la versión correcta instalada usando `nvm use 20` antes de ejecutar cualquier comando.
