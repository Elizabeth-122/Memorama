// Guardar la operación y el nivel seleccionados
let operacionSeleccionada = "";
let nivelSeleccionado = "";
const sonidoBoton=new Audio("sonidos/clickbtn.mp3")

// Obtener los botones de operaciones
const botonesOperaciones = document.querySelectorAll("[data-operacion]");

// Obtener los botones de dificultad
const botonesNiveles = document.querySelectorAll("[data-nivel]");

// Obtener el botón Jugar
const botonJugar = document.getElementById("btn-jugar");

// Seleccionar una operación
botonesOperaciones.forEach(boton => {
    boton.addEventListener("click", function() {

        operacionSeleccionada = this.dataset.operacion;

        // Quitar la selección anterior
        botonesOperaciones.forEach(b => {
            b.classList.remove("seleccionado");
        });

        // Marcar la operación elegida
        this.classList.add("seleccionado");

        comprobarSeleccion();
    });
});

// Seleccionar un nivel
botonesNiveles.forEach(boton => {
    boton.addEventListener("click", function() {

        nivelSeleccionado = this.dataset.nivel;

        // Quitar la selección anterior
        botonesNiveles.forEach(b => {
            b.classList.remove("seleccionado");
        });

        // Marcar el nivel elegido
        this.classList.add("seleccionado");

        comprobarSeleccion();
    });
});

// Comprobar si ya eligió ambas opciones
function comprobarSeleccion() {

    if (operacionSeleccionada !== "" && nivelSeleccionado !== "") {
        botonJugar.disabled = false;
    } else {
        botonJugar.disabled = true;
    }
}
// Iniciar el juego
botonJugar.addEventListener("click", function() {

    if (operacionSeleccionada !== "" && nivelSeleccionado !== "") {

        sonidoBoton.currentTime = 0;
        sonidoBoton.play();

        setTimeout(function() {

            window.location.href = "juego.html?operacion=" + operacionSeleccionada + "&nivel=" + nivelSeleccionado;

        }, 250);

    }

});

// Sonido para todos los botones


// Detectar cuando se presiona cualquier botón
document.querySelectorAll("button").forEach(function(boton) {

    boton.addEventListener("click", function() {

        sonidoBoton.currentTime = 0;
        sonidoBoton.play();

    });

});