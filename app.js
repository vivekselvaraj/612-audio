var particle = new Particle();
var token;
var deviceId = "HB"; //change this to match your photon name - case sensitive!
//var token = "e1af4f6439213a8610db5df2750c557ac475703c"; //commented out so we are not hard coding the token

//The below code logs you into the particle cloud account
particle.login({username: "slbrento@umich.edu", password: "PIxD_SI612"}).then(
    function(data) {
        token = data.body.access_token;
    },
    function(err) {
        console.log('Failed to login to Particle', err);
    }
)

/*****************************************************
 *   Cloud Functions
 * ***************************************************
 *  When you click an HTML button, trigger a function
 *  that asks your robot to change its face.
 *  Use name: 'showImage' to load a .bmp file *
 *  Use name: 'face' to draw a pre-defined face or text screen *
 */

 /*  *******************************************************
     EXAMPLE1 of how to draw 2 faces, before and after speaking


     
     ******************************************************* */





     $("#nq").click( function() {
        speak("Navigating to North Quad on your favorite scenic route"); //what the app should speak (use \n to force a new line)
    });

    $("#obstacle").click( function() {
        speak("I sensed that you swerved. Was there a car on the road in your path? Should I mark this obstable?"); //what the app should speak (use \n to force a new line)
    });

    $("#truck").click( function() {
        speak("I sensed that you swerved. Was there a truck on the road in your path? Should I mark this obstable?"); //what the app should speak (use \n to force a new line)
    });










$("#joke").click( function() {//the name of the HTML button is in double quotes "#joke". Make this match your HTML button ID in index.html
    particle.callFunction({
        deviceId: deviceId,
        name: 'face',  //specify that we want to use our Particle Cloud function 'face' (this is published in the .ino file in setup())
        argument: "misch", //which face we want to draw
        auth: token
    });

    speak("How do you catch a unique rabbit?"); //what should be spoken by app


//below is optional...after timeout of 3000 finish speaking
    setTimeout(function(){speak("Unique up on it."); //speak this after a timeout
    	particle.callFunction({
        	deviceId: deviceId,
        	name: 'face',  //specify that we want to use our Particle Cloud function 'face' (this is published in the .ino file in setup())
        	argument: "happy", //which face we want to draw
        	auth: token
    	});
    }, 3000);//how long the timeout should be 3000 = 3 sec
});


/*  *******************************************************
    EXAMPLE2 of how to speak and write the same text to the screen
    ******************************************************* */

$("#Help").click( function() {
    particle.callFunction({
        deviceId: deviceId,
        name: 'writeMessage', //specify we want to write text to TFT screen by calling the "writeMessage" function published in Particle Cloud (look at your .ino setup() function)
        argument: "How can I help you?", //text to write to the TFT screen
        auth: token
    });
    speak("How can I help you?"); //what the app should speak (use \n to force a new line)
});


/*  *******************************************************************
    EXAMPLE3 of how to display an image from the micro sd card and speak a sentence
    To get custom images you can convert them to BMP format - True Color 24
    at this website https://online-converting.com/image/convert2bmp/
    File names must be 8 characters or fewer and end in .bmp
    ********************************************************************  */
$("#Welcome").click( function() {
    particle.callFunction({
        deviceId: deviceId,
        name: 'showImage', //specify we want to draw a BMP image (name of our Particle.function created in the .ino setup())
        argument: "/carHome.bmp", //the specific BMP image to show...saved on micro SD card. List of all images and names is in the "resources" folder
        auth: token
    });
    speak("Welcome to CinaPlex!"); //what to speak to the user
});

$("#test").click( function() {
    particle.callFunction({
        deviceId: deviceId,
        name: 'showImage', //specify we want to draw a BMP image (name of our Particle.function created in the .ino setup())
        argument: "/confIJ.bmp", //the specific BMP image to show...saved on micro SD card. List of all images and names is in the "resources" folder
        auth: token
    });
    speak("Indiana Jones tickets confirmed."); //what to speak to the user
});





/*************************************************************
   LEAVE THIS CODE AS IS - Advanced Speech Synthesis
 ************************************************************* */

//automatically click speak and write button on press of Enter key
var input = document.getElementById("speech");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("speakAndWrite").click();
    }
});

//speak button
$("#speak").click(function() {
    var text = $("#speech").val();
    speak(text);
});

//speak and write to screen button
$("#speakAndWrite").click(function() {
    var text = $("#speech").val();
    speak(text);
    particle.callFunction({
        deviceId: deviceId,
        name: 'writeMessage', //specify we want to write text to TFT
        argument: text, //text to write to the TFT
        auth: token
    });
});

function speak(text) {
    // Create an utterance to be spoken by the Web Speech API
    var msgConfig = new SpeechSynthesisUtterance();

    // Get all the possible voices
    var voices = window.speechSynthesis.getVoices();

    // Set the voice to be Victoria
    msgConfig.voice = voices.filter(function(voice) {return voice.name === "Victoria"})[0]; //Kyoko or Victoria

    // Reduce the pitch so the voice sounds more robotic. Values are between 0 and 2
    msgConfig.pitch = "1.0";

    // Speed up the voice so it sounds more robotic. Values can be between 0.1 and 10
    msgConfig.rate = "1.0";

    // Set the text we are going to say.
    msgConfig.text = text;

    // Ask Web Speech API to say our utterance, in the voice we configured.
    window.speechSynthesis.speak(msgConfig);
}
