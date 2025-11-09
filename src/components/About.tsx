import { 
  Code2, 
  Zap, 
  Target, 
  Layers, 
  CheckCircle2, 
  Package, 
  Globe,
  BarChart3,
  Users,
  Bell,
  Download,
  FolderKanban
} from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { useDarkMode } from '../hooks/useDarkMode';

export function About() {
  const { t } = useI18n();
  const { isDark } = useDarkMode();

  const features = [
    {
      icon: BarChart3,
      title: t('about.features.dashboard.title'),
      description: t('about.features.dashboard.description'),
    },
    {
      icon: FolderKanban,
      title: t('about.features.projects.title'),
      description: t('about.features.projects.description'),
    },
    {
      icon: Users,
      title: t('about.features.team.title'),
      description: t('about.features.team.description'),
    },
    {
      icon: Bell,
      title: t('about.features.alerts.title'),
      description: t('about.features.alerts.description'),
    },
    {
      icon: Globe,
      title: t('about.features.i18n.title'),
      description: t('about.features.i18n.description'),
    },
    {
      icon: Download,
      title: t('about.features.export.title'),
      description: t('about.features.export.description'),
    },
  ];

  const techStack = [
    { name: 'React', version: '18.3.1', category: t('about.tech.core') },
    { name: 'TypeScript', version: '5.6.2', category: t('about.tech.language') },
    { name: 'Vite', version: '5.4.8', category: t('about.tech.build') },
    { name: 'TailwindCSS', version: '3.4.13', category: t('about.tech.styles') },
    { name: 'Zustand', version: '4.5.3', category: t('about.tech.state') },
    { name: 'TanStack Table', version: '8.19.2', category: t('about.tech.tables') },
    { name: 'Recharts', version: '2.12.7', category: t('about.tech.charts') },
    { name: 'React Hook Form', version: '7.53.0', category: t('about.tech.forms') },
    { name: 'Zod', version: '3.23.8', category: t('about.tech.validation') },
    { name: 'MSW', version: '2.4.9', category: t('about.tech.mock') },
    { name: 'Lucide React', version: '0.462.0', category: t('about.tech.icons') },
    { name: 'Vitest', version: '2.1.3', category: t('about.tech.testing') },
  ];

  const goals = [
    t('about.goals.performance'),
    t('about.goals.scalability'),
    t('about.goals.maintainability'),
    t('about.goals.userExperience'),
    t('about.goals.codeQuality'),
    t('about.goals.accessibility'),
  ];

  const architecture = [
    { title: t('about.architecture.component.title'), description: t('about.architecture.component.description') },
    { title: t('about.architecture.state.title'), description: t('about.architecture.state.description') },
    { title: t('about.architecture.styling.title'), description: t('about.architecture.styling.description') },
    { title: t('about.architecture.i18n.title'), description: t('about.architecture.i18n.description') },
    { title: t('about.architecture.testing.title'), description: t('about.architecture.testing.description') },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-2xl shadow-sm p-8 border border-border dark:border-border-dark">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary-dark/10">
            <Code2 className="w-8 h-8 text-primary dark:text-primary-dark" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              {t('about.hero.title')}
            </h1>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark mb-4">
              {t('about.hero.subtitle')}
            </p>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              {t('about.hero.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary dark:text-primary-dark" />
          {t('about.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-bg-panel dark:bg-bg-panel-dark rounded-xl p-6 border border-border dark:border-border-dark hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary-dark/10">
                    <Icon className="w-5 h-5 text-primary dark:text-primary-dark" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary dark:text-primary-dark" />
          {t('about.tech.title')}
        </h2>
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-xl p-6 border border-border dark:border-border-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-base dark:bg-bg-base-dark border border-border dark:border-border-dark"
              >
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    {tech.name}
                  </div>
                  <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {tech.category}
                  </div>
                </div>
                <div className="text-sm font-mono text-primary dark:text-primary-dark">
                  v{tech.version}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary dark:text-primary-dark" />
          {t('about.goals.title')}
        </h2>
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-xl p-6 border border-border dark:border-border-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success dark:text-success-dark mt-0.5 flex-shrink-0" />
                <p className="text-text-secondary dark:text-text-secondary-dark">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary dark:text-primary-dark" />
          {t('about.architecture.title')}
        </h2>
        <div className="space-y-4">
          {architecture.map((item, index) => (
            <div
              key={index}
              className="bg-bg-panel dark:bg-bg-panel-dark rounded-xl p-6 border border-border dark:border-border-dark"
            >
              <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                {item.title}
              </h3>
              <p className="text-text-secondary dark:text-text-secondary-dark">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-primary dark:text-primary-dark" />
          {t('about.practices.title')}
        </h2>
        <div className="bg-bg-panel dark:bg-bg-panel-dark rounded-xl p-6 border border-border dark:border-border-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                {t('about.practices.code.title')}
              </h3>
              <ul className="space-y-1 text-sm text-text-secondary dark:text-text-secondary-dark">
                <li>• {t('about.practices.code.typeScript')}</li>
                <li>• {t('about.practices.code.eslint')}</li>
                <li>• {t('about.practices.code.prettier')}</li>
                <li>• {t('about.practices.code.strict')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                {t('about.practices.performance.title')}
              </h3>
              <ul className="space-y-1 text-sm text-text-secondary dark:text-text-secondary-dark">
                <li>• {t('about.practices.performance.memoization')}</li>
                <li>• {t('about.practices.performance.lazy')}</li>
                <li>• {t('about.practices.performance.optimization')}</li>
                <li>• {t('about.practices.performance.bundle')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                {t('about.practices.ux.title')}
              </h3>
              <ul className="space-y-1 text-sm text-text-secondary dark:text-text-secondary-dark">
                <li>• {t('about.practices.ux.responsive')}</li>
                <li>• {t('about.practices.ux.darkMode')}</li>
                <li>• {t('about.practices.ux.loading')}</li>
                <li>• {t('about.practices.ux.feedback')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                {t('about.practices.maintainability.title')}
              </h3>
              <ul className="space-y-1 text-sm text-text-secondary dark:text-text-secondary-dark">
                <li>• {t('about.practices.maintainability.modular')}</li>
                <li>• {t('about.practices.maintainability.reusable')}</li>
                <li>• {t('about.practices.maintainability.documented')}</li>
                <li>• {t('about.practices.maintainability.tested')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

