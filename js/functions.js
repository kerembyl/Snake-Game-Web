const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const scoreDisplay = document.getElementById('score')
const gridSizeSubmit = document.getElementById('gridSizeSubmit')
const overlayHandler = document.getElementsByClassName('overlay')
const gridSize = document.getElementById('gridSize')
const gameContainer = document.querySelector('.game-container')
const scoreList = document.querySelector('.score-list')
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const unitSquareSize = 20 // Values has to be same with width/height values of css .square class
let appleIndex = 0
let score = 0
let intervalTime = 1000
let speed = 0.9
let timerId = 0
let width = 10


function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
    //create element
    const square = document.createElement('div')
    //add styling to the element
    square.classList.add('square')
    //put the element into grid
    grid.appendChild(square)
    //push it into a new squares array    
    squares.push(square)
    }
}

function setGridSize(){
    width = gridSize.value / unitSquareSize  //set snake grid
    grid.style.width = gridSize.value   //set grid css width
    grid.style.height = gridSize.value  //set grid css height 
    gameContainer.style.width = gridSize.value
    createGrid()
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    overlayHandler[0].style.display = 'none'  //close overlay screen
}


function startGame() {
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    //remove the apple
    squares[appleIndex].classList.remove('apple')
    clearInterval(timerId)
    currentSnake = [2,1,0]
    score = 0
    //re add new score to browser
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 800
    generateApple()
    //read the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    timerId = setInterval(move, intervalTime)
}

function gameOver() {
    clearInterval(timerId)
    const savedScore = document.createElement('li')
    savedScore.textContent = score
    scoreList.appendChild(savedScore)
}

function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
    ){
        return gameOver()
    }
    

    //remove last element from currentSnake array
    const tail = currentSnake.pop()
    //remove styling from last element
    squares[tail].classList.remove('snake')
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction)
    //add styling so we can see it
    
    //deal with snake head gets apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        //remove the class of apple
        squares[currentSnake[0]].classList.remove('apple')
        //grow the snake by adding class of snake to it
        squares[tail].classList.add('snake')
        console.log(tail)
        //grow the snake array
        currentSnake.push(tail)
        console.log(currentSnake)
        //generate new apple
        generateApple()
        //add one to the score
        score++
        //display the score
        scoreDisplay.textContent = score
        //speed up the snake
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
    }
    
    squares[currentSnake[0]].classList.add('snake')
}


function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
        squares[appleIndex].classList.add('apple')
    } while (squares[appleIndex].classList.contains('snake'))
} 


// 39 is right arrow
// 38 is for the up arrow
// 37 is for the left arrow
// 40 is for the down arrow

function control(e) {
    if (e.keyCode === 39) {
        console.log('right pressed')
        direction = 1
    } else if (e.keyCode === 38) {
        console.log('up pressed')
        direction = -width
    } else if (e.keyCode === 37) {
        console.log('left pressed')
        direction = -1
    } else if (e.keyCode === 40) {
        console.log('down pressed')
        direction = +width
    }
}


document.addEventListener('keydown', control)
startButton.addEventListener('click', startGame)
gridSizeSubmit.addEventListener('click', setGridSize)
