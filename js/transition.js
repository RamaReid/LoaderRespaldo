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
let radialRevealDisparado = false;

const SKIP_LOADER_PREVIEW = window.location.hash.toLowerCase().includes("preview");

const LIFT_DURATION = 1000;
const DROP_DURATION = 500;
const IMPACT_DURATION = 250;
const LOGO_SEQUENCE_DELAY = 200;
const RADIAL_REVEAL_DURATION = 3600;

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
    if (SKIP_LOADER_PREVIEW) {
        paginaLista = true;
        ciclos = 2;
        detenerLoop = true;
        requestAnimationFrame(() => iniciarTransicion());
        return;
    }

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
    const logoTransitionContainer = document.getElementById("logo-transition-container");

    if (loader) {
        loader.style.display = "none";   // chau loader
    }

    if (!logoTransitionContainer) return;

    prepararLogoFinal(logoTransitionContainer);
    setTimeout(() => {
        ejecutarSecuenciaLogo(logoTransitionContainer);
    }, LOGO_SEQUENCE_DELAY);
}

function prepararLogoFinal(logoTransitionContainer) {
    logoTransitionContainer.style.display = "flex";
    logoTransitionContainer.style.opacity = "0";
    logoTransitionContainer.style.transition = "opacity 0.4s ease-out";

    requestAnimationFrame(() => {
        logoTransitionContainer.style.opacity = "1";
    });
}

function ejecutarSecuenciaLogo(logoTransitionContainer) {
    logoTransitionContainer.classList.remove("lift-logo", "drop-logo", "impact-logo");

    logoTransitionContainer.classList.add("lift-logo");

    setTimeout(() => {
        logoTransitionContainer.classList.remove("lift-logo");
        logoTransitionContainer.classList.add("drop-logo");

        dispararRadialReveal();

        setTimeout(() => {
            logoTransitionContainer.classList.remove("drop-logo");
            logoTransitionContainer.classList.add("impact-logo");
        }, DROP_DURATION);
    }, LIFT_DURATION);
}

function dispararRadialReveal() {
    if (radialRevealDisparado) return;
    radialRevealDisparado = true;

    const origin = obtenerCentroLogo();
    startRadialReveal({
        duration: RADIAL_REVEAL_DURATION,
        origin
    });
}

function obtenerCentroLogo() {
    const logo = document.querySelector("#logo-transition-container svg") || document.getElementById("logo-transition-container");
    if (!logo) return { x: 50, y: 50 };

    const overlay = document.getElementById("background-overlay");
    const stageRect = overlay ? overlay.getBoundingClientRect() : document.documentElement.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();
    const centerX = logoRect.left + (logoRect.width / 2);
    const centerY = logoRect.top + (logoRect.height / 2);
    const xPercent = ((centerX - stageRect.left) / stageRect.width) * 100;
    const yPercent = ((centerY - stageRect.top) / stageRect.height) * 100;

    return {
        x: Math.min(100, Math.max(0, xPercent)),
        y: Math.min(100, Math.max(0, yPercent))
    };
}

function startRadialReveal(options = {}) {
    const svgEl = document.getElementById("radialMaskSVG");
    const maskCircle = document.getElementById("maskHole");
    const maskRect = document.getElementById("maskRect");
    const overlay = document.getElementById("background-overlay");

    if (!svgEl || !maskCircle || !maskRect || !overlay) {
        return Promise.resolve();
    }

    const duration = options.duration || 2500;
    const origin = options.origin || { x: 50, y: 50 };
    const stage = overlay;
    const rect = stage.getBoundingClientRect();

    svgEl.setAttribute("width", rect.width);
    svgEl.setAttribute("height", rect.height);
    svgEl.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svgEl.style.position = "fixed";
    if (Number.isFinite(rect.left) && Number.isFinite(rect.top)) {
        svgEl.style.left = `${rect.left}px`;
        svgEl.style.top = `${rect.top}px`;
    } else {
        svgEl.style.left = "0px";
        svgEl.style.top = "0px";
    }
    svgEl.style.pointerEvents = "none";

    try {
        maskRect.setAttribute("width", rect.width);
        maskRect.setAttribute("height", rect.height);
    } catch (err) {
        /* ignore dimension errors */
    }

    const cxPx = (origin.x / 100) * rect.width;
    const cyPx = (origin.y / 100) * rect.height;
    maskCircle.setAttribute("cx", cxPx);
    maskCircle.setAttribute("cy", cyPx);
    maskCircle.setAttribute("r", 0);

    const maxDist = Math.hypot(rect.width, rect.height) * 1.2;
    const start = performance.now();

    return new Promise((resolve) => {
        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            maskCircle.setAttribute("r", eased * maxDist);

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                try {
                    stage.style.display = "none";
                } catch (err) {
                    /* ignore */
                }
                resolve();
            }
        }

        requestAnimationFrame(step);
    });
}

