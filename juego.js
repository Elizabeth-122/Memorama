// Obtener los datos enviados desde la pantalla de inicio
const parametros = new URLSearchParams(window.location.search);

// Recuperar la operación
const operacion = parametros.get("operacion");

// Recuperar el nivel
const nivel = parametros.get("nivel");

// Determinar la cantidad de parejas según el nivel
let cantidadParejas;

if (nivel === "facil") {
    cantidadParejas = 4;
} else if (nivel === "medio") {
    cantidadParejas = 6;
} else if (nivel === "dificil") {
    cantidadParejas = 10;
}

// Crear una lista para guardar las parejas
let parejas = [];

// Contadores del juego
let movimientos = 0;
let parejasEncontradas = 0;
let cartasSeleccionadas = [];
let bloqueo = false;

// Obtener los elementos del HTML
const tablero = document.getElementById("tablero");
const contadorMovimientos = document.getElementById("movimientos");
const contadorParejas = document.getElementById("parejas");

// Obtener los elementos del mensaje de victoria
const mensajeVictoria = document.getElementById("mensaje-victoria");
const botonReiniciar = document.getElementById("btn-reiniciar");
const botonInicio = document.getElementById("btn-inicio");
// Sonido al voltear una carta
const sonidoCarta = new Audio("sonidos/cartas.mp3");
const sonidoVictoria = new Audio("sonidos/bocina.mp3");

// Sonido para todos los botones
const sonidoBoton = new Audio("sonidos/clickbtn.mp3");

// Detectar cuando se presiona cualquier botón
document.querySelectorAll("button").forEach(function(boton) {

    boton.addEventListener("click", function() {

        sonidoBoton.currentTime = 0;
        sonidoBoton.play();

    });

});

// Obtener el símbolo de la operación
function obtenerSimbolo() {

    if (operacion === "suma") return "+";
    if (operacion === "resta") return "-";
    if (operacion === "multiplicacion") return "×";
    if (operacion === "division") return "÷";

}

// Generar una operación matemática
function generarOperacion() {

    let numero1;
    let numero2;
    let resultado;

    if (operacion === "suma") {

        numero1 = Math.floor(Math.random() * 10) + 1;
        numero2 = Math.floor(Math.random() * 10) + 1;
        resultado = numero1 + numero2;

    } else if (operacion === "resta") {

        numero1 = Math.floor(Math.random() * 10) + 1;
        numero2 = Math.floor(Math.random() * numero1) + 1;
        resultado = numero1 - numero2;

    } else if (operacion === "multiplicacion") {

        numero1 = Math.floor(Math.random() * 10) + 1;
        numero2 = Math.floor(Math.random() * 10) + 1;
        resultado = numero1 * numero2;

    } else if (operacion === "division") {

        numero2 = Math.floor(Math.random() * 10) + 1;
        resultado = Math.floor(Math.random() * 10) + 1;
        numero1 = numero2 * resultado;

    }

    return {
        pregunta: `${numero1} ${obtenerSimbolo()} ${numero2}`,
        resultado: resultado
    };
}

// Generar parejas sin repetir resultados
function generarParejas() {

    parejas = [];

    while (parejas.length < cantidadParejas) {

        let nuevaOperacion = generarOperacion();

        let repetido = parejas.some(function(par) {
            return par.resultado === nuevaOperacion.resultado;
        });

        if (!repetido) {
            parejas.push(nuevaOperacion);
        }
    }
}

// Crear las cartas
function crearCartas() {

    let cartas = [];

    parejas.forEach(function(par, indice) {

        cartas.push({
            id: indice,
            contenido: par.pregunta,
            tipo: "operacion"
        });

        cartas.push({
            id: indice,
            contenido: par.resultado,
            tipo: "resultado"
        });

    });

    return cartas;
}

// Mezclar las cartas
function mezclarCartas(cartas) {

    for (let i = cartas.length - 1; i > 0; i--) {

        let aleatorio = Math.floor(Math.random() * (i + 1));

        let temporal = cartas[i];

        cartas[i] = cartas[aleatorio];

        cartas[aleatorio] = temporal;
    }

    return cartas;
}

// Obtener la imagen del reverso
function obtenerImagenReverso() {

    if (operacion === "suma") {
        return "img/cardSuma.png";

    } else if (operacion === "resta") {
        return "img/cardResta.png";

    } else if (operacion === "multiplicacion") {
        return "img/cardMultiplicacion.png";

    } else if (operacion === "division") {
        return "img/cardDivision.png";
    }
}

// Obtener la imagen del frente
function obtenerImagenFrente() {

    if (operacion === "suma") {
        return "img/frenteSuma.png";

    } else if (operacion === "resta") {
        return "img/frenteResta.png";

    } else if (operacion === "multiplicacion") {
        return "img/frenteMultiplicacion.png";

    } else if (operacion === "division") {
        return "img/frenteDivision.png";
    }
}

