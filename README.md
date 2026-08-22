# Portafolio de Gary Taboada

Sitio estático publicado con GitHub Pages desde la rama `espaniol1`.

## Estructura

- `index.html`: portada, perfil profesional, tecnologías, proyectos y demos.
- `assets/styles.css`: estilos del portafolio, diseño responsivo y modo oscuro.
- `assets/app.js`: navegación móvil, persistencia del tema y año del pie de página.
- `content/demos/demo1.html`: formulario interactivo con validaciones y consumo de APIs públicas.
- `content/demos/demo2.html`: prototipo responsivo con diseño Fluent, navegación, modales y datos simulados.
- Demo 3 del `index.html`: acceso al proyecto full stack Frendo y a su repositorio.

## Proyecto destacado

**Frendo** es una aplicación de Amigo Secreto construida con FastAPI, React, TypeScript y SQLite. Incluye un asistente de regalos con IA mediante OpenAI API, manteniendo presupuesto, permisos, sorteo y reglas críticas bajo lógica determinística.

- Demo: https://frendo-project-front.onrender.com
- Código: https://github.com/Gariix1/frendo_project
- Arquitectura IA: https://github.com/Gariix1/frendo_project/blob/main/docs/AI_GIFT_ASSISTANT.md

## Desarrollo local

No requiere compilación ni dependencias. Puede abrirse directamente en el navegador o servirse con cualquier servidor HTTP estático.

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Rama publicada

La rama de producción de GitHub Pages es **`espaniol1`** y se publica desde `/(root)`.

Los cambios del portafolio publicado deben partir de `espaniol1` y regresar mediante pull request a `espaniol1`. La rama `main` mantiene una historia diferente y no debe mezclarse automáticamente con la versión publicada.