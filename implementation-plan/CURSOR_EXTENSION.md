# CursorFlow - Cursor Extension Specifications

## 🔌 Extension Overview

The CursorFlow extension integrates directly into Cursor IDE, providing seamless PRD generation, v0 integration, and live preview capabilities. This extension enables Product Managers to generate PRDs and create applications without leaving their development environment.

## 🛠️ Technology Stack

### **Core Technologies**
- **Extension Framework**: Cursor Extension API
- **Language**: TypeScript
- **UI Framework**: React (for extension UI)
- **Integration**: v0 SDK
- **State Management**: Zustand
- **Styling**: Tailwind CSS

### **Key Dependencies**
- **v0 SDK**: For code generation and project management
- **OpenAI SDK**: For PRD generation
- **React**: For extension UI components
- **Zod**: For validation
- **Axios**: For HTTP requests

## 🏗️ Extension Architecture

### **Extension Structure**
```
cursorflow-extension/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── commands/             # Command implementations
│   │   ├── prd.ts           # PRD generation commands
│   │   ├── v0.ts            # v0 integration commands
│   │   └── preview.ts       # Live preview commands
│   ├── services/            # Service layer
│   │   ├── openai.service.ts
│   │   ├── v0.service.ts
│   │   └── storage.service.ts
│   ├── ui/                  # Extension UI components
│   │   ├── components/
│   │   ├── panels/
│   │   └── views/
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Core Features

### **1. PRD Generation Commands**

#### **Generate PRD Command**
```typescript
// commands/prd.ts
export class PRDCommands {
  static async generatePRD() {
    const description = await vscode.window.showInputBox({
      prompt: 'Describe your product idea',
      placeHolder: 'e.g., A task management app for remote teams'
    });

    if (!description) return;

    const template = await vscode.window.showQuickPick([
      'Basic PRD',
      'Detailed PRD', 
      'Technical PRD',
      'User Story PRD'
    ], {
      placeHolder: 'Select PRD template'
    });

    if (!template) return;

    try {
      vscode.window.showInformationMessage('Generating PRD...');
      
      const prd = await this.openaiService.generatePRD(description, template);
      const prdContent = this.formatPRD(prd);
      
      // Create new file with PRD content
      const document = await vscode.workspace.openTextDocument({
        content: prdContent,
        language: 'markdown'
      });
      
      await vscode.window.showTextDocument(document);
      
      // Save PRD to storage
      await this.storageService.savePRD(prd);
      
      vscode.window.showInformationMessage('PRD generated successfully!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to generate PRD: ${error.message}`);
    }
  }

  private formatPRD(prd: PRD): string {
    return `# ${prd.title}

## Description
${prd.description}

## Features
${prd.features.map(feature => `- ${feature.name}: ${feature.description}`).join('\n')}

## User Stories
${prd.userStories.map(story => `- **${story.title}**: ${story.description}`).join('\n')}

## Technical Requirements
${prd.technicalRequirements.map(req => `- ${req.requirement}`).join('\n')}
`;
  }
}
```

#### **Export PRD to Web App**
```typescript
export class PRDCommands {
  static async exportPRDToWebApp() {
    const activeDocument = vscode.window.activeTextEditor?.document;
    if (!activeDocument) {
      vscode.window.showErrorMessage('No active document found');
      return;
    }

    try {
      const prdContent = activeDocument.getText();
      const prd = this.parsePRDFromMarkdown(prdContent);
      
      await this.apiService.exportPRD(prd);
      
      // Open web app in browser
      vscode.env.openExternal(vscode.Uri.parse('https://cursorflow.com/prds'));
      
      vscode.window.showInformationMessage('PRD exported to web app successfully!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to export PRD: ${error.message}`);
    }
  }
}
```

### **2. v0 Integration Commands**

#### **Generate Project from PRD**
```typescript
// commands/v0.ts
export class V0Commands {
  static async generateProject() {
    const activeDocument = vscode.window.activeTextEditor?.document;
    if (!activeDocument) {
      vscode.window.showErrorMessage('No PRD document found');
      return;
    }

    const prdContent = activeDocument.getText();
    
    try {
      vscode.window.showInformationMessage('Generating project with v0...');
      
      // Create v0 chat
      const chat = await this.v0Service.createChat(prdContent);
      
      // Generate code
      const code = await this.v0Service.generateCode(chat.chatId, prdContent);
      
      // Create project files
      await this.createProjectFiles(code);
      
      // Show live preview
      await this.showLivePreview(chat.deploymentUrl);
      
      vscode.window.showInformationMessage('Project generated successfully!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to generate project: ${error.message}`);
    }
  }

  private async createProjectFiles(code: V0Code) {
    // Create frontend files
    const frontendDir = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, 'frontend');
    await vscode.workspace.fs.createDirectory(frontendDir);
    
    // Create main component file
    const componentUri = vscode.Uri.joinPath(frontendDir, 'App.tsx');
    await vscode.workspace.fs.writeFile(componentUri, Buffer.from(code.frontend));
    
    // Create styles file
    const stylesUri = vscode.Uri.joinPath(frontendDir, 'styles.css');
    await vscode.workspace.fs.writeFile(stylesUri, Buffer.from(code.styles));
  }
}
```

#### **Pull Latest Code from v0**
```typescript
export class V0Commands {
  static async pullLatestCode() {
    const projectId = await this.getCurrentProjectId();
    if (!projectId) {
      vscode.window.showErrorMessage('No active project found');
      return;
    }

    try {
      vscode.window.showInformationMessage('Pulling latest code...');
      
      const code = await this.v0Service.getLatestCode(projectId);
      
      // Update existing files
      await this.updateProjectFiles(code);
      
      vscode.window.showInformationMessage('Code updated successfully!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to pull code: ${error.message}`);
    }
  }
}
```

### **3. Live Preview Commands**

#### **Show Live Preview**
```typescript
// commands/preview.ts
export class PreviewCommands {
  static async showLivePreview() {
    const deploymentUrl = await this.getCurrentDeploymentUrl();
    if (!deploymentUrl) {
      vscode.window.showErrorMessage('No deployment URL found');
      return;
    }

    // Open preview in Cursor's webview
    const panel = vscode.window.createWebviewPanel(
      'cursorflowPreview',
      'CursorFlow Preview',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    panel.webview.html = this.getPreviewHTML(deploymentUrl);
  }

  private getPreviewHTML(url: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CursorFlow Preview</title>
          <style>
            body { margin: 0; padding: 0; }
            iframe { width: 100%; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${url}" title="Live Preview"></iframe>
        </body>
      </html>
    `;
  }
}
```

## 🎨 Extension UI Components

### **1. PRD Editor Panel**
```typescript
// ui/panels/PRDEditorPanel.tsx
interface PRDEditorPanelProps {
  prd: PRD;
  onSave: (prd: PRD) => void;
  onGenerate: () => void;
}

export const PRDEditorPanel: React.FC<PRDEditorPanelProps> = ({ prd, onSave, onGenerate }) => {
  const [formData, setFormData] = useState(prd);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">PRD Editor</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
          <button 
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={onGenerate}
          >
            Generate Project
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="PRD Title"
          className="w-full p-2 border rounded"
        />
        
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product Description"
          className="w-full p-2 border rounded h-24"
        />
        
        <FeaturesEditor 
          features={formData.features}
          onChange={(features) => setFormData({ ...formData, features })}
        />
      </div>
    </div>
  );
};
```

### **2. Project Status Panel**
```typescript
// ui/panels/ProjectStatusPanel.tsx
interface ProjectStatusPanelProps {
  project: Project;
  onRefresh: () => void;
  onOpenLive: () => void;
}

export const ProjectStatusPanel: React.FC<ProjectStatusPanelProps> = ({ 
  project, 
  onRefresh, 
  onOpenLive 
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Project Status</h2>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-gray-500 text-white rounded"
            onClick={onRefresh}
          >
            Refresh
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={onOpenLive}
          >
            Open Live
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {project.status}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Deployment URL:</span>
          <a 
            href={project.deploymentUrl} 
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            View Live
          </a>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Created:</span>
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
```

## 🔧 Command Palette Integration

### **Registered Commands**
```typescript
// extension.ts
export function activate(context: vscode.ExtensionContext) {
  // PRD Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorflow.generatePRD', PRDCommands.generatePRD)
  );
  
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorflow.exportPRD', PRDCommands.exportPRDToWebApp)
  );
  
  // v0 Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorflow.generateProject', V0Commands.generateProject)
  );
  
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorflow.pullLatestCode', V0Commands.pullLatestCode)
  );
  
  // Preview Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorflow.showPreview', PreviewCommands.showLivePreview)
  );
  
  // Register status bar items
  registerStatusBarItems(context);
}
```

### **Status Bar Items**
```typescript
// utils/statusBar.ts
export function registerStatusBarItems(context: vscode.ExtensionContext) {
  // PRD Status
  const prdStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  prdStatus.text = '$(file-text) PRD';
  prdStatus.tooltip = 'Generate or edit PRD';
  prdStatus.command = 'cursorflow.generatePRD';
  context.subscriptions.push(prdStatus);
  
  // Project Status
  const projectStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
  projectStatus.text = '$(code) Project';
  projectStatus.tooltip = 'Generate project from PRD';
  projectStatus.command = 'cursorflow.generateProject';
  context.subscriptions.push(projectStatus);
  
  // Preview Status
  const previewStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
  previewStatus.text = '$(eye) Preview';
  previewStatus.tooltip = 'Show live preview';
  previewStatus.command = 'cursorflow.showPreview';
  context.subscriptions.push(previewStatus);
}
```

## 🔄 State Management

### **Extension State**
```typescript
// store/extensionStore.ts
interface ExtensionState {
  // Current project state
  currentProject: Project | null;
  currentPRD: PRD | null;
  
  // v0 integration state
  v0ChatId: string | null;
  deploymentUrl: string | null;
  
  // UI state
  isGenerating: boolean;
  isPreviewOpen: boolean;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  setCurrentPRD: (prd: PRD | null) => void;
  setV0ChatId: (chatId: string | null) => void;
  setDeploymentUrl: (url: string | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsPreviewOpen: (open: boolean) => void;
}

export const useExtensionStore = create<ExtensionState>((set) => ({
  currentProject: null,
  currentPRD: null,
  v0ChatId: null,
  deploymentUrl: null,
  isGenerating: false,
  isPreviewOpen: false,
  
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentPRD: (prd) => set({ currentPRD: prd }),
  setV0ChatId: (chatId) => set({ v0ChatId: chatId }),
  setDeploymentUrl: (url) => set({ deploymentUrl: url }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setIsPreviewOpen: (open) => set({ isPreviewOpen: open }),
}));
```

## 🔐 Configuration

### **Extension Settings**
```json
// package.json
{
  "contributes": {
    "configuration": {
      "title": "CursorFlow",
      "properties": {
        "cursorflow.openaiApiKey": {
          "type": "string",
          "default": "",
          "description": "OpenAI API Key for PRD generation"
        },
        "cursorflow.v0ApiKey": {
          "type": "string",
          "default": "",
          "description": "v0 Platform API Key"
        },
        "cursorflow.autoSave": {
          "type": "boolean",
          "default": true,
          "description": "Auto-save PRDs to web app"
        },
        "cursorflow.previewPanel": {
          "type": "string",
          "enum": ["webview", "browser"],
          "default": "webview",
          "description": "Where to show live preview"
        }
      }
    }
  }
}
```

## 🧪 Testing Strategy

### **Unit Tests**
```typescript
// tests/commands/prd.test.ts
describe('PRDCommands', () => {
  beforeEach(() => {
    // Mock vscode API
    jest.mock('vscode');
  });

  describe('generatePRD', () => {
    it('should generate PRD with valid input', async () => {
      const mockShowInputBox = jest.fn().mockResolvedValue('Test product');
      const mockShowQuickPick = jest.fn().mockResolvedValue('Basic PRD');
      
      vscode.window.showInputBox = mockShowInputBox;
      vscode.window.showQuickPick = mockShowQuickPick;
      
      await PRDCommands.generatePRD();
      
      expect(mockShowInputBox).toHaveBeenCalled();
      expect(mockShowQuickPick).toHaveBeenCalled();
    });
  });
});
```

### **Integration Tests**
```typescript
// tests/integration/v0.test.ts
describe('V0 Integration', () => {
  it('should generate project from PRD', async () => {
    const mockPRD = createMockPRD();
    const mockCode = createMockV0Code();
    
    // Mock v0 service
    jest.spyOn(V0Service, 'createChat').mockResolvedValue({ chatId: 'test-chat' });
    jest.spyOn(V0Service, 'generateCode').mockResolvedValue(mockCode);
    
    await V0Commands.generateProject();
    
    expect(V0Service.createChat).toHaveBeenCalled();
    expect(V0Service.generateCode).toHaveBeenCalled();
  });
});
```

## 📦 Packaging & Distribution

### **Extension Manifest**
```json
// package.json
{
  "name": "cursorflow",
  "displayName": "CursorFlow",
  "description": "PRD-to-Code platform integration for Cursor IDE",
  "version": "1.0.0",
  "publisher": "cursorflow",
  "engines": {
    "vscode": "^1.80.0"
  },
  "categories": [
    "Productivity",
    "Other"
  ],
  "activationEvents": [
    "onCommand:cursorflow.generatePRD",
    "onCommand:cursorflow.generateProject",
    "onCommand:cursorflow.showPreview"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "cursorflow.generatePRD",
        "title": "CursorFlow: Generate PRD",
        "category": "CursorFlow"
      },
      {
        "command": "cursorflow.generateProject",
        "title": "CursorFlow: Generate Project",
        "category": "CursorFlow"
      },
      {
        "command": "cursorflow.showPreview",
        "title": "CursorFlow: Show Live Preview",
        "category": "CursorFlow"
      }
    ]
  }
}
```

---

**Next Steps**: Review [`DEPLOYMENT.md`](./DEPLOYMENT.md) for deployment and infrastructure setup and [`TESTING.md`](./TESTING.md) for comprehensive testing strategy. 