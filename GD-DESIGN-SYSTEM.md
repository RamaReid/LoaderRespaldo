# GD Arquitectura — Design System (2025)

Este documento define los lineamientos visuales oficiales para todas las piezas generadas dentro del repositorio: código, animaciones, web components, assets y UI.

---

# 1. Paleta oficial

## A. Colores históricos (Impresos)
- Azul histórico GD: #233BBA
- Rojo G: #FF0009
- Blanco D (print): #FFFFFF
- Gris técnico líneas: #C4C3C4

## B. Colores digitales (Web/UI/Loader)
- Fondo dark 1: #121212
- Fondo dark 2: #1A1A1A
- Azul D digital 1: #2A41C8
- Azul D digital 2: #324DDD
- Gris líneas digital: #C4C3C4
- Highlights: #FFFFFF

---

# 2. Reglas de aplicación

### Print
- Fondo azul histórico
- D blanca
- G roja

### Digital (Default)
- Fondo oscuro
- D azul digital
- G roja
- Líneas gris claro

Nunca invertir roles de color.
Nunca usar blanco de fondo.
Nunca usar azul de fondo en interfaces.

---

# 3. Loader Specification

- Fondo: #121212
- Logo animado con técnica “stroke-drawing”
- Order: líneas → G → D
- Highlights blancos en puntos clave (máx. 1–2px)
- Easing recomendado: cubic-bezier(0.65,0,0.35,1)
- Duración total: entre 1.8 y 2.4s

---

# 4. SVG Guidelines

- Usar trazos uniformes
- stroke-linecap: round
- stroke-linejoin: round
- Evitar grupos innecesarios
- Optimizar con SVGO

---

# 5. Responsabilidad técnica

Todos los archivos, componentes y ramas deben respetar este sistema.  
Si un archivo no respeta los colores o reglas → marcar como issue.

