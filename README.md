# 📊 Project Pulse

> **Project Analytics Dashboard** - Front-end demo for visualizing metrics and team performance

Project Pulse is an interactive dashboard designed for teams that need to visualize their project performance in real-time. It offers a consolidated view of operational status: progress, team efficiency, delivery times, risks, and overall performance.

## ✨ Features

### 📈 Dashboard and Metrics
- **Real-time KPIs** with trend indicators (↑↓)
- **Period comparison** to analyze improvements or regressions
- **6 types of interactive charts**:
  - Monthly velocity
  - Completion rate
  - Backlog growth
  - Weekly trends
  - Task status distribution
  - Team workload

### 🎯 Project Management
- **Interactive table** with advanced filters
- **Full CRUD** (Create, Read, Update, Delete)
- **Search and sorting** by columns
- **Filters by**: date, team, status, priority

### 👥 Team Performance
- **Comparative visualization** of team members
- **Individual metrics**: velocity, compliance, productivity
- **Team member CRUD**

### 🔔 Alert System
- **Real-time notifications** of risks and events
- **Categorization** by type (warning, error, info)
- **Relative timestamps** (X minutes/hours/days ago)

### 🌐 Internationalization
- **Multi-language support**: Spanish and English
- **Dynamic language switching** without reloading

### 🎨 User Experience
- **Dark mode** with smooth transitions
- **Responsive design** (Desktop, Tablet, Mobile)
- **CSV export** of projects, team, alerts, and KPIs
- **Modals and confirmations** for critical actions
- **Loading and error states** with retry option
- **Interactive drill-down** in charts

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Core** | React | 18.3.1 |
| **Language** | TypeScript | 5.6.2 |
| **Build Tool** | Vite | 5.4.8 |
| **Styles** | TailwindCSS | 3.4.13 |
| **Global State** | Zustand | 4.5.3 |
| **Tables** | TanStack Table | 8.19.2 |
| **Charts** | Recharts | 2.12.7 |
| **Forms** | React Hook Form + Zod | 7.53.0 / 3.23.8 |
| **Icons** | Lucide React | 0.462.0 |
| **Mock API** | MSW | 2.4.9 |

## 📋 Requirements

- **Node.js**: >= 20 (recommended to use nvm)
- **npm**: >= 9 (included with Node.js 20)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-pulse
   ```

2. **Use the correct Node.js version**
   ```bash
   nvm use 20
   # Or if you don't have nvm installed:
   # nvm install 20
   # nvm use 20
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with HMR |
| `npm run build` | Builds the project for production |
| `npm run preview` | Previews the production build |
| `npm run lint` | Runs ESLint on the code |
| `npm run format` | Formats the code with Prettier |
| `npm test` | Runs tests with Vitest |

## 📁 Project Structure

```
project-pulse/
├── src/
│   ├── components/          # React components
│   │   ├── charts/         # Chart components
│   │   └── modals/         # Reusable modals
│   ├── hooks/              # Custom hooks
│   ├── i18n/               # Internationalization configuration
│   │   └── locales/        # Translation files (en.json, es.json)
│   ├── lib/                 # Utilities and helpers
│   │   ├── msw/            # Mock Service Worker (simulated API)
│   │   ├── csvExport.ts    # Export functions
│   │   └── validation.ts  # Validation schemas
│   ├── store/              # Global state (Zustand)
│   ├── styles/            # Global styles
│   ├── types/              # TypeScript definitions
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── dist/                    # Production build (generated)
├── .nvmrc                  # Node.js version (20)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Main Features

### Dashboard Overview
- **6 main KPIs** with trend indicators
- **Period comparison** (current vs previous)
- **Interactive charts** with drill-down
- **Key metrics visualization**:
  - Throughput (tasks/week)
  - Cycle Time (average days)
  - On-Time Rate (%)
  - Active projects
  - Total/completed tasks

### Project Management
- **Table view** with all relevant columns
- **Advanced filters**:
  - Date range (week, month, quarter, year)
  - Team member
  - Status (on-track, delayed, blocked)
  - Priority (high, medium, low)
- **Real-time global search**
- **Sorting** by any column
- **Full CRUD** with validation

### Team Performance
- **Comparative bar chart** of velocity
- **Individual cards** with detailed metrics
- **Member management** (create, edit, delete)

### Data Export
- **Export to CSV**:
  - Projects (filtered)
  - Team members
  - Alerts
  - All data (consolidated)

## 🎨 Themes and Customization

The project includes:
- **Complete dark mode** with custom color palette
- **Smooth transitions** between themes
- **Responsive design** optimized for all devices

## 🌍 Internationalization

The project supports multiple languages:
- **Spanish** (es)
- **English** (en)

The language can be changed dynamically from the header without reloading the page.

## 📝 Important Notes

### Front-end Demo
This is a **demo project** that simulates a real API using **MSW (Mock Service Worker)**. All data is fictional and generated dynamically. Changes made (create, edit, delete) are maintained in memory during the session but are lost when reloading the page.

### Simulated Data
- KPIs and metrics are generated with random values within realistic ranges
- Projects and team members have example data
- Alerts are generated automatically

### Application State
- State is managed with **Zustand** (lightweight state management)
- Data is "persisted" in memory during the session
- On reload, initial mock data is loaded again

## 🚧 Upcoming Improvements (Roadmap)

- [ ] Simulated authentication with roles
- [ ] PDF export
- [ ] Enhanced global search
- [ ] Saved filters/custom views
- [ ] Presentation mode (hide UI, highlight charts)
- [ ] Keyboard shortcuts
- [ ] Complete unit tests
- [ ] Storybook for component documentation

## 📄 License

This project is a portfolio demo. All rights reserved.

## 👤 Author

Developed for **Marga Solutions** - Analytics dashboard demo

---

**Note**: This project uses Node.js 20. Make sure you have the correct version installed using `nvm use 20` before running any command.
