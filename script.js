//Variables lógicas
var tamanoTablero = 0;
var tableroLogico = [];
var celdaActiva = "0-0";
var jugadorActual = 1;
var fichasRestantes1 = 0;
var fichasRestantes2 = 0;
var partidaFinalizada = false;

//Variables de interfaz
var contenedor1 = $("#fichas1");
var contenedor2 = $("#fichas2");
var tablero = $("#tablero");
var mensaje = $("#estado");
var marcador1 = $(".marcador1");
var marcador2 = $(".marcador2");
const contador1 = 0;
const contador2 = 0;
var marcador1 = 0;
var marcador2 = 0;


document.onkeydown = function (e) {
	pulsarTecla(e.keyCode);
	console.log()
}

//Comenzamos el juego según la elección del usuario en el primer menú

$('#botonInicio').click(function () {


	//Obtener el input del tamaño de tablero
	var input = $("#numeroCasillas");
	tamanoTablero = parseInt(input.val());


	//Validar que es un tamaño correcto
	if (tamanoTablero < 3 || tamanoTablero > 6) {

		$("#mensajeError").html("El tamaño no es correcto");
		$("#mensajeError").css("display", "block");
	}
	else {

		$("#fondoModal").css("display", "none");
		crearTablero();
	}

});


//Función que inicia el tablero y los contadores
function crearTablero() {
	//Inicializar variables
	tableroLogico = [];
	celdaActiva = "0-0";
	jugadorActual = 1;
	fichasRestantes1 = tamanoTablero;
	fichasRestantes2 = tamanoTablero;
	partidaFinalizada = false;
	mensaje.html("Turno del jugador 1" + "<img src='azul.png'>");

	//Establecer el alto fijo de los contenedores
	var altura = 125 * tamanoTablero + 57;
	$(contenedor1).css("height", altura + "px")
	$(contenedor2).css("height", altura + "px")

	//Recargar contenedores de fichas
	for (var i = 0; i < tamanoTablero; i++) {
		$(contenedor1).append("<div></div>");
		$(contenedor2).append("<div></div>");
	}

	//Añadir la clase correspondiente al número de columnas
	if (tamanoTablero) {
		$(tablero).addClass("C" + tamanoTablero + "Columnas");
	}

	//Rellenamos el tablero lógico y el visual
	for (var i = 0; i < tamanoTablero; i++) { //filas
		tableroLogico[i] = [];
		for (var j = 0; j < tamanoTablero; j++) { //columnas

			//Se añaden los divs que harán de celdas, con sus respectivos eventos
			var celda = document.createElement("DIV");
			$(celda).attr({ "id": i + "-" + j, "class": "celda" },);

			$(celda).mouseenter(function (e) {
				cambiarCeldaSeleccionada(e.target.id);
			});
			$(celda).click(function (e) {
				colocarFicha();
			});
			$(tablero).append(celda);
			tableroLogico[i][j] = 0;
		}
	}

	//obtengo los datos del locaslStorage
	if (localStorage.getItem("contador1") !== null) {
		marcador1 = localStorage.getItem("contador1");
		marcador1.html(marcador1);
	}
	if (localStorage.getItem("contador2") !== null) {
		marcador2 = localStorage.getItem("contador2");
		marcador2.html(marcador2);
	}

}

//Función para registrar las pulsaciones de las teclas
function pulsarTecla(codigo) {
	var nuevaPosicion = 0;

	//obtenermos los índices actuales
	var indices = celdaActiva.split("-");
	var x = indices[0];
	var y = indices[1];


	switch (codigo) {
		case 37: //izquierda
			//restamos columna
			if (y > 0)
				y--;
			break;
		case 38: //arriba
			if (x > 0)
				x--;
			break;
		case 39: //derecha
			if (y < tamanoTablero - 1)
				y++;
			break;
		case 40: //abajo
			if (x < tamanoTablero - 1)
				x++;
			break;
		case 13: //intro
			colocarFicha();
			break;
		case 32: //espacio
			colocarFicha();
			break;
	}

	cambiarCeldaSeleccionada(x + "-" + y);
}

//Función para cambiar la celda actualmente seleccionada
function cambiarCeldaSeleccionada(id) {
	//Quitar la selección a la actualmente seleccionada
	var celdaAnterior = $(celdaActiva);
	if (celdaAnterior)
		$(celdaAnterior).remove("seleccionada");
	//Añadir la selección en la nueva
	celdaActiva = id;
	var celdaActual = $("#" + id);
	$(celdaActual).add("seleccionada");
}

//Función para colocar fichas en la celda actualmente seleccionada
function colocarFicha() {
	if (!partidaFinalizada) {
		//obtenermos los índices actuales
		var indices = celdaActiva.split("-");
		var x = indices[0];
		var y = indices[1];

		//Ver qué hay en la posición actual
		var valor = tableroLogico[x][y];

		var colocarFicha = false;

		//Verificar que la casilla esté libre
		if (valor == 0) {
			//Comprobar que quedan fichas por poner
			if ((jugadorActual == 1 && fichasRestantes1 > 0) || (jugadorActual == 2 && fichasRestantes2 > 0)) {
				colocarFicha = true;
			} else {
				$(mensaje).html("No quedan fichas");
			}
		}
		//Si la casilla no está libre
		else {
			//Comprobar que la ficha es nuestra
			if ((jugadorActual == valor)) {
				//Que aún queden fichas
				if ((jugadorActual == 1 && fichasRestantes1 > 0) || (jugadorActual == 2 && fichasRestantes2 > 0)) {
					$(mensaje).html("Aún quedan fichas por colocar");
				}
				//Si no nos quedan fichas
				else {
					//Cargar ficha en el contedor del jugador activo
					var ficha = document.createElement("DIV");
					if (jugadorActual == 1) {
						fichasRestantes1++;
						$(contenedor1).append(ficha);
					} else {
						fichasRestantes2++;
						$(contenedor2).append(ficha);
					}
					//Borrar ficha del tablero
					var celda = $("#" + x + "-" + y)[0];
					$(celda).removeClass("jugador1");
					$(celda).removeClass("jugador2");
					tableroLogico[x][y] = 0;
				}

			} else {
				$(mensaje).html("Casilla ocupada");
			}

		}


		//Cuando colocamos ficha, restar una de la reserva del jugador actual, y colocarla en el tablero
		if (colocarFicha) {
			restarFicha(jugadorActual);
			tableroLogico[x][y] = jugadorActual;
			var celda = $("#" + x + "-" + y);
			if (jugadorActual == 1)
				$(celda).addClass("jugador1");
			else
				$(celda).addClass("jugador2");

			comprobarVictoria();
		}
	}

}

