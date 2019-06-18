function hanoiI(n) {
    var maxD = [n - 1, -1, -1];
    var j = 0;

    while (true) {
        
        maxD = max(n);

        if (x % 2 === 0) {

            if (maxD[0] > maxD[1]) {
                console.log('disco ' + maxD[0] + ' de 0 pra 1');
                // pinos[0][maxD[0]] = false;
                // pinos[1][maxD[0]] = true;
                
                // moveDisco(maxD[0], 0, 1, 4, true);
            }

            else {
                console.log('disco ' + maxD[1] + ' de 1 pra 0');
                // pinos[1][maxD[1]] = false;
                // pinos[0][maxD[1]] = true;
                
                // moveDisco(maxD[1], 1, 0, 4, true);
            }

            if (ganhou())   break;
            maxD = max(n);

            if (maxD[0] > maxD[2]) {
                console.log('disco ' + maxD[0] + ' de 0 pra 2');
                // pinos[0][maxD[0]] = false;
                // pinos[2][maxD[0]] = true;
                
                // moveDisco(maxD[0], 0, 2, 4, true);
            }

            else {
                console.log('disco ' + maxD[2] + ' de 2 pra 0');
                // pinos[2][maxD[2]] = false;
                // pinos[0][maxD[2]] = true;
                
                // moveDisco(maxD[2], 2, 0, 4, true);
            }

            if (ganhou())   break;
            maxD = max(n);

            if (maxD[1] > maxD[2]) {
                console.log('disco ' + maxD[1] + ' de 1 pra 2');
                // pinos[1][maxD[1]] = false;
                // pinos[2][maxD[1]] = true;
                
                // moveDisco(maxD[1], 1, 2, 4, true);
            }

            else {
                console.log('disco ' + maxD[2] + ' de 2 pra 1');
                // pinos[2][maxD[2]] = false;
                // pinos[1][maxD[2]] = true;
                
                // moveDisco(maxD[2], 2, 1, 4, true);
            }

            if (ganhou())   break;
        }

        else {

            if (maxD[0] > maxD[2]) {
                console.log('disco ' + maxD[0] + ' de 0 pra 2');
                // pinos[0][maxD[0]] = false;
                // pinos[2][maxD[0]] = true;
                
                // moveDisco(maxD[0], 0, 2, 4, true);
            }

            else {
                console.log('disco ' + maxD[2] + ' de 2 pra 0');
                // pinos[2][maxD[2]] = false;
                // pinos[0][maxD[2]] = true;
                
                // moveDisco(maxD[2], 2, 0, 4, true);
            }

            if (ganhou())   break;
            maxD = max(n);

            if (maxD[0] > maxD[1]) {
                console.log('disco ' + maxD[0] + ' de 0 pra 1');
                // pinos[0][maxD[0]] = false;
                // pinos[1][maxD[0]] = true;
                
                // moveDisco(maxD[0], 0, 1, 4, true);
            }

            else {
                console.log('disco ' + maxD[1] + ' de 1 pra 0');
                // pinos[1][maxD[1]] = false;
                // pinos[0][maxD[1]] = true;
                
                // moveDisco(maxD[1], 1, 0, 4, true);
            }

            if (ganhou())   break;
            maxD = max(n);

            if (maxD[1] > maxD[2]) {
                console.log('disco ' + maxD[1] + ' de 1 pra 2');
                // pinos[1][maxD[1]] = false;
                // pinos[2][maxD[1]] = true;
                
                // moveDisco(maxD[1], 1, 2, 4, true);
            }

            else {
                console.log('disco ' + maxD[2] + ' de 2 pra 1');
                // pinos[2][maxD[2]] = false;
                // pinos[1][maxD[2]] = true;
                
                // moveDisco(maxD[2], 2, 1, 4, true);
            }

            if (ganhou())   break;
        }
        j++;
    }
}

function hanoi(n, orig, extra, dest, sec) {
    if (n === 0)
        return;

    setTimeout(hanoi, sec, n - 1, orig, dest, extra, sec);

    setTimeout(moveDisco, sec-1, x - n, orig, dest);
    /*if (sec === 0) {
        console.log('sec 0 porra');
        $('#next').click(function(){hanoi(n-1, extra, orig, dest);});
    }*/
    /*else
        setTimeout(hanoi, sec, n-1, extra, orig, dest, sec);*/

    setTimeout(hanoi, sec, n - 1, extra, orig, dest, sec);
}

function max(n) {
    var maxD = [-1, -1, -1];
    for (var i = 0; i < n; i++) {
        if (pinos[0][i])
            maxD[0] = i;
        if (pinos[1][i])
            maxD[1] = i;
        if (pinos[2][i])
            maxD[2] = i;
    }

    return maxD;
}

function resolve() {
    console.log('oi....');
    $('#desiste').hide();
    $('#next').show();
    hanoi(x, 0, 1, 2, 4);
    //$('#next').hide();
}


// Dentro do document.ready() :
    $('#desiste').click(function() {
        var sol = confirm('Deseja ver a solução?');
        if (sol)
            resolve();
            
        setTimeout(function() {
            comecou = false;
            primeiroJogo = false;
            $(this).hide();
            $('#inicio').show();
        }, 10000);
    });

