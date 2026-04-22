// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird width/height ratio=408/228 17/12
let birdWidth = 50; 
let birdHeight = 45;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let bird={
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipes width/height ratio=64/512=1/8
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;
let pipeGap=170;
let toppipeImg;
let bottompipeImg;

let velocityX=-2;
let velocityY=0;
let gravity=0.4;
let minPipeDistance=170;
let gameover=false;
let score=0;
let stepSound=new Audio("./sfx_wing.mp3"); 
let HitSound=new Audio("./sfx_hit.wav");
let bgm=new Audio("./sfx_bgm.mp3");
bgm.loop=true;

function triggerGameOver(){
    if(!gameover){
        gameover=true;
        HitSound.currentTime=0;
        HitSound.play().catch(() => {});
    }
}

window.onload=function(){
    board=document.getElementById("board");
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d"); // used for drawing on the board
    // draw flappy bird
    // context.fillstyle="green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // load images
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);}

        toppipeImg=new Image();
        toppipeImg.src="./toppipe.jpg";
        bottompipeImg=new Image();
        bottompipeImg.src="./bottompipe1.jpg";
        requestAnimationFrame(update);
        setInterval(placePipes,1500);
        document.addEventListener("keydown",moveBird);
        
    
    }

    function update(){
             requestAnimationFrame(update);
             if(gameover){
                return;
             }
             context.clearRect(0,0,board.width,board.height);
            //  image
                velocityY+=gravity;
            bird.y=Math.max(bird.y+velocityY,0); // bird should not go above the board
             context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

             if(bird.y>board.height){
                     triggerGameOver();
             }    

                for(let i=0;i<pipeArray.length;i++){
                    let pipe=pipeArray[i];
                    pipe.x+=velocityX;
                    context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

                    if(detectCollision(bird,pipe)){
                        triggerGameOver();
                    }
                }
                
                while(pipeArray.length>0&&pipeArray[0].x<-pipeWidth){
                    pipeArray.shift(); // remove the pipe from the array
                }

                context.fillStyle="white";
                context.font="20px Arial";
                for(let i=0;i<pipeArray.length;i++){
                    let pipe=pipeArray[i];
                    if(!pipe.passed && pipe.x+pipe.width<bird.x){
                        score+=0.5;
                        pipe.passed=true;
                    }
                }
                context.fillText("Score: "+score,5,45);
                
                if(gameover){
                   
                    context.fillText("Game Over!",5,90);
                    bgm.pause();
                    bgm.currentTime=0;
                }

    }

    function placePipes(){
       if(gameover){
        return;
       }
        // (0-1)*pipeHeight/2
        // (0->128 pipeHeight/4
        // 1->-128-256 (pipeHeight/4-pipeHeight/2=-3/4 pipeHeight)
        let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
        let openingSpace=pipeGap;
let topPipe={
    img: toppipeImg,
    x: pipeX,
    y: randomPipeY,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
}
pipeArray.push(topPipe);

let bottomPipe={
    img: bottompipeImg,
    x: pipeX,
    y: randomPipeY+pipeHeight+openingSpace,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
}
pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code=="Space" || e.code=="ArrowUp"||e.code=="KeyX"){
        if(bgm.paused){
            bgm.play();
        }
     
        // bird jump
        velocityY=-6;
        stepSound.currentTime=0;
        stepSound.play().catch(() => {});
        // reset game
        if(gameover){
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameover=false;
        }
    }
}
function detectCollision(a,b){
    return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
}