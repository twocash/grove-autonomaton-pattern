# Architecture — foundry-template-v1

## Target State

```
src/config/
├── foundry-template.ts      ← NEW (replaces hero-prompts.ts)
├── prompts.schema.ts        ← MODIFY (add template_recognition block)
├── hero-prompts.ts          ← DELETE
└── ...

src/components/Foundry/
├── FoundryPane.tsx           ← MODIFY (replace hero prompt button with template buttons)
└── index.ts

docs/
├── foundry-requirements-template.md  ← NEW (reference doc committed to repo)
```

## Data Flow

```
User clicks "Load Example"
    ↓
FoundryPane calls loadSignalWatchTemplate()
    ↓
Reads SIGNAL_WATCH_TEMPLATE from foundry-template.ts
    ↓
dispatch({ type: 'SET_FOUNDRY_INPUT', input: templateText })
    ↓
Textarea populates with ~400 lines of structured requirements
    ↓
User clicks "Compile Architecture →"
    ↓
compileArchitecture() sends to Tier 3 API
    ↓
prompts.schema.ts pipeline includes template_recognition block
    ↓
Tier 3 model detects section markers, maps sections to Manifesto output
    ↓
Streaming output renders Sovereign Manifesto
    ↓
User clicks "Download Sovereign Manifesto (.html)"
```
