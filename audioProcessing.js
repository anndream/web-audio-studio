// TODO: 
// fazer classes
// classe Vu
// classe wave
// classe track extend Vu, wave
// função reset para vu e play

var totalTracks = 2
var playing = [false,false];
var audioElementsId = ['audio-id-1','audio-id-2']
var peakMetersId = ['peak-meter-id-1','peak-meter-id-2']
var wavesId = ['wave-id-1','wave-id-2']
var volumeId = ['volume-id-1','volume-id-2']
var panId = ['pan-id-1','pan-id-2']
var wavesurfer = []
var responsiveWave = []

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
document.getElementById(audioElementsId[0]).setAttribute('type','audio/mpeg');
document.getElementById(audioElementsId[1]).setAttribute('type','audio/mpeg');

wavesurfer[0] = WaveSurfer.create({
    container: document.querySelector('#wave-id-1'),
    waveColor: 'rgb(96, 170, 130)',
    progressColor: 'grey',
    cursorColor:'white',
    hideScrollbar: true,
    splitChannels:true,
    maxCanvasWidth: 200,
    height:100,
    backend: 'MediaElement'
});

wavesurfer[1] = WaveSurfer.create({
    container: document.querySelector('#wave-id-2'),
    waveColor: 'rgb(96, 170, 130)',
    progressColor: 'grey',
    cursorColor:'white',
    hideScrollbar: true,
    splitChannels:true,
    maxCanvasWidth: 200,
    height:100,
    backend: 'MediaElement'
});

responsiveWave[0] = wavesurfer[0].util.debounce(function() {
    wavesurfer[0].empty();
    wavesurfer[0].drawBuffer();
}, 20);
  
responsiveWave[1] = wavesurfer[1].util.debounce(function() {
    wavesurfer[1].empty();
    wavesurfer[1].drawBuffer();
}, 20);

wavesurfer[0].zoom(Number(0));
wavesurfer[1].zoom(Number(0));
window.addEventListener('resize', responsiveWave[0]);
window.addEventListener('resize', responsiveWave[1]);


// Audio functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function setAudioSource(elem,src,id){
    document.getElementById(elem).setAttribute('src','./samples/'+src);
    wavesurfer[0].load(document.getElementById(elem));
    document.getElementById('track-id-1').innerHTML = src
}

function runVu(meterId, audioId, options, ctx) {
    var meterElement = document.getElementById(meterId);
    var audioElement = document.getElementById(audioId);
    var sourceNode = ctx.createMediaElementSource(audioElement);
    sourceNode.connect(ctx.destination);
    var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, ctx);
    webAudioPeakMeter.createMeter(meterElement, meterNode, options);
}

function playAudio(id) {
    // var myAudio = document.getElementById(audioElementsId);

    if(!playing){
        audioCtx.resume(); 
        // myAudio.play();
        playing = true;
        document.getElementById('play-pause-id-i').className= "fa fa-pause";
    }
    else{
        // myAudio.pause();
        playing = false;
        document.getElementById('play-pause-id-i').className="fa fa-play";
    } 
    wavesurfer[0].playPause();
}

function stopAudio(id) {
    // audioCtx.resume(); 
    // var myAudio = document.getElementById(audioElementsId);
    // myAudio.pause();
    // myAudio.currentTime = 0;
    playing = false;
    document.getElementById('play-pause-id-i').className="fa fa-play";
    wavesurfer[0].stop();
} 

function setVolume(id){
    var value = document.getElementById('volume-id-1').value;
    value = value/100;
    wavesurfer[0].setVolume(value);
    getIdNumber(id);
}

function setPan(id){
    var value = document.getElementById('pan-id-1').value;
}

document.getElementById("wave-id-1").onscroll = function() {zoom()};

function zoom(id){
    wavesurfer[0].zoom(Number(0));
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
    var table = document.getElementById("tracks-list-id");
    
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
                setAudioSource('audio-id-1',track)
          }}(row)

          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        table.appendChild(row)
    }
    setAudioSource('audio-id-1',data[0].name)
}

function getIdNumber(elem){
    var str = elem.id.split('-')
    var id = str[str.length-1]
    // console.log(id)
    return id;
}

// Initialize ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
runVu(peakMetersId[0], audioElementsId[0], { audioMeterStandard: 'true-peak' }, audioCtx);
runVu(peakMetersId[1], audioElementsId[1], { audioMeterStandard: 'true-peak' }, audioCtx);


