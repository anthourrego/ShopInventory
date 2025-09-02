// Variables globales
let bannerSwiper, categoriesSwiper, productSwiper;
let productsFromJSON = []; // Array para almacenar productos del JSON

// Función para cargar productos desde JSON
async function loadProductsFromJSON() {
    try {
        console.log('🔄 Cargando productos desde JSON...');
        const response = await fetch('assets/products.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const products = await response.json();
        
        // Validar y agregar imágenes por defecto si no existen
        productsFromJSON = products.map(product => ({
            ...product,
            images: product.images || ['assets/placeholder.svg'],
            // Asegurar que siempre tenga al menos una imagen
            category: product.category || 'sin-categoria'
        }));
        
        console.log(`✅ ${productsFromJSON.length} productos cargados desde JSON`);
        
        // Hacer los productos accesibles globalmente - ESTA ES LA FUENTE PRINCIPAL
        window.productsFromJSON = productsFromJSON;
        
        // También actualizar window.products para compatibilidad
        window.products = productsFromJSON;
        
        return productsFromJSON;
    } catch (error) {
        console.error('❌ Error cargando productos del JSON:', error);
        console.log('🔄 Usando productos por defecto como fallback');
        
        // Fallback: usar un array vacío o productos de demostración mínimos
        window.productsFromJSON = [];
        window.products = [];
        
        return [];
    }
}

// Mapeo de categorías a íconos y nombres de visualización
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

// Función para renderizar las categorías obtenidas desde el endpoint
function renderCategories(categories) {
    const categoriesWrapper = document.querySelector('.categories-swiper .swiper-wrapper');
    if (!categoriesWrapper) {
        console.error('❌ Contenedor de categorías no encontrado.');
        return;
    }

    // Limpia las categorías existentes (excepto "Todos") antes de agregar las nuevas
    const dynamicSlides = categoriesWrapper.querySelectorAll('.swiper-slide:not(:first-child)');
    dynamicSlides.forEach(slide => slide.remove());

    categories.forEach(category => {
        // Asumo que el objeto category tiene una propiedad 'name'
        const categoryName = category.name;
        const config = categoryConfig[categoryName] || { icon: 'fas fa-tag', display: categoryName };
        
        // Crear slug para data-category (normalizar nombre)
        const categorySlug = categoryName.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/[ñ]/g, 'n')
            .replace(/[^a-z0-9-]/g, '');

        const slideHTML = `
            <div class="swiper-slide">
                <div class="category-item" data-category="${categorySlug}" data-original-category="${categoryName}">
                    <div class="category-icon">
                        <i class="${config.icon}"></i>
                    </div>
                    <span>${config.display}</span>
                </div>
            </div>
        `;
        categoriesWrapper.insertAdjacentHTML('beforeend', slideHTML);
    });

    console.log(`✅ ${categories.length} categorías cargadas desde el endpoint.`);
    
    // Actualizar Swiper después de agregar las categorías
    if (categoriesSwiper) {
        categoriesSwiper.update();
        console.log('🔄 Swiper de categorías actualizado');
    }
}

// Nueva función para obtener y renderizar las categorías desde el endpoint
async function fetchAndRenderCategories() {
    const endpoint = 'http://inventorysystem/getCategories';
    console.log(`🔄 Cargando categorías desde ${endpoint}...`);
    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
        }

        const categories = await response.json();

        console.log(categories);

        if (Array.isArray(categories)) {
            renderCategories(categories);
        } else {
            console.error('❌ La respuesta del endpoint de categorías no es un array válido.');
        }

    } catch (error) {
        console.error('❌ Error al cargar las categorías:', error);
        const categoriesWrapper = document.querySelector('.categories-swiper .swiper-wrapper');
        if (categoriesWrapper) {
             console.error('No se pudieron cargar las categorías. El contenedor de categorías podría estar vacío.');
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing app...');
    
    // Cargar productos y categorías en paralelo
    await Promise.all([
        loadProductsFromJSON(),
        fetchAndRenderCategories()
    ]);
    
    initializeSwiper();
    initializeEventListeners();
    
    // Cargar productos iniciales después de que los datos estén listos
    console.log('🚀 Iniciando carga de productos...');
    loadInitialProducts();
    
    initializeSearch();
    
    // Test function - esto se puede quitar después
    window.testModal = function() {
        console.log('Testing modal...');
        openProductModal(1);
    };
    
    console.log('App initialized successfully');
});

// Función para inicializar Swiper
function initializeSwiper() {
    // Banner principal
    bannerSwiper = new Swiper('.banner-swiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // Categorías
    categoriesSwiper = new Swiper('.categories-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
        breakpoints: {
            320: {
                slidesPerView: 3,
                spaceBetween: 10
            },
            480: {
                slidesPerView: 4,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 6,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 8,
                spaceBetween: 20
            }
        }
    });
}

