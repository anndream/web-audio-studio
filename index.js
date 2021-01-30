// var webAudioPeakMeter = require('web-audio-peak-meter');


var playing = false;
function playAudio() {
    audioCtx.resume(); 
    
    if(!playing){
        myAudio.play();
        playing = true;
        document.getElementById('play-pause').className ="fa fa-pause";
        alert("Play");
    }
    else{
        myAudio.pause();
        playing = false;
        document.getElementById('play-pause').className="fa fa-play";
        alert("Pause");
    } 
} 

function stopAudio() {
    // audioCtx.resume(); 
    myAudio.pause();
    myAudio.currentTime = 0;
    playing = false;
    document.getElementById('play-pause').className="fa fa-play";
    alert("Stop");
} 

// myAudio.addEventListener('play', function() {
//     audioCtx.resume();
// });

function init(){

    alert("Init");
    
    document.getElementById('play-pause').className ="fa fa-play";


    var myMeterElement = document.getElementById('my-peak-meter');
    var myAudio = document.getElementById('my-audio');

    var audioCtx = new(window.AudioContext || window.webkitAudioContext)(); //new window.AudioContext();
    var sourceNode = audioCtx.createMediaElementSource(myAudio);

    sourceNode.connect(audioCtx.destination);
    var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);

    webAudioPeakMeter.createMeter(myMeterElement, meterNode, {});


}