var cont = 0;

/* Determinamos el tiempo total en segundos */
var totalTiempo=30;
/* Determinamos la url donde redireccionar */
var url="principal.html";

var KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39, 
    BARRA: 32
};

var puntos = 0;

var map = {};

map.pressedKeys=[];

var iVidas=4;

var tecla = "";

window.onload=updateReloj();

var colisionLlave = "no";
var yaProbado = 'no';

$(document).ready(function(){
    ponPuntos();  //provisional
    $('.llave').css({
        backgroundImage: "url(imagenes/llave2.gif)"
    });

});

function updateReloj()
{
    document.getElementById('CuentaAtras').innerHTML = "Quedan <span style='font-size: 2em;'>"+totalTiempo+"</span> segundos";

    if(totalTiempo==0)
    {
        var jqPJ = $("#pj");
        var divCorazon = "#heart" + iVidas;

        jqPJ.css({
            top:"40px",
            left:"40px"
        });

        $(divCorazon).effect("explode","slow");

        $(divCorazon).css({
            backgroundImage: "url(imagenes/corazon_vacio.png)"
        });

        $(divCorazon).effect("pulsate","slow");

        iVidas--;
        if(iVidas==0){
            clearInterval(map.timer);
            clearInterval(map.timerEne);
            $("#mensajeMuerte").addClass("muerte1",1000).addClass("muerte2",5000);
            window.location.href = 'perder.html';
        }
        alert('TIME OUT. Volvemos a intentarlo.');
        totalTiempo=30;
        setTimeout("updateReloj()",1000);
        
    }else{
        /* Restamos un segundo al tiempo restante */
        totalTiempo-=1;
        /* Ejecutamos nuevamente la función al pasar 1000 milisegundos (1 segundo) */
        setTimeout("updateReloj()",1000);
    }
}

$(function()
{
    // bucle de juego cada 30 milisegundos
    map.timer = setInterval(gameloop,30);

    map.timerEne= setInterval(moverEnemigos,1000);

    // marcar las teclas pulsadas en el array "pressedKeys"
    $(document).keydown(function(event){
        var e=window.event||event;
        map.pressedKeys[e.keyCode] = true;
        var jqPJ=$("#pj");
        if (e.keyCode==KEY.UP) // up
        {
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-derecha.png)"
            });
        }
        if (e.keyCode==KEY.DOWN) // down
        {
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-izq.gif)"
            });
        }
        if (e.keyCode==KEY.LEFT) // left
        {
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-izq.gif)"
            });
        }
        if (e.keyCode==KEY.RIGHT) // right
        {
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-derecha.png)"
            });
        }
    });
    $(document).keyup(function(event){
        var e=window.event||event;
        map.pressedKeys[e.keyCode] = false;
        var jqPJ=$("#pj");

        jqPJ.css({
                backgroundImage: "url(imagenes/stop/mario-parado.png)"
            });
    });

    


});

function gameloop() {
    moveMe();
    herida();
    salida();
    colisionEnemigos();
    colisionLlavePersonaje();
    detectarColisionObstaculos();
}

function ponPuntos()
{
    var parrafo = $('<p></p>').text("Puntos: "+puntos);
    parrafo.attr('style','margin-left: 10%;');
    $('#puntos').append(parrafo);
}

function moveMe() {

    //var direction=0;
    var jqPJ=$("#pj");

    if (map.pressedKeys[KEY.UP]) // flecha arriba
    {
        direction = parseInt(jqPJ.css("top"));
        tecla = "arriba";
        if(collision(jqPJ,$('#paredArriba'))>0 || collision(jqPJ,$('#paredDerechaSalida'))>0 || collision(jqPJ,$('#obstaculo1'))>0 || collision(jqPJ,$('#obstaculo2'))>0 || collision(jqPJ,$('#obstaculo3'))>0 || collision(jqPJ,$('#obstaculo4'))>0){
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-derecha.png)"
            });
        }else {
            jqPJ.animate({top: "-=10px"},5);
        }
    }
    if (map.pressedKeys[KEY.DOWN]) // arrow downflecha abajo
    {
        direction = parseInt(jqPJ.css("top"));
        tecla = "abajo";
        if(collision(jqPJ,$('#paredAbajo'))>0 || collision(jqPJ,$('#obstaculo1'))>0 || collision(jqPJ,$('#obstaculo2'))>0 || collision(jqPJ,$('#obstaculo3'))>0 || collision(jqPJ,$('#obstaculo4'))>0){
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-izq.gif)"
            });
        }else {

            jqPJ.animate({top: "+=10px"},5);
        }
    }
    if (map.pressedKeys[KEY.LEFT]) // flecha izquierda
    {
        direction = parseInt(jqPJ.css("left"));
        tecla = "izquierda";
        if(collision(jqPJ,$('#paredIzquierda'))>0 || collision(jqPJ,$('#obstaculo1'))>0 || collision(jqPJ,$('#obstaculo2'))>0 || collision(jqPJ,$('#obstaculo3'))>0 || collision(jqPJ,$('#obstaculo4'))>0){
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-izq.gif)"
            });
        }else {

            jqPJ.animate({left: "+=-10px"},5);
        }
    }
    if (map.pressedKeys[KEY.RIGHT]) // flecha derecha
    {
        direction = parseInt(jqPJ.css("left"));
        tecla = "derecha";
        if(collision(jqPJ,$('#paredDerecha'))>0 || collision(jqPJ,$('#paredSalida')) || collision(jqPJ,$('#obstaculo1'))>0 || collision(jqPJ,$('#obstaculo2'))>0 || collision(jqPJ,$('#obstaculo3'))>0 || collision(jqPJ,$('#obstaculo4'))>0){
            jqPJ.css({
                backgroundImage: "url(imagenes/mario-derecha.png)"
            });
        }else {

            jqPJ.animate({left: "+=10px"},5);
        }
    }
    if (map.pressedKeys[KEY.BARRA]) // barra espacio
    {
        disparar(tecla);
    }

}

