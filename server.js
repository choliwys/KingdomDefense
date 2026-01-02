// Importamos la librería Express
const express = require('express');
const path = require('path');

// Creamos la aplicación
const app = express();
const PORT = 3000;

// MIDDLEWARE:
// Le decimos a Express que la carpeta 'public' contiene archivos estáticos
// (HTML, CSS, JS, Imágenes) que pueden ser accedidos por cualquiera.
app.use(express.static(path.join(__dirname, 'public')));

// RUTA PRINCIPAL:
// Cuando alguien entre a la raíz '/', enviamos el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ARRANCAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`💻 Presiona Ctrl + C para detenerlo`);
});