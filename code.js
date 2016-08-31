var baraja = [];
var numCartas = 0;

function crearBaraja() {
  var palos = ["c","d","e","t"]
  for (var i = 0; i < palos.length; i++) {
    var palo = palos[i];
    for (var v = 0; v < 13; v++) {
      var valor = v+1;
      var carta = { palo: palo, valor: valor };
      baraja[baraja.length] = carta;
    }
  }
  return baraja;
};

function crearMano(numCartas) {
  var _baraja = baraja.length == 0 ? crearBaraja() : baraja;
  var mano = [];
  for (var m = 0; m < numCartas; m++) {
    _baraja = baraja.length == 0 ? crearBaraja() : baraja;
    var cartaAzar = Math.floor(Math.random()*(_baraja.length));
    var cartaDeBaraja = _baraja[cartaAzar];
    _baraja.splice(cartaAzar,1);
    mano[mano.length] = cartaDeBaraja;
  }
  return mano;
};

function puntuar(mano){
  var totalPuntos = 0;
  var puntajes = [];
  for (var p = 0; p < mano.length; p++) {
    var carta = mano[p];
    switch (carta.valor) {
      case 1:
      if((totalPuntos + 11) > 21){
        valorCarta = 1;
      }else{
        valorCarta = 11;
      }
      break;
      case 11:
      valorCarta = 10;
      break;
      case 12:
      valorCarta = 10;
      break;
      case 13:
      valorCarta = 10;
      break;
      default:
      valorCarta = carta.valor;
    }
    puntajes[puntajes.length] = valorCarta;
    totalPuntos += valorCarta;
  }
  return {totalPuntos: totalPuntos, puntajes:puntajes};
}

function dibujarCartas(baraja, divID) {
  var textoEnDiv = '';
  for (var c = 0; c < baraja.length; c++) {
    var carta = baraja[c];
    var textoCarta = '';
    var simboloCarta = '';
    var color = '';
    if (carta) {
      switch (carta.valor) {
        case 1:
        textoCarta = 'a';
        break;
        case 11:
        textoCarta = 'j';
        break;
        case 12:
        textoCarta = 'q';
        break;
        case 13:
        textoCarta = 'k';
        break;
        default:
        textoCarta = carta.valor;
      }
      switch (carta.palo) {
        case "c":
        simboloCarta = '&#9829;';
        break;
        case "d":
        simboloCarta = '&#9830;';
        break;
        case "e":
        simboloCarta = '&#9824;';
        break;
        case "t":
        simboloCarta = '&#9827;';
        break;
        default:
      }
      if (simboloCarta == '&#9829;' || simboloCarta == '&#9830;') {
        color = 'color';
      } else {
        color = '';
      }
      dibujandoCarta = '<div class="naipe ' + color + '">' +
            '<div class="arriba">' + '<div class="letra">&#160;' + textoCarta + '</div>' + '<div>&#160;' + simboloCarta + '</div>' +
			'</div><div class="centro">' + simboloCarta + '</div>' +
			'<div class="abajo"><div class="letra">&#160;' + textoCarta + '</div>' +
			'<div>&#160;' + simboloCarta + '</div></div></div>';
      textoEnDiv += dibujandoCarta;
    }
  }
  document.getElementById(divID).innerHTML = textoEnDiv;
};

var player;
function nombreJugador() {
  player = document.getElementById("jugadorNombre").value;
  document.getElementById('jugador').innerHTML = player;
  document.getElementById('elJugador').innerHTML = player;
}

var clic = 0;
function ocultarmostras() {
  if (clic==1) {
    document.getElementById("reglas").style.display = "none";
    document.getElementById("btnmo").innerHTML = 'Mostrar Reglas';
    clic++;
  } else {
    document.getElementById("reglas").style.display = "block";
    document.getElementById("btnmo").innerHTML = 'Ocultar Reglas';
    clic = 1;
  }
}

var click = 1;
function empezar() {
  if (click==1) {
    document.getElementById("cabecera").style.display = "none";
    document.getElementById("partida").style.display = "block";
    click++;
  }
}

function soloLetras(e) {
  key = e.keyCode || e.which;
  tecla = String.fromCharCode(key).toString();
  letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ"; //Se define todo el abecedario que se quiere que se muestre.
  especiales = [8, 37, 39, 46, 6]; //Es la validación del KeyCodes, que teclas recibe el campo de texto.

  tecla_especial = false
  for(var i in especiales) {
    if(key == especiales[i]) {
      tecla_especial = true;
      break;
    }
  }

  if(letras.indexOf(tecla) == -1 && !tecla_especial)
  return false;
}

var Croupier = { barajando: crearMano, reparte: dibujarCartas, puntua: puntuar };

var casa = {};
var jugador = {};

casa['puntajes'] = {};
casa.puntajes['PJ'] = 0;
casa.puntajes['PG'] = 0;
casa.puntajes['PE'] = 0;
casa.puntajes['PP'] = 0;
casa.mano = [];

jugador['puntajes'] = {};
jugador.puntajes['PJ'] = 0;
jugador.puntajes['PG'] = 0;
jugador.puntajes['PE'] = 0;
jugador.puntajes['PP'] = 0;
jugador.mano = [];

function pintarMarcador(){
  // Marcador del Jugador
  document.getElementById('jPJ').innerHTML = jugador.puntajes.PJ;
  document.getElementById('jPG').innerHTML = jugador.puntajes.PG;
  document.getElementById('jPE').innerHTML = jugador.puntajes.PE;
  document.getElementById('jPP').innerHTML = jugador.puntajes.PP;

  // Marcador de la casa
  document.getElementById('cPJ').innerHTML = casa.puntajes.PJ;
  document.getElementById('cPG').innerHTML = casa.puntajes.PG;
  document.getElementById('cPE').innerHTML = casa.puntajes.PE;
  document.getElementById('cPP').innerHTML = casa.puntajes.PP;
}

