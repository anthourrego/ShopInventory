// Estado del carrito
let cart = [];

// Función para agregar producto al carrito
async function addToCart(productId, quantity = 1) {
    try {
        console.log('🛒 Agregando producto al carrito:', productId);
        const product = await getProductById(productId);
        if (!product) {
            console.error('Producto no encontrado');
            showCartNotification('Error: Producto no encontrado', 'error');
            return;
        }

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => 
            item.product.id === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
            console.log(`➕ Cantidad actualizada: ${existingItem.quantity}`);
        } else {
            cart.push({
                product: product,
                quantity: quantity
            });
            console.log(`🆕 Producto agregado al carrito`);
        }

        updateCartUI();
        showCartNotification(`${product.name} agregado al carrito`);
        
    } catch (error) {
        console.error('❌ Error agregando producto al carrito:', error);
        showCartNotification('Error agregando producto al carrito', 'error');
    }
}

// Función para remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => 
        item.product.id !== productId
    );
    updateCartUI();
}

// Función para actualizar cantidad en el carrito
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => 
        item.product.id === productId
    );
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }
}

// Función para calcular el total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
}

// Función para obtener la cantidad total de items
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Función para actualizar la UI del carrito
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    const cartModalTotal = document.getElementById('cart-total-amount');
    
    const itemCount = getCartItemCount();
    const total = getCartTotal();
    
    cartCount.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);
    
    if (cartModalTotal) {
        cartModalTotal.textContent = formatPrice(total);
    }
    
    renderCartItems();
    
    // Actualizar estado del botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        if (itemCount === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('disabled');
            checkoutBtn.textContent = 'Carrito vacío';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('disabled');
            checkoutBtn.textContent = 'Enviar pedido por WhatsApp';
        }
    }
    
    // El carrito flotante siempre está visible como footer
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        // Bootstrap fixed-bottom ya maneja la visibilidad
        
        // Cambiar el texto según si hay items o no
        const cartText = floatingCart.querySelector('.cart-text');
        if (itemCount > 0) {
            cartText.textContent = 'Ver pedido';
        } else {
            cartText.textContent = 'Carrito vacío - ¡Agrega productos!';
        }
    }
}

// Función para renderizar items del carrito
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3; color: #7AD31C;"></i>
                <h4 style="color: #333; margin-bottom: 10px;">Tu carrito está vacío</h4>
                <p style="font-size: 14px; margin-bottom: 20px;">¡Descubre nuestros productos increíbles!</p>
                <button onclick="closeCartModal(); document.querySelector('.category-item[data-category=all]').click();" 
                        style="background: linear-gradient(135deg, #4F4F4D, #7AD31C); color: white; border: none; 
                               padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: bold;">
                    Ver todos los productos
                </button>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.product.images[0]}" alt="${item.product.name}" class="cart-item-image"
                 onerror="this.src='assets/placeholder.svg'">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">${formatPrice(item.product.price)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.product.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="updateCartQuantity(${item.product.id}, parseInt(this.value))"
                           style="width: 40px; text-align: center; border: none; background: transparent; font-weight: bold;">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.product.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Función para mostrar el modal del carrito
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    renderCartItems();
}

// Función para cerrar el modal del carrito
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    const overlay = document.getElementById('overlay');
    
    modal.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Función para mostrar notificación del carrito
function showCartNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    
    const backgroundColor = type === 'error' 
        ? 'linear-gradient(135deg, #dc3545, #c82333)' 
        : 'linear-gradient(135deg, #4F4F4D, #7AD31C)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para generar mensaje de WhatsApp
function generateWhatsAppMessage() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    let message = '🛍️ *NUEVO PEDIDO - FitWinner*\n\n';
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.product.name}*\n`;
        message += `    Cantidad: ${item.quantity}\n`;
        message += `   💰 Precio: ${formatPrice(item.product.price)}\n`;
        message += `   💵 Subtotal: ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });
    
    message += `💰 *TOTAL: ${formatPrice(getCartTotal())}*\n\n`;
    message += '📱 ¡Gracias por tu preferencia!\n';
    message += '🚚 Confirma tu pedido para proceder con el envío.';
    
    return encodeURIComponent(message);
}

// Función para enviar pedido por WhatsApp
function sendWhatsAppOrder() {
    // Verificar si el carrito está vacío
    if (cart.length === 0) {
        // Mostrar notificación más elegante
        showNotification('Tu carrito está vacío. ¡Agrega productos antes de enviar tu pedido!', 'warning');
        return;
    }
    
    // Verificar si el botón está deshabilitado (doble validación)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn && (checkoutBtn.disabled || checkoutBtn.classList.contains('disabled'))) {
        return; // No hacer nada si el botón está deshabilitado
    }
    
    const phoneNumber = '573103587032'; // Reemplazar con el número real
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Mostrar notificación de éxito
    showNotification('¡Pedido enviado! Te redirigimos a WhatsApp.', 'success');
    
    // Limpiar carrito después de enviar
    cart = [];
    updateCartUI();
    closeCartModal();
    
    showCartNotification('¡Pedido enviado! Te contactaremos pronto.');
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    updateCartUI();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Carrito flotante - siempre visible
    const floatingCart = document.querySelector('.floating-cart');
    if (floatingCart) {
        floatingCart.addEventListener('click', function() {
            // Siempre abrir el modal, independientemente del contenido
            showCartModal();
        });
        
        // Bootstrap fixed-bottom ya maneja la visibilidad, no necesitamos display manual
    }
    
    // Cerrar carrito
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartModal);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            // Prevenir acción si el botón está deshabilitado
            if (this.disabled || this.classList.contains('disabled')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            sendWhatsAppOrder();
        });
    }
    
    // Cerrar modal al hacer click en overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeCartModal();
            closeProductModal();
        });
    }
    
    // Inicializar carrito
    updateCartUI();
});

// Agregar estilos para las animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Exportar funciones para uso global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.showCartModal = showCartModal;
window.closeCartModal = closeCartModal;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.clearCart = clearCart;
