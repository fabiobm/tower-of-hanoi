let disks = -1
let rods = [[], [], []]
let firstMatch = true
let started = false
let movements = 0

const modalButtonTypes = {
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
}

// dynamic disk sizes (in %) according to number of disks
const diskSizes = {
    1: [100],
    2: [100, 80],
    3: [100, 80, 60],
    4: [100, 80, 60, 40],
    5: [100, 85, 70, 55, 40],
    6: [100, 85, 70, 55, 40, 25],
    7: [100, 87.5, 75, 62.5, 50, 37.5, 25],
    8: [100, 87.5, 75, 62.5, 53.125, 43.75, 34.375, 25],
    9: [100, 90.625, 81.25, 71.875, 62.5, 53.125, 43.75, 34.375, 25],
    10: [100, 91.25, 82.5, 73.75, 65, 56.25, 47.5, 40, 32.5, 25],
}

$(document).ready(function() {
    $('.disk').hide() // Initial state
    $('#quit').hide()

    $('#start').click(function() {
        if (!firstMatch) {
            reset()
        }

        showModal(
            'Choose a number of disks between 1 and 10:',
            ['CANCEL', 'START'],
            0,
            {min: 1, max: 10, callback: nDisks => {
                started = true
                disks = nDisks
                for (let i = 0; i < disks; i++) {
                    $('#d' + i).css({width: diskSizes[disks][i] + '%'})
                    $('#d' + i).show()
                }

                initRods()
                $(this).hide()
                $('#quit').show()
            }}
        )
    })

    $('#quit').click(function() {
        started = false
        firstMatch = false
        $(this).hide()
        $('#start').show()
    })

    let disk
    let orig
    let selectedDisk = -1

    $('.disk').click(function() {
        if (!started) return
        if (selectedDisk !== -1) {
            $('#d' + disk).css('border', '')
        }

        disk = $(this).attr('id').substring(1)
        selectedDisk = disk
        orig = findDisk(disk)
        $(this).css({border: '3px dashed black'})
    })

    $('.rod').click(function() {
        if (!started) return
        const dest = $(this).attr('id')

        switch(dest) {
            case 'left':
                moveDisk(disk, orig, 0, 0.6)
                break

            case 'mid':
                moveDisk(disk, orig, 1, 0.6)
                break

            case 'right':
                moveDisk(disk, orig, 2, 0.6)
                break

            default:
                console.error('The id (' + dest + ') of the destination rod div is invalid')
        }

        $('#d' + disk).css('border', '')

        selectedDisk = -1

        // Winning alert and restart
        if (success()) {
            started = false
            $('#quit').hide()
            $('#start').show()
            firstMatch = false

            const minimum = (Math.pow(2, disks) - 1)
            showModal([
                'Congratulations! You did it with ' + movements + ' movement' +
                    (movements === 1 ? '' : 's') + '!',
                '',
                'The minimum is ' + minimum +
                    (movements > minimum ? ' ;)' : ' :)')
            ], ['OK'], 1200)
        }
    })
})

function initRods() {
    for (let i = 0; i < disks; i++) {
        rods[0][i] = true
        rods[1][i] = rods[2][i] = false
    }
}

function nDisks(rod) {
    let n = 0
    for (let i = 0; i < disks; i++) {
        if (rods[rod][i]) {
            n++
        }
    }

    return n
}

function findDisk(disk) {
    if (rods[0][disk]) {
        return 0
    }

    if (rods[1][disk]) {
        return 1
    }

    if (rods[2][disk]) {
        return 2
    }
}

function moveDisk(disk, orig, dest, speed) {
    if (!started) return false

    // Checks whether the movement is valid
    if (dest === orig) {
        console.error('Destination (' + dest + ') is the same as origin')
        showModal('Invalid move, destination is the same as origin', ['OK'], 0)
        return false
    }

    if (findDisk(disk) !== orig) {
        console.error('Attempt to move disk (' + disk + ') that is not on the rod (' + orig + ')')
        showModal('Invalid move, attempt to move disk that is not on the rod', ['OK'], 0)
        return false
    }

    let maxDest = 0
    let maxOrig = 0
    for (let i = 0; i < disks; i++) {
        if (rods[dest][i]) {
            maxDest = i
        }

        if (rods[orig][i]) {
            maxOrig = i
        }
    }

    if (maxDest > disk) {
        console.error('Attempt to place bigger disk (' + disk + ') on top of smaller one (' + maxDest + ')')
        showModal('Invalid move, attempt to place bigger disk on top of smaller one', ['OK'], 0)
        return false
    }

    if (maxOrig > disk) {
        console.error('Attempt to move disk (' + disk + ') that is not on top of its rod (' + maxOrig + ')')
        showModal('Invalid move, attempt to move disk that is not on top of its rod', ['OK'], 0)
        return false
    }

    adjustDisk(disk, nDisks(orig), nDisks(dest), orig, dest, speed)

    rods[dest][disk] = true
    rods[orig][disk] = false

    movements++
    $('#movements').text('Movements: ' + movements)

    return true
}

