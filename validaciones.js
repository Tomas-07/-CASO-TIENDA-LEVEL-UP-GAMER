// ============================================
// LEVEL-UP GAMER - SISTEMA DE VALIDACIÓN Y FUNCIONALIDADES
// ============================================

// ============================================
// SISTEMA DE PUNTOS LEVELUP Y GAMIFICACIÓN
// ============================================
const gamification = {
  levels: [
    { level: 1, name: "Novato", minPoints: 0, maxPoints: 99, discount: 0 },
    { level: 2, name: "Jugador", minPoints: 100, maxPoints: 299, discount: 5 },
    { level: 3, name: "Veterano", minPoints: 300, maxPoints: 599, discount: 10 },
    { level: 4, name: "Experto", minPoints: 600, maxPoints: 999, discount: 15 },
    { level: 5, name: "Leyenda", minPoints: 1000, maxPoints: Infinity, discount: 20 }
  ],

  getUserLevel(points) {
    for (let level of this.levels) {
      if (points >= level.minPoints && points <= level.maxPoints) {
        return level;
      }
    }
    return this.levels[0];
  },

  addPoints(userId, points) {
    const currentPoints = parseInt(this.getPoints(userId)) || 0;
    const newPoints = currentPoints + points;
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    userData.levelUpPoints = newPoints;
    sessionStorage.setItem('userData', JSON.stringify(userData));
    return newPoints;
  },

  getPoints(userId) {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    return userData.levelUpPoints || 0;
  }
};

// ============================================
// VALIDACIÓN DE REGISTRO (Mayor de 18 años)
// ============================================
function validarRegistro(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('reg-nombre');
  const email = document.getElementById('reg-email');
  const password = document.getElementById('reg-pass');
  const mayor18 = document.getElementById('reg-18');
  const codigoReferido = document.getElementById('reg-ref');
  
  let errores = [];
  let isValid = true;

  // Limpiar errores previos
  [nombre, email, password].forEach(campo => {
    if (campo) campo.classList.remove('error');
  });

  // Validar nombre completo
  if (!nombre.value.trim() || nombre.value.trim().length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres');
    nombre.classList.add('error');
    isValid = false;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errores.push('Ingresa un email válido');
    email.classList.add('error');
    isValid = false;
  }

  // Validar contraseña (mínimo 6 caracteres)
  if (password.value.length < 6) {
    errores.push('La contraseña debe tener mínimo 6 caracteres');
    password.classList.add('error');
    isValid = false;
  }

  // VALIDAR MAYOR DE 18 AÑOS (REQUERIMIENTO OBLIGATORIO)
  if (!mayor18.checked) {
    errores.push('Debes ser mayor de 18 años para registrarte');
    isValid = false;
  }

  if (!isValid) {
    mostrarMensaje(errores.join('. '), 'error');
    return false;
  }

  // Verificar descuento DUOC (20% de por vida)
  let descuentoDuoc = 0;
  if (email.value.toLowerCase().includes('@duoc.cl') || 
      email.value.toLowerCase().includes('@duocuc.cl')) {
    descuentoDuoc = 20;
  }

  // Procesar código de referido
  let puntosReferido = 0;
  if (codigoReferido && codigoReferido.value.trim()) {
    puntosReferido = 50; // Puntos por usar código de referido
    // Dar puntos al usuario que refirió (simulado)
    const referidorPoints = 100; // El referidor gana 100 puntos
  }

  // Guardar datos del usuario
  const userData = {
    nombre: nombre.value.trim(),
    email: email.value.trim(),
    descuentoDuoc: descuentoDuoc,
    levelUpPoints: puntosReferido,
    codigoReferido: generarCodigoReferido(),
    fechaRegistro: new Date().toISOString()
  };

  sessionStorage.setItem('userData', JSON.stringify(userData));
  sessionStorage.setItem('isLoggedIn', 'true');

  // Mostrar mensaje de éxito
  let mensaje = '¡Registro exitoso! ';
  if (descuentoDuoc > 0) {
    mensaje += `Tienes un descuento del ${descuentoDuoc}% de por vida por ser estudiante DUOC. `;
  }
  if (puntosReferido > 0) {
    mensaje += `Has ganado ${puntosReferido} puntos LevelUp. `;
  }
  mensaje += `Tu código de referido es: ${userData.codigoReferido}`;

  mostrarMensaje(mensaje, 'success');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);

  return false;
}

