var UNIT = 30;
var CANVAS_WIDTH = 16 * UNIT;
var CANVAS_HEIGHT = 16 * UNIT;
var score = 0;
var bestScore = 0;
var canvasElement = $("<canvas class='blur' width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'>Your browser does not support the HTML5 canvas tag.</canvas>");
var canvas = canvasElement.get(0).getContext("2d");
var FPS = 30;
var paused = false;
$(document).ready(function(){
	canvasElement.appendTo('#canvas_container'); // create canvas in body
	setInterval(function() {
		update();
		draw();
	}, 1000/FPS); // set FPS 
});
// var period = 20;
var period = 3;
var moveLeft;
var moveRight;
var moveUp;
var moveDown;
var currentDirection;
var timer = period;
var bodies = new Array();
var swipeDirection;
function move(){
  $("canvas").swipe({
    swipe:function(event, direction, distance, duration, fingerCount) {
      swipeDirection = direction;
    }
  });
  // check keys
  if ((keydown.left || keydown.a || swipeDirection == "left") && (currentDirection != "right" || bodyNum == 0)) {
    moveLeft = true;
    moveRight = false;
    moveUp = false;
    moveDown = false;
    swipeDirection = "left";
    paused = false;
  }
  if ((keydown.right || keydown.d || swipeDirection == "right") && (currentDirection != "left" || bodyNum == 0)) {
    moveLeft = false;
    moveRight = true;
    moveUp = false;
    moveDown = false;
    swipeDirection = "right";
    paused = false;
  }
  if ((keydown.up || keydown.w || swipeDirection == "up") && (currentDirection != "down" || bodyNum == 0)) {
    moveLeft = false;
    moveRight = false;
    moveUp = true;
    moveDown = false;
    swipeDirection = "up";
    paused = false;
  }
  if ((keydown.down || keydown.s || swipeDirection == "down") && (currentDirection != "up" || bodyNum == 0)) {
    moveLeft = false;
    moveRight = false;
    moveUp = false;
    moveDown = true;
    swipeDirection = "down";
    paused = false;
  }
  if (keydown.space) {
    paused = !paused;
  }  

  // move accordingly
  if (timer==0) {
      for (var i=bodyNum; i>0;i--) {
//   	  	if (i==0) {
//   	  	  bodies[i] = new body(head.x-UNIT/2, head.y-UNIT/2);
//   	  	} else {
   		  bodies[i] = new body(bodies[i-1].x,bodies[i-1].y);
//   		}
  	  }
  	  bodies[0] = new body(head.x-UNIT/2, head.y-UNIT/2);
  
  	timer = period;
//   	body(head.x - UNIT/2, head.y - UNIT/2);

    if (!paused) {
      if (moveLeft) {
        currentDirection = "left";
        head.x -= UNIT;
      } else if (moveRight) {
        currentDirection = "right";
        head.x += UNIT;
      } else if (moveUp) {
        currentDirection = "up";
        head.y -= UNIT;
      } else if (moveDown) {
        currentDirection = "down";
        head.y += UNIT;
      }
    }
  }
  timer--;
  
}

function edge() {
  if (head.x<0) {
    head.x += CANVAS_WIDTH;
  } else if (head.x>CANVAS_WIDTH) {
    head.x -= CANVAS_WIDTH;
  }
  if (head.y<0) {
    head.y += CANVAS_HEIGHT;
  } else if (head.y>CANVAS_HEIGHT) {
    head.y -= CANVAS_HEIGHT;
  }
}

var recheck;
var bodyNum = 0;
var got = false;
function checkGot() {
  if (food.x == head.x && food.y == head.y) {
  	got = true;
  }
  if (got) {
    score++;
    if (score >= bestScore) {
      bestScore = score;
    }
    bodyNum++;
    food.x = UNIT*Math.floor(Math.random()*(CANVAS_WIDTH/UNIT-1))+UNIT*0.5;
    food.y = UNIT*Math.floor(Math.random()*(CANVAS_HEIGHT/UNIT-1))+UNIT*0.5;
    recheck = true;
    while (recheck == true) {
      recheck = false;
      console.log(recheck)
	  for (var i=0; i<bodyNum;i++) {
	    if (bodies[i].x==food.x-UNIT/2 && bodies[i].y==food.y-UNIT/2) {
	      food.x = UNIT*Math.floor(Math.random()*(CANVAS_WIDTH/UNIT-1))+UNIT*0.5;
          food.y = UNIT*Math.floor(Math.random()*(CANVAS_HEIGHT/UNIT-1))+UNIT*0.5;
          recheck = true;
	    }
	  }
	}
    got = false;
    console.log("body number:",bodyNum,"score:",score);
  }
}

var die = false;
function checkDie(){
  if (!die) {
    for (var i=0; i<bodyNum;i++) {
  	  if (bodies[i].x==head.x-UNIT/2 && bodies[i].y==head.y-UNIT/2) {
          die = true;
          paused = true;
          document.getElementById("game_over").style.display = "block";
          $("canvas").addClass('blur');
          $("#info_container").removeClass('glass');
    	}
    }
  }
}