function columnSize() {
    return $('#d0').outerWidth()
}

function adjustDisk(diskNumber, nOrig, nDest, orig, dest, duration) {
    const disk = $('#d' + diskNumber)
    const horizontal = (dest - orig) * columnSize()
    const vertical = (nOrig - nDest - 1) * 30

    // CSS3 transitions don't (yet?) animate grid-column/grid-row changes,
    // so the transform is used only for the animation (in two steps, their order
    // depending on the origin/destination of the disk) and, after the animation
    // has completed, grid-row and grid-column are updated.
    disk.css({
        transition: `ease-in-out ${duration}s transform`,
        transform: `translate(${nOrig > nDest ? horizontal + 'px, 0' : '0, ' + vertical + 'px'})`
    })
    setTimeout(() => {
        disk.css({ transform: `translate(${horizontal}px, ${vertical}px)`})
        setTimeout(() => disk.css({
            gridColumn: `${dest + 1} / auto`,
            gridRow: `${11 - nDest} / auto`,
            transition: 'none',
            transform: 'translate(0, 0)'
        }), duration * 1000)
    }, duration * 1000)
}

function success() {
    return (nDisks(2) === parseInt(disks) && nDisks(0) === 0 && nDisks(1) === 0) ? true : false
}

function reset() {
    $('.disk').css('border', '')
    $('.disk').hide()
    movements = 0
    $('#movements').text('Movements: 0')
    disks = -1
    rods = [[], [], []]

    for (let i = 0; i < 10; i++) {
        $('#d' + i).css({gridColumn: '1 / auto', gridRow: `${11 - i} / auto`})
    }
}

function showModal(content, buttons, delay, inputOpts) {
    setTimeout(() => {
        let joinedContent = content
        if (Array.isArray(content)) {
            joinedContent = content.join('<br/>')
        }

        const container = $('<div class="modal-container"></div>')
        const modal = $('<div class="modal"></modal>')
        modal.html(joinedContent)

        if (inputOpts) {
            const inputContainer = $('<div class="modal-input"></div>')
            const current = $('<div class="input-current-value">' + inputOpts.min + '</div>')
            const plusButton = $('<div class="input-plus">＋</div>')
            const minusButton = $('<div class="input-minus disabled">－</div>')
            plusButton.click(() => {
                const curr = parseInt(current.text())
                if (curr < inputOpts.max) {
                    current.text(curr + 1)
                    if (curr + 1 === inputOpts.max) {
                        plusButton.addClass('disabled')
                    } else if (curr === inputOpts.min) {
                        minusButton.removeClass('disabled')
                    }
                }
            })
            minusButton.click(() => {
                const curr = parseInt(current.text())
                if (curr > inputOpts.min) {
                    current.text(curr - 1)
                    if (curr - 1 === inputOpts.min) {
                        minusButton.addClass('disabled')
                    } else if (curr === inputOpts.max) {
                        plusButton.removeClass('disabled')
                    }
                }
            })

            inputContainer.append(minusButton)
            inputContainer.append(current)
            inputContainer.append(plusButton)
            modal.append(inputContainer)
        }

        const buttonsContainer = $('<div class="modal-buttons"></div>")')
        modal.append(buttonsContainer)
        container.append(modal)

        buttons.forEach((type, i) => {
            const button = $('<button class="modal-button ' + type.toLowerCase() + '"></button>')
            button.html(modalButtonTypes[type].text)
            if ((i + 1) < buttons.length) { button.css({marginRight: '8px'}) }
            if (type === 'START' && inputOpts) {
                button.click(() => {
                    inputOpts.callback(parseInt($('.input-current-value').text()))
                    modalButtonTypes[type].action()
                })
            } else {
                button.click(modalButtonTypes[type].action)
            }
            buttonsContainer.append(button)
        })

        $('body').append(container)
    }, delay)
}

function hideModal() {
    $('.modal-container').remove()
}