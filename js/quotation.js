// Sistema de cotizaciones por WhatsApp

// Mapeo de departamentos a ciudades principales (puedes expandir según necesites)
const departmentCities = {
    /* 'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta', 'La Estrella', 'Caldas', 'Copacabana'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Galapa', 'Puerto Colombia'],
    'Bogotá D.C.': ['Bogotá'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tulua', 'Cartago', 'Buga'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
    'Cundinamarca': ['Soacha', 'Fusagasugá', 'Chía', 'Zipaquirá', 'Facatativá', 'Madrid', 'Mosquera', 'Funza'],
    'Norte de Santander': ['Cúcuta', 'Villa del Rosario', 'Los Patios', 'Ocaña'],
    'Córdoba': ['Montería', 'Cereté', 'Lorica', 'Sahagún'],
    'Sucre': ['Sincelejo', 'Corozal', 'Sampués'],
    'Cesar': ['Valledupar', 'Aguachica', 'Codazzi'],
    'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación'],
    'La Guajira': ['Riohacha', 'Maicao', 'Fonseca'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón'],
    'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada'],
    'Casanare': ['Yopal', 'Aguazul', 'Villanueva'],
    'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'],
    'Caldas': ['Manizales', 'La Dorada', 'Chinchiná'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
    'Quindío': ['Armenia', 'Calarcá', 'La Tebaida', 'Montenegro'],
    'Nariño': ['Pasto', 'Tumaco', 'Ipiales'],
    'Cauca': ['Popayán', 'Santander de Quilichao'],
    'Putumayo': ['Mocoa', 'Puerto Asís'],
    'Caquetá': ['Florencia', 'San Vicente del Caguán'],
    'Chocó': ['Quibdó', 'Istmina'],
    'San Andrés y Providencia': ['San Andrés', 'Providencia'],
    'Guaviare': ['San José del Guaviare'],
    'Guainía': ['Inírida'],
    'Vaupés': ['Mitú'],
    'Vichada': ['Puerto Carreño'], */
    'Risaralda': ['Santa Rosa de Cabal']
};

// Función para abrir el modal de cotización
function openQuotationModal() {
    // Verificar que hay productos en el carrito
    if (!cart || cart.length === 0) {
        alert('Debes agregar productos al carrito antes de solicitar una cotización.');
        return;
    }
    
    const modal = document.getElementById('quotation-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Resetear formulario
        document.getElementById('quotation-form').reset();
        
        console.log('✅ Modal de cotización abierto');
    }
}

// Función para cerrar el modal de cotización
function closeQuotationModal() {
    const modal = document.getElementById('quotation-modal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        console.log('✅ Modal de cotización cerrado');
    }
}

