import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Element } from '../Canvas/types'; // ajusta el path según tu estructura

export async function exportToAngular(elements: Element[]) {
    const zip = new JSZip();
    const root = zip.folder('angular-export')!;
    const src = root.folder('src')!;
    const app = src.folder('app')!;

    // Archivos raíz
    root.file('package.json', generatePackageJson());
    root.file('angular.json', generateAngularJson());
    root.file('tsconfig.json', generateTsConfig());
    root.file('tsconfig.app.json', generateTsConfigApp());
    src.file('main.ts', generateMainTs());
    src.file('polyfills.ts', `import 'zone.js';`);
    src.file('styles.css', `body { margin: 0; font-family: sans-serif; }`);
    src.file('index.html', generateIndexHtml());

    // App structure
    app.file('app.module.ts', generateAppModule());
    app.file('app.component.ts', generateAppComponent());
    app.file('app.component.html', `<app-canvas></app-canvas>`);
    app.file('app.component.css', ``);

    // Canvas component generado desde los elementos
    const canvas = generateCanvasComponent(elements);
    app.file('canvas.component.ts', canvas.ts);
    app.file('canvas.component.html', canvas.html);
    app.file('canvas.component.css', canvas.css);

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'angular-export.zip');
}

// Aquí van los generadores que conoces: generatePackageJson, generateCanvasComponent, etc.
// Puedes usar los que ya creaste y adaptar `generateCanvasComponent` a tu modelo `Element`

function generateCanvasComponent(elements: Element[]) {
  const html = `
<div class="canvas">
  ${elements.map(el => {
    const id = el.id.replace(/[^a-zA-Z0-9-_]/g, '');
    switch (el.type) {
      case 'rect':
        return `<div class="element rect" id="${id}"></div>`;
      case 'circle':
        return `<div class="element circle" id="${id}"></div>`;
      case 'text':
        return `<p class="element text" id="${id}">${el.text || ''}</p>`;
      case 'line':
        return `<div class="element line" id="${id}"></div>`;
      default:
        return '';
    }
  }).join('\n')}
</div>`;

  const css = `
.canvas {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f9f9f9;
}
${elements.map(el => {
  const id = el.id.replace(/[^a-zA-Z0-9-_]/g, '');
  const common = `
#${id} {
  position: absolute;
  top: ${el.y}px;
  left: ${el.x}px;
  transform: rotate(${el.rotation || 0}deg);
  opacity: ${el.opacity ?? 1};
}`;
  switch (el.type) {
    case 'rect':
      return `${common}
#${id} {
  width: ${el.width}px;
  height: ${el.height}px;
  background-color: ${el.fill};
  border-radius: ${el.cornerRadius ?? 0}px;
}`;
    case 'circle':
      return `${common}
#${id} {
  width: ${el.radius! * 2}px;
  height: ${el.radius! * 2}px;
  background-color: ${el.fill};
  border-radius: 50%;
}`;
    case 'text':
      return `${common}
#${id} {
  width: ${el.width}px;
  height: ${el.height}px;
  font-size: ${el.fontSize || 16}px;
  font-family: ${el.fontFamily || 'sans-serif'};
  color: ${el.fill};
}`;
    case 'line':
      return `${common}
#${id} {
  width: ${el.width || 100}px;
  height: 0;
  border-top: ${el.strokeWidth || 2}px ${el.dash ? 'dashed' : 'solid'} ${el.stroke || '#000'};
}`;
    default:
      return '';
  }
}).join('\n')}
`;

  const ts = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {}
`;

  return {
    html: html.trim(),
    css: css.trim(),
    ts: ts.trim()
  };
}

function generatePackageJson(): string {
    return `{
    "name": "canvas-export",
    "version": "0.0.0",
    "scripts": {
      "ng": "ng",
      "start": "ng serve",
      "build": "ng build"
    },
    "private": true,
    "dependencies": {
      "@angular/animations": "^17.2.0",
      "@angular/common": "^17.2.0",
      "@angular/compiler": "^17.2.0",
      "@angular/core": "^17.2.0",
      "@angular/forms": "^17.2.0",
      "@angular/platform-browser": "^17.2.0",
      "@angular/platform-browser-dynamic": "^17.2.0",
      "@angular/router": "^17.2.0",
      "rxjs": "~7.8.0",
      "tslib": "^2.3.0",
      "zone.js": "~0.14.3"
    },
    "devDependencies": {
      "@angular-devkit/build-angular": "^17.2.0",
      "@angular/cli": "~17.2.0",
      "@angular/compiler-cli": "^17.2.0",
      "@types/node": "^18.0.0",
      "typescript": "~5.2.0"
    }
  }`;
  }
  
  function generateAngularJson(): string {
    return `{
    "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    "version": 1,
    "defaultProject": "canvas-export",
    "projects": {
      "canvas-export": {
        "projectType": "application",
        "root": "",
        "sourceRoot": "src",
        "prefix": "app",
        "architect": {
          "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": {
              "outputPath": "dist/canvas-export",
              "index": "src/index.html",
              "main": "src/main.ts",
              "polyfills": "src/polyfills.ts",
              "tsConfig": "tsconfig.app.json",
              "assets": ["src/favicon.ico", "src/assets"],
              "styles": ["src/styles.css"],
              "scripts": []
            },
            "configurations": {
              "production": {
                "optimization": true,
                "outputHashing": "all",
                "sourceMap": false,
                "extractCss": true,
                "namedChunks": false,
                "aot": true,
                "extractLicenses": true,
                "vendorChunk": false,
                "buildOptimizer": true,
                "fileReplacements": []
              },
              "development": {
                "buildOptimizer": false,
                "optimization": false,
                "vendorChunk": true,
                "extractLicenses": false,
                "sourceMap": true,
                "namedChunks": true
              }
            },
            "defaultConfiguration": "production"
          },
          "serve": {
            "builder": "@angular-devkit/build-angular:dev-server",
            "configurations": {
              "production": {
                "browserTarget": "canvas-export:build:production"
              },
              "development": {
                "browserTarget": "canvas-export:build:development"
              }
            },
            "defaultConfiguration": "development"
          }
        }
      }
    }
  }`;
  }
  
  function generateTsConfig(): string {
    return `{
    "compileOnSave": false,
    "compilerOptions": {
      "baseUrl": "./",
      "outDir": "./dist/out-tsc",
      "strict": true,
      "sourceMap": true,
      "experimentalDecorators": true,
      "moduleResolution": "node",
      "target": "ES2022",
      "module": "ES2022",
      "lib": ["ES2022", "dom"]
    }
  }`;
  }
  
  function generateTsConfigApp(): string {
    return `{
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/app",
      "types": []
    },
    "files": ["src/main.ts", "src/polyfills.ts"],
    "include": ["src/**/*.d.ts"]
  }`;
  }
  
  function generateMainTs(): string {
    return `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
  import { AppModule } from './app/app.module';
  
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));`;
  }
  
  function generateIndexHtml(): string {
    return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Canvas Export</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <app-root></app-root>
  </body>
  </html>`;
  }
  
  function generateAppModule(): string {
    return `import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { CanvasComponent } from './canvas.component';
  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [AppComponent, CanvasComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}`;
  }
  
  function generateAppComponent(): string {
    return `import { Component } from '@angular/core';
  
  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {}`;
  }

  