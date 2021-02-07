
var playing = false;
var audioElementsId = 'audio-1'
var peakMetersId = 'peak-meter-1'
var audioSource = ['./samples/Storm.mp3']


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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
wavesurfer.zoom(Number(0));

document.getElementById(audioElementsId).setAttribute('type','audio/mpeg');

var responsiveWave = wavesurfer.util.debounce(function() {
    wavesurfer.empty();
    wavesurfer.drawBuffer();
  }, 20);
  
window.addEventListener('resize', responsiveWave);

// functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function setAudioSource(elem,src){
    document.getElementById(elem).setAttribute('src','./samples/'+src);
    wavesurfer.load(document.getElementById(elem));
    document.getElementById('track-id-1').innerHTML = src
}

function runVu(meterId, audioId, options, ctx) {
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
    // var myAudio = document.getElementById(audioElementsId);

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

document.getElementById("wave-1").onscroll = function() {zoom()};

function zoom(){
    wavesurfer.zoom(Number(0));
}

// Data functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getFiles(){
    var inp = document.getElementById("files");
    var files = []

    for (i = 0; i < inp.files.length; i++) {
        files[i] = inp.files[i];
        // console.log(files[i])
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

          row.onclick = function(){return function(){
                var track = this.cells[0].innerHTML;
                setAudioSource('audio-1',track)
          }}(row)

          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        table.appendChild(row)
    }
    setAudioSource('audio-1',data[0].name)
}

// function getTableData(elem){
    
    
// }

// Initialize ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
runVu(peakMetersId, audioElementsId
, { audioMeterStandard: 'true-peak' }, audioCtx);

