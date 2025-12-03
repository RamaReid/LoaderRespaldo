/* ================================================================
   GD Arquitectura — transition.js (versión final)
   Control total de la transición del loader hacia el sitio:
   - 2 ciclos mínimos
   - espera a que cargue la página
   - corta el loop (loader.js respeta detenerLoop)
   - ejecuta elevación → caída → impacto
   - controla reveal del plano global
   ================================================================ */

/* ---------------------------------------------------------------
   ESTADOS GLOBALES
--------------------------------------------------------------- */
let ciclos = 0;                 // ciclos completos del loader
let paginaLista = false;        // true cuando la página terminó de cargar
let transicionIniciada = false; // evita disparar dos veces


/* ---------------------------------------------------------------
   1) Detectar carga total de la página
--------------------------------------------------------------- */
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        paginaLista = true;
        verificarCondiciones();
    }
};


/* ---------------------------------------------------------------
   2) Detectar cuando se completa cada ciclo del loader
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("loader-container");

    if (!container) return;

    // Delegación: cada vez que termine la animación del trazo final
    container.addEventListener("animationend", (e) => {
        if (e.target.classList.contains("str5")) {
            ciclos++;
            verificarCondiciones();
        }
    });

});


/* ---------------------------------------------------------------
   3) Verificar si se cumplen las condiciones para iniciar transición:
      - Página completamente cargada
      - Loader ejecutó al menos 2 ciclos
--------------------------------------------------------------- */
function verificarCondiciones() {
    if (transicionIniciada) return;

    if (paginaLista === true && ciclos >= 2) {
        iniciarTransicion();
    }
}


/* ---------------------------------------------------------------
   4) TRANSICIÓN PRINCIPAL (lift → drop → impacto → reveal)
--------------------------------------------------------------- */
function iniciarTransicion() {

    transicionIniciada = true;
    detenerLoop = true; // corta loop en loader.js

    const container = document.getElementById("loader-container");
    const body = document.body;

    if (!container) return;

    /* -----------------------------------------------------------
       A) Semireveal del plano (overlay empieza a bajar)
    ----------------------------------------------------------- */
    body.classList.add("reveal-start");

    /* -----------------------------------------------------------
       B) ELEVACIÓN DEL LOGO
    ----------------------------------------------------------- */
    container.classList.add("gd-lift");

    const liftDuration = 450;  // ms (coincide con transition.css)
    const dropDuration = 380;  // ms


    /* -----------------------------------------------------------
       C) CAÍDA
    ----------------------------------------------------------- */
    setTimeout(() => {

        container.classList.remove("gd-lift");
        container.classList.add("gd-drop");

        /* -------------------------------------------------------
           D) IMPACTO (pulso técnico final)
        ------------------------------------------------------- */
        setTimeout(() => {

            container.classList.add("gd-impact");

            /* ---------------------------------------------------
               E) REVEAL FINAL DEL PLANO
            --------------------------------------------------- */
            body.classList.add("reveal-end");

            /* ---------------------------------------------------
               F) Aquí conectamos con la siguiente etapa:
                  - ondas desde el impacto
                  - movimiento del logo al header
                  - despliegue del header
            --------------------------------------------------- */
            // startRippleWaves();   ← lo agregaremos después
            // moveLogoToHeader();   ← siguiente paso
            // deployHeader();       ← después del movimiento

        }, dropDuration);

    }, liftDuration);
}
