
var playing = false;
var audioElementsId = 'audio-1'
var peakMetersId = 'peak-meter-1'
var audioSource = './samples/theHunt.mp3'

document.getElementById(audioElementsId
    ).setAttribute('src',audioSource);
document.getElementById(audioElementsId
    ).setAttribute('type','audio/mpeg');

var mainObjects = {audiosource:audioSource,
                   audioList:''}

                   
// var wavesurfer = Object.create(WaveSurfer);
// wavesurfer.init({
//     container: document.querySelector('#wave-1'),
//     waveColor: 'rgb(96, 170, 130)',
//     progressColor: 'grey',
//     cursorColor:'white',
//     hideScrollbar: true,
//     backend: 'MediaElement'
// });

var wavesurfer = WaveSurfer.create({
    container: document.querySelector('#wave-1'),
    waveColor: 'rgb(96, 170, 130)',
    progressColor: 'grey',
    cursorColor:'white',
    hideScrollbar: true,
    splitChannels:true,
    maxCanvasWidth: 200,
    height:100,
    backend: 'MediaElement'
});


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

wavesurfer.load(document.getElementById(audioElementsId));
wavesurfer.zoom(Number(0));


// functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function init(meterId, audioId, options, ctx) {
    var meterElement = document.getElementById(meterId);
    var audioElement = document.getElementById(audioId);

    var sourceNode = ctx.createMediaElementSource(audioElement);
    sourceNode.connect(ctx.destination);
    var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, ctx);
    webAudioPeakMeter.createMeter(meterElement, meterNode, options);

    // audioElement.addEventListener('play', function () {
    //     ctx.resume();
    // });
}

function playAudio() {
    var myAudio = document.getElementById(audioElementsId);

    if(!playing){
        audioCtx.resume(); 
        // myAudio.play();
        playing = true;
        document.getElementById('play-pause-i').className= "fa fa-pause";
    }
    else{
        // myAudio.pause();
        playing = false;
        document.getElementById('play-pause-i').className="fa fa-play";
    } 
    wavesurfer.playPause();
}

function stopAudio() {
    // audioCtx.resume(); 
    var myAudio = document.getElementById(audioElementsId);
    // myAudio.pause();
    // myAudio.currentTime = 0;
    playing = false;
    document.getElementById('play-pause-i').className="fa fa-play";
    wavesurfer.stop();
} 

function setVolume(){
    var value = document.getElementById('volume-1').value;
    value = value/100;
    wavesurfer.setVolume(value);
    // console.log(value)
}

function setPan(){
    var value = document.getElementById('pan-1').value;
}



/// Data functions

function getFiles(){
    var inp = document.getElementById("files");
    var files = []

    for (i = 0; i < inp.files.length; i++) {
        files[i] = inp.files[i];
        console.log(files[i])
    }

    createTabe(inp.files);
}


function createTabe(data){
    var table = document.getElementById("tracks-list");
    
    while (table.lastElementChild) {
        table.removeChild(table.lastElementChild);
    }

    for (i = 0; i < data.length; i++) {
        var row = document.createElement("tr");
    
        for (var j = 0; j < 3; j++) { // columns
          var cell = document.createElement("td");
          if(j==0){
            var cellText = document.createTextNode(data[i].name);
          }else if(j==1){
            var cellText = document.createTextNode("Music");
          }else{
            var cellText = document.createTextNode(data[i].size);
          }

          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        table.appendChild(row)
    }
}


// Initialize
init(peakMetersId, audioElementsId
, { audioMeterStandard: 'true-peak' }, audioCtx);

