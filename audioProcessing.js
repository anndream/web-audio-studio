// TODO: 
// fazer classes
// classe Vu
// classe wave
// classe track extend Vu, wave
// função reset para vu e play

var totalTracks = 2
var isPlaying = false;
var audioElementsId = ['audio-id-1','audio-id-2'];
var peakMetersId = ['peak-meter-id-1','peak-meter-id-2'];
var wavesId = ['wave-id-1','wave-id-2'];
var volumeId = ['volume-id-1','volume-id-2'];
var panId = ['pan-id-1','pan-id-2'];
var wavesurfer = [];
var responsiveWave = [];
var recEnable = [false,false];
var loadOnTrack = 0;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
document.getElementById(audioElementsId[0]).setAttribute('type','audio/mpeg');
document.getElementById(audioElementsId[1]).setAttribute('type','audio/mpeg');

// var plugins = WaveSurfer.timeline.create({
//     showTime: true,
//     opacity: 1,
//     customShowTimeStyle: {
//         // 'background-color': '#000',
//         color: '#fff',
//         padding: '2px',
//         'font-size': '10px'
//     }
// })

var wsParams = {
    container: document.querySelector('#wave-id-1'),
    waveColor: 'rgb(96, 170, 130)',
    progressColor: 'grey',
    cursorColor:'white',
    hideScrollbar: true,
    splitChannels:true,
    maxCanvasWidth: 180,
    height:74,
    backend: 'MediaElement',
    responsive: true,
}

wavesurfer[0] = WaveSurfer.create(wsParams);
wsParams.container=document.querySelector('#wave-id-2')
wavesurfer[1] = WaveSurfer.create(wsParams);

// wavesurfer[0].on('ready', function () {
//     var timeline = Object.create(WaveSurfer.Timeline);

//     timeline.init({
//       wavesurfer: wavesurfer[0],
//       container: '#timeline'
//     });
//   });

///////
// responsiveWave[0] = wavesurfer[0].util.debounce(function() {
//     wavesurfer[0].empty();
//     wavesurfer[0].drawBuffer();
//     if(isPlaying){
//         var currentProgress = wavesurfer[0].getCurrentTime()/ wavesurfer[0].getDuration();
//         wavesurfer[0].seekTo(currentProgress); 
//         console.log(wavesurfer[0].getCurrentTime())
//     }
// }, 20);
  
// responsiveWave[1] = wavesurfer[1].util.debounce(function() {
//     wavesurfer[1].empty();
//     wavesurfer[1].drawBuffer();
// }, 20);

// window.addEventListener('resize', responsiveWave[0]);
// window.addEventListener('resize', responsiveWave[1]);
///////////

wavesurfer[0].zoom(Number(0));
wavesurfer[1].zoom(Number(0));

wavesurfer[0].on('audioprocess', function() {
    if(wavesurfer[0].isPlaying()) {
        var totalTime = wavesurfer[0].getDuration(),
            currentTime = wavesurfer[0].getCurrentTime(),
            remainingTime = totalTime - currentTime;
        
        // document.getElementById('time-id').innerText = totalTime.toFixed(1);
        timer(currentTime.toFixed(1));
    }
});


// Audio functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function setAudioSource(elem,src){
    var id = getIdNumber(elem)
    var track = 'track-id-'+id
    document.getElementById(elem).setAttribute('src','./samples/'+src);
    wavesurfer[id-1].load(document.getElementById(elem));
    document.getElementById(track).innerHTML = src
}

function runVu(meterId, audioId, options, ctx) {
    var meterElement = document.getElementById(meterId);
    var audioElement = document.getElementById(audioId);
    var sourceNode = ctx.createMediaElementSource(audioElement);
    sourceNode.connect(ctx.destination);
    var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, ctx);
    webAudioPeakMeter.createMeter(meterElement, meterNode, options);
}

function playAudio() {
    if(!isPlaying){
        audioCtx.resume(); 
        isPlaying = true;
        document.getElementById('play-pause-id-i').className= "fa fa-pause";
    }else{
        isPlaying = false;
        document.getElementById('play-pause-id-i').className="fa fa-play";
    } 
    wavesurfer[0].playPause();
    wavesurfer[1].playPause();
}

function stopAudio() {
    isPlaying = false;
    document.getElementById('play-pause-id-i').className="fa fa-play";
    wavesurfer[0].stop();
    wavesurfer[1].stop();
    timer(0);
} 

wavesurfer[0].on('finish', function(){
    stopAudio();
});

wavesurfer[1].on('finish', function(){
    stopAudio();
});

function setVolume(elem){
    var id = getIdNumber(elem);
    var value = document.getElementById(volumeId[id-1]).value;
    value = value/100;
    wavesurfer[id-1].setVolume(value);
}

function setPan(id){
    var value = document.getElementById('pan-id-1').value;
}

// TODO
document.getElementById("wave-id-1").onscroll = function() {};

function zoom(id){
    wavesurfer[0].zoom(Number(0));
}

function muteTrack(elem){
    var id = getIdNumber(elem)
    wavesurfer[id].toggleMute()
}

function soloTrack(elem){

}

function recTrack(elem){

}

function timer(seconds){
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const time = 'Time: ' + [
        m > 9 ? m : '0' + m,
        s > 9 ? s : '0' + s
      ].filter(Boolean).join(':');

      document.getElementById('time-id').innerText = time;
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
                setAudioSource(audioElementsId[loadOnTrack],track);
                document.getElementById('play-pause-id-i').className="fa fa-play";
                if(isPlaying){
                    stopAudio();
                }
          }}(row)

          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        table.appendChild(row)
    }
    if(data.length>0)
        setAudioSource(audioElementsId[0],data[0].name) 
}

function getIdNumber(elem){
    if(elem.id == undefined){
        var str = elem.split('-')
    }else{
        var str = elem.id.split('-')
    }
    var id = str[str.length-1]
    // console.log(id)
    return id;
}

// Initialize ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
runVu(peakMetersId[0], audioElementsId[0], { audioMeterStandard: 'true-peak' }, audioCtx);
runVu(peakMetersId[1], audioElementsId[1], { audioMeterStandard: 'true-peak' }, audioCtx);


/*

- Escolher trilha de banco existente, ou trilha própria fazendo upload
- Escolher amostra do narrador 
- Gravar voz 
- Sincronizar e mixar as faixas
- Baixar áudio 

- Sistema de pagamento
- Sistema de login
- Método para contatar o narrador

Requerimentos técnicos:

- Apresentar as trilhas em tabela com metadados
- Apresentar amostras dos narradores em tabela com os dados
- Filtrar trilhas e narradores por gênero
- Mostrar o áudio em formato de onda em 2 pistas, sendo 1 para a trilha e outra para a locução
- Sincronização das pistas
- Mostradores e controles do áudio por pista (VU, voume, pan, mute, solo, rec)
- Controle principal (play, pause, stop, rec, tempo)



*/