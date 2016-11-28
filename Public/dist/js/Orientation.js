// Pitch [ 0=-215, -188=10, 2.7 per 1 degree, equation = 2.7*input - 215]
 var socket = io.connect('http:raspberrypi.local:5000');

 var rotate_text =0;
 var rotate=0;
 var pitch=0;
 var pitch_text=0;


socket.on('Orientation', function (data) {
		
		 pitch= ((data.pitch+1)*2.7 - 215);
		 pitch= pitch.toFixed(0).toString();
		 pitch_text= (data.pitch+1.7).toFixed(0);
		 rotate_text = (data.roll-4).toFixed(0).toString();
		 rotate ='rotate('+(data.roll-4).toString()+"deg)";

	
	    document.querySelector('.form1').innerHTML = pitch_text;
	    document.querySelector('.form2').innerHTML = pitch_text;
	    document.querySelector('.form3').innerHTML = rotate_text;
	      $('.pitch').animate({
	          'background-position-y' : pitch+'px'
	          });
	      $('head').append("<style>.transform:before { transform:"+rotate+"; }</style>");
	      $(".Orientation").addClass("transform");
	

});