// ============================================
// GENERAR CÓDIGO DE REFERIDO ÚNICO
// ============================================
function generarCodigoReferido() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

// ============================================
// VALIDACIÓN DE LOGIN
// ============================================
function validarLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const rememberMe = document.getElementById('rememberMe');
  
  let isValid = true;

  // Limpiar errores previos
  [email, password].forEach(campo => {
    if (campo) campo.classList.remove('error');
  });

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    email.classList.add('error');
    isValid = false;
  }

  // Validar contraseña
  if (password.value.length < 6) {
    password.classList.add('error');
    isValid = false;
  }

  if (!isValid) {
    mostrarMensaje('Por favor, verifica tus credenciales', 'error');
    return false;
  }

  // Simular login exitoso
  sessionStorage.setItem('isLoggedIn', 'true');
  
  if (rememberMe && rememberMe.checked) {
    sessionStorage.setItem('rememberUser', email.value);
  }

  mostrarMensaje('¡Inicio de sesión exitoso!', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);

  return false;
}

// ============================================
// GESTIÓN DEL CARRITO DE COMPRAS
// ============================================
const carrito = {
  items: [],

  init() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    if (carritoGuardado) {
      this.items = JSON.parse(carritoGuardado);
    }
  },

  agregar(producto) {
    const existente = this.items.find(item => item.codigo === producto.codigo);
    
    if (existente) {
      existente.cantidad++;
    } else {
      this.items.push({
        ...producto,
        cantidad: 1
      });
    }
    
    this.guardar();
    this.actualizar();
    mostrarMensaje(`${producto.nombre} agregado al carrito`, 'success');
  },

  eliminar(codigo) {
    this.items = this.items.filter(item => item.codigo !== codigo);
    this.guardar();
    this.actualizar();
  },

  modificarCantidad(codigo, cantidad) {
    const item = this.items.find(i => i.codigo === codigo);
    if (item) {
      item.cantidad = parseInt(cantidad);
      if (item.cantidad <= 0) {
        this.eliminar(codigo);
      } else {
        this.guardar();
        this.actualizar();
      }
    }
  },

  calcularTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.precio * item.cantidad);
    }, 0);
  },

  aplicarDescuentos() {
    let total = this.calcularTotal();
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    // Descuento DUOC
    if (userData.descuentoDuoc) {
      total *= (1 - userData.descuentoDuoc / 100);
    }
    
    // Descuento por nivel de gamificación
    const points = userData.levelUpPoints || 0;
    const level = gamification.getUserLevel(points);
    if (level.discount > 0) {
      total *= (1 - level.discount / 100);
    }
    
    return total;
  },

  guardar() {
    sessionStorage.setItem('carrito', JSON.stringify(this.items));
  },

  actualizar() {
    const contador = document.getElementById('carrito-count');
    if (contador) {
      contador.textContent = this.items.length;
    }
  },

  vaciar() {
    this.items = [];
    this.guardar();
    this.actualizar();
  }
};

// ============================================
// SISTEMA DE FILTROS AVANZADOS
// ============================================
function inicializarFiltros() {
  const categoriaSelect = document.getElementById('filtro-categoria');
  const precioSelect = document.getElementById('filtro-precio');
  const busquedaInput = document.getElementById('busqueda');

  if (categoriaSelect) {
    categoriaSelect.addEventListener('change', aplicarFiltros);
  }
  if (precioSelect) {
    precioSelect.addEventListener('change', aplicarFiltros);
  }
  if (busquedaInput) {
    busquedaInput.addEventListener('input', aplicarFiltros);
  }
}

