// Variables globales
let bannerSwiper, categoriesSwiper;
let productsFromJSON = []; // Array para almacenar productos del JSON

// Configuración API cargada desde config.js

// Sistema completamente basado en endpoints - No se usa más products.json
// Las funciones de productos ahora consultan directamente los endpoints del sistema de inventario

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
    const categoriesContainer = document.getElementById('categories-container');
    
    if (!categoriesWrapper) {
        console.error('❌ Contenedor de categorías no encontrado.');
        return;
    }

    // Si no hay categorías o solo hay una categoría, ocultar el panel completo de categorías
    if (!categories || categories.length <= 1) {
        console.log(`📋 ${categories.length === 0 ? 'No hay categorías' : 'Solo hay una categoría'} disponible, ocultando panel de categorías`);
        if (categoriesContainer) {
            categoriesContainer.classList.add('d-none');
        }
        return;
    } else {
        // Si hay más de una categoría, mostrar el panel
        if (categoriesContainer) {
            categoriesContainer.classList.remove('d-none');
        }
    }

    // Limpia las categorías existentes (excepto "Todos") antes de agregar las nuevas
    const dynamicSlides = categoriesWrapper.querySelectorAll('.swiper-slide:not(:first-child)');
    dynamicSlides.forEach(slide => slide.remove());

    categories.forEach(category => {
        // Asumo que el objeto category tiene propiedades 'id' y 'name'
        const categoryId = category.id;
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
                <div class="category-item" data-category="${categorySlug}" data-original-category="${categoryName}" data-category-id="${categoryId}">
                    <div class="category-icon">
                        <img src="assets/default.webp" alt="${config.display}" style="width: 100%; height: 100%; object-fit: contain;">
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
    const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES);
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
        const categoriesContainer = document.getElementById('categories-container');
        if (categoriesContainer) {
            console.log('🙈 Ocultando panel de categorías debido a error en la carga');
            categoriesContainer.classList.add('d-none');
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing app...');
    console.log('🌐 Sistema completamente basado en endpoints');
    
    // Solo cargar categorías desde endpoint
    await fetchAndRenderCategories();
    
    initializeSwiper();
    initializeEventListeners();
    
    // Cargar productos iniciales desde endpoints
    console.log('🚀 Iniciando carga de productos desde endpoints...');
    await loadInitialProducts();
    
    // initializeSearch(); // Comentado - causaba búsqueda automática al escribir
    
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
        categoriesWrapper.addEventListener('click', async function(e) {
            const categoryItem = e.target.closest('.category-item');
            if (!categoryItem) return;
            
            console.log('🏷️ Categoría seleccionada:', categoryItem.dataset.category);
            
            // Remover clase active de todas las categorías
            document.querySelectorAll('.category-item').forEach(cat => cat.classList.remove('active'));
            // Agregar clase active a la categoría seleccionada
            categoryItem.classList.add('active');
            
            // Obtener información de la categoría
            const categorySlug = categoryItem.dataset.category;
            const originalCategory = categoryItem.dataset.originalCategory || categorySlug;
            const categoryId = categoryItem.dataset.categoryId;
            
            // Mostrar estado de carga
            const sectionTitle = document.querySelector('.section-title h2');
            const categoryName = categoryItem.querySelector('span').textContent;
            
            if (categorySlug === 'all') {
                sectionTitle.textContent = 'Todos los productos';
            } else {
                sectionTitle.textContent = `${categoryName} - Cargando...`;
            }
            
            // Mostrar estado de carga en el grid
            const grid = document.getElementById('products-grid');
            if (grid) {
                grid.innerHTML = `
                    <div class="no-products-found">
                        <div class="no-products-content">
                            <i class="fas fa-spinner fa-spin" style="font-size: 4rem; color: #7AD31C; margin-bottom: 1rem;"></i>
                            <h3 style="color: #4F4F4D; margin-bottom: 0.5rem; font-family: 'Montserrat', sans-serif; font-weight: 600;">Cargando productos...</h3>
                            <p style="color: #666; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif;">Obteniendo productos de ${categoryName}</p>
                        </div>
                    </div>
                `;
            }
            
            try {
                // Cargar productos de la categoría
                let products;
                if (categorySlug === 'all') {
                    products = await getProductsByCategory('all');
                } else {
                    // Pasar tanto el nombre como el ID de la categoría
                    products = await getProductsByCategory(originalCategory, categoryId);
                }
                
                renderProducts(products);
                
                // Actualizar título de sección (quitar "Cargando...")
                if (categorySlug === 'all') {
                    sectionTitle.textContent = 'Todos los productos';
                } else {
                    sectionTitle.textContent = categoryName;
                }
                
                console.log('✅ Productos cargados para categoría:', categoryName);
                
            } catch (error) {
                console.error('❌ Error cargando productos:', error);
                
                // Mostrar error en el grid
                if (grid) {
                    grid.innerHTML = `
                        <div class="no-products-found">
                            <div class="no-products-content">
                                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #dc3545; margin-bottom: 1rem;"></i>
                                <h3 style="color: #4F4F4D; margin-bottom: 0.5rem; font-family: 'Montserrat', sans-serif; font-weight: 600;">Error al cargar productos</h3>
                                <p style="color: #666; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif;">No se pudieron obtener los productos de ${categoryName}</p>
                            </div>
                        </div>
                    `;
                }
                
                sectionTitle.textContent = `${categoryName} - Error`;
            }
        });
    }

    // Búsqueda mejorada - Solo con Enter
    const searchInput = document.querySelector('#search-input');
    
    if (searchInput) {
        // Event listener para la tecla Enter
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault(); // Prevenir submit del formulario
                performSearch();
            }
        });
        
        // Event listener adicional para compatibilidad
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                performSearch();
            }
        });
        
        // Event listener para detectar cuando se borra todo el contenido
        searchInput.addEventListener('input', function(e) {
            const currentValue = e.target.value.trim();
            // Si el campo está vacío, reiniciar la búsqueda
            if (currentValue === '') {
                console.log('🔄 Campo de búsqueda vacío - Reiniciando búsqueda');
                performSearch(); // Esto cargará todos los productos
            }
        });
    }
    
    // Funcionalidad del logo - regresar al inicio
    const logo = document.getElementById('logo-home');
    if (logo) {
        logo.addEventListener('click', function() {
            console.log('🏠 Logo clickeado - Regresando al inicio');
            goToHome();
        });
    }
    
    // Manejar redimensionamiento de ventana
    /* window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            searchContainer.classList.remove('expanded');
        }
    }); */
}

