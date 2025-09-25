// Base de datos de productos (DESHABILITADA - Ahora usamos products.json)
/*
const products = [
    // Productos comentados - ahora se cargan desde assets/products.json
];
*/

// Array vacío como fallback
const products = [];

// Caché de productos para evitar peticiones innecesarias
const productsCache = new Map();

// Asegurar que las constantes globales estén disponibles (definidas en main.js)
if (typeof API_CONFIG === 'undefined') {
    console.warn('⚠️ API_CONFIG no encontrado, usando configuración local');
    window.API_CONFIG = {
        BASE_URL: 'http://inventorysystem/Shop',
        ENDPOINTS: {
            CATEGORIES: '/getCategories',
            PRODUCTS: '/getProducts',
            PRODUCT_BY_ID: '/getProduct',
            SEARCH_PRODUCTS: '/searchProducts'
        }
    };
    
    window.buildApiUrl = function(endpoint, params = '') {
        return `${window.API_CONFIG.BASE_URL}${endpoint}${params}`;
    };
}

// Funciones de manejo de caché
function addToCache(product) {
    if (product && product.id) {
        productsCache.set(parseInt(product.id), product);
        console.log(`💾 Producto ${product.id} agregado al caché`);
    }
}

function getFromCache(productId) {
    const castedId = parseInt(productId);
    const cachedProduct = productsCache.get(castedId);
    if (cachedProduct) {
        console.log(`🚀 Producto ${castedId} encontrado en caché`);
        return cachedProduct;
    }
    return null;
}

function addMultipleToCache(products) {
    if (Array.isArray(products)) {
        products.forEach(product => addToCache(product));
        console.log(`💾 ${products.length} productos agregados al caché`);
    }
}

// Función para obtener productos por categoría
async function getProductsByCategory(category, categoryId = null) {
    console.log('🔍 Obteniendo productos para categoría:', category, 'ID:', categoryId);
    
    try {
        let endpoint;
        
        // Si es "all" o no hay categoría, usar endpoint para todos los productos
        if (!category || category === 'all') {
            endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS);
            console.log(`🌐 Consultando TODOS los productos desde: ${endpoint}`);
        } else if (categoryId) {
            // Si hay un categoryId, consultar el endpoint específico
            endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS, `/${categoryId}`);
            console.log(`🌐 Consultando productos desde: ${endpoint}`);
        } else {
            throw new Error('No se puede consultar productos sin ID de categoría');
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const products = await response.json();
        console.log(`✅ ${products.length} productos obtenidos del endpoint`);
        
        // Validar y agregar imágenes por defecto si no existen
        const processedProducts = products.map(product => ({
            ...product,
            images: product.images || ['assets/placeholder.svg']
        }));
        
        // Agregar productos al caché automáticamente
        addMultipleToCache(processedProducts);
        
        return processedProducts;
        
    } catch (error) {
        console.error('❌ Error obteniendo productos del endpoint:', error);
        console.log('� Sin fallback disponible - sistema completamente basado en endpoints');
        
        // Sin fallback - devolver array vacío con error
        return [];
    }
}

// Función para obtener un producto por ID
async function getProductById(id) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID, `/${id}`);
        console.log(`🌐 Consultando producto por ID desde: ${endpoint}`);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const product = await response.json();
        console.log(`✅ Producto obtenido del endpoint:`, product.name);
        
        // Validar y agregar imágenes por defecto si no existen
        const processedProduct = {
            ...product,
            images: product.images || ['assets/placeholder.svg']
        };
        
        // Agregar producto al caché automáticamente
        addToCache(processedProduct);
        
        return processedProduct;
        
    } catch (error) {
        console.error('❌ Error obteniendo producto del endpoint:', error);
        return null;
    }
}

// Función para buscar productos
async function searchProducts(query) {
    try {
        const endpoint = buildApiUrl(API_CONFIG.ENDPOINTS.SEARCH_PRODUCTS, `?q=${encodeURIComponent(query)}`);
        console.log(`🔍 Buscando productos desde: ${endpoint}`);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const products = await response.json();
        console.log(`✅ ${products.length} productos encontrados en búsqueda`);
        
        // Validar y agregar imágenes por defecto si no existen
        const processedProducts = products.map(product => ({
            ...product,
            images: product.images || ['assets/placeholder.svg']
        }));
        
        // Agregar productos al caché automáticamente
        addMultipleToCache(processedProducts);
        
        return processedProducts;
        
    } catch (error) {
        console.error('❌ Error buscando productos del endpoint:', error);
        return [];
    }
}

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

