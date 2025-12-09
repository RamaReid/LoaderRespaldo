# GD Arquitectura — Copilot Instructions

## Architecture Snapshot
- `index.html` mantiene tres capas: loader narrativo (SVG A en `#loader-container`), logo estático de transición (SVG B en `#logo-transition-container`) y la aplicación real dentro de `.gd-app`.
- CSS se divide entre tokens/base (`css/style.css`), layout utilitario (`css/layout.css`), módulos (`css/header.css`, `css/home.css`), animaciones del loader (`css/loader.css`) y transición (`css/transition.css`).
- JS está orquestado en `js/loader.js` (loop SVG), `js/transition.js` (lift → drop → radial reveal) y placeholders `js/header.js`, `js/home.js`; no hay bundler, se carga directo desde HTML.

## Visual System & Assets
- Paleta obligatoria en `GD-DESIGN-SYSTEM.md`: fondo #121212/#1A1A1A, D azul #2A41C8/#324DDD, G roja #FF0009, líneas #C4C3C4, highlights #FFFFFF; cualquier nuevo estilo debe salir de esas vars en `:root` de `css/style.css`.
- `context/copilot-readme.md` refuerza que todo debe verse sobrio, técnico y racionalista; evita fondos claros, degradados improvisados o animaciones agresivas.
- `GDanimado.html` es el prototipo narrativo; prueba cambios complejos allí y luego replica los `@keyframes` definitivos en `css/loader.css` para no romper la fuente de verdad.

## Loader Loop (SVG A)
- El SVG va inline para que los `mask` y `stroke-dashoffset` definidos en CSS reaccionen; no conviertas a `<img>` ni a `object`.
- `js/loader.js` escucha `animationend` en `.str5` y clona el SVG para reiniciar el ciclo; si cambias la secuencia conserva esa clase para el último trazo.
- `css/style.css` reduce el logo al 35 % vía `--gd-logo-width`; si necesitas otro tamaño, ajusta la variable en vez de escalar manualmente el SVG.

## Transition Orchestrator (SVG B + Radial Reveal)
- `js/transition.js` espera `document.readyState === "complete"` y al menos dos ciclos del loader antes de cortar el loop y mostrar el logo estático.
- El handshake se hace con la global `detenerLoop`; cualquier script nuevo que pare el loader debe respetar esa bandera para no desincronizarse.
- Agrega `#preview` al hash de la URL para saltar el loader (útil en desarrollo); el script simula dos ciclos y arranca la transición inmediatamente.
- `startRadialReveal` anima `#background-overlay` usando `#radialMaskSVG`; recalcula el centro con `obtenerCentroLogo()`, así que conserva `#logo-transition-container` visible durante la secuencia.

## App Shell & Header/Home
- `.gd-app` permanece oculta hasta que `transition.js` resuelve la promesa del radial reveal y aplica `body.app-ready`; nuevas vistas deben engancharse a ese evento o al `MutationObserver` que prefieras.
- `css/header.css` y `css/home.css` asumen que el header es sticky y que las secciones usan la clase `.section`; respeta esa semántica para no romper los clips y gradientes.
- El menú móvil actual vive inline en `index.html` (nav toggle con `aria-expanded`); si migras esa lógica, mantén el mismo API para que los estilos sigan funcionando.

## Hero Revista Module
- `hero-revista/` es un submódulo independiente basado en PageFlip (`vendor/page-flip.browser.min.js` + `accion.js`); se incrustará en `#hero-revista-section` cuando esté listo.
- Mantén los assets del hero dentro de `hero-revista/img/hero/` y documenta nuevos spreads en `hero-revista/IMAGE_MAP.md` para preservar la correspondencia.

## Workflow & Testing
- Es un sitio estático puro: usa `npx serve .`, VS Code Live Server o abre `index.html` directamente; para depurar solo el flipbook abre `hero-revista/index.html`.
- Cada ajuste significativo en la secuencia loader → transición → reveal debe actualizar `ESTADO.md`; cambios en responsabilidades entre archivos van en `RESPONSABILIDADES.md`.
- Antes de subir animaciones nuevas, valida en `GDanimado.html`, luego lleva las reglas finales a `css/loader.css` y limpia duplicados.

## Conventions & References
- Documenta decisiones de UI/transición en `guidelines/arquitectura-ui.md` y `guidelines/transiciones.md`; son la referencia para futuros agentes.
- Mantén los SVGs optimizados (ver sección "SVG Guidelines" en `GD-DESIGN-SYSTEM.md`); usa `stroke-linecap:round`, evita grupos redundantes y conserva proporciones.
- Si necesitas nuevas reglas para agentes humanos/AI, edita también `copilot-system-prompt.txt` o `context/copilot-readme.md` para que todo quede alineado.
