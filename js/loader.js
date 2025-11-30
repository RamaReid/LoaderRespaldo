// GD Loader — Loop engine (versión estable)

function setupLoop() {
    const container = document.getElementById("loader-container");
    const lastStroke = container.querySelector(".str5");

    lastStroke.addEventListener("animationend", () => {

        // Fade-out suave
        container.style.opacity = "0";
        container.style.transition = "opacity 0.25s linear";

        setTimeout(() => {
            // Clonar el SVG completo
            const svg = container.querySelector("svg");
            const clone = svg.cloneNode(true);

            // Reemplazar
            container.innerHTML = "";
            container.appendChild(clone);

            // Montar y volver a mostrar
            requestAnimationFrame(() => {
                container.style.opacity = "1";
                setupLoop(); // reinstalar listener
            });

        }, 250);
    });
}

document.addEventListener("DOMContentLoaded", setupLoop);
