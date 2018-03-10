var cont = 2;

/* Determinamos el tiempo total en segundos */
var totalTiempo=65;
/* Determinamos la url donde redireccionar */
var url="principal.html";

window.onload=updateReloj();

var KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39, 
    BARRA: 32
};

var puntos = 300;

var map = {};

map.pressedKeys=[];

var iVidas=4;

var tecla = "";

var colisionLlave = "no";
var colisionLlave2 = "no";
var colisionLlave3 = "no";
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
        totalTiempo=65;
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

    map.timerEne= setInterval(moveEnemigos,1000);

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
}

function moveEnemigos(){
    var jqEnemy;
    //var direction;
    var numAleatorio;

    $(".enemigos").each(function(){
        jqEnemy=$(this);
        //var direction=0;
        numAleatorio=Math.floor((Math.random() * (40-37+1)) + 37);

        if (numAleatorio==KEY.UP) // flecha arriba
        {
            //direction = parseInt(jqEnemy.css("top"));

                jqEnemy.css({backgroundImage: "url(imagenes/enemigos/enemigo1_up.gif)"});
                jqEnemy.animate({top: "-=60px"},100);
                

        }
        if (numAleatorio==KEY.DOWN) // arrow downflecha abajo
        {
            //direction = parseInt(jqEnemy.css("top"));

                jqEnemy.css({backgroundImage: "url(imagenes/enemigos/enemigo1_down.gif)"});
                jqEnemy.animate({top: "+=60px"},100);
                

        }
        if (numAleatorio==KEY.LEFT) // flecha izquierda
        {
            //direction = parseInt(jqEnemy.css("left"));

                jqEnemy.css({backgroundImage: "url(imagenes/enemigos/enemigo1_izq.gif)"});
                jqEnemy.animate({left: "-=60px"},100);
                

        }
        if (numAleatorio==KEY.RIGHT) // flecha derecha
        {
            //direction = parseInt(jqEnemy.css("left"));
                jqEnemy.css({backgroundImage: "url(imagenes/enemigos/enemigo1_der.gif)"});
                jqEnemy.animate({left: "+=60px"},100);
                

        }
    });
}

function colisionEnemigos(){
    var jqEnemy;

    $(".enemigos").each(function(){
        jqEnemy=$(this);

            if(collision(jqEnemy,$('#paredArriba'))>0 || collision(jqEnemy,$('#paredDerechaSalida'))>0) {
                jqEnemy.stop(false, false);
                jqEnemy.animate({top: "+=3px"}, 1);
                jqEnemy.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_up.png)"
                });
            }

            if(collision(jqEnemy,$('#paredAbajo'))>0) {
                jqEnemy.stop(false, false);
                jqEnemy.animate({top: "+=-3px"}, 1);
                jqEnemy.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_down.png)"
                });
            }

            if(collision(jqEnemy,$('#paredIzquierda'))>0) {
                jqEnemy.stop(false, false);
                jqEnemy.animate({left: "+=3px"}, 1);
                jqEnemy.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_izq.png)"
                });
            }

            if(collision(jqEnemy,$('#paredDerecha'))>0 || collision(jqEnemy,$('#paredSalida'))) {
                jqEnemy.stop(false, false);
                jqEnemy.animate({left: "+=-3px"}, 1);
                jqEnemy.css({
                    backgroundImage: "url(imagenes/enemigos/enemigo1_der.png)"
                });
            }

    });
}

function salida(){
    var jqPJ=$("#pj");
    var jqSalida=$("#salida");
    if(collision(jqPJ,jqSalida)>0){
        if(colisionLlave=='si' && colisionLlave2=='si' && colisionLlave3=='si')
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
    
    if(cont>2)
    {
        window.location.href = 'ganaste.html';
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

function colisionLlavePersonaje() {
    if(collision($("#pj"),$("#llave"))>0){
        colisionLlave='si';
        $("#llave").css({top:"470px",left:"1140px",height:"50px",width:"50px"});
        $("#llave").wrap("<li></li>").parent().sortable({ revert: "invalid" }).appendTo("#llaveCogida ul");
    }
    if(collision($("#pj"),$("#llave2"))>0){
        colisionLlave2='si';
        $("#llave2").css({top:"470px",left:"1200px",height:"50px",width:"50px"});
        $("#llave2").wrap("<li></li>").parent().sortable({ revert: "invalid" }).appendTo("#llaveCogida ul");
    }
    if(collision($("#pj"),$("#llave3"))>0){
        colisionLlave3='si';
        $("#llave3").css({top:"470px",left:"1265px",height:"50px",width:"50px"});
        $("#llave3").wrap("<li></li>").parent().sortable({ revert: "invalid" }).appendTo("#llaveCogida ul");
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
    var col5 = collision($('#pj'),$('#obstaculo5'));
    var col6 = collision($('#pj'),$('#obstaculo6'));
  
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

    if( col5 > 0){
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

    if( col6 > 0){
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
  }