# Optimización de rendimiento

## Mejoras aplicadas

- **Lazy-loading de imágenes:** todos los avatares de ponentes, charlas cortas
  y comité organizador, además del certificado, usan
  `loading="lazy"` + `decoding="async"`. Así ~6 MB de imágenes dejan de
  bloquear la carga inicial y solo se descargan al llegar a cada sección.
- **Logo del navbar:** `decoding="async"` + `fetchpriority="high"`.
- **Animaciones de canvas:** `bloch-sphere` y `quantum-circuit` se **pausan
  cuando salen del viewport** (IntersectionObserver) y cuando la pestaña está
  oculta, en lugar de redibujarse a 60 fps de forma permanente.
- **Fondo `quantum-field`:** densidad de partículas reducida en móviles y CPUs
  de ≤4 núcleos; el cálculo de enlaces usa distancia al cuadrado para evitar
  `Math.sqrt` en el caso común.
- **Cache-busting:** versión de assets subida a `?v=16`.

## Pendiente (requiere herramientas de imagen)

Varios archivos pesan mucho más de lo necesario para el tamaño en que se
muestran (los avatares se ven a 100×100 px). Conviene recomprimirlos:

| Archivo | Tamaño aprox. | Recomendación |
|---|---|---|
| `Org_team/Juan.png` | 1.88 MB | Redimensionar a ~300 px, objetivo < 60 KB |
| `Org_team/julian.png` | 1.3 MB | ídem |
| `certificados/certificadoejemplo.png` | 1.1 MB | Exportar a WebP/JPG ~900 px de ancho |
| `Logos/logo_oscuro.png` | 660 KB | Redimensionar a la altura real del navbar o usar SVG |
| `Logos/logo_claro.png` | 556 KB | ídem |
| `Org_team/JOHN.png` | 308 KB | Comprimir |

Ejemplo con ImageMagick / cwebp:

```bash
magick Org_team/Juan.png -resize 300x300^ -gravity center -extent 300x300 -strip Org_team/Juan.png
cwebp -q 80 -resize 300 300 Org_team/Juan.png -o Org_team/Juan.webp
```
