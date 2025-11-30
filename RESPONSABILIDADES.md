# Responsabilidades del repositorio — LoaderRespaldo

Este documento describe la responsabilidad de los archivos principales y cómo se relacionan entre sí. Mantenerlo actualizado ayuda a colaboradores a entender la intención y el flujo.

## Archivos y responsabilidades

- `index.html`
  - Página principal de demo/producción.
  - Contiene el contenedor `#loader-container` donde se renderiza el logo (SVG inline) y enlaza las hojas de estilo y el JS de control.
  - Responsabilidad: punto de montaje del loader; debe enlazar la hoja de estilos canonical (`css/style.css`) y opcionalmente `css/loader.css` si se separan las animaciones.

- `GDanimado.html`
  - Versión narrativa completa del loader (preview). Contiene el SVG inline con sus reglas CSS y animaciones narrativas.
  - Responsabilidad: fuente de verdad para la animación narrativa — útil para pruebas y previews. No tocar paths del SVG en este archivo salvo para correcciones de contenido.

- `css/style.css`
  - Hoja de estilos principal (variables, layout, trazos base).
  - Responsabilidad: definir la paleta (`:root`), resets y estilos estructurales. Debe ser referenciada por `index.html`.

- `css/loader.css`
  - Hoja destinada a contener las reglas de animación (masks, `@keyframes`, `animation` con delays/tiempos) cuando se separa la animación del layout.
  - Responsabilidad: centralizar animaciones del loader; si existe, `index.html` debe cargarla después de `css/style.css`.

- `css/style.css` vs `css/loader.css`
  - Mantener una única fuente de verdad para animaciones. `style.css` = variables y base; `loader.css` = animaciones largas/narrativas. Evitar duplicados.

- `js/loader.js`
  - Lógica opcional de control (fade-out, inyección del SVG, carga dinámica, detección de fin de animación).
  - Responsabilidad: controlar la visibilidad del loader en la interfaz y coordinar eventos (por ejemplo, quitar el loader cuando la animación narrativa termina). Actualmente es un placeholder — implementar según necesidad.

- `svg/logo.svg`
  - Archivo SVG independiente (placeholder actualmente).
  - Responsabilidad: si se quiere un asset reutilizable, mantener una versión optimizada aquí. Nota: para que las animaciones CSS del host afecten al SVG, el SVG debe inyectarse inline (o bien la animación debe residir dentro del propio archivo SVG como estilos internos).

- `GD-DESIGN-SYSTEM.md`, `copilot-system-prompt.txt`, `context/copilot-readme.md`, `.github/linters/gd-color-rules.json`, `.github/copilot-instruction.md`
  - Documentación y reglas de diseño.
  - Responsabilidad: fuente normativa (paleta, reglas de uso, loader spec funcional vs narrativo). Cualquier cambio en colores/tiempos debe reflejarse aquí primero.

## Buenas prácticas y notas

- No cambiar los `paths` ni las proporciones del SVG sin una razón validada.
- Respetar la paleta oficial (usar únicamente colores definidos en `.github/linters/gd-color-rules.json` / GD Design System).
- Para animación narrativa mantener delays y duraciones en `GDanimado.html` o en `css/loader.css` (dependiendo de dónde mantengamos la fuente de verdad).
- Si se extrae el SVG a `svg/logo.svg` y se desea animarlo con CSS del documento host, usar inyección (fetch + insert) para que los estilos afecten al SVG inline.

## Flujo recomendado para edición

1. Editar y validar animaciones en `GDanimado.html` (preview).  
2. Extraer reglas finales a `css/loader.css` (o mantener inline si se prefiere).  
3. Asegurar que `index.html` referencia `css/style.css` y `css/loader.css` en ese orden.  
4. Implementar control en `js/loader.js` si es necesario para coordinar el ciclo de vida del loader.  

---
Fecha: 2025-11-30
