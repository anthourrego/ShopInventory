/**
 * Configuración global del sistema de tienda
 * @author ShopInventory
 * @version 1.0.0
 */

// Configuración principal de la API
const API_CONFIG = {
    // URL base del servidor de inventario
    BASE_URL: 'https://fitwinnergym.gomariwms.com/Shop',
    
    // Endpoints disponibles
    ENDPOINTS: {
        CATEGORIES: '/getCategories',           // GET - Obtener todas las categorías
        PRODUCTS: '/getProducts',              // GET - Obtener todos los productos o por categoría /{id}
        PRODUCT_BY_ID: '/getProduct',          // GET - Obtener producto específico /{id}
        SEARCH_PRODUCTS: '/searchProducts'     // GET - Buscar productos ?q={query}
    },
    
    // Configuración de timeout y reintentos
    TIMEOUT: 10000, // 10 segundos
    MAX_RETRIES: 3,
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Configuración de WhatsApp para cotizaciones
const WHATSAPP_CONFIG = {
    // Número de WhatsApp comercial (incluir código de país sin +)
    BUSINESS_NUMBER: '573103587032', // CAMBIAR POR TU NÚMERO REAL
    
    // Mensaje de bienvenida personalizado
    WELCOME_MESSAGE: '¡Hola! Te saluda el equipo de nuestra tienda 🛍️',
    
    // Configuración adicional
    AUTO_OPEN: true, // Abrir WhatsApp automáticamente después del envío
    CLEAR_CART_AFTER_QUOTE: true // Limpiar carrito automáticamente después de enviar cotización
};

/**
 * Construye una URL completa para la API
 * @param {string} endpoint - El endpoint a usar (usar API_CONFIG.ENDPOINTS)
 * @param {string} params - Parámetros adicionales para la URL
 * @returns {string} URL completa
 */
function buildApiUrl(endpoint, params = '') {
    return `${API_CONFIG.BASE_URL}${endpoint}${params}`;
}

/**
 * Realiza una petición fetch con configuración por defecto
 * @param {string} url - URL completa para la petición
 * @param {object} options - Opciones adicionales para fetch
 * @returns {Promise<Response>} Respuesta de la petición
 */
async function apiRequest(url, options = {}) {
    const config = {
        headers: API_CONFIG.DEFAULT_HEADERS,
        timeout: API_CONFIG.TIMEOUT,
        ...options
    };
    
    console.log(`🌐 API Request: ${url}`);
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log(`✅ API Response: ${response.status} ${response.statusText}`);
        return response;
        
    } catch (error) {
        console.error(`❌ API Error: ${error.message}`);
        throw error;
    }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
    window.buildApiUrl = buildApiUrl;
    window.apiRequest = apiRequest;
}

// Para uso en Node.js (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        WHATSAPP_CONFIG,
        buildApiUrl,
        apiRequest
    };
}