//Choose colours
const colourSquares = document.querySelectorAll('.colour');
const currentColour = document.querySelector('.currentColour');

colourSquares.forEach((square) => {
    square.addEventListener('click', function () {
        const colour = this.style.backgroundColor;
        currentColour.style.backgroundColor = colour;
    });
});

//Paint marbles
function paintMarbles(current_row) {
    let new_row = document.getElementById(current_row);
    let marbles = new_row.querySelectorAll('.marble');

    marbles.forEach((marble) => {
        marble.addEventListener('click', function () {
            const colour = currentColour.style.backgroundColor;
            this.style.backgroundColor = colour;
        });
    });
}

//Stop painting
function stopPaintingMarbles(current_row) {
    const row = document.getElementById(current_row);
    const marbles = row.querySelectorAll('.marble');

    const stopDraw = function () {
        const colour = currentColour.style.backgroundColor;
        this.style.backgroundColor = colour;
    };

    marbles.forEach((marble) => {
        marble.removeEventListener('click', stopDraw);
        const newMarble = marble.cloneNode(true);
        marble.parentNode.replaceChild(newMarble, marble);
    });
}

//Check if marbles are coloured
function checkIfColoured(current_row) {
    const new_row = document.getElementById(current_row);
    const marbles = new_row.querySelectorAll('.marble');

    for (let i = 0; i < marbles.length; i++) {
        const marble = marbles[i];
        const computedStyle = getComputedStyle(marble);
        const colour = computedStyle.backgroundColor;

        if (colour === null || colour === 'transparent' || colour === 'rgba(0, 0, 0, 0)') {
            alert("All marbles in the row must be coloured");
            return false;
        }
    }
    return true;
}

//Check if code marbles are coloured
function checkIfColouredCode() {
    const new_row = document.getElementById('codeRow');
    const marbles = new_row.querySelectorAll('.codeColour');

    for (let i = 0; i < marbles.length; i++) {
        const marble = marbles[i];
        const computedStyle = getComputedStyle(marble);
        const colour = computedStyle.backgroundColor;

        if (colour === null || colour === 'transparent' || colour === 'rgba(0, 0, 0, 0)') {
            alert("All marbles in the code must be coloured");
            return false;
        }
    }
    return true;
}

function compareColours(current_row) {

    let win7 = false;

    //Filling codeColours array
    const codeColours = [];
    codeColours.push(getComputedStyle(document.getElementById('cc1')).backgroundColor);
    codeColours.push(getComputedStyle(document.getElementById('cc2')).backgroundColor);
    codeColours.push(getComputedStyle(document.getElementById('cc3')).backgroundColor);
    codeColours.push(getComputedStyle(document.getElementById('cc4')).backgroundColor);

    //Filling guessColours array
    const marbles = document.getElementById(current_row).querySelectorAll('.marble');

    const guessColours = [];
    for (let i = 0; i < marbles.length; i++) {
        guessColours.push(getComputedStyle(marbles[i]).backgroundColor);
    }

    let correctPosition = 0;
    let wrongPosition = 0;

    for (let i = 0; i < guessColours.length; i++) {
        if (guessColours[i] === codeColours[i]) {
            correctPosition++;
            guessColours[i] = null;
            codeColours[i] = null;
        }
    }

    for (let i = 0; i < guessColours.length; i++) {
        const currentColour = guessColours[i];
        if (currentColour && codeColours.includes(currentColour)) {
            //if element 'currentColour' is not null and is in the array 'codeColours', then wrongPosition++
            wrongPosition++;
            //and here delete the element 'currentColour' from array 'codeColours'(To avoid recognising of the same element multiple times)
            codeColours.splice(codeColours.indexOf(currentColour), 1); //delete 1 element on index 'indexOf...'
        }
    }

    console.log("Correct position: " + correctPosition + " Wrong Position: " + wrongPosition);
    //Painting the pegs

    current_row = current_row.replace('row', '');

    if (correctPosition == 4) {
        codeRow.style.display = "flex";
        submitCode.style.display = "none";
        submitColours.style.display = "none";
        codeBreakerWins.style.display = "flex";
        win7 = true;
    }

    //go from peg 1 to peg 4 in the row.
    for (i = 1; i <= 4; i++) {
        if (correctPosition > 0) {
            //if there are correct positions then paint it black
            document.getElementById('p' + current_row + i).style.backgroundColor = 'black';
            correctPosition--;
        } else if (wrongPosition > 0) {
            //if there are incorrect positions then paint it white
            document.getElementById('p' + current_row + i).style.backgroundColor = 'white';
            wrongPosition--;
        }
    }
    return win7;
}
//Start of the game
//Set Code
setCode()
function setCode() {
    const codeMarbles = document.querySelectorAll('.codeColour');

    const drawCode = function () {
        const colour = currentColour.style.backgroundColor;
        this.style.backgroundColor = colour;
    };

    codeMarbles.forEach((codeColour) => {
        codeColour.addEventListener('click', drawCode);
    });

    document.getElementById('submitCode').addEventListener('click', function () {
        if ((checkIfColouredCode()) == true) {

            codeMarbles.forEach((codeColour) => {
                codeColour.removeEventListener('click', drawCode);
            });

            let codeRow = document.getElementById("codeRow");
            codeRow.style.display = "none";

            startGame(row1);
        }
    });
}

//Start guessing
function startGame(current_row) {

    let nextRowButton = document.getElementById('submitColours');
    nextRowButton.addEventListener('click', checkRow);

    if (current_row == null) {
        gameOver();
        return;
    }
    current_row.style.outline = "2px solid #000000";
    let row = current_row.id;

    //get next row.
    id_number = row.replace('row', '');
    let new_row = "row" + (Number(id_number) + 1);

    console.log("-------========Current row id: " + id_number + "========-------");

    paintMarbles(row);

    function checkRow() {
        if ((checkIfColoured(row)) == true) {
            nextRowButton.removeEventListener('click', checkRow);
            stopPaintingMarbles(row);
            if (compareColours(row)) {
                return;
            }
            current_row.style.outline = "none";
            startGame(document.getElementById(new_row));
        }
    }
}

function gameOver() {
    codeRow.style.display = "flex";
    submitCode.style.display = "none";
    submitColours.style.display = "none";
    codeMakerWins.style.display = "flex";
}