// update
function update() {
  if (!die) {
    updateScores();
    move();
    edge();
    checkGot();
  }
  checkDie();
}

function updateScores() {
  document.getElementById("score").innerHTML = score;
  document.getElementById("best").innerHTML = bestScore;

}

// draw
function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.lineWidth = 4;
  canvas.strokeStyle = '#0d47a1';
  // if (!die){
  	food.draw();
  	head.draw();
  	for (var i=0; i<bodyNum;i++) {
  	  bodies[i].draw();
	}
  // } else {
  //   canvas.fillStyle = "#0d47a1";
  //   canvas.fillText("SCORE:"+score, CANVAS_WIDTH/2, CANVAS_HEIGHT/2-10);
  //   canvas.fillText("GAME OVER!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  // }
}

var head = {
  color: "#1976d2",
  x: UNIT*Math.floor(Math.random()*(CANVAS_WIDTH/UNIT-1))+UNIT*0.5,
  y: UNIT*Math.floor(Math.random()*(CANVAS_HEIGHT/UNIT-1))+UNIT*0.5,
  r: UNIT/2,
  draw: function() {
    canvas.fillStyle = this.color;
    rectX = this.x-UNIT/2;
    rectY = this.y-UNIT/2;
    cornerRadius = 8;
    canvas.beginPath();
    canvas.moveTo(rectX + cornerRadius, rectY);
    canvas.lineTo(rectX + UNIT - cornerRadius, rectY);
    canvas.arcTo(rectX + UNIT, rectY, rectX + UNIT, rectY + cornerRadius, cornerRadius);
    canvas.lineTo(rectX + UNIT, rectY + UNIT - cornerRadius);
    canvas.arcTo(rectX + UNIT, rectY + UNIT, rectX + UNIT - cornerRadius, rectY + UNIT, cornerRadius);
    canvas.lineTo(rectX + cornerRadius, rectY + UNIT);
    canvas.arcTo(rectX, rectY + UNIT, rectX, rectY + UNIT - cornerRadius, cornerRadius);
    canvas.lineTo(rectX, rectY + cornerRadius);
    canvas.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
    canvas.fill();
    canvas.stroke();
    canvas.fillStyle = '#0d47a1';
    canvas.beginPath();
    canvas.arc(this.x, this.y, 3, 0, 2*Math.PI);
    canvas.fill();
    canvas.stroke();
  }
};

function body(tempX,tempY) {
  this.x = tempX;
  this.y = tempY;
  this.draw = function() {
    rectX = this.x;
    rectY = this.y;
    cornerRadius = 8;
    canvas.fillStyle = '#1976d2';
    canvas.beginPath();
    canvas.moveTo(rectX + cornerRadius, rectY);
    canvas.lineTo(rectX + UNIT - cornerRadius, rectY);
    canvas.arcTo(rectX + UNIT, rectY, rectX + UNIT, rectY + cornerRadius, cornerRadius);
    canvas.lineTo(rectX + UNIT, rectY + UNIT - cornerRadius);
    canvas.arcTo(rectX + UNIT, rectY + UNIT, rectX + UNIT - cornerRadius, rectY + UNIT, cornerRadius);
    canvas.lineTo(rectX + cornerRadius, rectY + UNIT);
    canvas.arcTo(rectX, rectY + UNIT, rectX, rectY + UNIT - cornerRadius, cornerRadius);
    canvas.lineTo(rectX, rectY + cornerRadius);
    canvas.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
    canvas.fill();
    canvas.stroke();
  };
}

var food = {
  color: "#0d47a1",
  x: UNIT*Math.floor(Math.random()*(CANVAS_WIDTH/UNIT-1))+UNIT*0.5,
  y: UNIT*Math.floor(Math.random()*(CANVAS_HEIGHT/UNIT-1))+UNIT*0.5,
  r: UNIT/2,
  draw: function() {
    canvas.fillStyle = this.color;
    canvas.beginPath();
    canvas.arc(this.x,this.y,this.r, 0,2*Math.PI);
    canvas.fill();
    canvas.stroke();
  }
};

// button controls
$(document).ready(function(){
  $("#easy").click(function(){
    period = 15;
    document.getElementById("difficulties").style.display = "none";
    $("canvas").removeClass('blur');
    $("#info_container").removeClass('glass');
  });
  $("#hard").click(function(){
    period = 5;
    document.getElementById("difficulties").style.display = "none";
    $("#info_container").removeClass('glass');
    $("canvas").removeClass('blur');
  });
  $("#insane").click(function(){
    period = 3;
    document.getElementById("difficulties").style.display = "none";
    $("#info_container").removeClass('glass');
    $("canvas").removeClass('blur');
  });
  $("#restart").click(function(){
    die = false;
    bodyNum = 0;
    score = 0;
    moveUp = false;
    moveDown = false;
    moveLeft = false;
    moveDown = false;
    swipeDirection = " ";
    document.getElementById("game_over").style.display = "none";
    document.getElementById("difficulties").style.display = "block";
  });
});

// prevent scrolling with arrow keys
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        return false;
    }
};