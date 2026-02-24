# QA Automation Framework

Framework de automatización de pruebas completo con **UI (Playwright)** y **API (Jest + Axios)**, implementando buenas prácticas de la industria.

---

## 📁 Estructura del proyecto

```
qa-automation-framework/
├── .github/workflows/       # CI/CD con GitHub Actions
│   └── ci.yml
├── config/
│   └── env.ts               # Variables de entorno centralizadas
├── fixtures/
│   ├── ui.fixtures.ts       # Datos de prueba para UI
│   └── api.fixtures.ts      # Datos de prueba para API
├── pages/                   # Page Object Model (POM)
│   ├── login.page.ts
│   ├── admin-users.page.ts
│   └── add-user.page.ts
├── utils/
│   ├── api.client.ts        # HTTP client wrapper (Axios)
│   ├── order.service.ts     # Capa de servicio para Orders API
│   └── ui.helpers.ts        # Helpers compartidos para tests UI
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts
│   │   ├── admin-users.spec.ts
│   │   └── create-user.spec.ts
│   └── api/
│       └── store-orders.spec.ts
├── playwright.config.ts
├── jest.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🚀 Instalación

### Requisitos previos
- Node.js ≥ 18
- npm ≥ 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/qa-automation-framework.git
cd qa-automation-framework

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install --with-deps

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario (los defaults ya funcionan con los demo sites)
```

---

## ▶️ Ejecución de pruebas

### Todos los tests
```bash
npm run test:all
```

### Solo API (Jest)
```bash
npm run test:api
```

### Solo UI (Playwright) – headless
```bash
npm run test:ui
```

### UI con navegador visible
```bash
npm run test:ui:headed
```

### UI en paralelo (4 workers)
```bash
npm run test:ui:parallel
```

### Ver reporte HTML de Playwright
```bash
npm run report
```

---

## 🧪 Escenarios implementados

### Opción A – UI (OrangeHRM)

| ID | Suite | Descripción |
|----|-------|-------------|
| TC-L01 | Login | Login exitoso con credenciales válidas |
| TC-L02 | Login | Login fallido muestra "Invalid credentials" |
| TC-L03 | Login | Contraseña incorrecta muestra error |
| TC-L04 | Login | Submit vacío muestra validaciones "Required" |
| TC-L05 | Login | Recuperación tras error, login exitoso |
| TC-AU01 | Usuarios | Filtro por rol Admin retorna solo Admins |
| TC-AU02 | Usuarios | Filtro por rol ESS retorna solo ESS |
| TC-AU03 | Usuarios | Botones Editar/Eliminar presentes en cada fila |
| TC-AU04 | Usuarios | Reset limpia filtros |
| TC-AU05 | Usuarios | Click en Editar navega a página de edición |
| TC-CU01 | Crear Usuario | Formulario vacío muestra errores Required |
| TC-CU02 | Crear Usuario | Contraseñas distintas muestran mismatch error |
| TC-CU03 | Crear Usuario | Username muy corto muestra error de longitud |
| TC-CU04 | Crear Usuario | Creación exitosa y verificación en búsqueda |
| TC-CU05 | Crear Usuario | Cancel no guarda y vuelve a la lista |

### Opción B – API (Petstore)

| ID | Suite | Descripción |
|----|-------|-------------|
| TC-API-01 | GET Order | HTTP 200 para orden existente |
| TC-API-02 | GET Order | Validación de schema de respuesta |
| TC-API-03 | GET Order | HTTP 404 para orden inexistente |
| TC-API-04 | GET Order | Status coincide con el creado |
| TC-API-05 | POST Order | Crear orden retorna HTTP 200 |
| TC-API-06 | POST Order | ID asignado es numérico y > 0 |
| TC-API-07 | POST Order | petId y quantity reflejados en respuesta |
| TC-API-08 | POST Order | Status "placed" reflejado |
| TC-API-09 | POST Order | Flag complete reflejado |
| TC-API-10 | DELETE Order | Eliminar orden existente retorna HTTP 200 |
| TC-API-11 | DELETE Order | Orden eliminada no es recuperable (HTTP 404) |
| TC-API-12 | DELETE Order | Eliminar orden inexistente retorna HTTP 404 |
| TC-API-13 | Inventory | GET inventory retorna HTTP 200 (bonus) |
| TC-API-14 | Inventory | Inventory es mapa string→number (bonus) |

---

## 🏗️ Decisiones técnicas

### Lenguaje: TypeScript
Tipado estático mejora el mantenimiento, el autocompletado en IDEs y la documentación implícita del código.

### UI: Playwright
- **Multi-browser nativo**: Chromium, Firefox y WebKit desde la misma API.
- **Auto-wait**: Elimina sleeps explícitos; Playwright espera que los elementos sean actionable.
- **Traces y screenshots automáticos** en fallos, sin configuración adicional.
- **Paralelismo**: Los tests se ejecutan en paralelo por defecto.

### API: Jest + Axios
- **Jest** ofrece `describe/beforeAll/beforeEach` para orquestar estado compartido sin acoplamiento entre tests.
- **Axios** permite interceptors para logging centralizado de requests/responses.
- La capa `OrderService` abstrae las llamadas HTTP, separando la lógica de negocio de la infraestructura HTTP.

### Page Object Model (POM)
Cada pantalla tiene su propia clase con locators y acciones encapsuladas. Los tests solo llaman métodos de alto nivel (`fillForm`, `save`, `expectLoginError`), no interactúan con locators directamente.

### Datos de prueba externos
Los fixtures (`fixtures/*.ts`) están separados de los tests. Usar `Date.now()` en usernames garantiza unicidad en cada ejecución.

### CI/CD
- **Matrix strategy**: Los tests de UI corren en parallel en los 3 browsers.
- **Artefactos**: Los reportes HTML y el coverage se guardan como artifacts.
- **Schedule diario**: Smoke test automático a las 06:00 UTC.

---

## 📊 Evidencia de ejecución

Los reportes se generan automáticamente:
- **Playwright**: `playwright-report/index.html` — abrir con `npm run report`
- **Jest**: `coverage/lcov-report/index.html`
- **CI**: Los artifacts de GitHub Actions contienen los reportes de cada browser.