// Mostrar las cartas en el tablero
function mostrarCartas() {

    let imagenReverso = obtenerImagenReverso();
    let imagenFrente = obtenerImagenFrente();

    let mazo = crearCartas();

    // Cambiar las columnas según la cantidad de cartas
    if (mazo.length === 20) {
        tablero.style.gridTemplateColumns = "repeat(5, minmax(0, 1fr))";
    } else {
        tablero.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
    }

    mezclarCartas(mazo);

    tablero.innerHTML = "";

    mazo.forEach(function(carta) {

        let elemento = document.createElement("button");

        elemento.classList.add("carta");
        elemento.type = "button";

        // Imagen del reverso
        let reverso = document.createElement("img");

        reverso.src = imagenReverso;
        reverso.alt = "Carta cerrada";

        // Imagen del frente
        let frente = document.createElement("img");

        frente.src = imagenFrente;
        frente.alt = "Carta abierta";
        frente.classList.add("imagen-frente");
        frente.hidden = true;

        // Contenido de la carta
        let contenido = document.createElement("span");

        contenido.classList.add("contenido-carta");
        contenido.textContent = carta.contenido;
        contenido.hidden = true;

        elemento.appendChild(reverso);
        elemento.appendChild(frente);
        elemento.appendChild(contenido);

        // Guardar los datos de la carta
        elemento.dataset.id = carta.id;
        elemento.dataset.tipo = carta.tipo;

        // Evento para voltear la carta
        elemento.addEventListener("click", function() {
            voltearCarta(elemento);
        });

        tablero.appendChild(elemento);
    });
}

// Voltear una carta
function voltearCarta(carta) {

    if (bloqueo || carta.classList.contains("volteada")) {
        return;
    }

    carta.classList.add("volteada");
    sonidoCarta.currentTime = 0;
    sonidoCarta.play();

    carta.querySelector("img:first-child").hidden = true;
    carta.querySelector(".imagen-frente").hidden = false;
    carta.querySelector(".contenido-carta").hidden = false;

    cartasSeleccionadas.push(carta);

    // Comprobar cuando se seleccionen dos cartas
    if (cartasSeleccionadas.length === 2) {

        movimientos++;

        contadorMovimientos.textContent = movimientos;

        comprobarPareja();
    }
}

// Comprobar si las cartas forman pareja
function comprobarPareja() {

    let primera = cartasSeleccionadas[0];
    let segunda = cartasSeleccionadas[1];

    if (
        primera.dataset.id === segunda.dataset.id &&
        primera.dataset.tipo !== segunda.dataset.tipo
    ) {

        parejasEncontradas++;

        contadorParejas.textContent = parejasEncontradas;

        cartasSeleccionadas = [];

        // Comprobar si terminó el juego
        if (parejasEncontradas === cantidadParejas) {

            setTimeout(function() {
                lanzarConfeti();
                sonidoVictoria.currentTime=0;
                sonidoVictoria.play();
                mensajeVictoria.hidden = false;
            }, 300);

        }

    } else {

        bloqueo = true;

        setTimeout(function() {

            cartasSeleccionadas.forEach(function(carta) {

                carta.classList.remove("volteada");

                carta.querySelector("img:first-child").hidden = false;
                carta.querySelector(".imagen-frente").hidden = true;
                carta.querySelector(".contenido-carta").hidden = true;

            });

            cartasSeleccionadas = [];
            bloqueo = false;

        }, 1000);
    }
}

// Volver a jugar
botonReiniciar.addEventListener("click", function() {

    // Reiniciar los contadores
    movimientos = 0;
    parejasEncontradas = 0;

    // Limpiar las cartas seleccionadas
    cartasSeleccionadas = [];

    bloqueo = false;

    // Actualizar los números en pantalla
    contadorMovimientos.textContent = movimientos;
    contadorParejas.textContent = parejasEncontradas;

    // Ocultar el mensaje de victoria
    mensajeVictoria.hidden = true;

    // Generar nuevas operaciones y cartas
    generarParejas();
    mostrarCartas();

});

// Regresar al inicio
botonInicio.addEventListener("click", function() {

    window.location.href = "index.html";

});

// Preparar e iniciar el tablero

generarParejas();
mostrarCartas();

// Crear animación de confeti
function lanzarConfeti() {

    const contenedor = document.getElementById("contenedor-confeti");

    const colores = [
        "#ff4081",
        "#ffeb3b",
        "#4caf50",
        "#2196f3",
        "#9c27b0",
        "#ff9800"
    ];

    for (let i = 0; i < 100; i++) {

        const papelito = document.createElement("div");

        papelito.classList.add("confeti");

        papelito.style.left = Math.random() * 100 + "%";

        papelito.style.backgroundColor =
            colores[Math.floor(Math.random() * colores.length)];

        papelito.style.animationDelay = Math.random() * 2 + "s";

        contenedor.appendChild(papelito);

        setTimeout(function() {
            papelito.remove();
        }, 5000);
    }
}
// Sonido para todos los botones de la página
document.querySelectorAll("button").forEach(function(boton) {

    boton.addEventListener("click", function() {

        sonidoBoton.currentTime = 0;
        sonidoBoton.play();

    });

});