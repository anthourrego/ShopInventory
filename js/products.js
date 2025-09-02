// Base de datos de productos (DESHABILITADA - Ahora usamos products.json)
/*
const products = [
    // Productos comentados - ahora se cargan desde assets/products.json
];
*/

// Array vacío como fallback
const products = [];

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    // Usar exclusivamente productos del JSON
    const allProducts = window.productsFromJSON || [];
    
    if (!category || category === 'all') {
        return allProducts;
    }
    return allProducts.filter(product => product.category === category);
}

// Función para obtener un producto por ID
function getProductById(id) {
    // Usar exclusivamente productos del JSON
    const allProducts = window.productsFromJSON || [];
    
    return allProducts.find(product => product.id === parseInt(id));
}

// Función para buscar productos
function searchProducts(query) {
    // Usar exclusivamente productos del JSON
    const allProducts = window.productsFromJSON || [];
    
    const searchTerm = query.toLowerCase();
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
    );
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
    
    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-product-id="${product.id}" onclick="openProductModal(${product.id}); console.log('Card clicked for product: ${product.id}');">
            <div class="product-images">
                <img src="${product.images && product.images.length > 0 ? product.images[0] : 'assets/placeholder.svg'}" alt="${product.name}" class="product-main-image" 
                     onerror="this.src='assets/placeholder.svg'">
                ${product.images && product.images.length > 1 ? `
                    <img src="${product.images[1]}" alt="${product.name}" class="product-secondary-image"
                         onerror="this.style.display='none'">
                ` : ''}
            </div>
            <div class="product-info p-3">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price text-end mb-0 mt-2">${formatPrice(product.price)}</p>
            </div>
        </div>
    `).join('');
}

// Función para cargar productos iniciales
function loadInitialProducts() {
    // Esperar hasta que los productos del JSON estén disponibles
    if (!window.productsFromJSON || window.productsFromJSON.length === 0) {
        console.log('⏳ Esperando carga de productos del JSON...');
        setTimeout(loadInitialProducts, 100); // Reintentar en 100ms
        return;
    }
    
    const activeCategory = document.querySelector('.category-item.active')?.dataset.category || 'all';
    const products = getProductsByCategory(activeCategory);
    console.log(`📦 Cargando ${products.length} productos para categoría: ${activeCategory}`);
    renderProducts(products);
}

// Función para abrir modal de producto
function openProductModal(productId) {
    console.log('🚀 Abriendo modal para producto:', productId);
    
    // Verificar que el producto existe
    const product = getProductById(productId);
    if (!product) {
        console.error('❌ Producto no encontrado:', productId);
        alert('Producto no encontrado');
        return;
    }
    
    console.log('✅ Producto encontrado:', product.name);
    
    // Obtener elementos del DOM
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('overlay');
    
    if (!modal || !overlay) {
        console.error('❌ Elementos del modal no encontrados');
        alert('Error: Modal no disponible');
        return;
    }
    
    console.log('✅ Elementos del modal encontrados');
    
    // Llenar información básica del producto
    try {
        const modalName = document.getElementById('modal-product-name');
        const modalPrice = document.getElementById('modal-product-price');
        const modalDescription = document.getElementById('modal-product-description');
        
        if (modalName) modalName.textContent = product.name;
        if (modalPrice) modalPrice.textContent = '$' + product.price.toLocaleString('es-CO');
        if (modalDescription) modalDescription.textContent = product.description;
        
        console.log('✅ Información del producto cargada');
    } catch (error) {
        console.error('❌ Error cargando información:', error);
    }
    
    // Configurar imágenes
    try {
        const imagesWrapper = document.getElementById('product-images-wrapper');
        if (imagesWrapper) {
            if (product.images && product.images.length > 0) {
                imagesWrapper.innerHTML = product.images.map(image => `
                    <div class="swiper-slide">
                        <img src="${image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;" 
                             onerror="this.src='assets/placeholder.svg'">
                    </div>
                `).join('');
            } else {
                // Si no hay imágenes, usar placeholder por defecto
                imagesWrapper.innerHTML = `
                    <div class="swiper-slide">
                        <img src="assets/placeholder.svg" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;">
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
            addToCartBtn.onclick = function() {
                console.log('🛒 Agregando al carrito...');
                const quantityInput = document.getElementById('quantity');
                
                const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
                
                if (typeof addToCart === 'function') {
                    addToCart(productId, quantity);
                    closeProductModal();
                } else {
                    console.error('❌ Función addToCart no disponible');
                    alert('Error: Función de carrito no disponible');
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
window.getProductsByCategory = getProductsByCategory;
window.getProductById = getProductById;
window.searchProducts = searchProducts;
window.formatPrice = formatPrice;
window.renderProducts = renderProducts;
window.loadInitialProducts = loadInitialProducts;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
