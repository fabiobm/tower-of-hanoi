var disks = -1;
var rods = [[], [], []];
var firstMatch = true;
var started = false;
var movements = 0;
var modalButtonTypes = {
    OK: {
        text: 'OK',
        action: hideModal
    },
    CANCEL: {
        text: 'Cancel',
        action: hideModal
    },
    START: {
        text: 'Start',
        action: hideModal
    }
};

$(document).ready(function() {
    $('.disk').hide(); // Initial state
    $('#quit').hide();

    $('#start').click(function() {
        if (!firstMatch) {
            reset();
        }

        showModal(
            'Choose a number of disks between 1 and 10:',
            ['CANCEL', 'START'],
            0,
            {min: 1, max: 10, callback: nDisks => {
                started = true;
                disks = nDisks;
                for (var i = 0; i < disks; i++) {
                    $('#d' + i).show();
                }

                initRods();
                $(this).hide();
                $('#quit').show();
            }}
        );
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
        if (!started) return;
        if (selectedDisk !== -1) {
            $('#d' + disk).css('border', '');
        }

        disk = $(this).attr('id').substring(1);
        selectedDisk = disk;
        orig = findDisk(disk);
        $(this).css({border: '3px dashed black'});
    });

    $('.rod').click(function() {
        if (!started) return;
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

            minimum = (Math.pow(2, disks) - 1);
            showModal([
                'Congratulations! You did it with ' + movements + ' movement' +
                    (movements === 1 ? '' : 's') + '!',
                '',
                'The minimum is ' + minimum +
                    (movements > minimum ? ' ;)' : ' :)')
            ], ['OK'], 1200);
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
    if (!started) return false;

    // Checks whether the movement is valid
    if (dest === orig) {
        console.error('Destination (' + dest + ') is the same as origin');
        showModal('Invalid move, destination is the same as origin', ['OK'], 0);
        return false;
    }

    if (findDisk(disk) !== orig) {
        console.error('Attempt to move disk (' + disk + ') that is not on the rod (' + orig + ')');
        showModal('Invalid move, attempt to move disk that is not on the rod', ['OK'], 0);
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
        showModal('Invalid move, attempt to place bigger disk on top of smaller one', ['OK'], 0);
        return false;
    }

    if (maxOrig > disk) {
        console.error('Attempt to move disk (' + disk + ') that is not on top of its rod (' + maxOrig + ')');
        showModal('Invalid move, attempt to move disk that is not on top of its rod', ['OK'], 0);
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
    return $('#d0').outerWidth();
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
    $('.disk').hide();
    movements = 0;
    $('#movements').text('Movements: 0');
    disks = -1;
    rods = [[], [], []];

    for (var i = 0; i < 10; i++) {
        $('#d' + i).css({gridColumn: '1 / auto', gridRow: `${11 - i} / auto`});
    }
}

function showModal(content, buttons, delay, inputOpts) {
    setTimeout(() => {
        joinedContent = content;
        if (Array.isArray(content)) {
            joinedContent = content.join('<br/>');
        }

        container = $('<div class="modal-container"></div>');
        modal = $('<div class="modal"></modal>');
        modal.html(joinedContent);

        if (inputOpts) {
            inputContainer = $('<div class="modal-input"></div>');
            current = $('<div class="input-current-value">' + inputOpts.min + '</div>');
            plusButton = $('<div class="input-plus">＋</div>');
            minusButton = $('<div class="input-minus disabled">－</div>');
            plusButton.click(() => {
                curr = parseInt(current.text());
                if (curr < inputOpts.max) {
                    current.text(curr + 1);
                    if (curr + 1 === inputOpts.max) {
                        plusButton.addClass('disabled');
                    } else if (curr === inputOpts.min) {
                        minusButton.removeClass('disabled');
                    }
                }
            });
            minusButton.click(() => {
                curr = parseInt(current.text());
                if (curr > inputOpts.min) {
                    current.text(curr - 1);
                    if (curr - 1 === inputOpts.min) {
                        minusButton.addClass('disabled');
                    } else if (curr === inputOpts.max) {
                        plusButton.removeClass('disabled');
                    }
                }
            });

            inputContainer.append(minusButton);
            inputContainer.append(current);
            inputContainer.append(plusButton);
            modal.append(inputContainer);
        }

        buttonsContainer = $('<div class="modal-buttons"></div>")');
        modal.append(buttonsContainer);
        container.append(modal);

        buttons.forEach((type, i) => {
            button = $('<button class="modal-button ' + type.toLowerCase() + '"></button>');
            button.html(modalButtonTypes[type].text);
            if ((i + 1) < buttons.length) { button.css({marginRight: '8px'}); }
            if (type === 'START' && inputOpts) {
                button.click(() => {
                    inputOpts.callback(parseInt($('.input-current-value').text()));
                    modalButtonTypes[type].action();
                });
            } else {
                button.click(modalButtonTypes[type].action);
            }
            buttonsContainer.append(button);
        });

        $('body').append(container);
    }, delay);
}

function hideModal() {
    $('.modal-container').remove();
}