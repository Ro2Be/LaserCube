//GAMESETTINGS
cw  = 300;  //canvasWidth
ch  = 300;  //canvasHeight
rectw = 20; //rectWidth
recth = 20; //rectHeight
gs  = 100;  //gameSpeed
gsa = 100;  //gameSpeedAccelerator
slc = 5;    //startingLazerCount
mlc = 10;   //maxLazerCount
g   = 6;    //gravitySpeed
prs = 3;    //playerRunSpeed
pjs = 7;    //playerJumpSpeed
acs = 2;    //airControllSpeed

//EVENTTIMEFACTORS
etf0 = 0 / 5; //eventtimefactor
etf1 = 1 / 5; //eventtimefactor
etf2 = 2 / 5; //eventtimefactor
etf3 = 3 / 5; //eventtimefactor
etf4 = 4 / 5; //eventtimefactor
etf5 = 5 / 5; //eventtimefactor

//DISPLAYED INFO
sc  = 0;    //score
ts  = 0;    //topScore

//CALCULATION VARIALBES
go  = 0;    //0game 1gameover
t   = 0;    //time
lp  = [];   //lazerpoints
edge= 1;    //1bottom 2left 3top 4right
lr  = 1;    //left/rightMovement 0disable 1enable
rectPosX = cw / 2;
rectPosY = ch - recth; 
lc = slc; //lazercount
lt = 13000 / gs; //lazertime  
te0 = lt * etf0; //timeevent
te1 = lt * etf1; //timeevent
te2 = lt * etf2; //timeevent
te3 = lt * etf3; //timeevent
te4 = lt * etf4; //timeevent
te5 = lt * etf5; //timeevent

//SERVERCLIENT

var socket;

function preload() {
  socket = io.connect('http://localhost:3000');
  songBySANDU = loadSound("sound/SANDU - LazersExclusive.mp3");
  soundLaserCanon = loadSound("sound/MikeKoenig - LaserCanon.mp3");
  soundAlarmClock = loadSound("sound/SoundBible - AlarmClock.mp3");
}

function setup() {
  createCanvas (cw, ch);
  this.createLazerPoints();
  songBySANDU.loop([0],[1.12],[0.3],[0],[77]);
}

function draw() 
{
  if (go === 0) 
  { //game
    timeEvents();
    nextLevel ();
    showLazers();
    keyPressed();
    showPlayer();
    showInformation ();
    switch(edge) 
    {
      case 1:
        if (rectPosY != ch - recth -0.1)
          rectPosY += g;
        break;
      case 2:
        if (rectPosX != -0.1)        
          rectPosX -= g;
        break;
      case 3:
        if (rectPosY != -0.1)            
          rectPosY -= g;
        break;
      case 4:
        if (rectPosX != cw - rectw -0.1)   
          rectPosX += g;
        break;
    }  
    checkEdge();
    t += 1;
  } 
  else
  { //gameover
    t = 0;
    background(0);
    fill (255, 0, 155)
    textSize(40);
    text("GAME OVER", cw/2 -120, ch/2);
    rect (cw/2 -55, ch/2 + 30, 110, 40);
    textSize(24);
    fill (255);
    text("AGAIN", cw/2 - 35, ch/2 + 60);
    showInformation();
  }
}

function keyPressed(){
  if (keyIsDown(ENTER) 
    & go === 1) 
    restart();
  if (keyIsDown(LEFT_ARROW)) 
  {
    switch(edge) 
    {
      case 1:
        rectPosX -= prs * lr + acs;
        break;
      case 2:
        rectPosY -= prs * lr + acs;
        break;
      case 3:
        rectPosX += prs * lr + acs;
        break;
      case 4:
        rectPosY += prs * lr + acs;
        break;
    }  
    checkEdge();
  }
  if (keyIsDown(RIGHT_ARROW)) 
  {
    switch(edge) 
    {
      case 1:
        rectPosX += prs * lr + acs;
        break;
      case 2:
        rectPosY += prs * lr + acs;
        break;
      case 3:
        rectPosX -= prs * lr + acs;
        break;
      case 4:
        rectPosY -= prs * lr + acs;
        break;
    }     
    checkEdge();
  }
  if (keyIsDown(UP_ARROW)) 
  {    
    switch(edge) 
    {
      case 1:
        rectPosY -= pjs;
        break;
      case 2:
        rectPosX += pjs;
        break;
      case 3:
        rectPosY += pjs;
        break;
      case 4:
        rectPosX -= pjs;
        break;
    }     
    lr = 0;
    checkEdge();
  }
}

