// Script de prueba para verificar categorías dinámicas
const fs = require('fs');
const path = require('path');

try {
    const jsonPath = path.join(__dirname, 'assets', 'products.json');
    const data = fs.readFileSync(jsonPath, 'utf8');
    const products = JSON.parse(data);
    
    console.log('✅ JSON cargado correctamente');
    console.log('📊 Total de productos:', products.length);
    
    // Extraer categorías únicas
    const categories = [...new Set(products.map(p => p.category))];
    console.log('📋 Categorías disponibles:', categories);
    
    // Mapear a configuración de categorías
    const categoryConfig = {
        'Ropa deportiva': {
            icon: 'fas fa-running',
            display: 'Ropa Deportiva'
        },
        'Sin categoria': {
            icon: 'fas fa-shopping-bag',
            display: 'Otros'
        },
        'Suplementos': {
            icon: 'fas fa-pills',
            display: 'Suplementos'
        }
    };
    
    console.log('\n🏷️ Configuración de categorías que se generarán:');
    categories.forEach(category => {
        const config = categoryConfig[category] || {
            icon: 'fas fa-tag',
            display: category
        };
        
        const categorySlug = category.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9-]/g, '');
        
        console.log(`  - ${category} → slug: "${categorySlug}", display: "${config.display}", icon: "${config.icon}"`);
        
        // Contar productos en esta categoría
        const productCount = products.filter(p => p.category === category).length;
        console.log(`    📦 ${productCount} productos`);
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
