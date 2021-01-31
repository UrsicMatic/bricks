
var canvas=document.getElementById("myCanvas");
var ctx=canvas.getContext("2d");

var x=canvas.width/2;
var y=canvas.height-80;
var paddleHeight=5;
var paddleWidth=100;
var paddleX=(canvas.width-paddleWidth)/2;
var rightPressed=false;  
var leftPressed=false;  
var ballRadius=7;

var count=brickColumnCount*brickRowCount;

var score = 0;
var lives = 2;

var stopped = false; 

var brickWidth=80;
var brickHeight=70;
var brickPadding=6;
var brickOffsetTop=30;
var brickOffsetLeft=40;
var stanje;
var brickRowCount = Math.floor(canvas.height/((brickWidth+brickPadding)*2)+2);
var brickColumnCount = Math.floor(canvas.width/(brickWidth+brickPadding));

var sound = new Howl({
  src: ['audio/FirewatchOSTPrologue.mp3'],
      autoplay: true,
      loop: true,
      volume: 0.1
});

sound.play();

function stanjeRand () {
	stanje=Math.floor((Math.random() * 4));
	if (stanje <= 1)
		stanje=1;
	else if (stanje > 1 && stanje <= 2)
		stanje=2;		
	else
		stanje=3;	
}

var bricks=[];
for(c=0;c<brickColumnCount;++c){
	bricks[c]=[];
		for(r=0;r<brickRowCount;++r){
			stanjeRand();
			bricks[c][r]={x:0,y:0,status:stanje};	
		}
}

dy=-6;
dx=4;

function drawBall(){
	ctx.beginPath();
	ctx.arc(x,y,ballRadius,0,Math.PI*2);
	ctx.fillStyle='rgb(84, 0, 49)';
	ctx.fillStroke='rgb(84, 0, 49)';
	ctx.stroke="10";
	ctx.fill();
	ctx.closePath();
}

var paddleImg = new Image;
paddleImg.src = 'imgs/Untitled.png';

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
	ctx.fillStyle= 'rgb(84, 0, 49)';
	ctx.fill();
	ctx.closePath();
	/*ctx.beginPath();
	ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
	ctx.fillStyle="#ff0000";
	ctx.fill();
	ctx.closePath();
	*/

}

function drawBricks(){	
	var brick_img1 = new Image;
	brick_img1.src = 'imgs/img1.png';	
	var brick_img2 = new Image;
	brick_img2.src = 'imgs/img2.png';	
	var brick_img3 = new Image;
	brick_img3.src = 'imgs/img3.png';
	
	for(c=0;c<brickColumnCount;++c){
		for(r=0;r<brickRowCount;++r){
			if(bricks[c][r].status==1){
				var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x=brickX;
				bricks[c][r].y=brickY;
				ctx.beginPath();
				ctx.drawImage(brick_img1,brickX-15,brickY,brickWidth,brickHeight);
				//ctx.fillStyle="#0095DD";
				//ctx.fill();
				ctx.closePath();
			} 
			if(bricks[c][r].status==2){
				var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x=brickX;
				bricks[c][r].y=brickY;
				ctx.beginPath();
				ctx.drawImage(brick_img2,brickX-15,brickY,brickWidth,brickHeight);
				//ctx.fillStyle="#0095DD";
				//ctx.fill();
				ctx.closePath();
			} 
			if(bricks[c][r].status==3){
				var brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x=brickX;
				bricks[c][r].y=brickY;
				ctx.beginPath();
				ctx.drawImage(brick_img3,brickX-15,brickY,brickWidth,brickHeight);
				//ctx.fillStyle="#0095DD";
				//ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function prikaziObvestilo(besedilo) {
	stopped = true;
	swal(besedilo).then(function() {
		stopped = false;
	});
}

function prikaziObvestila(besedila, casi) {
	if (besedila.length <= 0 || casi.length <= 0)
		return;
	var besedilo = besedila.shift();
	var cas = casi.shift();
	prikaziObvestilo(besedilo);
	setTimeout(function() {
		prikaziObvestila(besedila, casi);
	}, cas);
}

function collisionDetection(){
	for(c=0;c<brickColumnCount;++c){
		for(r=0;r<brickRowCount;++r){
		var b=bricks[c][r];
			if(b.status==1){
				if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
					dy=-dy;
					b.status=0;
					score++;
					count--;
					if(count==0){
						setTimeout(function() {
							document.location.reload();
						}, 5000);
						prikaziObvestilo("O ne, izgubili ste!");
					}else if (score == brickColumnCount * brickRowCount) {
						setTimeout(function() {
							document.location.reload();
						}, 5000);
						prikaziObvestilo("Zmaga!");						
					}
				}
			}			
			if(b.status==2){
				if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
					dy=-dy;
					b.status=1;
				}
			}			
			if(b.status==3){
				if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
					dy=-dy;
					b.status=2;
				}
			}	
		}
	}
}

function drawScore(){
	ctx.font="20px Lucida Console";
	ctx.fillStyle="#000";
	ctx.fillText("točke: "+score,40,20);
}

function drawLives() {
	ctx.font = "20px Lucida Console";
	ctx.fillStyle = "#000";
	ctx.fillText("življenje: "+lives, canvas.width-200, 20);
}

function draw(){
	// Ce je spremenljivka stopped true, igra ne poteka
	if (stopped) {
		return;
	}

	ctx.clearRect(0,0,canvas.width,canvas.height);

	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	//drawToBeat();

	collisionDetection();

	if (y+dy<ballRadius) {
		dy=-dy;
	} else if (y+dy>canvas.height-ballRadius) {
		if(x>=paddleX&&x<=paddleX+paddleWidth){
			dy=-dy;
			dx=8*((x-(paddleX+paddleWidth/2))/paddleWidth);
		} else {
			lives--;
			if(!lives) {
				prikaziObvestilo("O ne, izgubili ste!");
				setTimeout(function() {
					document.location.reload();
				}, 3000);
			} else{
				x=canvas.width/2;
				y = canvas.height-30;
				paddleWidth=80;
				paddleX=(canvas.width-paddleWidth)/2;
			}
		}
	}
	else
		y+=dy;

	if(x+dx<ballRadius || x+dx>canvas.width-ballRadius)
		dx=-dx;
	else
		x+=dx;

	if(rightPressed && paddleX<canvas.width-paddleWidth)
		paddleX+=7;
	else if(leftPressed && paddleX>0)
		paddleX-=7;
}

function keyDownHandler(e){	
	if(e.keyCode==39)
		rightPressed=true;
	else if(e.keyCode==37)
		leftPressed=true;
}

function keyUpHandler(e){
	if(e.keyCode==39)
		rightPressed=false;
	if(e.keyCode==37)
		leftPressed=false;
}


document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);

setInterval(draw, 20);

document.body.onload = function() {
	prikaziObvestila(
		["Pozdrevljeni! Pritisnite gumb OK, da pričnete z igro"],
		[2000]
	);
}
