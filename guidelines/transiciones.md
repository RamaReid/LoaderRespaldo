# Secuencia conceptual: loader → transición → background → header

1. Loader
   - Punto de partida: el loader presenta la animación narrativa del logo.
   - Su intención es cubrir el tiempo de arranque y preparar la expectativa visual.

2. Transición
   - Inicio: al cumplirse la condición (conteo de ciclos, recursos listos, o señal externa),
     la transición se dispara desde el código de orquestación.
   - Acciones principales:
       - Activar un 'radial reveal' o máscara que descubra el background real.
       - Animar el logo: escalar y mover el logo hacia su ubicación final en el header.
       - Desactivar o pausar los elementos del loader para evitar solapamientos visuales.

3. Background (fondo real)
   - El fondo real debe estar preparado debajo del loader y ser revelado por la máscara.
   - A partir de este momento, el contenido principal (home) puede iniciarse.

4. Header
   - El header, inicialmente oculto o fuera de vista, se muestra tras la fase de reveal.
   - Su despliegue debe ser fluido y coordinado con la posición final del logo.

Notas:
- No mezclar la lógica ni los estilos del loader con los de la transición; mantener separación.
- Esta secuencia es conceptual; las implementaciones técnicas se documentarán en los archivos
  `transition.js`, `transition.css` y en la guía de arquitectura UI.
