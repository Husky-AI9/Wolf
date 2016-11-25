// Pitch [ 0=-215, -188=10, 2.7 per 1 degree, equation = 2.7*input - 215]

var n = 0;
var pitch = -188;
var pitch_text=0;
var rotate=0;
var rotate_text=0;

$(document).ready(function() {
 		
	setInterval(function(){
		Simulate();
		document.querySelector('.form1').innerHTML = pitch_text;
		document.querySelector('.form2').innerHTML = pitch_text;
		document.querySelector('.form3').innerHTML = rotate_text;

	    $('.pitch').animate({
	        'background-position-y' : pitch+'px'
	        });
	    $('head').append("<style>.transform:before { transform:"+rotate+"; }</style>");
	    $(".Orientation").addClass("transform");
	
	 },1000);

});

function Simulate(){
	var random=Math.random();
	var random2 = Math.floor(Math.random() * 80) - 40;
	pitch_text =  (Math.floor(Math.random() * 160) - 80);
	var test3 = pitch_text*2.7 - 215;
	rotate_text = random2.toString();
	rotate='rotate('+random2.toString()+"deg)";
	pitch= test3.toFixed(0).toString();
}