// Función para actualizar ciudades basado en el departamento seleccionado
function updateCities() {
    const departmentSelect = document.getElementById('department');
    const citySelect = document.getElementById('city');
    
    if (!departmentSelect || !citySelect) return;
    
    const selectedDepartment = departmentSelect.value;
    
    // Limpiar opciones de ciudad
    citySelect.innerHTML = '<option value="">--</option>';
    
    if (selectedDepartment && departmentCities[selectedDepartment]) {
        departmentCities[selectedDepartment].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// Función para formatear el mensaje de WhatsApp
function formatWhatsAppMessage(formData, cartItems) {
    let message = `🛒 *COTIZACIÓN DE TIENDA*\n\n`;
    
    // Datos del cliente
    message += `👤 *DATOS DEL CLIENTE*\n`;
    message += `• Nombre: ${formData.fullname}\n`;
    message += `• WhatsApp: ${formData.fullWhatsApp}\n`;
    message += `• Email: ${formData.email}\n\n`;
    
    // Dirección de envío
    message += `📍 *DIRECCIÓN DE ENVÍO*\n`;
    message += `• Departamento: ${formData.department}\n`;
    message += `• Ciudad: ${formData.city}\n`;
    message += `• Barrio: ${formData.neighborhood}\n`;
    message += `• Dirección: ${formData.address}\n\n`;
    
    // Productos solicitados
    message += `🛍️ *PRODUCTOS SOLICITADOS*\n`;
    let total = 0;
    
    cartItems.forEach((item, index) => {
        const subtotal = item.product.price * item.quantity;
        total += subtotal;
        
        message += `${index + 1}. *${item.product.name}*\n`;
        message += `   • Cantidad: ${item.quantity}\n`;
        message += `   • Precio unitario: ${formatPrice(item.product.price)}\n`;
        message += `   • Subtotal: ${formatPrice(subtotal)}\n\n`;
    });
    
    // Total
    message += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;
    
    // Forma de pago
    message += `💳 *FORMA DE PAGO PREFERIDA*\n`;
    message += `• ${formData.paymentMethod}\n\n`;
    
    message += `📱 Por favor confirma disponibilidad y tiempo de entrega.`;
    
    return message;
}

// Función para validar el formulario
function validateQuotationForm() {
    const form = document.getElementById('quotation-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validar formato de email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
        email.classList.add('error');
        isValid = false;
    }
    
    // Validar número de WhatsApp (formato mejorado)
    const whatsapp = document.getElementById('whatsapp');
    const phoneValue = whatsapp.value.replace(/\s/g, '');
    const phoneRegex = /^[0-9]{7,10}$/;
    if (whatsapp.value && !phoneRegex.test(phoneValue)) {
        whatsapp.classList.add('error');
        showWhatsAppValidation(whatsapp, 'invalid', '⚠ Número de WhatsApp inválido');
        isValid = false;
    } else if (whatsapp.value) {
        whatsapp.classList.remove('error');
        hideWhatsAppValidation(whatsapp);
    }
    
    return isValid;
}

// Función para procesar el envío del formulario
async function processQuotationForm(event) {
    event.preventDefault();
    
    console.log('📝 Procesando formulario de cotización...');
    
    // Validar formulario
    if (!validateQuotationForm()) {
        alert('Por favor completa todos los campos requeridos correctamente.');
        return;
    }
    
    // Recopilar datos del formulario
    const formData = {
        countryCode: document.getElementById('country-code').value,
        whatsapp: document.getElementById('whatsapp').value.replace(/\s/g, ''),
        fullWhatsApp: getFullWhatsAppNumber(),
        email: document.getElementById('email').value,
        fullname: document.getElementById('fullname').value,
        department: document.getElementById('department').value,
        city: document.getElementById('city').value,
        neighborhood: document.getElementById('neighborhood').value,
        address: document.getElementById('address').value,
        paymentMethod: document.getElementById('payment-method').value
    };
    
    // Verificar que hay productos en el carrito
    if (!cart || cart.length === 0) {
        alert('No hay productos en el carrito para cotizar.');
        return;
    }
    
    // Formatear mensaje para WhatsApp
    const message = formatWhatsAppMessage(formData, cart);
    
    // Crear URL de WhatsApp usando configuración
    const whatsappNumber = WHATSAPP_CONFIG?.BUSINESS_NUMBER || '573188732564';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    console.log('✅ Redirigiendo a WhatsApp...');
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Cerrar modales
    closeQuotationModal();
    
    // Cerrar modal del carrito si está abierto
    if (typeof closeCartModal === 'function') {
        closeCartModal();
        console.log('🔒 Modal del carrito cerrado después de enviar cotización');
    }
    
    // Limpiar carrito después de enviar cotización (si está habilitado en configuración)
    const shouldClearCart = WHATSAPP_CONFIG?.CLEAR_CART_AFTER_QUOTE !== false; // Por defecto true
    
    if (shouldClearCart) {
        setTimeout(() => {
            if (typeof clearCart === 'function') {
                clearCart();
                console.log('🧹 Carrito limpiado después de enviar cotización');
                
                // Mostrar notificación de éxito
                if (typeof showCartNotification === 'function') {
                    showCartNotification('¡Cotización enviada! El carrito se ha limpiado automáticamente.', 'success');
                }
            } else {
                console.warn('⚠️ Función clearCart no disponible');
            }
        }, 1000); // Esperar 1 segundo para que se abra WhatsApp primero
    } else {
        // Solo mostrar notificación de cotización enviada
        if (typeof showCartNotification === 'function') {
            showCartNotification('¡Cotización enviada exitosamente!', 'success');
        }
    }
}

// Inicializar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar evento de cambio de departamento
    const departmentSelect = document.getElementById('department');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', updateCities);
    }
    
    // Configurar envío del formulario
    const quotationForm = document.getElementById('quotation-form');
    if (quotationForm) {
        quotationForm.addEventListener('submit', processQuotationForm);
    }
    
    // Cerrar modal al hacer clic en el overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                const quotationModal = document.getElementById('quotation-modal');
                if (quotationModal && quotationModal.classList.contains('show')) {
                    closeQuotationModal();
                }
            }
        });
    }
    
    console.log('✅ Sistema de cotizaciones inicializado');
});

