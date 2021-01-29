// var webAudioPeakMeter = require('web-audio-peak-meter');
var myMeterElement = document.getElementById('my-peak-meter');
var myAudio = document.getElementById('my-audio');

var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); //new window.AudioContext();
var sourceNode = audioCtx.createMediaElementSource(myAudio);

sourceNode.connect(audioCtx.destination);
var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);

webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});

document.getElementById('play-pause').className ="fa fa-play";

var playing = false;
function playAudio() {
    audioCtx.resume(); 
    
    if(!playing){
        myAudio.play();
        playing = true;
        document.getElementById('play-pause').className ="fa fa-pause";
    }
    else{
        myAudio.pause();
        playing = false;
        document.getElementById('play-pause').className="fa fa-play";
    } 
} 

function stopAudio() {
    // audioCtx.resume(); 
    myAudio.pause();
    myAudio.currentTime = 0;
    playing = false;
    document.getElementById('play-pause').className="fa fa-play";
} 

// myAudio.addEventListener('play', function() {
//     audioCtx.resume();
// });
