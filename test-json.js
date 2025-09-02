// Script de prueba para verificar la carga del JSON
const fs = require('fs');
const path = require('path');

try {
    const jsonPath = path.join(__dirname, 'assets', 'products.json');
    console.log('Ruta del archivo:', jsonPath);
    
    const data = fs.readFileSync(jsonPath, 'utf8');
    const products = JSON.parse(data);
    
    console.log('✅ JSON cargado correctamente');
    console.log('📊 Total de productos:', products.length);
    
    // Verificar categorías
    const categories = [...new Set(products.map(p => p.category))];
    console.log('📋 Categorías disponibles:', categories);
    
    // Verificar que todos tienen description e images
    const withDescription = products.filter(p => p.description).length;
    const withImages = products.filter(p => p.images && p.images.length > 0).length;
    
    console.log('📝 Productos con descripción:', withDescription);
    console.log('🖼️ Productos con imágenes:', withImages);
    
    // Mostrar primer producto como ejemplo
    console.log('🔍 Ejemplo de producto:');
    console.log(JSON.stringify(products[0], null, 2));
    
} catch (error) {
    console.error('❌ Error al cargar el JSON:', error.message);
}