// Función mejorada para formatear números de WhatsApp
function formatWhatsAppNumber(input) {
    // Obtener solo números
    let value = input.value.replace(/\D/g, '');
    
    // Aplicar formato según la longitud
    if (value.length <= 3) {
        input.value = value;
    } else if (value.length <= 6) {
        input.value = value.replace(/(\d{3})(\d{1,3})/, '$1 $2');
    } else if (value.length <= 10) {
        input.value = value.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1 $2 $3');
    } else {
        // Limitar a 10 dígitos máximo
        value = value.substring(0, 10);
        input.value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
}

// Función para validar número de WhatsApp en tiempo real
function validateWhatsAppNumber(input) {
    const value = input.value.replace(/\s/g, '');
    const countryCode = document.getElementById('country-code').value;
    const container = input.closest('.whatsapp-input-container');
    
    // Remover clases de validación previas
    input.classList.remove('valid', 'invalid');
    if (container) {
        container.classList.remove('valid', 'invalid');
    }
    
    if (value.length >= 7) {
        if (value.length >= 10) {
            input.classList.add('valid');
            if (container) container.classList.add('valid');
            showWhatsAppValidation(input, 'valid', '✓ Número válido');
        } else {
            input.classList.add('invalid');
            if (container) container.classList.add('invalid');
            showWhatsAppValidation(input, 'invalid', '⚠ Número muy corto');
        }
    } else if (value.length > 0) {
        input.classList.add('invalid');
        if (container) container.classList.add('invalid');
        showWhatsAppValidation(input, 'invalid', '⚠ Número muy corto');
    } else {
        hideWhatsAppValidation(input);
    }
}

// Función para mostrar validación visual del WhatsApp
function showWhatsAppValidation(input, type, message) {
    let validationDiv = input.parentNode.querySelector('.whatsapp-validation');
    
    if (!validationDiv) {
        validationDiv = document.createElement('div');
        validationDiv.className = 'whatsapp-validation';
        input.parentNode.appendChild(validationDiv);
    }
    
    validationDiv.className = `whatsapp-validation ${type}`;
    validationDiv.textContent = message;
}

// Función para ocultar validación del WhatsApp
function hideWhatsAppValidation(input) {
    const validationDiv = input.parentNode.querySelector('.whatsapp-validation');
    if (validationDiv) {
        validationDiv.remove();
    }
}

// Función para obtener el número completo de WhatsApp
function getFullWhatsAppNumber() {
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('whatsapp').value.replace(/\s/g, '');
    return `${countryCode}${phoneNumber}`;
}

// Agregar listeners mejorados para el campo de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappInput = document.getElementById('whatsapp');
    const countrySelect = document.getElementById('country-code');
    
    if (whatsappInput) {
        // Formateo en tiempo real
        whatsappInput.addEventListener('input', function(e) {
            formatWhatsAppNumber(this);
            validateWhatsAppNumber(this);
        });
        
        // Validación al perder el foco
        whatsappInput.addEventListener('blur', function() {
            validateWhatsAppNumber(this);
        });
        
        // Limpiar al hacer foco
        whatsappInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
        
        // Prevenir pegado de números con código de país
        whatsappInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = this.value.replace(/\D/g, '');
                // Si el número pegado empieza con código de país, removerlo
                if (value.startsWith('57') && value.length > 10) {
                    value = value.substring(2);
                } else if (value.startsWith('1') && value.length > 10) {
                    value = value.substring(1);
                }
                this.value = '';
                this.value = value;
                formatWhatsAppNumber(this);
                validateWhatsAppNumber(this);
            }, 10);
        });
    }
    
    // Cambio de país
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            if (whatsappInput.value) {
                validateWhatsAppNumber(whatsappInput);
            }
        });
    }
});