function aplicarFiltros() {
  const categoria = document.getElementById('filtro-categoria')?.value || 'todas';
  const precio = document.getElementById('filtro-precio')?.value || 'todos';
  const busqueda = document.getElementById('busqueda')?.value.toLowerCase() || '';

  const productos = document.querySelectorAll('.producto');

  productos.forEach(producto => {
    let mostrar = true;

    // Filtrar por categoría
    if (categoria !== 'todas') {
      const categoriaProducto = producto.dataset.categoria;
      if (categoriaProducto !== categoria) {
        mostrar = false;
      }
    }

    // Filtrar por precio
    if (precio !== 'todos') {
      const precioProducto = parseInt(producto.dataset.precio);
      if (precio === 'bajo' && precioProducto > 50000) mostrar = false;
      if (precio === 'medio' && (precioProducto < 50000 || precioProducto > 200000)) mostrar = false;
      if (precio === 'alto' && precioProducto < 200000) mostrar = false;
    }

    // Filtrar por búsqueda
    if (busqueda) {
      const nombreProducto = producto.querySelector('h3')?.textContent.toLowerCase() || '';
      const descripcion = producto.querySelector('.descripcion')?.textContent.toLowerCase() || '';
      if (!nombreProducto.includes(busqueda) && !descripcion.includes(busqueda)) {
        mostrar = false;
      }
    }

    producto.style.display = mostrar ? 'block' : 'none';
  });
}

// ============================================
// SISTEMA DE RESEÑAS Y CALIFICACIONES
// ============================================
function inicializarReseñas() {
  const btnResena = document.querySelector('.btn-resena');
  if (btnResena) {
    btnResena.addEventListener('click', publicarResena);
  }
}

function publicarResena() {
  const rating = document.querySelector('input[name="rating"]:checked');
  const texto = document.querySelector('.review-text');

  if (!rating) {
    mostrarMensaje('Por favor selecciona una calificación', 'error');
    return;
  }

  if (!texto.value.trim()) {
    mostrarMensaje('Por favor escribe tu reseña', 'error');
    return;
  }

  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    mostrarMensaje('Debes iniciar sesión para publicar una reseña', 'error');
    setTimeout(() => {
      window.location.href = 'Login.html';
    }, 2000);
    return;
  }

  const resena = {
    usuario: userData.nombre || 'Usuario Anónimo',
    rating: parseInt(rating.value),
    texto: texto.value.trim(),
    fecha: new Date().toLocaleDateString('es-CL')
  };

  // Agregar reseña a la lista
  agregarResenaDOM(resena);

  // Dar puntos por reseña
  gamification.addPoints('currentUser', 25);

  mostrarMensaje('¡Reseña publicada! Has ganado 25 puntos LevelUp', 'success');

  // Limpiar formulario
  texto.value = '';
  document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);
}

function agregarResenaDOM(resena) {
  const lista = document.querySelector('.reviews-list');
  if (!lista) return;

  const item = document.createElement('li');
  item.className = 'review-item fade-in';
  item.innerHTML = `
    <div class="review-head">
      <span class="stars" style="--value:${resena.rating}" aria-label="${resena.rating} de 5"></span>
      <strong class="user">${resena.usuario}</strong>
      <time class="date">${resena.fecha}</time>
    </div>
    <p class="review-body">${resena.texto}</p>
  `;

  lista.insertBefore(item, lista.firstChild);
}