// Función para regresar al inicio
async function goToHome() {
    try {
        console.log('🏠 Iniciando regreso al inicio...');
        
        // Limpiar el input de búsqueda
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Restaurar título
        const sectionTitle = document.querySelector('.section-title h2');
        if (sectionTitle) {
            sectionTitle.textContent = 'Todos los productos';
        }
        
        // Remover active de todas las categorías y activar "Todos"
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const allCategory = document.querySelector('.category-item[data-category="all"]');
        if (allCategory) {
            allCategory.classList.add('active');
        }
        
        // Cargar todos los productos
        await loadInitialProducts();
        
        console.log('✅ Regreso al inicio completado');
        
    } catch (error) {
        console.error('❌ Error al regresar al inicio:', error);
    }
}

// Función para realizar búsqueda mejorada
async function performSearch() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) {
        console.error('❌ Input de búsqueda no encontrado');
        return;
    }
    
    const query = searchInput.value.trim();
    const sectionTitle = document.querySelector('.section-title h2');
    
    console.log(`🔍 Realizando búsqueda: "${query}"`);
    
    // Si no hay query, cargar todos los productos
    if (query.length === 0) {
        await loadInitialProducts();
        if (sectionTitle) {
            sectionTitle.textContent = 'Todos los productos';
        }
        return;
    }
    
    // Validar longitud mínima de búsqueda
    if (query.length < 2) {
        console.log('⚠️ Query muy corto, mínimo 2 caracteres');
        return;
    }
    
    // Mostrar estado de carga
    if (sectionTitle) {
        sectionTitle.textContent = `Buscando: "${query}"...`;
    }
    
    const grid = document.getElementById('products-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="no-products-found">
                    <div class="no-products-content text-center py-5">
                        <div class="spinner-border text-success mb-3" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <h3 style="color: #4F4F4D; margin-bottom: 0.5rem; font-family: 'Montserrat', sans-serif; font-weight: 600;">Buscando productos...</h3>
                        <p style="color: #666; margin-bottom: 0; font-family: 'Inter', sans-serif;">Consultando "${query}" en el sistema</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    try {
        const results = await searchProducts(query);
        
        if (results && Array.isArray(results)) {
            renderProducts(results);
            
            // Actualizar título
            if (sectionTitle) {
                sectionTitle.textContent = `Resultados para: "${query}" (${results.length} encontrados)`;
            }
            
            console.log(`✅ Búsqueda completada: ${results.length} productos encontrados`);
        } else {
            throw new Error('Respuesta inválida del servidor');
        }
        
        // Remover active de categorías
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
    } catch (error) {
        console.error('❌ Error en búsqueda:', error);
        if (sectionTitle) {
            sectionTitle.textContent = `Error buscando: "${query}"`;
        }
        renderProducts([]);
        
        // Mostrar mensaje de error
        if (grid) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="no-products-found">
                        <div class="no-products-content text-center py-5">
                            <i class="bi bi-exclamation-triangle" style="font-size: 4rem; color: #dc3545; margin-bottom: 1rem;"></i>
                            <h3 style="color: #4F4F4D; margin-bottom: 0.5rem;">Error en la búsqueda</h3>
                            <p style="color: #666; margin-bottom: 1rem;">No se pudo realizar la búsqueda. Intenta de nuevo.</p>
                            <button class="btn btn-success" onclick="loadInitialProducts()">Cargar todos los productos</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Función para inicializar búsqueda en tiempo real
function initializeSearch() {
    const searchInput = document.querySelector('#search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = this.value.trim();
            const sectionTitle = document.querySelector('.section-title h2');
            
            if (query.length === 0) {
                await loadInitialProducts();
                // Restaurar título original
                sectionTitle.textContent = 'Todos los productos';
                return;
            }
            
            if (query.length >= 2) {
                await performSearch();
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