//Función para restar fichas de la reserva
function restarFicha(jugador) {
	if (jugadorActual == 1) {
		fichasRestantes1--;
		$(contenedor1).children().last().remove();
	}
	else {
		fichasRestantes2--;
		$(contenedor2).children().last().remove();
	}
}

//Función para comprobar la victoria
function comprobarVictoria() {

	//Primero comprobamos que al jugador no le quedan fichas
	var contador = 0;
	if ((jugadorActual == 1 && fichasRestantes1 == 0) || (jugadorActual == 2 && fichasRestantes2 == 0)) {
		var seguir = true;
		//Comprobar las filas
		for (var i = 0; i < tamanoTablero && contador < tamanoTablero; i++) { //Recorre las diferentes filas
			contador = 0;
			seguir = true;

			for (var j = 0; j < tamanoTablero && contador < tamanoTablero && seguir; j++) { //Recorre las casillas de cada fila
				if (tableroLogico[i][j] == jugadorActual)
					contador++;
				else {
					seguir = false;
				}
			}
		}
		//Comprobar las columnas
		if (contador != tamanoTablero) {
			for (var i = 0; i < tamanoTablero && contador < tamanoTablero; i++) { //Recorre las diferentes columnas
				contador = 0;
				seguir = true;

				for (var j = 0; j < tamanoTablero && contador < tamanoTablero && seguir; j++) { //Recorre las casillas de cada columna
					if (tableroLogico[j][i] == jugadorActual)
						contador++;
					else {
						seguir = false;
					}
				}
			}
			//Comprobar la diagonal 1
			if (contador != tamanoTablero) {
				contador = 0;
				seguir = true;
				for (var j = 0; j < tamanoTablero && contador < tamanoTablero && seguir; j++) { //Recorre las casillas de cada columna
					if (tableroLogico[j][j] == jugadorActual)
						contador++;
					else {
						seguir = false;
					}
				}
				//Comprobar la diagonal 2
				if (contador != tamanoTablero) {
					contador = 0;
					seguir = true;
					var j = tamanoTablero - 1;
					for (var i = 0; i < tamanoTablero && contador < tamanoTablero && seguir; i++) { //Recorre las casillas de cada columna
						if (tableroLogico[i][j - i] == jugadorActual)
							contador++;
						else {
							seguir = false;
						}
					}
				}
			}
		}
	}
	if (contador == tamanoTablero) {
		partidaFinalizada = true;
		var btnRepetir = $("#repetir");
		$(btnRepetir).css("display", "inline");
		//Agrego puntuacion al ganador
		if (jugadorActual == 1) {
			marcador1++
			localStorage.setItem("contador1", marcador1);
			$("#ganador").html("¡El jugador 1 ha ganado!");
			$(".ganador").css("display", "block");
		} else {
			marcador2++
			localStorage.setItem("contador2", marcador2);
			$("#ganador").html("¡El jugador 2 ha ganado!");
			$(".ganador").css("display", "block");
		}
	} else {
		//Cambio de jugador
		if (jugadorActual == 1) {
			jugadorActual = 2;
			var color = "verde.png";
		} else {
			jugadorActual = 1;
			var color = "azul.png";
		}

		$(mensaje).html("Turno del jugador " + jugadorActual + "<img src=" + color + ">");
	}

}

function reiniciar() {
	location.reload();
}

//Comienza una nueva partida con el mismo tablero

function nuevaPartida() {
	tablero.html("");
	contenedor1.html("");
	var p1 = $("<p>");
	var p2 = $(`<p class='marcador1 marcador'>${marcador1}</p>`);
	p1.html("Fichas jugador 1");
	contenedor1.append(p1);
	contenedor1.append(p2);
	contenedor2.html("");
	p1 = $("<p>");
	p1.html("Fichas jugador 2");
	var p2 = $(`<p class='marcador1 marcador'>${marcador2}</p>`);
	contenedor2.append(p1);
	contenedor2.append(p2);
	$(".ganador").css("display", "none");
	crearTablero();
}
//reseteo el tablero
function resetear() {
	if (confirm("Si Reseteas el juego se eliminaran las puntuaciones")) {
		localStorage.setItem("contador1", 0);  //reseteo valores del localStorage
		localStorage.setItem("contador2", 0);
		$("#estado").html("Turno del jugador1");
		tablero.html("");
		contenedor1.html("");
		var p1 = $("<p>");
		var p2 = $(`<p class='marcador1 marcador'>0</p>`);
		p1.html("Fichas jugador 1");
		contenedor1.append(p1);
		contenedor1.append(p2);
		contenedor2.html("");
		p1 = $("<p>");
		p1.html("Fichas jugador 2");
		var p2 = $(`<p class='marcador1 marcador'>0</p>`);
		contenedor2.append(p1);
		contenedor2.append(p2);
		crearTablero();
	}
};