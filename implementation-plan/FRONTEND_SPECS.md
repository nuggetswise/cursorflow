# CursorFlow - Frontend Specifications

## 🎨 Frontend Overview

The CursorFlow frontend is a React/Next.js application deployed on Vercel, providing a seamless web interface for Product Managers to manage PRDs, generate applications, and analyze code.

## 🛠️ Technology Stack

### **Core Technologies**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

### **Key Libraries**
- **UI Components**: Shadcn/ui, Lucide React icons
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts for analytics
- **Code Highlighting**: Prism.js
- **Notifications**: Sonner

## 📱 Page Structure

### **1. Authentication Pages**
```
/auth
├── /login
├── /register
├── /forgot-password
└── /reset-password
```

### **2. Dashboard Pages**
```
/dashboard
├── /overview
├── /prds
├── /projects
├── /analytics
└── /settings
```

### **3. PRD Management Pages**
```
/prds
├── /new
├── /[id]
├── /[id]/edit
└── /[id]/export
```

### **4. Project Management Pages**
```
/projects
├── /new
├── /[id]
├── /[id]/preview
├── /[id]/versions
└── /[id]/analysis
```

## 🎯 Core Components

### **1. Layout Components**

#### **MainLayout**
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
```

#### **Header Component**
```typescript
const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          <Navigation />
        </div>
        <div className="flex items-center space-x-4">
          <UserMenu />
          <Notifications />
        </div>
      </div>
    </header>
  );
};
```

#### **Sidebar Component**
```typescript
const Sidebar: React.FC = () => {
  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'PRDs', icon: FileText, href: '/prds' },
    { label: 'Projects', icon: Code, href: '/projects' },
    { label: 'Analytics', icon: BarChart, href: '/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
};
```

### **2. PRD Components**

#### **PRDEditor**
```typescript
interface PRDEditorProps {
  prd: PRD;
  onSave: (prd: PRD) => void;
  onGenerate: () => void;
}

const PRDEditor: React.FC<PRDEditorProps> = ({ prd, onSave, onGenerate }) => {
  const [formData, setFormData] = useState(prd);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit PRD</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onSave(formData)}>
            Save Draft
          </Button>
          <Button onClick={onGenerate}>
            Generate Project
          </Button>
        </div>
      </div>
      
      <PRDForm data={formData} onChange={setFormData} />
    </div>
  );
};
```

#### **PRDForm**
```typescript
interface PRDFormProps {
  data: PRD;
  onChange: (data: PRD) => void;
}

const PRDForm: React.FC<PRDFormProps> = ({ data, onChange }) => {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Title"
          value={data.title}
          onChange={(value) => onChange({ ...data, title: value })}
        />
        <FormField
          label="Template"
          type="select"
          options={['basic', 'detailed', 'technical', 'user-story']}
          value={data.template}
          onChange={(value) => onChange({ ...data, template: value })}
        />
      </div>
      
      <FormField
        label="Description"
        type="textarea"
        value={data.description}
        onChange={(value) => onChange({ ...data, description: value })}
      />
      
      <FeaturesEditor
        features={data.features}
        onChange={(features) => onChange({ ...data, features })}
      />
      
      <UserStoriesEditor
        userStories={data.userStories}
        onChange={(userStories) => onChange({ ...data, userStories })}
      />
    </form>
  );
};
```

### **3. Project Components**

#### **ProjectCard**
```typescript
interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <StatusBadge status={project.status} />
            <span className="text-sm text-gray-500">
              {formatDate(project.createdAt)}
            </span>
          </div>
        </div>
        <ProjectMenu onView={() => onView(project.id)} onEdit={() => onEdit(project.id)} onDelete={() => onDelete(project.id)} />
      </div>
    </div>
  );
};
```

#### **ProjectPreview**
```typescript
interface ProjectPreviewProps {
  project: Project;
  onRefresh: () => void;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, onRefresh }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Preview</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => window.open(project.deploymentUrl, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Live
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <iframe
          src={project.deploymentUrl}
          className="w-full h-96 border-0"
          title="Project Preview"
        />
      </div>
    </div>
  );
};
```

### **4. AI Design Critique Components**

#### **AuditDashboard**
```typescript
interface AuditDashboardProps {
  projectId: string;
  deploymentUrl: string;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ projectId, deploymentUrl }) => {
  const [audit, setAudit] = useState<DesignAudit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auditType, setAuditType] = useState<AuditType>('full');

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/audit/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: deploymentUrl, projectId, auditType })
      });
      const data = await response.json();
      setAudit(data.audit);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Design Critique</h2>
        <div className="flex space-x-2">
          <Select value={auditType} onValueChange={setAuditType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Audit</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="accessibility">Accessibility</SelectItem>
              <SelectItem value="copy">Copy Analysis</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runAudit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Run Audit
              </>
            )}
          </Button>
        </div>
      </div>

      {audit && <AuditResults audit={audit} />}
    </div>
  );
};
```

#### **AuditResults**
```typescript
interface AuditResultsProps {
  audit: DesignAudit;
}