// Función para renderizar productos
function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    
    if (!productsToRender || productsToRender.length === 0) {
        // Verificar si es porque no se han cargado los productos del JSON
        if (!window.productsFromJSON || window.productsFromJSON.length === 0) {
            grid.innerHTML = `
                <div class="no-products-found">
                    <div class="no-products-content">
                        <i class="fas fa-hourglass-half" style="font-size: 4rem; color: #7AD31C; margin-bottom: 1rem; opacity: 0.7;"></i>
                        <h3 style="color: #4F4F4D; margin-bottom: 0.5rem; font-family: 'Montserrat', sans-serif; font-weight: 600;">Cargando productos...</h3>
                        <p style="color: #666; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif;">Por favor espera mientras cargamos nuestro catálogo.</p>
                    </div>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="no-products-found">
                    <div class="no-products-content">
                        <i class="fas fa-search" style="font-size: 4rem; color: #7AD31C; margin-bottom: 1rem; opacity: 0.7;"></i>
                        <h3 style="color: #4F4F4D; margin-bottom: 0.5rem; font-family: 'Montserrat', sans-serif; font-weight: 600;">No se encontraron productos</h3>
                        <p style="color: #666; margin-bottom: 1.5rem; font-family: 'Inter', sans-serif;">Intenta con otros términos de búsqueda o explora nuestras categorías.</p>
                        <button onclick="document.querySelector('.search-input').value = ''; document.querySelector('.search-input').focus(); loadInitialProducts(); document.querySelector('.section-title h2').textContent = 'Todos los productos';" 
                                style="background: linear-gradient(135deg, #4F4F4D, #7AD31C); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: 600; font-family: 'Inter', sans-serif; transition: transform 0.2s ease;">
                            Ver todos los productos
                        </button>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    grid.innerHTML = productsToRender.map(product => {
        const stock = parseInt(product.stock) || 0;
        const isOutOfStock = stock <= 0;
        const isLowStock = stock > 0 && stock <= 15;
        
        return `
        <div class="col-xl-3 col-lg-4 col-md-6 col-6">
            <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}" ${isOutOfStock ? '' : `onclick="openProductModalWithCache(${product.id}); console.log('Card clicked for product: ${product.id}');"`}>
                <div class="product-images">
                    <img src="${product.FotoURLSmall || (product.images && product.images.length > 0 ? product.images[0] : 'assets/placeholder.svg')}" alt="${product.name}" class="product-main-image" 
                         onerror="this.src='assets/placeholder.svg'">
                    ${product.images && product.images.length > 1 ? `
                        <img src="${product.images[1]}" alt="${product.name}" class="product-secondary-image"
                             onerror="this.style.display='none'">
                    ` : ''}
                    ${isOutOfStock ? '<div class="stock-overlay"><span class="out-of-stock-badge">Sin Stock</span></div>' : ''}
                </div>
                <div class="product-info p-3">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-footer">
                        <p class="product-price text-end mb-0">${formatPrice(product.price)}</p>
                        <div class="stock-info">
                            ${isOutOfStock ? '<span class="stock-status out-of-stock">Sin stock</span>' : 
                              isLowStock ? `<span class="stock-status low-stock">${stock} disponibles</span>` : 
                              ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Función para cargar productos iniciales
async function loadInitialProducts() {
    console.log('🚀 Cargando productos iniciales desde endpoints...');
    
    const activeCategory = document.querySelector('.category-item.active')?.dataset.category || 'all';
    const activeCategoryId = document.querySelector('.category-item.active')?.dataset.categoryId;
    const activeCategoryName = document.querySelector('.category-item.active')?.dataset.originalCategory || activeCategory;
    
    try {
        console.log(`📡 Consultando productos para categoría: ${activeCategory}`);
        const products = await getProductsByCategory(activeCategoryName, activeCategoryId);
        console.log(`📦 Cargando ${products.length} productos para categoría: ${activeCategory}`);
        renderProducts(products);
    } catch (error) {
        console.error('❌ Error cargando productos iniciales:', error);
        renderProducts([]); // Mostrar mensaje de error
    }
}

// Función para castear valores de productos
function castProductValues(product) {
    console.log('🔄 Casteando valores del producto:', product);
    
    if (!product) {
        console.warn('⚠️ Producto nulo o indefinido');
        return null;
    }
    
    try {
        const castedProduct = {
            // Castear ID como número
            id: parseInt(product.id) || 0,
            
            // Castear nombre como string
            name: String(product.name || '').trim(),
            
            // Castear precio como número
            price: parseFloat(product.price) || 0,
            
            // Castear descripción como string
            description: String(product.description || '').trim(),
            
            // Castear categoría como string
            category: String(product.category || '').trim(),
            
            // Castear stock como número entero
            stock: parseInt(product.stock) || 0,
            
            // Castear imágenes como array de strings (mantenemos compatibilidad con images)
            images: Array.isArray(product.images) 
                ? product.images.map(img => String(img || '').trim()).filter(img => img)
                : [],
            
            // Castear campos de foto específicos del endpoint
            FotoURLSmall: String(product.FotoURLSmall || '').trim(),
            FotoURL: String(product.FotoURL || '').trim(),
            
            // Mantener propiedades adicionales si existen
            ...Object.keys(product).reduce((acc, key) => {
                if (!['id', 'name', 'price', 'description', 'category', 'images', 'FotoURLSmall', 'FotoURL'].includes(key)) {
                    acc[key] = product[key];
                }
                return acc;
            }, {})
        };
        
        console.log('✅ Producto casteado correctamente:', {
            id: castedProduct.id,
            name: castedProduct.name,
            price: castedProduct.price,
            stock: castedProduct.stock,
            imagesCount: castedProduct.images.length
        });
        
        return castedProduct;
        
    } catch (error) {
        console.error('❌ Error casteando producto:', error);
        return product; // Devolver original si hay error
    }
}

// Función optimizada para abrir modal de producto usando caché
async function openProductModalWithCache(productId) {
    // Castear productId a número
    const castedProductId = parseInt(productId);
    console.log('🚀 Abriendo modal para producto:', castedProductId, '(original:', productId, ')');
    
    // Obtener elementos del DOM
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('overlay');
    
    if (!modal || !overlay) {
        console.error('❌ Elementos del modal no encontrados');
        alert('Error: Modal no disponible');
        return;
    }
    
    // Intentar obtener producto desde caché primero
    let product = getFromCache(castedProductId);
    
    if (product) {
        console.log('💾 Usando producto desde caché - NO se hará petición al endpoint');
        
        // Castear valores del producto para asegurar tipos correctos
        const castedProduct = castProductValues(product);
        
        // Llenar modal directa e inmediatamente con datos del caché
        populateProductModal(castedProduct, castedProductId, modal, overlay);
        
    } else {
        console.log('🌐 Producto no encontrado en caché - consultando endpoint...');
        
        // Mostrar modal con estado de carga
        showLoadingModal(modal, overlay);
        
        // Obtener producto desde endpoint
        product = await getProductById(castedProductId);
        if (!product) {
            console.error('❌ Producto no encontrado:', castedProductId);
            showErrorModal(modal);
            return;
        }
        
        console.log('✅ Producto obtenido desde endpoint:', product.name);
        
        // Castear valores del producto
        const castedProduct = castProductValues(product);
        
        // Llenar modal con datos obtenidos
        populateProductModal(castedProduct, castedProductId, modal, overlay);
    }
}

// Función auxiliar para mostrar modal con estado de carga
function showLoadingModal(modal, overlay) {
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    
    if (modalName) modalName.textContent = 'Cargando...';
    if (modalPrice) modalPrice.textContent = '$0';
    if (modalDescription) modalDescription.textContent = 'Obteniendo información del producto...';
    
    modal.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal mostrado con estado de carga');
}

// Función auxiliar para mostrar modal con error
function showErrorModal(modal) {
    const modalName = document.getElementById('modal-product-name');
    const modalDescription = document.getElementById('modal-product-description');
    
    if (modalName) modalName.textContent = 'Producto no encontrado';
    if (modalDescription) modalDescription.textContent = 'No se pudo cargar la información del producto.';
}

// Función auxiliar para llenar el modal con datos del producto
function populateProductModal(castedProduct, castedProductId, modal, overlay) {
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    
    console.log('🎨 Llenando modal con datos del producto:', castedProduct.name);
    
    // Llenar información básica del producto
    try {
        const productStock = parseInt(castedProduct.stock) || 0;
        
        if (modalName) modalName.textContent = castedProduct.name;
        if (modalPrice) {
            modalPrice.textContent = '$' + castedProduct.price.toLocaleString('es-CO');
            modalPrice.style.fontWeight = 'bold';
        }
        if (modalDescription) modalDescription.textContent = castedProduct.description;
        
        // Agregar información de disponibilidad
        const availabilityInfo = document.getElementById('modal-availability-info');
        if (availabilityInfo) {
            if (productStock <= 0) {
                availabilityInfo.textContent = 'Agotado';
                availabilityInfo.className = 'availability-info out-of-stock';
            } else if (productStock <= 15) {
                availabilityInfo.textContent = `${productStock} disponibles`;
                availabilityInfo.className = 'availability-info low-stock';
            } else {
                availabilityInfo.textContent = 'Disponible';
                availabilityInfo.className = 'availability-info available';
            }
        }
        
        console.log('✅ Información del producto cargada (Stock:', productStock, ')');
    } catch (error) {
        console.error('❌ Error cargando información:', error);
    }
    
    // Configurar imágenes
    try {
        const imagesWrapper = document.getElementById('product-images-wrapper');
        if (imagesWrapper) {
            // Priorizar FotoURL del endpoint, luego images como fallback
            if (castedProduct.FotoURL) {
                imagesWrapper.innerHTML = `
                    <div class="swiper-slide">
                        <img src="${castedProduct.FotoURL}" alt="${castedProduct.name}" onerror="this.src='assets/placeholder.svg'">
                    </div>
                `;
            } else if (castedProduct.images && castedProduct.images.length > 0) {
                imagesWrapper.innerHTML = castedProduct.images.map(image => `
                    <div class="swiper-slide">
                        <img src="${image}" alt="${castedProduct.name}" onerror="this.src='assets/placeholder.svg'">
                    </div>
                `).join('');
            } else {
                // Si no hay imágenes, usar placeholder por defecto
                imagesWrapper.innerHTML = `
                    <div class="swiper-slide">
                        <img src="assets/placeholder.svg" alt="${castedProduct.name}">
                    </div>
                `;
            }
            console.log('✅ Imágenes configuradas');
        }
    } catch (error) {
        console.error('❌ Error cargando imágenes:', error);
    }
    
    // Configurar botón de agregar al carrito
    try {
        const addToCartBtn = document.getElementById('add-to-cart-modal');
        if (addToCartBtn) {
            addToCartBtn.onclick = async function() {
                console.log('🛒 Agregando al carrito...');
                const quantityInput = document.getElementById('quantity');
                
                const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
                
                // Deshabilitar botón mientras se procesa
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Agregando...';
                
                try {
                    if (typeof addToCart === 'function') {
                        await addToCart(castedProductId, quantity);
                        closeProductModal();
                    } else {
                        console.error('❌ Función addToCart no disponible');
                        alert('Error: Función de carrito no disponible');
                    }
                } catch (error) {
                    console.error('❌ Error agregando al carrito:', error);
                } finally {
                    // Restaurar botón
                    addToCartBtn.disabled = false;
                    addToCartBtn.textContent = 'Agregar al carrito';
                }
            };
            console.log('✅ Botón de carrito configurado');
        }
    } catch (error) {
        console.error('❌ Error configurando botón:', error);
    }
    
    // Configurar controles de cantidad
    try {
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const quantityInput = document.getElementById('quantity');
        
        // Resetear cantidad a 1 cada vez que se abre el modal
        if (quantityInput) {
            quantityInput.value = 1;
            console.log('🔄 Cantidad reseteada a 1');
        }
        
        if (qtyMinus && quantityInput) {
            qtyMinus.onclick = function() {
                let currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            };
        }
        
        if (qtyPlus && quantityInput) {
            qtyPlus.onclick = function() {
                let currentValue = parseInt(quantityInput.value) || 1;
                quantityInput.value = currentValue + 1;
            };
        }
        
        console.log('✅ Controles de cantidad configurados');
    } catch (error) {
        console.error('❌ Error configurando controles:', error);
    }
    
    // Mostrar modal
    try {
        console.log('🎭 Mostrando modal...');
        modal.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Verificar que se aplicó la clase
        setTimeout(() => {
            if (modal.classList.contains('show')) {
                console.log('✅ Modal visible correctamente');
            } else {
                console.error('❌ Modal no se mostró correctamente');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error mostrando modal:', error);
        alert('Error mostrando modal: ' + error.message);
    }
    
    // Configurar validaciones de stock después de mostrar el modal
    configureStockValidation(castedProduct);
}

// Función para configurar validaciones de stock en el modal
function configureStockValidation(product) {
    try {
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const quantityInput = document.getElementById('quantity');
        const addToCartBtn = document.getElementById('add-to-cart-modal');
        const productStock = parseInt(product.stock) || 0;
        
        console.log('🏷️ Configurando validaciones de stock:', productStock);
        
        // Configurar input de cantidad
        if (quantityInput) {
            quantityInput.max = productStock;
            
            quantityInput.addEventListener('input', function() {
                let value = parseInt(this.value) || 1;
                if (value > productStock) {
                    this.value = productStock;
                    console.warn('⚠️ Cantidad ajustada al stock máximo:', productStock);
                } else if (value < 1) {
                    this.value = 1;
                }
            });
        }
        
        // Configurar botón plus
        if (qtyPlus && quantityInput) {
            qtyPlus.onclick = function() {
                let currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue < productStock) {
                    quantityInput.value = currentValue + 1;
                } else {
                    console.warn('⚠️ No se puede agregar más, stock máximo alcanzado');
                }
            };
        }
        
        // Deshabilitar elementos si no hay stock
        if (productStock <= 0) {
            if (qtyMinus) qtyMinus.disabled = true;
            if (qtyPlus) qtyPlus.disabled = true;
            if (quantityInput) quantityInput.disabled = true;
            
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'No disponible';
                addToCartBtn.style.background = '#6c757d';
                addToCartBtn.style.cursor = 'not-allowed';
            }
        }
        
        console.log('✅ Validaciones de stock configuradas (Stock:', productStock, ')');
        
    } catch (error) {
        console.error('❌ Error configurando validaciones de stock:', error);
    }
}

// Función para abrir modal de producto (método original - mantenido para compatibilidad)
async function openProductModal(productId) {
    // Castear productId a número
    const castedProductId = parseInt(productId);
    console.log('🚀 Abriendo modal para producto:', castedProductId, '(original:', productId, ')');
    
    // Obtener elementos del DOM
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('overlay');
    
    if (!modal || !overlay) {
        console.error('❌ Elementos del modal no encontrados');
        alert('Error: Modal no disponible');
        return;
    }
    
    // Obtener elementos de contenido
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');
    
    // Mostrar modal con contenido de carga
    if (modalName) modalName.textContent = 'Cargando...';
    if (modalPrice) modalPrice.textContent = '$0';
    if (modalDescription) modalDescription.textContent = 'Obteniendo información del producto...';
    
    modal.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal mostrado con estado de carga');
    
    // Verificar que el producto existe
    const product = await getProductById(castedProductId);
    if (!product) {
        console.error('❌ Producto no encontrado:', castedProductId);
        if (modalName) modalName.textContent = 'Producto no encontrado';
        if (modalDescription) modalDescription.textContent = 'No se pudo cargar la información del producto.';
        return;
    }
    
    console.log('✅ Producto encontrado:', product.name);
    
    // Castear valores del producto para asegurar tipos correctos
    const castedProduct = castProductValues(product);
    console.log('🔄 Valores del producto casteados:', castedProduct);
    
    // Llenar información básica del producto
    try {
        const productStock = parseInt(castedProduct.stock) || 0;
        
        if (modalName) modalName.textContent = castedProduct.name;
        if (modalPrice) {
            modalPrice.textContent = '$' + castedProduct.price.toLocaleString('es-CO');
            modalPrice.style.fontWeight = 'bold';
        }
        if (modalDescription) modalDescription.textContent = castedProduct.description;
        
        // Agregar información de disponibilidad
        const availabilityInfo = document.getElementById('modal-availability-info');
        if (availabilityInfo) {
            if (productStock <= 0) {
                availabilityInfo.textContent = 'Agotado';
                availabilityInfo.className = 'availability-info out-of-stock';
            } else if (productStock <= 15) {
                availabilityInfo.textContent = `${productStock} disponibles`;
                availabilityInfo.className = 'availability-info low-stock';
            } else {
                availabilityInfo.textContent = 'Disponible';
                availabilityInfo.className = 'availability-info available';
            }
        }
        
        console.log('✅ Información del producto cargada (Stock:', productStock, ')');
    } catch (error) {
        console.error('❌ Error cargando información:', error);
    }
    
    // Configurar imágenes
    try {
        const imagesWrapper = document.getElementById('product-images-wrapper');
        if (imagesWrapper) {
            // Priorizar FotoURL del endpoint, luego images como fallback
            if (castedProduct.FotoURL) {
                imagesWrapper.innerHTML = `
                    <div class="swiper-slide">
                        <img src="${castedProduct.FotoURL}" alt="${castedProduct.name}" onerror="this.src='assets/placeholder.svg'">
                    </div>
                `;
            } else if (castedProduct.images && castedProduct.images.length > 0) {
                imagesWrapper.innerHTML = castedProduct.images.map(image => `
                    <div class="swiper-slide">
                        <img src="${image}" alt="${castedProduct.name}" onerror="this.src='assets/placeholder.svg'">
                    </div>
                `).join('');
            } else {
                // Si no hay imágenes, usar placeholder por defecto
                imagesWrapper.innerHTML = `
                    <div class="swiper-slide">
                        <img src="assets/placeholder.svg" alt="${castedProduct.name}">
                    </div>
                `;
            }
            console.log('✅ Imágenes configuradas');
        }
    } catch (error) {
        console.error('❌ Error cargando imágenes:', error);
    }
    
    // Configurar botón de agregar al carrito
    try {
        const addToCartBtn = document.getElementById('add-to-cart-modal');
        if (addToCartBtn) {
            addToCartBtn.onclick = async function() {
                console.log('🛒 Agregando al carrito...');
                const quantityInput = document.getElementById('quantity');
                
                const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
                
                // Deshabilitar botón mientras se procesa
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Agregando...';
                
                try {
                    if (typeof addToCart === 'function') {
                        await addToCart(castedProductId, quantity);
                        closeProductModal();
                    } else {
                        console.error('❌ Función addToCart no disponible');
                        alert('Error: Función de carrito no disponible');
                    }
                } catch (error) {
                    console.error('❌ Error agregando al carrito:', error);
                } finally {
                    // Restaurar botón
                    addToCartBtn.disabled = false;
                    addToCartBtn.textContent = 'Agregar al carrito';
                }
            };
            console.log('✅ Botón de carrito configurado');
        }
    } catch (error) {
        console.error('❌ Error configurando botón:', error);
    }
    
    // Configurar controles de cantidad
    try {
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const quantityInput = document.getElementById('quantity');
        
        // Resetear cantidad a 1 cada vez que se abre el modal
        if (quantityInput) {
            quantityInput.value = 1;
            console.log('🔄 Cantidad reseteada a 1');
        }
        
        if (qtyMinus && quantityInput) {
            qtyMinus.onclick = function() {
                let currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            };
        }
        
        if (qtyPlus && quantityInput) {
            qtyPlus.onclick = function() {
                let currentValue = parseInt(quantityInput.value) || 1;
                quantityInput.value = currentValue + 1;
            };
        }
        
        console.log('✅ Controles de cantidad configurados');
    } catch (error) {
        console.error('❌ Error configurando controles:', error);
    }
    
    // Mostrar modal
    try {
        console.log('🎭 Mostrando modal...');
        modal.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Verificar que se aplicó la clase
        setTimeout(() => {
            if (modal.classList.contains('show')) {
                console.log('✅ Modal visible correctamente');
            } else {
                console.error('❌ Modal no se mostró correctamente');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error mostrando modal:', error);
        alert('Error mostrando modal: ' + error.message);
    }
}

// Función para cerrar modal de producto
function closeProductModal() {
    console.log('🔄 Cerrando modal...');
    
    try {
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('overlay');
        
        if (modal) {
            modal.classList.remove('show');
            console.log('✅ Modal ocultado');
        }
        
        if (overlay) {
            overlay.classList.remove('show');
            console.log('✅ Overlay ocultado');
        }
        
        document.body.style.overflow = 'auto';
        console.log('✅ Scroll restaurado');
        
    } catch (error) {
        console.error('❌ Error cerrando modal:', error);
    }
}

// Exportar funciones para uso global
window.products = products;
window.productsFromJSON = window.productsFromJSON || [];
window.productsCache = productsCache;
window.getProductsByCategory = getProductsByCategory;
window.getProductById = getProductById;
window.searchProducts = searchProducts;
window.formatPrice = formatPrice;
window.renderProducts = renderProducts;
window.loadInitialProducts = loadInitialProducts;
window.openProductModal = openProductModal;
window.openProductModalWithCache = openProductModalWithCache;
window.closeProductModal = closeProductModal;
window.castProductValues = castProductValues;
window.configureStockValidation = configureStockValidation;
window.addToCache = addToCache;
window.getFromCache = getFromCache;
