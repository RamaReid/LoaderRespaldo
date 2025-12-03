/* ================================================================
   GD Arquitectura — loader.js (VERSIÓN FINAL)
   - Anima el SVG del loader en loop infinito.
   - Cada vez que termina de dibujarse la D (.str5) reinicia el SVG.
   - Se detiene en seco cuando transition.js pone detenerLoop = true.
   ================================================================ */

var detenerLoop = false; // transition.js cambia esto a true cuando inicia la transición

/* ---------------------------------------------------------------
   Iniciar el primer ciclo cuando el DOM está listo
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", loopOnce);

function loopOnce() {
    if (detenerLoop) return;

    const container = document.getElementById("loader-container");
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    const lastStroke = svg.querySelector(".str5");
    if (!lastStroke) return;

    // Escuchamos el final del dibujo de la D azul
    lastStroke.addEventListener("animationend", onLastStrokeEnd, { once: true });
}

/* ---------------------------------------------------------------
   Al terminar de dibujarse la D (fin de un ciclo completo)
--------------------------------------------------------------- */
function onLastStrokeEnd() {
    if (detenerLoop) return; // transition.js manda cortar → no seguimos

    const container = document.getElementById("loader-container");
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    // Clonamos el SVG para reiniciar TODAS las animaciones CSS
    const clone = svg.cloneNode(true);

    // Reemplazamos el viejo por el nuevo
    container.innerHTML = "";
    container.appendChild(clone);

    // Forzamos reflow
    void container.offsetWidth;

    // Disparamos el siguiente ciclo
    loopOnce();
}