const AuditResults: React.FC<AuditResultsProps> = ({ audit }) => {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard
          title="Headline Grade"
          score={audit.headlineGrade}
          maxScore={10}
          description="Copy clarity and impact"
          color="blue"
        />
        <ScoreCard
          title="Performance"
          score={audit.performanceScore}
          maxScore={100}
          description="Page load and interaction speed"
          color="green"
        />
        <ScoreCard
          title="Accessibility"
          score={100 - (audit.accessibilityViolations.length * 10)}
          maxScore={100}
          description="WCAG compliance score"
          color="purple"
        />
      </div>

      {/* Friction Points */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Friction Points</h3>
        <div className="space-y-3">
          {audit.frictionPoints.map((point, index) => (
            <FrictionPointCard key={index} point={point} />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Actionable Suggestions</h3>
        <div className="space-y-3">
          {audit.suggestions.map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### **ScoreCard**
```typescript
interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, maxScore, description, color }) => {
  const percentage = (score / maxScore) * 100;
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  };

  return (
    <div className={`bg-white rounded-lg border ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{score}</div>
          <div className="text-xs text-gray-600">/ {maxScore}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              color === 'blue' ? 'bg-blue-500' :
              color === 'green' ? 'bg-green-500' :
              color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
```

#### **FrictionPointCard**
```typescript
interface FrictionPointCardProps {
  point: FrictionPoint;
}

const FrictionPointCard: React.FC<FrictionPointCardProps> = ({ point }) => {
  const severityColors = {
    low: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    medium: 'bg-orange-50 border-orange-200 text-orange-700',
    high: 'bg-red-50 border-red-200 text-red-700',
    critical: 'bg-red-100 border-red-300 text-red-800'
  };

  return (
    <div className={`border rounded-lg p-4 ${severityColors[point.severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium capitalize">{point.type}</span>
            <Badge variant={point.severity}>{point.severity}</Badge>
          </div>
          <p className="text-sm mb-2">{point.description}</p>
          <p className="text-xs text-gray-600">Location: {point.location}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
        <p className="text-sm font-medium">Suggestion:</p>
        <p className="text-sm">{point.suggestion}</p>
      </div>
    </div>
  );
};
```

#### **SuggestionCard**
```typescript
interface SuggestionCardProps {
  suggestion: AuditSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const priorityColors = {
    low: 'border-l-4 border-l-gray-300',
    medium: 'border-l-4 border-l-blue-300',
    high: 'border-l-4 border-l-orange-300',
    critical: 'border-l-4 border-l-red-300'
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${priorityColors[suggestion.priority]}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{suggestion.title}</h4>
        <Badge variant={suggestion.priority}>{suggestion.priority}</Badge>
      </div>
      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-500">Implementation:</p>
          <p className="text-sm">{suggestion.implementation}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Estimated Impact:</p>
          <p className="text-sm">{suggestion.estimatedImpact}</p>
        </div>
      </div>
    </div>
  );
};
```

### **5. Analytics Components**

#### **AnalyticsDashboard**
```typescript
const AnalyticsDashboard: React.FC = () => {
  const { data: analytics } = useQuery(['analytics'], fetchAnalytics);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="PRDs Created"
          value={analytics?.prdsCreated || 0}
          change={analytics?.prdsChange || 0}
          icon={FileText}
        />
        <MetricCard
          title="Projects Generated"
          value={analytics?.projectsGenerated || 0}
          change={analytics?.projectsChange || 0}
          icon={Code}
        />
        <MetricCard
          title="Success Rate"
          value={`${analytics?.successRate || 0}%`}
          change={analytics?.successRateChange || 0}
          icon={TrendingUp}
        />
        <MetricCard
          title="Active Users"
          value={analytics?.activeUsers || 0}
          change={analytics?.activeUsersChange || 0}
          icon={Users}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="PRD Creation Trend">
          <LineChart data={analytics?.prdTrend || []} />
        </ChartCard>
        <ChartCard title="Project Generation Trend">
          <LineChart data={analytics?.projectTrend || []} />
        </ChartCard>
      </div>
    </div>
  );
};
```

## 🎨 Design System

### **Color Palette**
```css
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --secondary: #64748b;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --background: #f8fafc;
  --surface: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border: #e2e8f0;
}
```

### **Typography**
```css
.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

.font-body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
```

### **Spacing Scale**
```css
.space-xs { gap: 0.25rem; }
.space-sm { gap: 0.5rem; }
.space-md { gap: 1rem; }
.space-lg { gap: 1.5rem; }
.space-xl { gap: 2rem; }
.space-2xl { gap: 3rem; }
```

## 📱 Responsive Design

### **Breakpoints**
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### **Mobile Considerations**
- Touch-friendly button sizes (min 44px)
- Swipe gestures for navigation
- Collapsible sidebar on mobile
- Optimized form inputs for mobile keyboards

## 🔄 State Management

### **Zustand Store Structure**
```typescript
interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // PRD state
  prds: PRD[];
  currentPRD: PRD | null;
  prdLoading: boolean;
  
  // Project state
  projects: Project[];
  currentProject: Project | null;
  projectLoading: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setUser: (user: User | null) => void;
  setPRDs: (prds: PRD[]) => void;
  setProjects: (projects: Project[]) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

## 🚀 Performance Optimizations

### **Code Splitting**
- Route-based code splitting with Next.js
- Component-level lazy loading
- Dynamic imports for heavy components

### **Caching Strategy**
- React Query for API caching
- Static generation for marketing pages
- Service worker for offline support

### **Bundle Optimization**
- Tree shaking for unused code
- Image optimization with Next.js Image
- Font optimization with next/font

## 🧪 Testing Strategy

### **Unit Tests**
- Component testing with React Testing Library
- Utility function testing with Jest
- Custom hook testing

### **Integration Tests**
- API integration testing
- Form submission testing
- Authentication flow testing

### **E2E Tests**
- Critical user journey testing
- Cross-browser compatibility
- Mobile responsiveness testing

## 📊 Analytics & Monitoring

### **User Analytics**
- Page view tracking
- User interaction tracking
- Conversion funnel analysis

### **Performance Monitoring**
- Core Web Vitals tracking
- Error tracking with Sentry
- Real User Monitoring (RUM)

---

**Next Steps**: Review [`BACKEND_SPECS.md`](./BACKEND_SPECS.md) for backend implementation details and [`CURSOR_EXTENSION.md`](./CURSOR_EXTENSION.md) for Cursor IDE extension development. 