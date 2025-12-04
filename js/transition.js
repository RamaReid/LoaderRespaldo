/* ================================================================
   GD Arquitectura — transition.js (VERSIÓN FINAL COMPLETA)
   - Cuenta ciclos del loader (SVG A)
   - Espera mínimo 2 ciclos + página cargada
   - Corta el loop del loader
   - Elimina el loader del DOM
   - Muestra logo.svg (SVG B) y le aplica lift → drop → impacto
   - Dispara clases de reveal para el fondo/plano
   ================================================================ */

let ciclos = 0;
let paginaLista = false;
let transicionIniciada = false;

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
   2) Contar ciclos del loader:
      escuchamos cualquier animationend en el contenedor y
      filtramos cuando el target es .str5 (D azul del SVG del loader)
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("loader-container");
    if (!container) return;

    container.addEventListener("animationend", (e) => {
        if (e.target.classList && e.target.classList.contains("str5")) {
            ciclos++;
            verificarCondiciones();
        }
    });
});

/* ---------------------------------------------------------------
   3) Verificar condiciones para iniciar la transición
--------------------------------------------------------------- */
function verificarCondiciones() {
    if (transicionIniciada) return;

    if (paginaLista === true && ciclos >= 2) {
        iniciarTransicion();
    }
}

/* ---------------------------------------------------------------
   4) TRANSICIÓN PRINCIPAL
      - Cortar loop del loader
      - Fade-out y remove del loader
      - Mostrar logo.svg (SVG B)
      - lift → drop → impacto
      - Enganchar reveal del fondo
--------------------------------------------------------------- */
function iniciarTransicion() {
    transicionIniciada = true;
    detenerLoop = true; // para que el loader deje de reiniciarse

    const loader = document.getElementById("loader-container");
    const logoFinal = document.getElementById("logo-final");

    if (loader) {
        loader.style.display = "none";   // chau loader
    }
    if (logoFinal) {
        logoFinal.style.display = "flex"; // aparece el SVG y nada más
    }
}

    // 3) Mostrar logo.svg (SVG B) en el mismo lugar
    logoContainer.style.transition = "opacity 0.4s ease-out";
    logoContainer.style.opacity = "1";

    // 4) Arrancar secuencia lift → drop → impacto
    const liftDuration = 450;
    const dropDuration = 380;
    const impactDuration = 220;

    // Pequeño delay para que el logo ya esté visible
    setTimeout(() => {
        // LIFT
        logoImg.classList.add("lift-logo");

        setTimeout(() => {
            // DROP
            logoImg.classList.remove("lift-logo");
            logoImg.classList.add("drop-logo");

            setTimeout(() => {
                // IMPACTO
                logoImg.classList.add("impact-logo");

                // 5) Disparar reveal del plano / fondo
                body.classList.add("reveal-start");

                // Opcional: después de un tiempo, terminar reveal
                setTimeout(() => {
                    body.classList.add("reveal-end");
                }, impactDuration + 300);

            }, dropDuration);

        }, liftDuration);

    }, 200);

