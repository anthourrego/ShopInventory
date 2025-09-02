# Tienda FitWinner - Aplicación Web

Una moderna aplicación web de e-commerce inspirada en el diseño de la tienda FitWinner, especializada en mallas de baño, ropa interior y accesorios.

## 🚀 Características

- **Diseño Responsivo**: Adaptable a dispositivos móviles, tablets y desktop
- **Slider de Banner**: Banner principal con navegación automática usando Swiper.js
- **Categorías Navegables**: Sistema de categorías con slider horizontal
- **Carrito de Compras**: Carrito flotante con funcionalidad completa
- **Modal de Productos**: Vista detallada de productos con galería de imágenes
- **Búsqueda**: Búsqueda en tiempo real de productos
- **WhatsApp Integration**: Envío de pedidos directamente por WhatsApp
- **Animaciones Suaves**: Transiciones y efectos visuales elegantes

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidad interactiva
- **Swiper.js**: Carruseles y sliders
- **Font Awesome**: Iconografía

## 📁 Estructura del Proyecto

```
Shop/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   ├── main.js            # Funcionalidad principal
│   ├── products.js        # Gestión de productos
│   └── cart.js            # Carrito de compras
└── assets/
    ├── logo1.png           # Logo de la tienda
    ├── placeholder.jpg    # Imagen placeholder
    └── products/          # Imágenes de productos
```

## 🎯 Funcionalidades Principales

### 1. **Navegación por Categorías**
- Medias y antifaz
- Panties
- Mallas brillantes
- Mallas de colores
- Salidas tejidas
- Levantadoras

### 2. **Carrito de Compras**
- Agregar productos con cantidad
- Modificar cantidades
- Eliminar productos
- Calcular totales automáticamente
- Persistir estado durante la sesión

### 3. **Vista de Productos**
- Modal con galería de imágenes
- Control de cantidad
- Descripción detallada

### 4. **Integración WhatsApp**
- Generación automática de mensaje de pedido
- Formato estructurado con detalles del pedido
- Envío directo a WhatsApp Business

## 🚀 Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador web
3. **Personalizar** los productos en `js/products.js`
4. **Configurar** el número de WhatsApp en `js/cart.js`
5. **Agregar** imágenes reales en `assets/products/`

## ⚙️ Configuración

### Productos
Editar el archivo `js/products.js` para agregar/modificar productos:

```javascript
{
    id: 1,
    name: "Nombre del Producto",
    price: 50000,
    category: "categoria",
    images: ["ruta/imagen1.jpg", "ruta/imagen2.jpg"],
    description: "Descripción del producto"
}
```

### WhatsApp
Configurar el número de WhatsApp en `js/cart.js`:

```javascript
const phoneNumber = '573103587032'; // Cambiar por el número real
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles**: 320px - 767px
- **Tablets**: 768px - 1023px
- **Desktop**: 1024px+

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `css/styles.css`:

```css
:root {
    --primary-color: #ff6b9d;
    --secondary-color: #c44569;
    --accent-color: #ff9999;
}
```

### Tipografía
Cambiar la fuente principal:

```css
body {
    font-family: 'Tu-Fuente-Preferida', Arial, sans-serif;
}
```

## 🔧 Funciones Adicionales

### Búsqueda
- Búsqueda en tiempo real
- Filtrado por nombre y descripción
- Resultados instantáneos

### Notificaciones
- Confirmación de agregado al carrito
- Notificación de pedido enviado
- Animaciones suaves

### Optimizaciones
- Lazy loading de imágenes
- Debounce en eventos de resize
- Preload de imágenes críticas

## 📸 Imágenes

Para un funcionamiento óptimo, agregar imágenes en formato JPG/PNG en:
- `assets/products/` para productos
- `assets/` para banners y logo

Resoluciones recomendadas:
- **Productos**: 300x300px mínimo
- **Banner**: 1200x300px
- **Logo**: 100x100px

## 🌟 Características Avanzadas

### SEO Ready
- Meta tags configurables
- URLs amigables
- Schema markup preparado

### Performance
- Imágenes optimizadas
- Código minificado listo
- Carga asíncrona de recursos

### Seguridad
- Validación de datos
- Sanitización de inputs
- Protección XSS básica

## 📞 Soporte

Para personalización o soporte técnico, contactar al desarrollador.

## 📄 Licencia

Este proyecto está diseñado específicamente para FitWinner - Tienda Verificada.

---

**Desarrollado con ❤️ para ofrecer la mejor experiencia de compra online**
