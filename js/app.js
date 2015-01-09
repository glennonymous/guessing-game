$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

$(function () {
  $('[data-toggle="popover"]').popover()
});

var $jumbotron = $('.jumbotron');

// When a game begins, there should be a random number generated between 1-100.
	// Create a variable that stores a new random number when the page is loaded
	// Or when button with id="startOver" is pressed.
var random = 0;

var randomize = function(){
	random = Math.floor((Math.random() * 100) + 1);
}

var cold = '#0b99d4'
var warm = '#ff7302'
var hot = '#e60000'
var dead = '#3c3c3c'
var win = '#8002a0'

$(window).load(randomize());


// The user should have an input field where they can submit a guess.
	// Create an array variable "guessHistory" in which latest guess is always at guessHistory[0]. 
guessHistory = [];

// Validate inputs that they are real numbers between 1-100.
function isValid(n){
    if (n == NaN) return false;
    if (n % 1 !== 0) return false;
    if (n<1) return false;
    if (n>100) return false;
    return true;
}

function showToolTip (idName, title) {
	$(idName).attr('title', title).tooltip('show');
	$(idName).keydown(function() {
				$(this).tooltip('destroy');
			});
}

// Submit the guess by pressing enter or clicking the submit button.
$("#submitButton").click(function() {submitNumber()});

// And also when they hit the enter key
$('#numberInput').keypress(function(e) {
            // Enter pressed?
            if(e.which == 10 || e.which == 13) {
                submitNumber();
            }
});

var temperature = "";

var count = 0;

var inputValue = 0;

// This function does all the various "submit" stuff
function submitNumber(){
	// Validate inputs that they are real numbers between 1-100.
	inputValue = parseInt($("#numberInput").val());

	if(!isValid(inputValue)) {
		// Tooltip = "Entry must be a whole number between 1 and 100."
		showToolTip('#invalidEntry', 'Entry must be a whole number between 1 and 100');
	}

	// Store all of the guesses and create a way to check if the guess is a repeat.
	else if (guessHistory.indexOf(inputValue) != -1) {
		// Tooltip = "You already guessed that!"
		showToolTip('#matching', 'You already guessed that!');
	}


	else if (inputValue != random){

		count = count + 1;

		if (count <= 5) {
			// Update the count tracker text.
			$('#progress').replaceWith('<p id="progress">' + count + ' out of 5' + '</p>');

			guessHistory.push(inputValue);
			var difference = 0;
			var guessHigher = "";

			// Determine the difference betweeen inputValue and random.
				//Determine which value is higher and subtract lower from higher value
			if (inputValue > random) {
				difference = inputValue - random;
				guessHigher = "lower"
			}
			
			else {difference = random - inputValue; guessHigher = "higher"}

			// Distance from number is
				// 10 - 29 -- warm
				// 1 - 9 -- hot

			if (difference > 9) {

				if (difference > 29) {
					// Cold
					$jumbotron.css('background', cold);
					$('h1').replaceWith('<h1>' + 'You are ICE COLD.' + '<br>' + '&nbsp;' + '</h1>');
					$('#higherOrLower').replaceWith('<p id="higherOrLower">' + 'Guess ' + guessHigher + '.' + '</p>')
					temperature = cold
				}

				else {
					// Warm
					$jumbotron.css('background', warm);
					$('h1').replaceWith('<h1>' + 'You are getting warm…' + '</h1>');
					$('#higherOrLower').replaceWith('<p id="higherOrLower">' + 'Guess ' + guessHigher + '.' + '</p>')
					temperature = warm
				}
			}

			else {
				// Hot
				$jumbotron.css('background', hot);
				$('h1').replaceWith('<h1>' + 'You are<br>SMOKING HOT!!' + '</h1>');
				$('#higherOrLower').replaceWith('<p id="higherOrLower">' + 'Guess ' + guessHigher + '.' + '</p>')
				temperature = hot
			}

			

		}

		// Allow the user to guess only a certain amount of times. When they run out of guesses 
		// let them know the game is over.
		else {
			// You lose!
			$jumbotron.css('background', dead);
			$('h4').css('visibility', 'hidden');
			$('h1').replaceWith('<h1>' + 'YOU LOSE!!' + '<br>' + '&nbsp;' + '</h1>');
			$('#higherOrLower').replaceWith('<p id="higherOrLower">' + '&nbsp;' + '</p>');
			temperature = dead;
			$('#progress').css('visibility', 'hidden');
			// Hide submit button
			$('#submitButton').css('visibility', 'hidden');
		}

	}

	else {
		
			$jumbotron.css('background', win);
			$('h4').css('visibility', 'hidden');
			$('h1').replaceWith('<h1>' + 'You got it right!' + '<br>' + '&nbsp;' + '</h1>');
			$('#higherOrLower').replaceWith('<p id="higherOrLower">' + '&nbsp;' + '</p>');
			temperature = win;
			$('#progress').css('visibility', 'hidden');
			$('#submitButton').css('visibility', 'hidden');
			

	}

	// After a user guesses a number keep a visual list of Hot and Cold answers that the user can see.
	$('#trackingText').css({
		'visibility' : 'visible',
		'color' : temperature
	}).append('<span class="badge" style="background:' + temperature + '">' + inputValue + 
	'</span>' + '<span>' + '&nbsp; &nbsp;' + '</span>');

	$("#numberInput").val("");

	// Track the user's previous guess. Let them know if they are getting “hotter” 
	// or “colder” based on their previous guess.
	
	if (temperature !== win) {
		if (temperature !== dead) {
			if (count > 1) {
				var diff0 = 0;
				var diff1 = 0;

				if (guessHistory[guessHistory.length - 1]<random) diff0 = random - guessHistory[guessHistory.length - 1];
				else diff0 = guessHistory[guessHistory.length - 1] - random;

				if (guessHistory[guessHistory.length - 2]<random) diff1 = random - guessHistory[guessHistory.length - 2];
				else diff1 = guessHistory[guessHistory.length - 2] - random;
				
				if (diff0<diff1) {
					$('#centeredColoredText').css({'color' : temperature, 'visibility': 'visible'});
					$('#centeredColoredText h4').replaceWith('<h4>' + 'You\'re getting hotter!' 
					+ '</h4>')
				}
				else {
					$('#centeredColoredText').css({'color' : temperature, 'visibility': 'visible'});
					$('#centeredColoredText h4').replaceWith('<h4>' + 'You\'re getting colder!' 
					+ '</h4>')
				}	

			}
		}
	}


}					

// "Start over" button restores page default state
$('#startOver').click(function() {
    location.reload();
});

// Create a button that provides the answer (Give me a Hint).
$('#hint').click(function () {
	showToolTip('#hint', random.toString());
})









