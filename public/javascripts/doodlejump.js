//Quadro
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

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

// Fisica
let velocityX = 0;
let velocityY = 0; // velocidade de salto de doodler
let initialVelocityY = -8; //inicialização de velocidade em Y
let gravity = 0.4;

//Plataformas
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

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
    doodlerRightImg.src = "../images/doodler-right.png.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "../images/doodler-left.png";

    platformImg = new Image();
    doodlerLeftImg.src = "../images/platform.png";


    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //Platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //deslizar a plataforma para baixo
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; 
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // limpar a plataforma e adicionar nova plataform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // remever primeiro elemento do array
        newPlatform();
    }
    // score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth/7, boardHeight*7/8);
    }
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
    else if (e.code == "Space" && gameOver) {
        //reset
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    // inicialização de plataforma
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        with : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
    
    //platform = {
     //   img : platformImg,
     //  x : boardWidth/2,
     //   y : boardHeight - 150,
     //   with : platformWidth,
     //   height : platformHeight
    //}
    //     platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        with : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && //o canto superior esquerdo de a não alcança o canto superior direito de b
           a.x + a.width > b.x && //o canto superior direito de a passa pelo canto superior esquerdo de b
           a.y < b.y + b.height && //o canto superior esquerdo de a não alcança o canto inferior esquerdo de b
           a.y + b.height > b.y   //O canto inferior esquerdo de a passa pelo canto superior esquerdo de b          
}

function updateScore() {
    let points = Math.floor(50*Math.random());
    if (velocityY < 0) {//negativo vai subir
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        } 
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}