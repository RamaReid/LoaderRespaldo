# Arquitectura UI — Visión general

El proyecto "GD Arquitectura" está organizado en capas claras para separar responsabilidades
visual, lógica y de contenidos. A continuación se describe la estructura general y la relación
entre secciones.

Estructura general:

- `index.html` — Contenedor principal de la demo y punto de montaje del loader (no modificar).
- `css/` — Carpeta de estilos. Se separan estilos base (`style.css`) y hojas específicas:
    - `transition.css` — órdenes para la transición loader → UI.
    - `layout.css` — utilidades y layout global.
    - `header.css` — estilos del header y su comportamiento inicial.
    - `home.css` — estilos del Home y Hero.
- `js/` — Carpeta de scripts: orquestación de transición (`transition.js`), control del header
  (`header.js`) y comportamiento del home/hero (`home.js`).
- `img/` — Recursos gráficos; `img/hero/` alojará imágenes del Hero.
- `guidelines/` — Documentación de diseño y secuencias (transiciones, arquitectura UI).

Relación entre secciones:

- El **loader** es independiente y no se debe mezclar con reglas de transición ni layout.
- La **transición** actúa como capa de orquestación: coordina el stop/start del loader,
  el reveal del background y el arranque del header/home.
- El **header** permanece inicialmente oculto; su despliegue se realiza cuando la transición
  finaliza y el logo ocupa su posición en el header.
- El **home/hero** se inicia después del reveal del background y puede ejecutar
  microanimaciones que respondan a la finalización de la transición.

Principios:

- Mantener separación de responsabilidades (estilos base vs animaciones vs orquestación).
- No introducir paleta de colores nueva — respetar variables y reglas en `css/style.css`.
- Documentar cada decisión en `guidelines/` para mantener coherencia entre diseño y código.
