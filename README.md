# Color Picker MCP App

Une application MCP simple qui expose une interface interactive de color picker.

## Architecture

Cette MCP App démontre :
- **Serveur MCP** : Expose un tool `pick_color` avec métadonnées UI
- **Ressource UI** : Interface HTML/JS interactive qui s'affiche dans Claude
- **Communication bidirectionnelle** : L'UI peut mettre à jour le contexte du modèle

## Installation

```bash
npm install
npm run build
```

## Utilisation

### 1. Démarrer le serveur

```bash
npm start
```

### 2. Configurer dans Claude Desktop

Ajoute dans `~/Library/Application Support/Claude/claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "color-picker": {
      "command": "node",
      "args": ["/chemin/vers/color-picker-mcp/dist/index.js"]
    }
  }
}
```

### 3. Utiliser dans Claude

Une fois configuré, tu peux demander à Claude :
- "Open the color picker"
- "Let me choose a color"
- "Pick a color for my website"

L'interface s'affichera directement dans la conversation !

## Structure du projet

```
color-picker-mcp/
├── src/
│   └── index.ts          # Serveur MCP
├── ui/
│   └── color-picker.html # Interface interactive
├── package.json
├── tsconfig.json
└── README.md
```

## Concepts clés MCP Apps

### 1. Tool avec UI metadata

```typescript
{
  name: "pick_color",
  description: "Open interactive color picker",
  _meta: {
    ui: {
      resourceUri: "ui://color-picker"
    }
  }
}
```

### 2. UI Resource

Le serveur sert du HTML via le schéma `ui://` :

```typescript
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === "ui://color-picker") {
    return { contents: [{ uri: request.params.uri, mimeType: "text/html", text: html }] };
  }
});
```

### 3. App API dans l'UI

L'interface utilise `@modelcontextprotocol/ext-apps` :

```javascript
import { App } from "@modelcontextprotocol/ext-apps";

const app = new App();
await app.connect();

// Mettre à jour le contexte du modèle
await app.updateModelContext({
  content: [{ type: "text", text: "User selected #3b82f6" }]
});

// Envoyer un message
await app.sendMessage({
  role: "user", 
  content: [{ type: "text", text: "I've selected the color" }]
});
```

## Étendre cet exemple

Tu peux facilement adapter ce template pour créer :
- 📊 Dashboards de données
- 📝 Formulaires complexes
- 📈 Visualisations interactives
- 🗺️ Cartes interactives
- 📄 Viewers de documents
- ⚙️ Configuration wizards

L'essentiel est que l'UI communique avec le host via `postMessage` et que le serveur MCP déclare correctement les métadonnées UI.

## Sécurité

Les MCP Apps tournent dans des iframes sandboxées avec :
- Permissions restreintes
- Communication JSON-RPC loggable
- Templates HTML pré-déclarés
- Consentement utilisateur possible pour les appels de tools

## Ressources

- [Documentation MCP Apps](https://modelcontextprotocol.io/docs/extensions/apps)
- [SDK ext-apps](https://www.npmjs.com/package/@modelcontextprotocol/ext-apps)
- [Exemples officiels](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples)