function moverEnemigos(){
    var jqEnemigo;
    //var direction;
    var numAleatorio;

    $(".enemigos").each(function(){
        jqEnemigo=$(this);
        //var direction=0;
        numAleatorio=Math.floor((Math.random() * (40-37+1)) + 37);

        if (numAleatorio==KEY.UP) // flecha arriba
        {
            //direction = parseInt(jqEnemigo.css("top"));

                jqEnemigo.css({backgroundImage: "url(imagenes/enemigos/enemigo1_up.gif)"});
                jqEnemigo.animate({top: "-=20px"},500);
                

        }
        if (numAleatorio==KEY.DOWN) //downflecha abajo
        {
            //direction = parseInt(jqEnemigo.css("top"));

                jqEnemigo.css({backgroundImage: "url(imagenes/enemigos/enemigo1_down.gif)"});
                jqEnemigo.animate({top: "+=20px"},500);
                

        }
        if (numAleatorio==KEY.LEFT) // flecha izquierda
        {
            //direction = parseInt(jqEnemigo.css("left"));

                jqEnemigo.css({backgroundImage: "url(imagenes/enemigos/enemigo1_izq.gif)"});
                jqEnemigo.animate({left: "-=20px"},500);
                

        }
        if (numAleatorio==KEY.RIGHT) // flecha derecha
        {
            //direction = parseInt(jqEnemigo.css("left"));
                jqEnemigo.css({backgroundImage: "url(imagenes/enemigos/enemigo1_der.gif)"});
                jqEnemigo.animate({left: "+=20px"},500);
                

        }
    });
}

function colisionEnemigos(){
    var jqEnemigo;

    $(".enemigos").each(function(){
        jqEnemigo=$(this);

            if(collision(jqEnemigo,$('#paredArriba'))>0 || collision(jqEnemigo,$('#paredDerechaSalida'))>0) {
                jqEnemigo.stop(false, false);
                jqEnemigo.animate({top: "+=3px"}, 1);
                jqEnemigo.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_up.png)"
                });
            }

            if(collision(jqEnemigo,$('#paredAbajo'))>0) {
                jqEnemigo.stop(false, false);
                jqEnemigo.animate({top: "+=-3px"}, 1);
                jqEnemigo.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_down.png)"
                });
            }

            if(collision(jqEnemigo,$('#paredIzquierda'))>0) {
                jqEnemigo.stop(false, false);
                jqEnemigo.animate({left: "+=3px"}, 1);
                jqEnemigo.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_izq.png)"
                });
            }

            if(collision(jqEnemigo,$('#paredDerecha'))>0 || collision(jqEnemigo,$('#paredSalida'))) {
                jqEnemigo.stop(false, false);
                jqEnemigo.animate({left: "+=-3px"}, 1);
                jqEnemigo.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_der.png)"
                });
            }

    });
}

