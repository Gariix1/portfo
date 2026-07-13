# Portafolio de Gary Taboada

Sitio estático publicado con GitHub Pages desde la rama `espaniol1`.

## Estructura

- `index.html`: portada y contenido principal del portafolio.
- `assets/styles.css`: estilos de la portada, diseño responsivo y modo oscuro.
- `assets/app.js`: navegación móvil, persistencia del tema y año del pie de página.
- `content/demos/demo1.html`: formulario interactivo con validaciones y consumo de APIs públicas.
- `content/demos/demo2.html`: prototipo responsivo con diseño Fluent, navegación, modales y datos simulados.

## Desarrollo local

No requiere compilación ni dependencias. Puede abrirse directamente en el navegador o servirse con cualquier servidor HTTP estático.

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Rama publicada

Los cambios de la versión española deben partir de `espaniol1`. La rama `main` mantiene una historia diferente y no debe mezclarse automáticamente con la versión publicada.
