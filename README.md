# Portafolio de Gary Taboada

Sitio estático publicado con GitHub Pages desde la rama `espaniol1`.

## Estructura

- `index.html`: portada, perfil profesional, tecnologías, experiencia, proyectos y demos.
- `assets/styles.css`: estilos de la portada, diseño responsivo y modo oscuro.
- `assets/app.js`: tema claro/oscuro, año del pie y sección activa en la navegación.
- `assets/shared.css` y `assets/shared.js`: sistema de movimiento compartido (revelado al hacer scroll, tarjetas elevables, botón de volver).
- `content/demos/demo1.html` + `assets/demo1.css` + `assets/demo1.js`: formulario interactivo con validaciones y consumo de APIs públicas.
- `content/demos/demo2.html` + `assets/demo2.css` + `assets/demo2.js`: prototipo móvil con diseño Fluent, navegación adaptable, modales y datos simulados.
- `assets/tailwind.css`: CSS de Tailwind **compilado** para las demos (se versiona; no hay CDN en tiempo de ejecución).
- `src/tailwind.css` y `tailwind.config.js`: entrada y configuración de Tailwind.
- Demo 3 del `index.html`: acceso al proyecto full stack Frendo y a su repositorio.

## Movimiento y animaciones

Todas las animaciones siguen las mismas reglas (ver cabecera de `assets/shared.css`):

1. Solo se animan `transform` y `opacity`.
2. Las animaciones de entrada usan `backwards`, nunca `forwards`, para no dejar estilos fijos que pisen el hover o el toque.
3. El hover solo se aplica con puntero fino (`@media (hover: hover) and (pointer: fine)`). En pantallas táctiles la tarjeta que ocupa el centro de la pantalla recibe `.is-active` y el toque tiene feedback con `:active`.
4. Con `prefers-reduced-motion` todo queda estático y visible; sin JavaScript el contenido también se ve completo.

## Desarrollo local

No requiere compilar para ver el sitio. Puede abrirse directamente en el navegador o servirse con cualquier servidor HTTP estático.

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

### Regenerar el CSS de Tailwind

Solo hace falta si cambias clases de Tailwind en las demos. Se usa el ejecutable independiente de Tailwind v3 (sin Node):

```bash
tailwindcss -c tailwind.config.js -i src/tailwind.css -o assets/tailwind.css --minify
```

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