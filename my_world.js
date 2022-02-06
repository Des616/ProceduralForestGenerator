"use strict";

/* global
  CLOSE
  background
  beginShape
  ellipse
  endShape
  fill
  line
  noFill
  noStroke
  noiseSeed
  pop
  push
  randomSeed
  stroke
  text
  translate
  vertex
  XXH
  loadImage
  image
  random
  map 
  concat
  noise
  sin 
  millis
  PI
*/
let pine1,
  pine2,
  pine3,
  state,
  pines,
  scarcity,
  snow1,
  snow2,
  snow3,
  snow4,
  snows;
let treeDensity;
let test;
function p2_preload() {
  pine1 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-none04.png?v=1572340220234"
  );
  pine2 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-none05.png?v=1572340238347"
  );
  pine3 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-none06.png?v=1572340242329"
  );
  pines = [pine1, pine2, pine3];
  snow1 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-full01.png?v=1572341663487"
  );
  snow2 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-full02.png?v=1572341660119"
  );
  snow3 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-full05.png?v=1572341656893"
  );
  snow4 = loadImage(
    "https://cdn.glitch.com/0cf7f7da-df1a-42fb-881e-e708c63a2efd%2Fpine-full04.png?v=1572341679224"
  );
  snows = [snow1, snow2, snow3, snow4];
  state = 3; //summer
  test = concat(snows, pines);
}

function p2_setup() {
  background("green");
}

let worldSeed;

function p2_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  treeDensity = map(worldSeed, 0, 30000000000, 0, 100);
  console.log(treeDensity);
}

function p2_tileWidth() {
  return 32;
}
function p2_tileHeight() {
  return 16;
}

let [tw, th] = [p2_tileWidth(), p2_tileHeight()];

let clicks = {};

function p2_tileClicked(i, j) {
  //toggle between winter and summer

  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p2_drawBefore() {}

function p2_drawTile(i, j) {
  noStroke();
  randomSeed(XXH.h32("tile:" + [i, j], worldSeed));

  let trees = noise(i / 3, j / 5) * 30;

  if (trees < treeDensity) {
    image(random(pines), 0, -64, 64, 64);
  } else if (trees < treeDensity + 2) {
    image(random(snows), 0, -64, 64, 64);
  }

  fill(83, 205, 241,100);
  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  

  pop();
  
  //draw the snow
   var snowy = XXH.h32("snow:" + [i, j], worldSeed) % 1000;
  
  var u = (millis() + snowy)/1000.0 % 1.0;
  var alpha = (sin(2 * PI * u) + 1) /2;
  fill(200,200,250,255 * alpha);
  var directionx = noise(i/5,j/5)-0.5;
  var dy = noise(i/8,j/10) - .5;
  ellipse(0 +u*tw*2* directionx,-3 * th * u * dy, 4,4);
}

function p2_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  //bottom
  vertex(tw, 0);
  //left
  vertex(0, -th);
  vertex(-tw ,0);
  vertex(0, th);
  
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p2_drawAfter() {
  background(240, 100);
}