function salida(){
    var jqPJ=$("#pj");
    var jqSalida=$("#salida");
    if(collision(jqPJ,jqSalida)>0){
        if(colisionLlave=='si')
        {
            clearInterval(map.timer);
            clearInterval(map.timerEne);
            cont++;
        }
        else if(yaProbado == 'no')
        {
            yaProbado = 'sí';
            //alert('!DEBES COGER LA LLAVE!');
            colisionPuerta();
        }
        else
        {
            yaProbado = 'sí';
        }
    }
    if(cont==1)
    {
        cont=2;
        //$("#mensajeGanar").addClass("ganastes1",1000).addClass("ganastes2",5000);
        window.location.href = 'nivel2.html';
    }
    else if(cont==2)
    {
        cont=3;
        //$("#mensajeGanar").addClass("ganastes1",1000).addClass("ganastes2",5000);
        window.location.href = 'nivel3.html';
    }
    else if(cont>2)
    {
        alert('No hay más niveles. Eres un campeón.');
        window.location.href = 'principal.html';
    }
}

function herida() {
    var jqPJ = $("#pj");

    $(".enemigos").each(function(){
        if (collision(jqPJ,$(this))>0) { //todo colision con enemigo
            var divCorazon = "#heart" + iVidas;

            jqPJ.css({
                top:"40px",
                left:"40px"
            });

            $(divCorazon).effect("explode","slow");

            $(divCorazon).css({
                backgroundImage: "url(imagenes/corazon_vacio.png)"
            });

            $(divCorazon).effect("pulsate","slow");

            iVidas--;
            if(iVidas==0){
                clearInterval(map.timer);
                clearInterval(map.timerEne);
                $("#mensajeMuerte").addClass("muerte1",1000).addClass("muerte2",5000);
                window.location.href = 'perder.html';
            }
        }
    });
}

function disparar(direccion)
{
  var caparazon = $("<div></div>").addClass("disparo");
  $(caparazon).css({left: $("#pj").offset().left-70, top: $("#pj").offset().top-70});
  $(caparazon).data("direccion", direccion);
  $("body").append(caparazon);
} 

function colisionLlavePersonaje() {
    if(collision($("#pj"),$("#llave"))>0){
        colisionLlave='si';
        $("#llave").css({top:"470px",left:"1140px",height:"50px",width:"50px"});
        $("#llave").wrap("<li></li>").parent().sortable({ revert: "invalid" }).appendTo("#llaveCogida ul");
    }
}


function colisionPuerta()
{
    var puerta = collision($('#pj'),$('#salida'));
    if( puerta > 0){
        $("#pj").stop(false,false);   
        $('#pj').animate({left: "+=-3px"},1);  
    }
}


function detectarColisionObstaculos(){

    var col1 = collision($('#pj'),$('#obstaculo1'));
    var col2 = collision($('#pj'),$('#obstaculo2'));
    var col3 = collision($('#pj'),$('#obstaculo3'));
    var col4 = collision($('#pj'),$('#obstaculo4'));
  
    if( col1 > 0){
        if(tecla=='abajo')
        {
            $("#pj").stop(false,false);   
            $('#pj').animate({top: "+=-3px"},1);  
        }
        else if(tecla=='arriba')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({top: "+=3px"},1);  
        }
        else if(tecla=='izquierda')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=3px"},1); 
        }
        else if(tecla=='derecha')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=-3px"},1); 
        }
        
    }
    if( col2 > 0){
        if(tecla=='abajo')
        {
            $("#pj").stop(false,false);   
            $('#pj').animate({top: "+=-3px"},1);  
        }
        else if(tecla=='arriba')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({top: "+=3px"},1);  
        }
        else if(tecla=='izquierda')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=3px"},1); 
        }
        else if(tecla=='derecha')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=-3px"},1); 
        }     
    }
    if( col3 > 0){
        if(tecla=='abajo')
        {
            $("#pj").stop(false,false);   
            $('#pj').animate({top: "+=-3px"},1);  
        }
        else if(tecla=='arriba')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({top: "+=3px"},1);  
        }
        else if(tecla=='izquierda')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=3px"},1); 
        }
        else if(tecla=='derecha')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=-3px"},1); 
        }    
    }
    if( col4 > 0){
        if(tecla=='abajo')
        {
            $("#pj").stop(false,false);   
            $('#pj').animate({top: "+=-3px"},1);  
        }
        else if(tecla=='arriba')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({top: "+=3px"},1);  
        }
        else if(tecla=='izquierda')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=3px"},1); 
        }
        else if(tecla=='derecha')
        {
            $("#pj").stop(false,false);  
            $('#pj').animate({left: "+=-3px"},1); 
        }     
    }

    $(".disparo").each(function()
  {
    if (collision($(this),$('.pared')) > 0)
      $(this).remove();
    else {
      if ($(this).data("direccion") == "derecha")
        $(this).css({left: "+=5px"});
      else if ($(this).data("direccion") == "izquierda")
        $(this).css({left: "-=5px"});
      else if ($(this).data("direccion") == "arriba")
      $(this).css({top: "+=5px"});
      else
      {
        $(this).css({top: "-=5px"}); 
      }
    }

  });

  }