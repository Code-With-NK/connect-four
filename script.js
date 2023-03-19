const board = document.querySelector('#board')
const modalContainer = document.querySelector('#modal-container')
const modalHeading = document.querySelector('#modal-heading')
const modalMessage = document.querySelector('#modal-message')
const modalButton = document.querySelector('#reset')
const linkText = document.querySelector('.link')
const ytLink = document.querySelector('#yt')

var rows = 7
var cols = 6

const root = document.querySelector(':root')

root.style.setProperty('--rows', rows)
root.style.setProperty('--cols', cols)

modalButton.onclick = () => {
    location.reload()
}

linkText.onclick = () => {
    location.assign(linkText.dataset.link)
}

ytLink.addEventListener('click', () => {
    window.open(ytLink.dataset.link)
})

const RED_TURN = 1
const YELLOW_TURN = 2

const pieces = []
for(let i = 0; i < (rows * cols); i++){
    pieces.push(0)
}

let playerTurn = RED_TURN
let hoverColumn = -1
let animating = false

for (let i = 0; i < (rows * cols); i++) {
    let cell = document.createElement('div')
    cell.className = 'cell'
    board.appendChild(cell)
    
    manageListeners(i, cell)
}

function manageListeners(i, cell){
    cell.addEventListener('touchstart', () => {
        onFingerEnteredColumn(i % rows)
    })
    
    cell.addEventListener('click', () => {
        if (!animating) {
            onColumnClicked(i % rows)
        }
    })
}

function onColumnClicked(column){
    let availableRow = pieces.filter((_, index) => index % rows === column).lastIndexOf(0)
    if(availableRow === -1){
        return
    }
    
    pieces[(availableRow * rows) + column] = playerTurn
    let cell = board.children[(availableRow * rows) + column]
    
    let unplacedPiece = document.querySelector("[data-placed='false']")
    let piece = createPiece()
    cell.appendChild(piece)
    
    let unplacedY = unplacedPiece.getBoundingClientRect().y
    let placedY = piece.getBoundingClientRect().y
    
    let yDiff = unplacedY - placedY
    
    animating = true
    removeUnplacedPiece()
    animatePiece(piece, yDiff)
}

function createPiece(){
    let piece = document.createElement('div')
    piece.className = 'piece'
    piece.dataset.placed = true
    piece.dataset.player = playerTurn
    return piece
}

function animatePiece(piece, y){
    let animate = piece.animate(
            [
                { transform: `translateY(${y}px)`, offset: 0 },
                { transform: `translateY(0px)`, offset: 0.5 },
                { transform: `translateY(${y / 10}px)`, offset: 0.73 },
                { transform: `translateY(0px)`, offset: 1 }
            ],
        {
            duration: 600,
            easing: "linear",
            iterations: 1
        }
    )
    
    animate.addEventListener('finish', () => {
        animating = false
        checkWinGameOrDraw()
    })
}

function checkWinGameOrDraw(){
    if(hasGameDrawn(pieces)){
        message = 'Game Drawn'
        showModal('Game Draw', message, 'Play Again')
    }
    
    if(hasPlayerWon(playerTurn, pieces)){
        heading = playerTurn == RED_TURN ? 'Game Lost' : 'Game Won'
        message = `${playerTurn == YELLOW_TURN ? 'Red' : 'Yellow'} player has won`
        showModal(heading, message, 'Play Again')
    }
    
    if (playerTurn === RED_TURN) {
        playerTurn = YELLOW_TURN
    } else {
        playerTurn = RED_TURN
    }
    
    updateHover()
}

function showModal(heading, message, buttonText){
    modalContainer.style.display = 'flex'
    modalHeading.textContent = heading
    modalMessage.textContent = message
    modalButton.textContent = buttonText
    return
}

function hasGameDrawn(pieces){
    return !pieces.includes(0)
}

function hasPlayerWon(playerTurn, pieces){
    for (let index = 0; index < (rows * cols); index++) {
        if(index % rows < (rows - 3)){
            if(
                pieces[index] === playerTurn &&
                pieces[index + 1] === playerTurn &&
                pieces[index + 2] === playerTurn &&
                pieces[index + 3] === playerTurn
            ){
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + 1].firstChild.dataset.highlighted = true
                board.children[index + 2].firstChild.dataset.highlighted = true
                board.children[index + 3].firstChild.dataset.highlighted = true
                return true
            }
        }
        
        if (index < (rows * (cols - 3))) {
            if (
                pieces[index] === playerTurn &&
                pieces[index + rows] === playerTurn &&
                pieces[index + (rows * 2)] === playerTurn &&
                pieces[index + (rows * 3)] === playerTurn
            ) {
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + rows].firstChild.dataset.highlighted = true
                board.children[index + (rows * 2)].firstChild.dataset.highlighted = true
                board.children[index + (rows * 3)].firstChild.dataset.highlighted = true
                return true
            }
        }
        
        if (index % rows < (rows - 3) && index < (rows * (cols - 3))) {
            if (
                pieces[index] === playerTurn &&
                pieces[index + (rows + 1)] === playerTurn &&
                pieces[index + ((rows + 1) * 2)] === playerTurn &&
                pieces[index + ((rows + 1) * 3)] === playerTurn
            ) {
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + (rows + 1)].firstChild.dataset.highlighted = true
                board.children[index + ((rows + 1) * 2)].firstChild.dataset.highlighted = true
                board.children[index + ((rows + 1) * 3)].firstChild.dataset.highlighted = true
                return true
            }
        }
        
        if (index % rows >= (cols - 3) && index < (rows * (cols - 3))) {
            if (
                pieces[index] === playerTurn &&
                pieces[index + (rows - 1)] === playerTurn &&
                pieces[index + ((rows - 1) * 2)] === playerTurn &&
                pieces[index + ((rows - 1) * 3)] === playerTurn
            ) {
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + (rows - 1)].firstChild.dataset.highlighted = true
                board.children[index + ((rows - 1) * 2)].firstChild.dataset.highlighted = true
                board.children[index + ((rows - 1) * 3)].firstChild.dataset.highlighted = true
                return true
            }
        }
    }
    
    return false
}

function updateHover(){
    removeUnplacedPiece()
    
    if(pieces[hoverColumn] === 0){
        let cell = board.children[hoverColumn]
        let piece = document.createElement('div')
        piece.className = 'piece'
        piece.dataset.player = playerTurn
        piece.dataset.placed = false
        cell.appendChild(piece)
    }
}

function removeUnplacedPiece(){
    let unplacedPiece = document.querySelector("[data-placed='false']")
    if (unplacedPiece) {
        unplacedPiece.parentElement.removeChild(unplacedPiece)
    }
}

function onFingerEnteredColumn(column){
    hoverColumn = column
    if(!animating){
        updateHover()
    }
}