// ============================================
// MOSTRAR MENSAJES AL USUARIO
// ============================================
function mostrarMensaje(texto, tipo = 'info') {
  // Buscar contenedor de mensajes existente
  let mensaje = document.getElementById('message') || document.getElementById('mensaje');
  
  // Si no existe, crear uno temporal
  if (!mensaje) {
    mensaje = document.createElement('div');
    mensaje.id = 'mensaje-temporal';
    mensaje.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      z-index: 9999;
      max-width: 400px;
      animation: slideInRight 0.5s ease-out;
    `;
    document.body.appendChild(mensaje);
  }

  mensaje.className = `message ${tipo}`;
  mensaje.textContent = texto;
  mensaje.style.display = 'block';

  setTimeout(() => {
    mensaje.style.display = 'none';
    if (mensaje.id === 'mensaje-temporal') {
      mensaje.remove();
    }
  }, 5000);
}

// ============================================
// ACTUALIZAR INFO DE USUARIO EN EL HEADER
// ============================================
function actualizarHeaderUsuario() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  
  const loginLink = document.querySelector('a[href="Login.html"]');
  
  if (isLoggedIn && loginLink) {
    const level = gamification.getUserLevel(userData.levelUpPoints || 0);
    loginLink.textContent = `${userData.nombre?.split(' ')[0] || 'Usuario'} | ${level.name}`;
    loginLink.href = 'perfil.html';
    loginLink.title = `${userData.levelUpPoints || 0} puntos LevelUp`;
  }
}

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
function verificarAutenticacion(paginaProtegida = false) {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  
  if (paginaProtegida && !isLoggedIn) {
    mostrarMensaje('Debes iniciar sesión para acceder a esta página', 'error');
    setTimeout(() => {
      window.location.href = 'Login.html';
    }, 2000);
    return false;
  }
  
  return isLoggedIn;
}

// ============================================
// INICIALIZACIÓN GLOBAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar carrito
  carrito.init();
  carrito.actualizar();

  // Actualizar header con info de usuario
  actualizarHeaderUsuario();

  // Configurar formulario de registro
  const registroForm = document.getElementById('registroForm');
  if (registroForm) {
    registroForm.addEventListener('submit', validarRegistro);
  }

  // Configurar formulario de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', validarLogin);
  }

  // Inicializar filtros
  inicializarFiltros();

  // Inicializar sistema de reseñas
  inicializarReseñas();

  // Configurar botones "Agregar al carrito"
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productoElement = this.closest('.producto');
      if (productoElement) {
        const producto = {
          codigo: productoElement.dataset.codigo || 'PROD' + Date.now(),
          nombre: productoElement.querySelector('h3')?.textContent || 'Producto',
          precio: parseInt(productoElement.dataset.precio || productoElement.querySelector('.precio')?.textContent.replace(/[^0-9]/g, '') || 0),
          imagen: productoElement.querySelector('img')?.src || ''
        };
        
        carrito.agregar(producto);
      }
    });
  });

  // Configurar inputs de cantidad en carrito
  document.querySelectorAll('.cart input[type="number"]').forEach(input => {
    input.addEventListener('change', function() {
      const codigo = this.dataset.codigo;
      carrito.modificarCantidad(codigo, this.value);
    });
  });

  // Botón de proceder al pago
  const btnPagar = document.querySelector('.btn-pagar');
  if (btnPagar) {
    btnPagar.addEventListener('click', function() {
      if (!verificarAutenticacion()) {
        mostrarMensaje('Debes iniciar sesión para realizar la compra', 'error');
        setTimeout(() => {
          window.location.href = 'Login.html';
        }, 2000);
        return;
      }

      if (carrito.items.length === 0) {
        mostrarMensaje('Tu carrito está vacío', 'error');
        return;
      }

      // Dar puntos por compra (1 punto por cada $1000)
      const total = carrito.calcularTotal();
      const puntosGanados = Math.floor(total / 1000);
      gamification.addPoints('currentUser', puntosGanados);

      mostrarMensaje(`¡Compra exitosa! Has ganado ${puntosGanados} puntos LevelUp`, 'success');
      
      carrito.vaciar();
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    });
  }
});

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================
window.carrito = carrito;
window.gamification = gamification;
window.verificarAutenticacion = verificarAutenticacion;
window.mostrarMensaje = mostrarMensaje;