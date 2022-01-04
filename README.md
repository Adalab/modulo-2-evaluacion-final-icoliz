# Módulo 2. Evaluación Final Ico Lizhen

## Cómo arrancar el proyecto

El flujo se inicia cuando introducimos una búsqueda válida en el input de la parte superior de la página y hacemos click en el botón de "buscar".

_Nota: el valor introducido debe tener más de dos caracteres. Los resultados de la búsqueda son aproximados._

### Búsqueda

Los resultados de la búsqueda se mostrarán en la columna derecha, bajo el título "resultados", con su respectiva imagen y título.
_Nota importante: las imágenes que contienen el placeholder por defecto (un cuadrado de 50x50 con un símbolo de exclamación han sido sustituidos por un placeholder propio con la palabra "Anime". Esto se ha hecho como comprobación por la posibilidad de que en el futuro una API no devolviera imagen_
Al hacer click en cualquiera de ellas:

### Favoritos

1. La serie se marcará como favorita con un aspecto diferenciador.
2. se añadirá a la columna izquierda "Series favoritas" si no estuviera ya.
3. Si la serie ya había sido seleccionada, se volverá al estilo original y se eliminará de "Series favoritas"

Además, al pulsar sobre el icono con forma de "X", la serie se eliminará de la lista de favoritas. El botón de borrar todas las series favoritas permitirá borrarlas todas a la vez, para mayor comodidad.

### Local Storage

La lista de series favoritas se guardará en el `localStorage` para conservar los datos después de finalizar la sesión.
