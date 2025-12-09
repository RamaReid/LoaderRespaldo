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
let trasladoIniciado = false;
let reintentosVuelo = 0;

const SKIP_LOADER_PREVIEW = window.location.hash.toLowerCase().includes("preview");

const LIFT_DURATION = 1000;
const DROP_DURATION = 500;
const IMPACT_DURATION = 250;
const LOGO_SEQUENCE_DELAY = 200;
const LOGO_FLIGHT_DURATION = 2300;
const LOGO_FLIGHT_STEPS = 120;
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
    logoTransitionContainer.dataset.logoHidden = "0";

    requestAnimationFrame(() => {
        logoTransitionContainer.style.opacity = "1";
        const logoFinal = document.getElementById("logo-final");
        if (logoFinal) {
            logoFinal.style.transform = "";
        }
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
            desvanecerLogoTransition(() => {
                const logoWrapper = document.getElementById("logo-transition-container");
                if (logoWrapper) {
                    logoWrapper.dispatchEvent(new CustomEvent("logo:flight-end", { bubbles: true }));
                }
                // Restaurar z-index original del header
                const headerEl = document.querySelector('.gd-header');
                if (headerEl) {
                    if (typeof headerEl.dataset._prevZ !== 'undefined') {
                        headerEl.style.zIndex = headerEl.dataset._prevZ || '';
                        delete headerEl.dataset._prevZ;
                    } else {
                        headerEl.style.zIndex = '';
                    }
                }
            });
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
    }).then(() => {
        document.body.classList.add("app-ready");
    }).catch(() => {
        document.body.classList.add("app-ready");
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

function iniciarTrasladoLogo() {
    if (trasladoIniciado) return;

    const logoWrapper = document.getElementById("logo-transition-container");
    const logoTarget = document.getElementById("logo-final") || logoWrapper;
    const destinoEl = document.querySelector(".gd-header .brand-logo");

    if (!logoWrapper || !logoTarget || !destinoEl) {
        mostrarHeaderSinVuelo();
        return;
    }

    const destinoRectCongelado = clonarRectangulo(destinoEl.getBoundingClientRect());
    const destinoFiguraRect = obtenerRectanguloFigura(destinoEl) || destinoRectCongelado;

    requestAnimationFrame(() => {
        const origenRect = logoTarget.getBoundingClientRect();
        const destinoRect = destinoRectCongelado;

        if (!origenRect.width || !destinoRect.width) {
            if (reintentosVuelo < 5) {
                reintentosVuelo += 1;
                setTimeout(iniciarTrasladoLogo, 32);
            } else {
                mostrarHeaderSinVuelo();
            }
            return;
        }

        trasladoIniciado = true;
        reintentosVuelo = 0;

        const vuelo = construirKeyframesVuelo(origenRect, destinoRect, {
            origenFiguraRect: obtenerRectanguloFigura(logoTarget),
            destinoFiguraRect: destinoFiguraRect
        });

        if (!vuelo) {
            mostrarHeaderSinVuelo();
            return;
        }

        logoWrapper.classList.remove("lift-logo", "drop-logo", "impact-logo");
        logoTarget.style.transition = "none";
        logoTarget.style.transformOrigin = "50% 50%";

        const animation = logoTarget.animate(vuelo.keyframes, vuelo.timing);

        const finalizarVuelo = () => {
            if (vuelo.ultimoFrame) {
                logoTarget.style.transform = vuelo.ultimoFrame.transform;
            }
            mostrarHeaderSinVuelo({ despacharEvento: true });
        };

        animation.onfinish = finalizarVuelo;
        animation.oncancel = finalizarVuelo;
    });
}

function construirKeyframesVuelo(origenRect, destinoRect, opcionesEscala = {}) {
    try {
        const origenCentro = {
            x: origenRect.left + (origenRect.width / 2),
            y: origenRect.top + (origenRect.height / 2)
        };

        const destinoCentro = {
            x: destinoRect.left + (destinoRect.width / 2),
            y: destinoRect.top + (destinoRect.height / 2)
        };

        const pathD = construirPathArquitectonico(origenCentro, destinoCentro);
        if (!pathD) return null;

    const { origenFiguraRect, destinoFiguraRect } = opcionesEscala || {};
    const scaleTarget = calcularEscalaObjetivo(origenFiguraRect || origenRect, destinoFiguraRect || destinoRect);
        const keyframes = muestrearTrayectoria(pathD, origenCentro, scaleTarget);

        if (!keyframes || !keyframes.length) return null;

        const ultimoFrame = keyframes[keyframes.length - 1];

        return {
            keyframes,
            ultimoFrame,
            timing: {
                duration: LOGO_FLIGHT_DURATION,
                easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fill: "forwards"
            }
        };
    } catch (err) {
        return null;
    }
}

function construirPathArquitectonico(pi, pf) {
    if (!pi || !pf) return null;

    const dx = Math.abs(pf.x - pi.x);
    const dy = Math.abs(pf.y - pi.y);
    const unitX = dx >= 1 ? dx / 4 : 1;
    const unitY = dy >= 1 ? dy / 3 : 1;

    const p0 = { x: pi.x, y: pi.y };
    const p1 = { x: pi.x + (-1.682) * unitX, y: pi.y + unitY };
    const p2 = { x: pi.x, y: Math.max(0, (window.innerHeight || dy || 600) - 5) };
    const p3 = { x: pi.x + 3 * unitX, y: pi.y };
    const p35 = { x: pi.x, y: pf.y + 0.25 * unitY };
    const p4 = { x: pf.x, y: pf.y };

    const pts = [p0, p1, p2, p3, p35, p4];
    const tangentsExit = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        null
    ];

    const arrivalTangent = (index) => {
        switch (index) {
            case 0: return { x: 0, y: 1 };
            case 1: return { x: 1, y: 0 };
            case 2: return { x: 0, y: -1 };
            case 3: return { x: 1, y: 0 };
            case 4: return { x: 1, y: 0 };
            default: return { x: 1, y: 0 };
        }
    };

    const cubicSegment = (pA, pB, tOut, tIn) => {
        const dxSeg = pB.x - pA.x;
        const dySeg = pB.y - pA.y;
        const chord = Math.hypot(dxSeg, dySeg);
        if (chord < 1) return ` L ${pB.x} ${pB.y}`;

        const normOut = Math.hypot(tOut.x, tOut.y) || 1;
        const normIn = Math.hypot(tIn.x, tIn.y) || 1;
        const c1x = pA.x + (tOut.x / normOut) * chord * 0.5;
        const c1y = pA.y + (tOut.y / normOut) * chord * 0.5;
        const c2x = pB.x - (tIn.x / normIn) * chord * 0.5;
        const c2y = pB.y - (tIn.y / normIn) * chord * 0.5;
        return ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${pB.x} ${pB.y}`;
    };

    const arcP3toP35 = (pStart, pEnd) => {
        const dxArc = pEnd.x - pStart.x;
        const dyArc = pEnd.y - pStart.y;
        const chord = Math.hypot(dxArc, dyArc);
        const radius = Math.max(1, chord * 0.75);
        return ` A ${radius} ${radius} 0 0 0 ${pEnd.x} ${pEnd.y}`;
    };

    const bezierP35toP4 = (pStart, pEnd) => {
        const margin = 1;
        const dxAbs = Math.max(margin, Math.abs(pEnd.x - pStart.x));
        const dyAbs = Math.max(margin, Math.abs(pStart.y - pEnd.y));
        const direction = Math.sign(pEnd.x - pStart.x) || 1;

        const t1x = 0.382;
        const t2x = 0.618;
        const c1yOffset = dyAbs * 0.20;
        const c2yOffset = dyAbs * 0.30;

        let c1x = pStart.x + direction * (dxAbs * t1x);
        let c1y = pStart.y + c1yOffset;
        let c2x = pEnd.x - (dxAbs * t2x);
        let c2y = pEnd.y + c2yOffset;

        if (direction > 0) {
            c1x = Math.max(c1x, pStart.x + margin);
            c2x = Math.min(c2x, pEnd.x - margin);
            if (c1x > c2x) c1x = Math.max(pStart.x + margin, c2x - margin * 0.5);
        } else {
            c1x = Math.min(c1x, pStart.x - margin);
            c2x = Math.max(c2x, pEnd.x + margin);
            if (c1x < c2x) c1x = Math.min(pStart.x - margin, c2x + margin * 0.5);
        }

        return ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${pEnd.x} ${pEnd.y}`;
    };

    let d = `M ${p0.x} ${p0.y}`;

    for (let i = 0; i < pts.length - 1; i++) {
        const actual = pts[i];
        const siguiente = pts[i + 1];
        if (i === 3) {
            d += arcP3toP35(actual, siguiente);
        } else if (i === 4) {
            d += bezierP35toP4(actual, siguiente);
        } else {
            d += cubicSegment(actual, siguiente, tangentsExit[i], arrivalTangent(i));
        }
    }

    return d;
}

function muestrearTrayectoria(pathD, origenCentro, scaleTarget) {
    if (!pathD || !document.body) return null;

    const svgNS = "http://www.w3.org/2000/svg";
    const tempSvg = document.createElementNS(svgNS, "svg");
    const tempPath = document.createElementNS(svgNS, "path");
    tempPath.setAttribute("d", pathD);
    tempSvg.appendChild(tempPath);
    document.body.appendChild(tempSvg);

    let keyframes = [];

    try {
        const total = tempPath.getTotalLength();
        const baseTransform = "translate(-50%, -50%)";

        for (let i = 0; i <= LOGO_FLIGHT_STEPS; i++) {
            const t = i / LOGO_FLIGHT_STEPS;
            const point = tempPath.getPointAtLength(total * t);
            const offsetX = point.x - origenCentro.x;
            const offsetY = point.y - origenCentro.y;
            const easedScale = interpolarSuavizado(1, scaleTarget, t);

            keyframes.push({
                offset: t,
                transform: `${baseTransform} translate(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px) scale(${easedScale.toFixed(4)})`
            });
        }
    } catch (err) {
        keyframes = null;
    } finally {
        document.body.removeChild(tempSvg);
    }

    return keyframes;
}

function interpolarSuavizado(inicio, fin, t) {
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return inicio + (fin - inicio) * eased;
}

function mostrarHeaderSinVuelo(opciones = {}) {
    const { despacharEvento = false } = opciones;
    const logoWrapper = document.getElementById("logo-transition-container");

    if (despacharEvento && logoWrapper) {
        logoWrapper.dispatchEvent(new CustomEvent("logo:flight-end", { bubbles: true }));
    }

    document.body.classList.add("header-visible");

    // Elevar temporalmente el z-index del header para que sea visible
    // por encima del `#loader-stage` mientras el logo se desvanece.
    const headerEl = document.querySelector('.gd-header');
    if (headerEl) {
        headerEl.dataset._prevZ = headerEl.style.zIndex || '';
        headerEl.style.zIndex = '60';
    }

    if (logoWrapper && logoWrapper.dataset.logoHidden !== "1") {
        logoWrapper.style.opacity = "1";
        logoWrapper.style.display = "flex";
    }
}

function desvanecerLogoTransition(callback) {
    const logoWrapper = document.getElementById("logo-transition-container");
    if (!logoWrapper) {
        if (typeof callback === "function") callback();
        return;
    }

    // Retrasar la aparición del header 0.5s para que empiece ligeramente
    // después del inicio del fade del logo.
    setTimeout(() => {
        mostrarHeaderSinVuelo({ despacharEvento: false });
    }, 500);

    logoWrapper.style.transition = "opacity 1.8s ease";
    // Forzar un reflow para que la transición arranque correctamente
    void logoWrapper.offsetWidth;
    logoWrapper.style.opacity = "0";
    logoWrapper.dataset.logoHidden = "1";

    setTimeout(() => {
        logoWrapper.style.display = "none";
        if (typeof callback === "function") callback();
    }, 1800);
}

function obtenerRectanguloFigura(elemento) {
    if (!elemento) return null;
    if (elemento.tagName && elemento.tagName.toLowerCase() === "svg") {
        return elemento.getBoundingClientRect();
    }
    const svg = elemento.querySelector ? elemento.querySelector("svg") : null;
    return svg ? svg.getBoundingClientRect() : null;
}

const TAM_LOGO_DESKTOP = 115;

function calcularEscalaObjetivo(origenRect, destinoRect) {
    if (!origenRect || !destinoRect) return 1;
    const destinoReferencia = destinoRect.width || TAM_LOGO_DESKTOP;
    const origenReferencia = origenRect.width || destinoReferencia;
    if (!destinoReferencia || !origenReferencia) return 1;
    const scale = destinoReferencia / origenReferencia;
    return Number.isFinite(scale) ? scale : 1;
}

function clonarRectangulo(rect) {
    if (!rect) return null;
    return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom
    };
}

