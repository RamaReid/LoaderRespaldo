function setupLoop() {
    const container = document.getElementById("loader-container");
    const lastStroke = container.querySelector(".str5");

    lastStroke.addEventListener("animationend", () => {

        // 1. Forzar opacidad inicial
        container.style.opacity = "1";

        // 2. Forzar reflow
        void container.offsetWidth;

        // 3. Aplicar transición ANTES del cambio
        container.style.transition = "opacity 0.55s ease-in-out";

        // 4. Fade-out
        container.style.opacity = "0";

        // 5. Swap después del fade-out
        setTimeout(() => {
            const svg = container.querySelector("svg");
            const clone = svg.cloneNode(true);

            container.innerHTML = "";
            container.appendChild(clone);

            // 6. Forzar reflow antes del fade-in
            void container.offsetWidth;

            // 7. Fade-in
            container.style.opacity = "1";

            // 8. Reinstalar el loop
            setupLoop();

        }, 550); // duración del fade-out exacta
    });
}

document.addEventListener("DOMContentLoaded", setupLoop);
