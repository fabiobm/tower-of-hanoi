/* TO-DO                                        */
/*                                              */
/*  - opcao de mostrar a solucao (com botoes?)  */

var x = -1;
var pinos = [[], [], []];
var primeiroJogo = true;
var comecou = false;
var movimentos = 0;

$(document).ready(function() {

    $('.disco').hide();             // No começo
    $('#desiste').hide();

    $('#inicio').click(function() {
        $('.disco').hide();

        if (!primeiroJogo) {
            console.log("curtiu em, jogando de novo!?");
            reset();
        }

        else
            comecou = true;

        while (isNaN(x) || x < 1 || x > 10)
            x = prompt("Escolha o número de discos (1 a 10)");
        
        for (var i = 0; i < x; i++)
            $('#d' + i).show();

        initPinos();
        $(this).hide();
        $('#desiste').show();
    });

    $('#desiste').click(function() {
        comecou = false;
        primeiroJogo = false;
        $(this).hide();
        $('#inicio').show();
    });

    var disco;
    var orig;
    var discoSelecionado = -1;

    $('.disco').click(function() {
        if (discoSelecionado !== -1) {
            $('#d' + disco).css('border', '');
        }
        disco = $(this).attr('id').substring(1);
        discoSelecionado = disco;
        console.log("disco = " + disco);
        orig = achaDisco(disco);
        console.log("disco " + disco + " veio de " + orig);
        $(this).css('border', '0.171875em dashed black');
    });

    $('.pino').click(function() {
        console.log("aqui o disco eh " + disco);
        var dest = $(this).attr('id');
        console.log("destino = " + dest);
        console.log("disco " + disco + " de " + orig + " pra " + dest);

        switch(dest) {

            case 'left':
                moveDisco(disco, orig, 0);
                break;

            case 'mid':
                moveDisco(disco, orig, 1);
                break;

            case 'right':
                moveDisco(disco, orig, 2);
                break;

            default:
                console.log('ERRO: id do div do pino destino inválido');
        }

        $('#d' + disco).css('border', '');

        discoSelecionado = -1;

        // Aviso de que ganhou e reinicia tudo
        if (ganhou()) {
            comecou = false;
            console.log('ganhou, boa');
            $('#desiste').hide();
            $('#inicio').show();
            primeiroJogo = false;
            setTimeout(function() {
                if (x === 1)
                    alert('Parabéns! Você ganhou com ' + movimentos + ' movimento!\nO mínimo possível é ' + (Math.pow(2, x) - 1) + '.');
                else
                    alert('Parabéns! Você ganhou com ' + movimentos + ' movimentos!\nO mínimo possível é ' + (Math.pow(2, x) - 1) + '.');
            }, 800);
        }
    });
});

function initPinos() {
    for (var i = 0; i < x; i++) {
        pinos[0][i] = true;
        pinos[1][i] = pinos[2][i] = false;
    }
}

function nDiscos(pino) {
    var n = 0;
    for (var i = 0; i < x; i++) {
        if (pinos[pino][i])
            n++;
    }

    return n;
}

function achaDisco(disco) {
    if (pinos[0][disco]) {
        console.log('pino 0');
        return 0;
    }
    if (pinos[1][disco]) {
        console.log('pino 1');
        return 1;
    }
    if (pinos[2][disco]) {
        console.log('pino 2');
        return 2;
    }
}

function moveDisco(disco, orig, dest, vel) {
    
    if (typeof(vel) === 'undefined')
        vel = 4;
    
    console.log("disco " + disco + " de " + orig + " pra " + dest);
    // Checa a validade do movimento
    if (dest === orig) {
        console.log("ERRO: Destino igual a origem do movimento");
        alert('Jogada inválida, destino igual a origem do movimento');
        return false;
    }

    if (achaDisco(disco) !== orig) {
        console.log("ERRO: Tentando mover disco " + disco + " que não está no pino " + orig);
        alert('Jogada inválida, tentativa de mover disco que não está no pino');
        return false;
    }

    var maxDest = 0;
    var maxOrig = 0;
    for (var i = 0; i < x; i++) {
        if (pinos[dest][i])
            maxDest = i;
        if (pinos[orig][i])
            maxOrig = i;
    }
    
    if (maxDest > disco) {
        console.log("ERRO: Jogada ilegal, tentativa de por disco maior em cima de menor");
        alert('Jogada inválida, tentativa de pôr disco maior em cima de disco menor');
        return false;
    }

    if (maxOrig > disco) {
        console.log("ERRO: Jogada ilegal, tentativa de mover disco que não está no topo");
        alert('Jogada inválida, tentativa de mover disco que não está no topo do seu pino');
        return false;
    }

    if (!comecou) {
        console.log("ERRO: Jogo terminou e novo jogo ainda não começou");
        alert('Jogada inválida, jogo ainda não começou');
        return false;
    }

    // Move na interface gráfica
    if (nDiscos(orig) > nDiscos(dest)) {
        ajustaHorizontal(disco, dest, vel * 100);
        ajustaVertical(disco, nDiscos(dest), vel * 100);
    }
    
    else {
        ajustaVertical(disco, nDiscos(dest), vel * 100);
        ajustaHorizontal(disco, dest, vel * 100);
    }

    // Move nas arrays
    pinos[dest][disco] = true;
    pinos[orig][disco] = false;

    movimentos++;
    $('#movimentos').text('Movimentos: ' + movimentos);
    if (movimentos > 0) {
        var mvm = 500 - 15 * (Math.floor(Math.log(movimentos)/Math.log(10)) + 1);
        mvm = mvm * 0.0625;
        $('#movimentos').css('margin-left', mvm + 'em');
    }

    return true;
}

function ajustaVertical(disco, n, vel) {
    var tm = 445 - 30 * n;
    tm = tm * 0.0625;
    console.log('tm = ' + tm);
    $('#d' + disco).animate({marginTop: tm + 'em'}, vel);
}

function ajustaHorizontal(disco, dest, vel) {
    var ml = 400 * dest + 10 + 15 * disco;
    ml = ml * 0.0625;
    $('#d' + disco).animate({marginLeft: ml + 'em'}, vel);
}

function ganhou() {
    return (nDiscos(2) === parseInt(x) && nDiscos(0) === 0 && nDiscos(1) === 0) ? true : false;
}

function reset() {
    comecou = true;
    movimentos = 0;
    $('#movimentos').text('Movimentos: 0').css('margin-left', '500px');
    x = -1;
    pinos = [[], [], []];
    for (var i = 0; i < 10; i++) {
        ajustaHorizontal(i, 0, 1);
        if (!ganhou())
            ajustaVertical(i, i, 1);
    }
}