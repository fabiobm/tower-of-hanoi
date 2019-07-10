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
            disks = prompt('Choose the number of disks (1 to 10)');
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
        $(this).css({border: '3px dashed black'});
    });

    $('.rod').click(function() {
        var dest = $(this).attr('id');

        switch(dest) {
            case 'left':
                moveDisk(disk, orig, 0, 0.6);
                break;

            case 'mid':
                moveDisk(disk, orig, 1, 0.6);
                break;

            case 'right':
                moveDisk(disk, orig, 2, 0.6);
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
            }, 1200);
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
        if (rods[dest][i]) {
            maxDest = i;
        }

        if (rods[orig][i]) {
            maxOrig = i;
        }
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

    adjustDisk(disk, nDisks(orig), nDisks(dest), orig, dest, speed);

    rods[dest][disk] = true;
    rods[orig][disk] = false;

    movements++;
    $('#movements').text('Movements: ' + movements);

    return true;
}

function columnSize() {
    return $('#d0').width();
}

function adjustDisk(diskNumber, nOrig, nDest, orig, dest, duration) {
    var disk = $('#d' + diskNumber);
    var horizontal = (dest - orig) * columnSize();
    var vertical = (nOrig - nDest - 1) * 30;

    // CSS3 transitions don't (yet?) animate grid-column/grid-row changes,
    // so the transform is used only for the animation (in two steps, their order
    // depending on the origin/destination of the disk) and, after the animation
    // has completed, grid-row and grid-column are updated.
    disk.css({
        transition: `ease-in-out ${duration}s transform`,
        transform: `translate(${nOrig > nDest ? horizontal + 'px, 0' : '0, ' + vertical + 'px'})`
    });
    setTimeout(() => {
        disk.css({ transform: `translate(${horizontal}px, ${vertical}px)`});
        setTimeout(() => disk.css({
            gridColumn: `${dest + 1} / auto`,
            gridRow: `${11 - nDest} / auto`,
            transition: 'none',
            transform: 'translate(0, 0)'
        }), duration * 1000);
    }, duration * 1000);
}

function success() {
    return (nDisks(2) === parseInt(disks) && nDisks(0) === 0 && nDisks(1) === 0) ? true : false;
}

function reset() {
    started = true;
    movements = 0;
    $('#movements').text('Movements: 0');
    disks = -1;
    rods = [[], [], []];

    for (var i = 0; i < 10; i++) {
        $('#d' + i).css({gridColumn: '1 / auto', gridRow: `${11 - i} / auto`});
    }
}