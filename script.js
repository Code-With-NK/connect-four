const board = document.querySelector('#board')
const modalContainer = document.querySelector('#modal-container')
const modalHeading = document.querySelector('#modal-heading')
const modalMessage = document.querySelector('#modal-message')
const modalButton = document.querySelector('#reset')
const linkText = document.querySelector('.link')
const ytLink = document.getElementById('yt')

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

const pieces = [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
]

let playerTurn = RED_TURN
let hoverColumn = -1
let animating = false

for (let i = 0; i < 42; i++) {
    let cell = document.createElement('div')
    cell.className = 'cell'
    board.appendChild(cell)
    
    cell.ontouchstart = () => {
        onFingerEnteredColumn(i % 7)
    }
    
    cell.onclick = () => {
        if(!animating){
            onColumnClicked(i % 7)
        }
    }
}

function onColumnClicked(column){
    let availableRow = pieces.filter((_, index) => index % 7 === column).lastIndexOf(0)
    if(availableRow === -1){
        return
    }
    
    pieces[(availableRow * 7) + column] = playerTurn
    let cell = board.children[(availableRow * 7) + column]
    
    let piece = document.createElement('div')
    piece.className = 'piece'
    piece.dataset.placed = true
    piece.dataset.player = playerTurn
    cell.appendChild(piece)
    
    let unplaceedPiece = document.querySelector("[data-placed='false']")
    let unplacedY = unplaceedPiece.getBoundingClientRect().y
    let placedY = piece.getBoundingClientRect().y
    
    let yDiff = unplacedY - placedY
    
    animating = true
    removeUnplacedPiece()
    let animate = piece.animate(
        [
            { transform: `translateY(${yDiff}px)`, offset: 0},
            { transform: `translateY(0px)`, offset: 0.6},
            { transform: `translateY(${yDiff / 20}px)`, offset: 0.8},
            { transform: `translateY(0px)`, offset: 1},
        ],
        {
            duration: 600,
            easing: "linear",
            iterations: 1
        }
    )
    
    animate.addEventListener('finish', checkWinGameOrDraw)
}

function checkWinGameOrDraw(){
    animating = false
    
    if(!pieces.includes(0)){
        modalContainer.style.display = 'flex'
        modalHeading.textContent = 'Game Draw'
        modalMessage.textContent = 'Game Has been Drawn. Play Again'
        modalButton.textContent = 'Play Again'
    }
    
    if(hasPlayerWon(playerTurn, pieces)){
        modalContainer.style.display = 'flex'
        modalHeading.textContent = playerTurn == RED_TURN ? 'Game Lost' : 'Game Won'
        modalMessage.textContent = `${playerTurn == YELLOW_TURN ? 'Red' : 'Yellow'} player has won`
        modalButton.textContent = 'Play Again'
    }
    
    if (playerTurn === RED_TURN) {
        playerTurn = YELLOW_TURN
    } else {
        playerTurn = RED_TURN
    }
    
    updateHover()
}

function hasPlayerWon(playerTurn, pieces){
    for (let index = 0; index < 42; index++) {
        if(index % 7 < 4){
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
        
        if (index < 21) {
            if (
                pieces[index] === playerTurn &&
                pieces[index + 7] === playerTurn &&
                pieces[index + 14] === playerTurn &&
                pieces[index + 21] === playerTurn
            ) {
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + 7].firstChild.dataset.highlighted = true
                board.children[index + 14].firstChild.dataset.highlighted = true
                board.children[index + 21].firstChild.dataset.highlighted = true
                return true
            }
        }
        
        if (index % 7 < 4 && index < 18) {
            if (
                pieces[index] === playerTurn &&
                pieces[index + 8] === playerTurn &&
                pieces[index + 16] === playerTurn &&
                pieces[index + 24] === playerTurn
            ) {
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + 8].firstChild.dataset.highlighted = true
                board.children[index + 16].firstChild.dataset.highlighted = true
                board.children[index + 24].firstChild.dataset.highlighted = true
                return true
            }
        }
        
        if (index % 7 >= 3 && index < 21) {
            if (
                pieces[index] === playerTurn &&
                pieces[index + 6] === playerTurn &&
                pieces[index + 12] === playerTurn &&
                pieces[index + 18] === playerTurn
            ) {
                board.children[index].firstChild.dataset.highlighted = true
                board.children[index + 6].firstChild.dataset.highlighted = true
                board.children[index + 12].firstChild.dataset.highlighted = true
                board.children[index + 18].firstChild.dataset.highlighted = true
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