var cartasVolteadas = '<div class="naipeVoltedo"></div><div class="naipeVoltedo"></div>';
function getCarta(divID,isJugador){
  if(isJugador){ // Cuando es el jugador
    if(jugador.mano.length == 0){ // Si es la primera vez le da 2 cartas
      Array.prototype.push.apply(jugador.mano,Croupier.barajando(2));
      document.getElementById("bancaCartas").innerHTML = cartasVolteadas;
      document.getElementById("btnDameCarta").innerHTML = "Una mas !";
      document.getElementById('btnPlantarse').style.display = "inline-block";
    }else{ // Cuando vuelva a pedir se le dará una sola carta
      Array.prototype.push.apply(jugador.mano,Croupier.barajando(1));
    }
    // Se pinta las cartas
    Croupier.reparte(jugador.mano,divID);
    // Se obtienen los puntajes y se pintan
    var puntaje = Croupier.puntua(jugador.mano);
    var _totalPuntos = puntaje.puntajes.join(' + ') + ' = ' + puntaje.totalPuntos;
    document.getElementById('miPuntaje').innerHTML = _totalPuntos;
    if(puntaje.totalPuntos == 21){
      // Gana Jugador
      jugador.puntajes.PJ ++;
      jugador.puntajes.PG ++;

      casa.puntajes.PJ ++;
      casa.puntajes.PP ++;
      pintarMarcador();

      document.getElementById('ganador').innerHTML = player + ' Gana'
      document.getElementById('btnDameCarta').style.display = "none";
      document.getElementById('btnPlantarse').style.display = "none";
      document.getElementById('btnNuevaPartida').style.display = "inline-block";
    }else{
      if(puntaje.totalPuntos > 21){
        // Gana la Casa
        jugador.puntajes.PJ ++;
        jugador.puntajes.PP ++;

        casa.puntajes.PJ ++;
        casa.puntajes.PG ++;
        pintarMarcador();

        document.getElementById('ganador').innerHTML = 'La Casa Gana'
        document.getElementById('btnDameCarta').style.display = "none";
        document.getElementById('btnPlantarse').style.display = "none";
        document.getElementById('btnNuevaPartida').style.display = "inline-block";
      }
    }
  }else{
    // Cuando es la maquina
    var puntajeJugador = Croupier.puntua(jugador.mano).totalPuntos;
    var puntaje = Croupier.puntua(casa.mano).totalPuntos;
    while(puntaje <= 21){
      if(casa.mano.length == 0){
        Array.prototype.push.apply(casa.mano,Croupier.barajando(2));
      }else{
        Array.prototype.push.apply(casa.mano,Croupier.barajando(1));
      }
      puntaje = Croupier.puntua(casa.mano).totalPuntos;
      if(puntaje >= puntajeJugador)
      break;
    }
    Croupier.reparte(casa.mano,divID);
    puntaje = Croupier.puntua(casa.mano);
    var _totalPuntos = puntaje.puntajes.join(' + ') + ' = ' + puntaje.totalPuntos;
    document.getElementById('elPuntaje').innerHTML = _totalPuntos;

    // Calcular puntajes y verificar ganador
    if(puntaje.totalPuntos > 21){
      jugador.puntajes.PJ ++;
      jugador.puntajes.PG ++;

      casa.puntajes.PJ ++;
      casa.puntajes.PP ++;

      document.getElementById('ganador').innerHTML = player + ' Gana'
      document.getElementById('btnDameCarta').style.display = "none";
      document.getElementById('btnPlantarse').style.display = "none";
      document.getElementById('btnNuevaPartida').style.display = "inline-block";
    }else{
      if(puntajeJugador == puntaje.totalPuntos){
        jugador.puntajes.PJ ++;
        jugador.puntajes.PE ++;

        casa.puntajes.PJ ++;
        casa.puntajes.PE ++;

        document.getElementById('ganador').innerHTML = 'Empate'
        document.getElementById('btnDameCarta').style.display = "none";
        document.getElementById('btnPlantarse').style.display = "none";
        document.getElementById('btnNuevaPartida').style.display = "inline-block";
      }else{
        jugador.puntajes.PJ ++;
        jugador.puntajes.PP ++;

        casa.puntajes.PJ ++;
        casa.puntajes.PG ++;

        document.getElementById('ganador').innerHTML = 'La Casa Gana'
        document.getElementById('btnDameCarta').style.display = "none";
        document.getElementById('btnPlantarse').style.display = "none";
        document.getElementById('btnNuevaPartida').style.display = "inline-block";
      }
    }
    pintarMarcador();
  }
}

function nuevaPartida() {
  casa.mano = [];
  jugador.mano = [];
  document.getElementById('misCartas').innerHTML = "";
  document.getElementById('miPuntaje').innerHTML = "";
  document.getElementById('bancaCartas').innerHTML = "";
  document.getElementById('elPuntaje').innerHTML = "";
  document.getElementById('ganador').innerHTML = "";
  document.getElementById("btnDameCarta").innerHTML = "Dame cartas";
  document.getElementById('btnDameCarta').style.display = "inline-block";
  document.getElementById('btnPlantarse').style.display = "none";
  document.getElementById('btnNuevaPartida').style.display = "none";
}

function verifica() {
  if (document.getElementById('jugadorNombre').value != "") {
    nombreJugador(); empezar();
  } else {
    document.getElementById('advertencia').style.display = "block";
    document.getElementById('advertencia').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Debes Ingresar tu nombre.';
  }
}
