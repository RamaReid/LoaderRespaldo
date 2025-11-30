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

# 3. Loader Specification — Versión Narrativa (2025)

Los loaders del sistema GD pueden funcionar en dos modos distintos: 
funcional (UI) o narrativo (identitario). Ambos responden a la estética 
arquitectónica, técnica y racionalista del símbolo GD, pero difieren en 
su profundidad expresiva.

---

## 3.1 Loader Funcional (UI)
Uso: interfaces, acciones breves, transiciones o feedback rápido.

- Duración sugerida: breve, orientada a microinteracción.
- El dibujo debe ser legible pero rápido.
- No debe competir con el contenido principal.
- Mantiene la secuencia estándar: líneas → G → D.
- Animación siempre técnica, con trazos limpios.
- Easing recomendado: cubic-bezier(0.65, 0, 0.35, 1).

---

## 3.2 Loader Narrativo (Identidad / Presentación)
Uso: introducciones, aperturas, despliegues visuales, storytelling 
arquitectónico, comunicación institucional o de portfolio.

- La duración **no tiene límite fijo**. 
  El tiempo total se define según la narrativa, legibilidad y el 
  impacto perceptivo que se quiera construir.
  
- La animación debe permitir que el observador:
  - perciba cada gesto técnico,
  - lea la construcción del orden arquitectónico,
  - reconozca el proceso y la secuencia racional del símbolo GD.

- Secuencia narrativa recomendada:
  1. Línea punteada vertical  
  2. Línea punteada horizontal  
  3. Línea llena vertical izquierda  
  4. Línea llena vertical derecha  
  5. Línea llena horizontal superior  
  6. Línea llena horizontal inferior  
  7. Trazos de fondo de la G (gris técnico)  
  8. G exterior  
  9. G interior (con leve desfase, final conjunto)  
  10. D final

- La velocidad de cada segmento debe ser suficiente para que 
  el usuario pueda percibirlo como una acción independiente 
  dentro de una secuencia mayor.

- El objetivo es construir una lectura técnica y ordenada:

  *primero la estructura → luego el trazo técnico → por último el 
  símbolo completo.*

- Siempre utilizar los colores del sistema digital:
  - Fondo dark  
  - G roja (#FF0009)  
  - D azul digital  
  - Líneas en gris técnico #C4C3C4  
  - Blancos solo como acentos mínimos si es necesario.

- Mantener siempre la estética racionalista, técnica y constructiva.
- Evitar exageraciones visuales no propias de la disciplina.

---

## 3.3 Consideraciones Técnicas del Loader
- SVG optimizado y modular.
- Trazos consistentes, linecap y linejoin redondeados.
- Mantener proporciones originales del símbolo GD.
- Evitar grupos o paths innecesarios.
- Preferir animación con `stroke-dashoffset` y máscaras direccionales.
- Easing suave: cubic-bezier(0.65, 0, 0.35, 1).

---

## 3.4 Coherencia
Todo nuevo loader debe evaluarse según:
- claridad de lectura,
- coherencia técnica,
- narrativa del proceso,
- impacto arquitectónico,
- fidelidad cromática.

No existe un tiempo “correcto”: 
el tiempo se ajusta a la narrativa y al propósito del loader.


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

