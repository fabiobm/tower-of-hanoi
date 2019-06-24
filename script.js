var disks = -1;
var rods = [[], [], []];
var firstMatch = true;
var started = false;
var movements = 0;

$(document).ready(function() {
    $('.disk').hide(); // Initial state
    $('#quit').hide();

    $('#start').click(function() {
        $('.disk').hide();

        if (!firstMatch) {
            reset();
        } else {
            started = true;
        }

        while (isNaN(disks) || disks < 1 || disks > 10) {
            disks = prompt("Choose the number of disks (1 to 10)");
        }
        
        for (var i = 0; i < disks; i++) {
            $('#d' + i).show();
        }

        initRods();
        $(this).hide();
        $('#quit').show();
    });

    $('#quit').click(function() {
        started = false;
        firstMatch = false;
        $(this).hide();
        $('#start').show();
    });

    var disk;
    var orig;
    var selectedDisk = -1;

    $('.disk').click(function() {
        if (selectedDisk !== -1) {
            $('#d' + disk).css('border', '');
        }

        disk = $(this).attr('id').substring(1);
        selectedDisk = disk;
        orig = findDisk(disk);
        $(this).css('border', '0.171875em dashed black');
    });

    $('.rod').click(function() {
        var dest = $(this).attr('id');

        switch(dest) {
            case 'left':
                moveDisk(disk, orig, 0);
                break;

            case 'mid':
                moveDisk(disk, orig, 1);
                break;

            case 'right':
                moveDisk(disk, orig, 2);
                break;

            default:
                console.error('The id (' + dest + ') of the destination rod div is invalid');
        }

        $('#d' + disk).css('border', '');

        selectedDisk = -1;

        // Winning alert and restart
        if (success()) {
            started = false;
            $('#quit').hide();
            $('#start').show();
            firstMatch = false;

            setTimeout(function() {
                if (disks === 1) {
                    alert('Congratulations! You did it with ' + movements + ' movement!\nThe minimum is ' + (Math.pow(2, disks) - 1));
                } else {
                    alert('Congratulations! You did it with ' + movements + ' movements!\nThe minimum is ' + (Math.pow(2, disks) - 1));
                }
            }, 800);
        }
    });
});

function initRods() {
    for (var i = 0; i < disks; i++) {
        rods[0][i] = true;
        rods[1][i] = rods[2][i] = false;
    }
}

function nDisks(rod) {
    var n = 0;
    for (var i = 0; i < disks; i++) {
        if (rods[rod][i]) {
            n++;
        }
    }

    return n;
}

function findDisk(disk) {
    if (rods[0][disk]) {
        return 0;
    }

    if (rods[1][disk]) {
        return 1;
    }

    if (rods[2][disk]) {
        return 2;
    }
}

function moveDisk(disk, orig, dest, speed) {
    if (typeof(speed) === 'undefined') {
        speed = 4;
    }
    
    // Checks whether the movement is valid
    if (dest === orig) {
        console.error('Destination (' + dest + ') is the same as origin');
        alert('Invalid move, destination is the same as origin');
        return false;
    }

    if (findDisk(disk) !== orig) {
        console.error('Attempt to move disk (' + disk + ') that is not on the rod (' + orig + ')');
        alert('Invalid move, attempt to move disk that is not on the rod');
        return false;
    }

    var maxDest = 0;
    var maxOrig = 0;
    for (var i = 0; i < disks; i++) {
        if (rods[dest][i])
            maxDest = i;
        if (rods[orig][i])
            maxOrig = i;
    }
    
    if (maxDest > disk) {
        console.error('Attempt to place bigger disk (' + disk + ') on top of smaller one (' + maxDest + ')');
        alert('Invalid move, attempt to place bigger disk on top of smaller one');
        return false;
    }

    if (maxOrig > disk) {
        console.error('Attempt to move disk (' + disk + ') that is not on top of its rod (' + maxOrig + ')');
        alert('Invalid move, attempt to move disk that is not on top of its rod');
        return false;
    }

    if (!started) {
        console.error('A match has ended and a new one has not started yet');
        alert('Invalid move, match has not started yet');
        return false;
    }

    if (nDisks(orig) > nDisks(dest)) {
        adjustHorizontally(disk, dest, speed * 100);
        adjustVertically(disk, nDisks(dest), speed * 100);
    }
    
    else {
        adjustVertically(disk, nDisks(dest), speed * 100);
        adjustHorizontally(disk, dest, speed * 100);
    }

    rods[dest][disk] = true;
    rods[orig][disk] = false;

    movements++;
    $('#movements').text('Movements: ' + movements);
    if (movements > 0) {
        var mvm = 500 - 15 * (Math.floor(Math.log(movements) / Math.log(10)) + 1);
        mvm = mvm * 0.0625;
        $('#movements').css('margin-left', mvm + 'em');
    }

    return true;
}

function adjustVertically(disk, n, speed) {
    var marginTop = 445 - 30 * n;
    marginTop = marginTop * 0.0625;
    $('#d' + disk).animate({marginTop: marginTop + 'em'}, speed);
}

function adjustHorizontally(disk, dest, speed) {
    var marginLeft = 400 * dest + 10 + 15 * disk;
    marginLeft = marginLeft * 0.0625;
    $('#d' + disk).animate({marginLeft: marginLeft + 'em'}, speed);
}

function success() {
    return (nDisks(2) === parseInt(disks) && nDisks(0) === 0 && nDisks(1) === 0) ? true : false;
}

function reset() {
    started = true;
    movements = 0;
    $('#movements').text('Movements: 0').css('margin-left', '500px');
    disks = -1;
    rods = [[], [], []];

    for (var i = 0; i < 10; i++) {
        adjustHorizontally(i, 0, 1);

        if (!success()) {
            adjustVertically(i, i, 1);
        }
    }
}