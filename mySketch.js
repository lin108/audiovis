


var vx =0;

let light;
let dark;




var x = 0;
let bg;

const maxXChange = 125;
const maxYChange = 5;
const yNoiseChange = 0.01;
const mouseYNoiseChange = 0.3;
const timeNoiseChange = 0.013;

let inverted = false;



const micSampleRate = 44100;

const freqDefinition = 8192;


const minFreqHz = 530;//C3
const maxFreqHz = 3103;//C7
const minFreq = Math.floor(minFreqHz/2/1.445);//2/1.445 is a magic number to convert Hz to MIC frequency, dont know why...
const maxFreq = Math.floor(maxFreqHz/2/1.445);//2/1.445 is a magic number to convert Hz to MIC frequency, dont know why...
const magconvertNumber = 2/1.445;


let mic, fft, spectrum;
let historygram;






function preload(){
mic= loadSound("noise.mp3");
light=loadImage("light.jpg");
dark=loadImage("dark.jpg");
	
//Shader

}

function setup() {

	
	createCanvas(windowWidth, windowHeight);
	
	historygram = createGraphics(windowWidth*5,height);
	mic.play();
	
	fft = new p5.FFT(0.0, 8192);
	mic.connect(fft);
	
}


function draw() {
	vx=vx+7.5;
	
	light.blend(dark,0,0,33,100,67,0,33,100,DARKEST);
	image(light,0,0);
	image(dark,0,0);
	
	//background(bg);
	
	spectrum = fft.analyze();
	

		

	//DRAW HISTORYGRAM
	//TRANSLATE
	
	
	
	//historygram.image(historygram, -2,0);
	
	//historygram.translate(5-x,0);
	for (let i = maxFreq; i >= minFreq; i--) {
	 //historygram.translate(5-x,0);
		let index = i - minFreq;
		let intensity = (spectrum[i] - spectrum[800])*4  ;
//console.log(spectrum[800]);
		historygram.stroke(255-intensity,255-intensity,255-intensity,intensity/2);
		var weight = map(intensity,0,255,0.5,2);
		historygram.strokeWeight(weight);
		let y = index / (maxFreq - minFreq - 1) * height;
		//historygram.line(600+x,y, 603+x,y); // right to left
	// historygram.line(600+x,y+2, 600+x,y); // vertical
	// historygram.line(width+x,y+2, width+x,y); // right to left	
		
		historygram.line(vx-3,y, vx,y);
		historygram.line(vx,y+2, vx,y); //1 
		historygram.line(vx,y, vx+2,y);
		
		//historygram.fill(255-intensity,255-intensity,255-intensity,intensity/4);
		//historygram.rect(vx,y,1,3);
	}

	image(historygram, windowWidth-vx,0);
	x= x -2;
	//drawStreak();
	
	
	// info text
	textSize(20);
	text("2020-12-30--10-12-11--593_pX.fots",1/25*width,9/10*height);
	fill(255);
	
	if(frameCount%40==0){
	drawStreak();}

}


function drawStreak() {
	let y = floor(random(height));
	let h = floor(random(20, 30)); //floor(random(1, 100));
	let xChange = floor(map(noise(y * yNoiseChange, (mouseY * mouseYNoiseChange + frameCount) * timeNoiseChange), 0.06, 0.94, -maxXChange, maxXChange)); //floor(random(-maxXChange, maxXChange));
	let yChange = floor(xChange * (maxYChange / maxXChange) * random() > 0.1 ? -1 : 1);

	if (random() < dist(pmouseX, pmouseY, mouseX, mouseY) / width * 0.3 + 0.0015) filter(POSTERIZE, floor(random(2, 6)));
	if (mouseIsPressed && abs(mouseY - y) < 60) {
		if (!inverted) filter(INVERT);
		inverted = true;
	} else {
		if (inverted) filter(INVERT);
		inverted = false
	}
	
	//It looks better with the line below IMO but it runs a lot slower (not quite real time)
	//if(random()<0.07)tint(random(255), random(255), random(255));
	
	image(historygram, xChange - maxXChange, -maxYChange + y + yChange, historygram.width, h, 0, y, historygram.width, h);
	//copy(img, 0, y, img.width, h, xChange - maxXChange, -maxYChange + y + yChange, img.width, h);
}








