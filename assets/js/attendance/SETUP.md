# Sistema de Asistencia — Guía de configuración

Este sistema permite que los asistentes **inicien sesión con Google** y registren
su asistencia escribiendo un **código rotatorio** que se proyecta en el salón.
Al final, una Google Sheet calcula quién asistió al **75%** o más (3 de 4 días).

> **Importante:** GitHub Pages solo sirve archivos estáticos, por eso el
> "backend" es un **Google Apps Script** gratuito. No se guarda ninguna
> contraseña ni secreto en el repositorio.

Hay 3 piezas:
1. **Google Sign-In** (botón de login) — necesita un *Client ID*.
2. **Apps Script + Google Sheet** (el backend) — da una *URL* y guarda los datos.
3. **El código rotatorio (TOTP)** — un *secreto compartido* entre el panel y el backend.

---

## Paso 1 — Crear la Google Sheet y el Apps Script (backend)

1. Crea una Google Sheet nueva (ej. "QFF Asistencia 2026").
2. Menú **Extensiones → Apps Script**.
3. Borra el contenido y pega **todo** el archivo `code.gs` de esta carpeta.
4. En **Configuración del proyecto** (⚙️) → **Propiedades del script**, añade:
   - `TOTP_SECRET` → una frase secreta larga que inventes (ej. `qff-2026-uDistrital-x7k9`). **Guárdala**, la necesitarás en el Paso 3.
   - `GOOGLE_CLIENT_ID` → lo obtendrás en el Paso 2 (puedes volver luego).
   - `SHEET_ID` → el id de tu Google Sheet. Está en la URL de la hoja:
     `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`
     (recomendado para que el backend siempre escriba en la hoja correcta).

   > **Diagnóstico rápido:** en el editor de Apps Script, elige la función
   > `testWrite` en el menú de arriba y pulsa **Ejecutar**. Debe añadir una fila
   > de prueba en la pestaña **Attendance**. Si falla, el error dice qué pasa
   > (permisos, SHEET_ID, etc.). Borra esa fila de prueba después.
5. **Implementar → Nueva implementación → Aplicación web**:
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
   - Copia la **URL** que termina en `/exec`.

---

## Paso 2 — Crear el Client ID de Google Sign-In

1. Entra a <https://console.cloud.google.com/> y crea un proyecto (o usa uno).
2. **APIs y servicios → Pantalla de consentimiento OAuth**: configúrala como
   "Externo", pon el nombre del evento y guarda.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth**:
   - Tipo: **Aplicación web**.
   - **Orígenes autorizados de JavaScript**, añade tu dominio de GitHub Pages:
     `https://qff-ud.github.io`
     (y `http://localhost:8000` si quieres probar en local).
4. Copia el **Client ID** (termina en `.apps.googleusercontent.com`).
5. Pega ese Client ID también en el **Script Property** `GOOGLE_CLIENT_ID`
   del Paso 1.

---

## Paso 3 — Conectar el frontend

Edita `assets/js/attendance/attendance-config.js` y reemplaza:

```js
googleClientId: "TU_CLIENT_ID.apps.googleusercontent.com",
backendUrl:     "TU_URL_DE_APPS_SCRIPT_QUE_TERMINA_EN_/exec",
```

Asegúrate de que estos valores coincidan con el backend:
- `totpStepSeconds` (por defecto **90**) = `STEP_SECONDS` en `code.gs`.
- `totalSessions` (por defecto **4**) = `TOTAL_SESSIONS` en `code.gs`.

> El **TOTP_SECRET NO se pone aquí** (quedaría público). Vive solo en el
> Script Property del backend y lo escribes a mano en el panel (Paso 4).

---

## Paso 4 — Usar el panel el día del evento

1. Abre `panel-codigo.html` en el computador conectado al proyector.
2. Escribe la **misma frase secreta** (`TOTP_SECRET`) que pusiste en el backend.
3. Se mostrará un **código grande que cambia cada 90 segundos**. Proyéctalo.
4. Los asistentes abren `asistencia.html`, inician sesión con Google y escriben
   el código visible en ese momento. Como caduca enseguida, reenviarlo por
   WhatsApp no sirve.

---

## Paso 5 — Al final del evento: ver quién califica

En la Google Sheet, la pestaña **Attendance** tiene una fila por (correo, día).
Para contar días por persona y marcar el 75%, crea una pestaña nueva con:

```
=QUERY(Attendance!B2:D, "select B, count(D) group by B label count(D) 'Dias'")
```

Quien tenga **3 o más** días cumple el 75% y recibe certificado.

---

## Opcional — Geolocalización (campus)

En `attendance-config.js`, dentro de `geofence`, pon `enabled: true` y ajusta
`lat`, `lng`, `radiusMeters`. Así el navegador pedirá la ubicación y solo
aceptará si el asistente está cerca del campus. (El GPS en interiores es
impreciso; úsalo como refuerzo, no como única barrera.)

---

## Notas de seguridad (honestas)

- El login con Google es real y seguro (lo valida Google y el backend).
- El código rotatorio hace **muy difícil** marcar asistencia a distancia, pero
  alguien podría fotografiar el código y enviarlo dentro de la ventana de 90s.
  Para máxima certeza, combínalo con la geolocalización o con revisión visual
  del staff. Para un certificado de asistencia suele ser más que suficiente.