function mousePressed() 
{
  if (go === 1 
    & cw / 2 - 55 < mouseX
    & mouseX < cw/2 + 55 
    & ch / 2 + 30 < mouseY 
    & mouseY < cw/2 + 70) 
    restart();
}

function checkEdge()
{
    if(rectPosX < 0) 
    {
      edge = 2; 
      rectPosX = 0; 
      lr = 1;
    }
    if(rectPosY < 0) 
    {
      edge = 3; 
      rectPosY = 0; 
      lr = 1;
    }
    if(cw < rectPosX + rectw) 
    {
      edge = 4; 
      rectPosX = cw - rectw; 
      lr = 1;
    }
    if(ch < rectPosY + recth) 
    {
      edge = 1; 
      rectPosY = ch - recth; 
      lr = 1;
    }
}

function timeEvents() {
  strokeWeight (t/4);
  if (te0 < t)
  {
    background (0); 
    stroke (map(t, 0, te2, 0, 255), 255, map(t, 0, te2, 0, 255), map(t, 0, 50, 0, 255));
  }
  if (te1 === t) 
    soundLaserCanon.play([0],[0.7],[0.4],[0],[1]);
  if (te1 < t) 
    stroke (255, map(t, te1, te3, 255, 0), map(t, te1, te3, 255, 0), 200);
  if (te2 === t) 
    soundAlarmClock.play([0],[1],[0.4],[0],[1.2]);
  if (te2 < t) 
    gameOver();
  if (te3 < t) 
    background (map(t, te3, te4, 255, 0));strokeWeight(map(t, te3, te4, 20,0))
  if (te4 < t)
  {
    background(0); 
    strokeWeight(0);
  }
}

function createLazerPoints () 
{
  lp = [];
  for (var i = 0; i < 2*lc; i++) 
    lp.push(random(-ch/2, 3*ch/2));
}

function nextLevel () 
{ 
  if (t === lt) 
  {
    this.createLazerPoints ();
    t = 0;
    if (lc != mlc) 
      lc += 1;
    gs += gsa;
    sc += 1;
  } 
}

function showLazers () 
{
  for (var i = 0; i < lc; i++) 
    line (-rectw, lp[i], cw + rectw, lp[i + lc]);
}

function showPlayer () 
{
  noStroke ();
  fill (255, 0, 155);
  rect (rectPosX, rectPosY, rectw, recth);
}

function gameOver () 
{
  if (t < te4)
  { 
    for (var i = 0; i < lc; i++) 
    {
      var y1 = lp[i];
      var y2 = lp[i + lc];
      if (y2 < y1
       & rectPosY < y2 + (cw + rectw - rectPosX) * (y1 - y2) / (2 * rectw + cw)
       & rectPosY + recth < y2 + (cw - rectPosX) * (y1 - y2) / (2 * rectw + cw))
       go = 1;
    }
  }
  
  if (y1 === y2
    & y2 < y1
    & y1 < y2 + recth)
    go = 1;
  
  if (y1 < y2
    & rectPosY < y2 + (cw - rectPosX) * (y1 - y2) / (2 * rectw + cw)
    & y2 + (cw +rectw - rectPosX) * (y1 - y2) / (2 * rectw + cw) < rectPosY + recth) 
    go = 1;
}

function restart () 
{
  go = 0;  
  lc = slc;
  sc = 0;
  this.createLazerPoints();
}

function showInformation () 
{
  if (ts < sc)
    ts = sc;
  textSize(15); 
  text("Topscore: " + str(ts), 10, 20);
  text("Score: " + str(sc), 10, 40);
}