// Función para inicializar event listeners
function initializeEventListeners() {
    // Categorías - usar delegación de eventos para categorías dinámicas
    const categoriesWrapper = document.querySelector('.categories-swiper .swiper-wrapper');
    if (categoriesWrapper) {
        categoriesWrapper.addEventListener('click', function(e) {
            const categoryItem = e.target.closest('.category-item');
            if (!categoryItem) return;
            
            console.log('🏷️ Categoría seleccionada:', categoryItem.dataset.category);
            
            // Remover clase active de todas las categorías
            document.querySelectorAll('.category-item').forEach(cat => cat.classList.remove('active'));
            // Agregar clase active a la categoría seleccionada
            categoryItem.classList.add('active');
            
            // Obtener categoría (usar original si existe, sino usar el slug)
            const categorySlug = categoryItem.dataset.category;
            const originalCategory = categoryItem.dataset.originalCategory || categorySlug;
            
            // Cargar productos de la categoría
            let products;
            if (categorySlug === 'all') {
                products = getProductsByCategory('all');
            } else {
                // Buscar por categoría original para mayor precisión
                products = getProductsByCategory(originalCategory);
            }
            
            renderProducts(products);
            
            // Actualizar título de sección
            const sectionTitle = document.querySelector('.section-title h2');
            const categoryName = categoryItem.querySelector('span').textContent;
            
            if (categorySlug === 'all') {
                sectionTitle.textContent = 'Todos los productos';
            } else {
                sectionTitle.textContent = categoryName;
            }
            
            console.log('✅ Productos cargados para categoría:', categoryName);
        });
    }

    // Búsqueda
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Función para realizar búsqueda
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    const sectionTitle = document.querySelector('.section-title h2');
    
    if (query.length === 0) {
        loadInitialProducts();
        // Restaurar título original
        sectionTitle.textContent = 'Todos los productos';
        return;
    }
    
    const results = searchProducts(query);
    renderProducts(results);
    
    // Actualizar título
    sectionTitle.textContent = `Resultados para: "${query}"`;
    
    // Remover active de categorías
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Función para inicializar búsqueda en tiempo real
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.trim();
            const sectionTitle = document.querySelector('.section-title h2');
            
            if (query.length === 0) {
                loadInitialProducts();
                // Restaurar título original
                sectionTitle.textContent = 'Todos los productos';
                return;
            }
            
            if (query.length >= 2) {
                performSearch();
            }
        }, 300);
    });
}

// Event listeners para cerrar modales
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Configurando event listeners del modal...');
    
    // Cerrar modal con botón X
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            console.log('🔄 Cerrando modal con botón X');
            closeProductModal();
        });
        console.log('✅ Botón X configurado');
    }
    
    // Cerrar modal con overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            console.log('🔄 Cerrando modal con overlay');
            closeProductModal();
            closeCartModal();
        });
        console.log('✅ Overlay configurado');
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('🔄 Cerrando modal con tecla Escape');
            closeProductModal();
            closeCartModal();
        }
    });
    console.log('✅ Tecla Escape configurada');
});

// Función para simular carga de datos
function simulateLoading() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    setTimeout(() => {
        loadInitialProducts();
    }, 1000);
}

// Función para crear imágenes placeholder
function createPlaceholderImages() {
    const placeholders = [
        'https://via.placeholder.com/300x300/ff6b9d/ffffff?text=Producto+1',
        'https://via.placeholder.com/300x300/c44569/ffffff?text=Producto+2',
        'https://via.placeholder.com/300x300/ff9999/ffffff?text=Producto+3'
    ];
    
    return placeholders;
}

// Función para manejar errores de carga de imágenes
function handleImageError(img) {
    img.src = 'assets/placeholder.svg';
    img.onerror = null; // Prevenir bucle infinito
}

// Función para scroll suave a sección
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para lazy loading de imágenes
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Función para optimizar rendimiento
function optimizePerformance() {
    // Debounce para resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (bannerSwiper) bannerSwiper.update();
            if (categoriesSwiper) categoriesSwiper.update();
            if (productSwiper) productSwiper.update();
        }, 250);
    });
    
    // Preload de imágenes críticas
    const criticalImages = [
        'assets/logo1.png',
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Función para analytics (placeholder)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // Aquí se puede integrar Google Analytics, Facebook Pixel, etc.
}

// Función para compartir producto
function shareProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: product.description,
            url: `${window.location.origin}?product=${productId}`
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const url = `${window.location.origin}?product=${productId}`;
        navigator.clipboard.writeText(url).then(() => {
            showCartNotification('Enlace copiado al portapapeles');
        });
    }
}

// Inicializar optimizaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    optimizePerformance();
    initializeLazyLoading();
    
    // Verificar si hay un producto específico en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
        setTimeout(() => {
            openProductModal(parseInt(productId));
        }, 500);
    }
});

// Exportar funciones para uso global
window.shareProduct = shareProduct;
window.trackEvent = trackEvent;
