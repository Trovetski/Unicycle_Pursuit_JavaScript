/*
Unicycle pursuit simulation with
control over velocity, angle,
location and turn rate of the 
target and chaser

by:- Aditya Gadhavi
*/

let overPursuer = false;
let overTarget = false;

let xOffset = 0.0;
let yOffset = 0.0;

let k=0.005;

class Agent{
    constructor(x,y,v,theta){
        this.x = x;
        this.y = y;
        this.v = v;
        this.theta = theta;

        this.x1 = 0;
        this.x2 = 0;
        this.x3 = 0;
        
        this.y1 = 0;
        this.y2 = 0;
        this.y3 = 0;

        this.makeTriangle();
    }

    distanceTo(dx,dy){
        return dist(dx,dy,this.x,this.y);
    }

    makeTriangle() {
        let l = 20;

        this.x1 = this.x + l*Math.cos(this.theta);
        this.x2 = this.x + l*Math.cos(this.theta+3*Math.PI/4);
        this.x3 = this.x + l*Math.cos(this.theta+5*Math.PI/4);

        this.y1 = this.y + l*Math.sin(this.theta);
        this.y2 = this.y + l*Math.sin(this.theta+3*Math.PI/4);
        this.y3 = this.y + l*Math.sin(this.theta+5*Math.PI/4);
    }

    updatePosition(){
        this.x += this.v*Math.cos(this.theta);
        this.y += this.v*Math.sin(this.theta);

        this.makeTriangle();
    }
}

let t = new Agent(750,500,0.15,0);//target
let p = new Agent(150,150,0.15,Math.PI/3);//pursuer

function executeControlLaw(){
    let dx = t.x-p.x;
    let dy = t.y-p.y;
    let alpha = 0;

    if(dx>=0){
        alpha = Math.atan(dy/dx);
    }else{
        alpha = Math.PI + Math.atan(dy/dx);
    }
    let beta = alpha - p.theta;

    p.theta += k*beta;

    if(t.distanceTo(p.x,p.y)<100){
        noLoop();
    }
}

function updateParameters() {
    t.v = vslider.value()/100.0;
    p.v = vslider.value()/100.0;

    k = gslider.value()/5000.0;
}

function mousePressed() {
    if(p.distanceTo(mouseX,mouseY)<12){
        overPursuer = true;

        xOffset = p.x - mouseX;
        yOffset = p.y - mouseY;
    }
    if(t.distanceTo(mouseX,mouseY)<12){
        overTarget = true;

        xOffset = t.x - mouseX;
        yOffset = t.y - mouseY;
    }
}

function mouseReleased() {
    overPursuer = false;
    overTarget = false;
}

function mouseDragged() {
    if(overPursuer){
        p.x = mouseX + xOffset;
        p.y = mouseY + yOffset;
    }else if(overTarget){
        t.x = mouseX + xOffset;
        t.y = mouseY + yOffset;
    }
}

function keyPressed(){
    if(keyCode === 32){
        noLoop();
    }else{
        loop();
    }
}

function setup(){
    canvas = createCanvas(1500,735);
    textSize(24);

    //velocity of agents
    vslider = createSlider(1, 200, 50);
    vslider.position(500,710);
    vslider.style('width', '200px');
    vslider.input(updateParameters);
    
    //gain in control law
    gslider = createSlider(25, 250, 100);
    gslider.position(800,710);
    gslider.style('width', '200px');
    gslider.input(updateParameters);

    frameRate(30);
}

function draw(){

    clear();
    background(58); // set background

    //set text
    stroke('white');
    strokeWeight(0);

    text('Velocity',400,720);
    text('Gain',720,720);

    //capture radius
    stroke("gray");
    strokeWeight(75);

    circle(t.x,t.y,75);

    //pursuer
    stroke('yellow');
    strokeWeight(5);

    triangle(p.x1,p.y1,p.x2,p.y2,p.x3,p.y3);

    //target
    stroke('green');
    strokeWeight(5);

    triangle(t.x1,t.y1,t.x2,t.y2,t.x3,t.y3);

    t.updatePosition();
    p.updatePosition();

    executeControlLaw();
}