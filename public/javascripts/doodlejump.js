//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

// Fisica
let velocityX = 0;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // desenhar quadrado

    //quadro de doodler
    //context.fillStyle = "green";
    //context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

    // carregar imagens
    doodlerRightImg = new Image();
    doodlerRightImg.src = "../images/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.height, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "../images/doodler-left.png";

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);

}

function update() {
    requestAnimationFrame(update);

    //doodler
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.height, doodler.height);

}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD"){ //Movimentos a direita
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //movimentos a esquerda
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
}