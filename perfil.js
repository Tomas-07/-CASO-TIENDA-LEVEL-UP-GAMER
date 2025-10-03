// Obtener elementos
const form = document.getElementById("perfilForm");
const mensaje = document.getElementById("mensaje");

// Cargar datos guardados si existen
window.onload = () => {
  if (localStorage.getItem("perfil")) {
    const datos = JSON.parse(localStorage.getItem("perfil"));
    document.getElementById("nombre").value = datos.nombre || "";
    document.getElementById("email").value = datos.email || "";
    document.getElementById("preferencias").value = datos.preferencias || "consolas";
  }
};

// Guardar cambios
form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const perfil = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    preferencias: document.getElementById("preferencias").value
  };

  localStorage.setItem("perfil", JSON.stringify(perfil));

  mensaje.textContent = "✅ Perfil actualizado correctamente";
  mensaje.style.color = "#39FF14";
});


