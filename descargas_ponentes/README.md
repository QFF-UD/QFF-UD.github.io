# Descarga de Ponentes

Carpeta con las imágenes de los ponentes organizadas por día del evento, para
que puedan descargarse desde la sección **Descargar Ponentes** del sitio.

## Estructura

```
descargas_ponentes/
├── dia1/   → Ponentes del Día 1 (27 de octubre)
├── dia2/   → Ponentes del Día 2 (28 de octubre)
└── dia3/   → Ponentes del Día 3 (29 de octubre)
```

## Cómo agregar una imagen descargable

1. Sube la imagen (PNG/JPG) a la carpeta del día correspondiente, por ejemplo
   `descargas_ponentes/dia1/nombre_ponente.png`.
2. En `index.html`, dentro de la sección `#speaker-downloads`, busca el panel
   del día (`#dl-day1`, `#dl-day2` o `#dl-day3`) y agrega una tarjeta de
   descarga dentro de su `.download-grid`:

   ```html
   <a class="download-card" href="descargas_ponentes/dia1/nombre_ponente.png" download>
       <i class="fas fa-download"></i>
       <span>Nombre del ponente</span>
   </a>
   ```

   El atributo `download` fuerza la descarga del archivo al hacer clic.
3. (Opcional) Elimina el mensaje `download-empty` de ese día cuando ya haya
   al menos una imagen.
