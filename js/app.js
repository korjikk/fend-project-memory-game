//global variable declaration
let numberOfMoves = 0;
let openCards = [];
let numberOfMatches = 0;
let isTimeoutStopped = true;

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        init();
    }
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//adds event listeners to 'restart' and 'modal close' buttons
//and calls the resetBoard function
function init() {
    document.querySelector('.restart').addEventListener('click', reset);
    document.querySelector('#playAgainButton').addEventListener('click', playAgainHandler);
    document.querySelector('.w3-display-topright').addEventListener('click', hideModal);
    resetBoard();
}

//hides the win modal
function hideModal() {
    document.getElementById('winModal').style.display = 'none';
}

//is called when a user presses the restart button or the Play Again button from the win modal
function playAgainHandler() {
    hideModal();
    reset();
}
//calls the card shuffle method,then calls the create card element method 
//on each card name and then appends each element to the deck
function resetBoard() {
    const cardClassNames = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor',
        'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    const shuffledCardNames = shuffle(cardClassNames.concat(cardClassNames));
    const deck = document.querySelector('.deck');

    shuffledCardNames.forEach(cardClassName => {
        const currentCard = createCardElement(cardClassName);
        deck.appendChild(currentCard);
    });
}

//creates the "card" element with a given class name
function createCardElement(cardClassName) {

    const listItem = document.createElement('li');
    const icon = document.createElement('i');
    listItem.className = "card";
    icon.classList.add('fa');
    icon.classList.add(cardClassName);
    listItem.appendChild(icon);
    listItem.addEventListener('click', cardClickHandler);

    return listItem;
}

//deletes everything from the deck
function deleteCardElements() {
    document.querySelector('.deck').innerHTML = '';
}

//this function resets all the global variables, the game timer, the star rating 
//and prepares the board for a new game
function reset() {
    numberOfMoves = 0;
    numberOfMatches = 0;
    openCards = [];
    if (timer) {
        clearInterval(timer);
        totalSeconds = 0;
        timer = 0;
    }
    document.querySelector('.moves').textContent = numberOfMoves;

    document.querySelectorAll('.fa-star').forEach(starElement => {
        starElement.classList.add('colored');
    });
    document.querySelector('#seconds').textContent = "00";
    document.querySelector('#minutes').textContent = "00";
    deleteCardElements();
    resetBoard();
}

//this function is executed on each card click
//it checks if we have a timeout (if timer has started)
//shows the card, pushes it to the openCards array 
//and then calls the checkForMatch function if we have 2 open cards
function cardClickHandler(event) {
    if (isTimeoutStopped === true) {
        if (!timer) {
            timer = setInterval(setTime, 1000);
        }
        event.target.classList.add('show');
        event.target.removeEventListener('click', cardClickHandler);
        openCards.push(event.target);
        if (openCards.length > 1) {
            checkForMatch(event.target);
        }
    }
}

//checks if the two selected cards do match
//if the number of matches is 8 (maximum), the game is stopped
function checkForMatch(currentCard) {
    if (openCards[0].firstChild.classList[1] === currentCard.firstChild.classList[1]) {
        currentCard.classList.toggle('match');
        openCards[0].classList.toggle('match');
        numberOfMatches++;
        openCards = [];
        incrementNumberOfMoves();
        checkStarRank();
        if (numberOfMatches === 8) {
            totalSeconds = 0;
            clearInterval(timer);
            displayWinModal();
        }
    }
    else if (openCards[0].firstChild.classList[1] !== currentCard.firstChild.classList[1]) {
        isTimeoutStopped = false;
        currentCard.classList.toggle('wrong');
        openCards[0].classList.toggle('wrong');
        setTimeout(() => {
            currentCard.classList.remove('show', 'wrong');
            openCards[0].classList.remove('show', 'wrong');
            openCards[0].addEventListener('click', cardClickHandler);
            currentCard.addEventListener('click', cardClickHandler);
            openCards = [];
            incrementNumberOfMoves();
            checkStarRank();
            isTimeoutStopped = true;
        }, 500);
    }
}

//increments the number of moves and updates the html element 
function incrementNumberOfMoves() {
    numberOfMoves++;
    document.querySelector('.moves').textContent = numberOfMoves;
}

//gradually decreases the star rank when the number of moves rise
function checkStarRank() {
    switch (numberOfMoves) {
        case 8: {
            document.querySelectorAll('.fa-star')[2].classList.remove('colored');
            break;
        }
        case 16: {
            document.querySelectorAll('.fa-star')[1].classList.remove('colored');
            break;
        }
        case 24: {
            document.querySelectorAll('.fa-star')[0].classList.remove('colored');
        }
    }
}

//changes the style of the modal element so it will come in view
function displayWinModal() {
    //ask to play again, show time and star rating
    document.querySelector('#nrOfMoves').textContent = document.querySelector('.moves').textContent;
    document.querySelector('#modalTime').textContent = document.querySelector('.time').textContent;
    document.querySelector('#starRank').textContent = document.querySelectorAll('.stars .colored').length;
    document.getElementById('winModal').style.display = 'block'
}


//count up timer logic from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let timer;

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
//we need always two digit time for minutes and seconds
function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
