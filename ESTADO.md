diff --git a/ESTADO.md b/ESTADO.md
new file mode 100644
index 0000000000000000000000000000000000000000..9d7963ba7ff47637d209e1c3dba0892da54659f7
--- /dev/null
+++ b/ESTADO.md
@@ -0,0 +1,17 @@
+# Estado actual del loader
+
+## Qué está pasando
+- `index.html` monta el SVG del loader directamente en `#loader-container` y prepara un segundo SVG estático en `#logo-final` para la transición.
+- `css/style.css` define la paleta digital oficial y los trazos base del SVG. Ambos contenedores (`#loader-container` y `#logo-final`) se escalan al 35% para mantener proporción.
+- `css/loader.css` anima las máscaras del SVG (líneas punteadas, marco y trazos) y usa `stroke-dashoffset` para dibujar los paths.
+- `js/loader.js` reinicia el SVG cada vez que termina de dibujarse la D azul (`.str5`) salvo que la transición lo desactive.
+- `js/transition.js` ahora espera dos ciclos completos y que la página esté lista para: detener el loop, ocultar el loader, mostrar el logo final y disparar la secuencia lift → drop → impacto.
+- `js/transition.js` expone `window.loaderDiagnostics` y lanza eventos (`loader:ciclo`, `loader:transicion`) para poder inspeccionar el estado del loop en consola o con listeners.
+- `css/transition.css` agrega el overlay de fondo y anima el logo final con las clases `lift-logo`, `drop-logo` e `impact-logo`; el revelado del plano ahora se gestiona íntegramente con la máscara radial.
+
+## Qué falta para llegar al objetivo
+- Integrar contenido real detrás del loader (`#app` está vacío) y coordinar su aparición con el final del radial reveal.
+- Afinar tiempos/curvas de la secuencia lift → drop → impacto para que calcen con la narrativa deseada del loader.
+- Ajustar estilos del overlay (color, opacidad final) una vez se conozca el fondo definitivo y el header que debe mostrarse.
+- Validar en navegadores/medidas reales el escalado al 35% y los offsets de las animaciones para asegurar que respeten las proporciones del GD Design System.

