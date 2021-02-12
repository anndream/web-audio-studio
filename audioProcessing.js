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
var timeLine = window.WaveSurfer.timeline
var emptyAudioLenght = 30
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();


var wsParams = {
    container: document.querySelector('#wave-id-1'),
    audioContext: audioCtx,
    waveColor: 'rgb(96, 170, 130)',
    progressColor: 'grey',
    cursorColor:'white',
    hideScrollbar: true,
    splitChannels: true,
    maxCanvasWidth: 200,
    height:80,
    backend: 'MediaElement',
    responsive: 0.02,
    plugins:[
        timeLine.create({
            container: '#timeline-id',
            showTime: true,
            opacity: 0,
            // timeInterval: 2,
            primaryColor: '#fff',
            secondaryFontColor: '#fff'

    })
    ]
}

wavesurfer[0] = WaveSurfer.create(wsParams);
wsParams.container=document.querySelector('#wave-id-2')
wavesurfer[1] = WaveSurfer.create(wsParams);

// Audio setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

wavesurfer[0].on('audioprocess', function() {
    if(wavesurfer[0].isPlaying()) {
        var totalTime = wavesurfer[0].getDuration(),
            currentTime = wavesurfer[0].getCurrentTime(),
            remainingTime = totalTime - currentTime;
        
        // document.getElementById('time-id').innerText = totalTime.toFixed(1);
        timer(currentTime.toFixed(1));
    }
});

function setAudioSource(elem,src){
    var id = getIdNumber(elem)
    var track = 'track-id-'+id
    document.getElementById(elem).setAttribute('src','./samples/'+src);
    wavesurfer[id-1].load(document.getElementById(elem));
    document.getElementById(track).innerHTML = src
    emptyAudioLenght = wavesurfer[id-1].getDuration()
}

function createEmptyTrack(duration,ctx){
    var buffer = audioCtx.createBuffer(2, emptyAudioLenght*audioCtx.sampleRate, audioCtx.sampleRate);


    for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
        // This gives us the actual ArrayBuffer that contains the data
        var nowBuffering = buffer.getChannelData(channel);
    
        for (var i = 0; i < buffer.length; i++) {
          // Math.random() is in [0; 1.0]
          // audio needs to be in [-1.0; 1.0]
          nowBuffering[i] = Math.random() * 2 - 1;
        }
    
        buffer = nowBuffering;
    }
    

    
// var emptyTrack = audioCtx.createBufferSource();
// emptyTrack.buffer = buffer;
// wavesurfer[1].load(emptyTrack);

}


function initAudioElement(meterId, audioId, options, ctx) {
    var id = getIdNumber(audioId) -1;
    var meterElement = document.getElementById(meterId);
    var audioElement = document.getElementById(audioId);
    var sourceNode = ctx.createMediaElementSource(audioElement);
    sourceNode.connect(ctx.destination);
    var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, ctx);
    webAudioPeakMeter.createMeter(meterElement, meterNode, options);
    document.getElementById(audioElementsId[id]).setAttribute('type','audio/mpeg');
    wavesurfer[id].zoom(Number(0));
    wavesurfer[id].setMute(false);
}

// Audio controls ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    var id = getIdNumber(elem) -1;
    var value = document.getElementById(volumeId[id]).value;
    value = value/100;
    wavesurfer[id].setVolume(value);
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
    var id = getIdNumber(elem)-1;

    if(wavesurfer[id].isPlaying()){
        var mute = wavesurfer[id].getMute();
        wavesurfer[id].setMute(!mute);
    }

}

function soloTrack(elem){
    // var id = getIdNumber(elem)-1;
    // var mute = wavesurfer[id].getMute();

    // for(var i=0; i<wavesurfer.length; i++){
    //     if(i!=id){
    //         wavesurfer[i].setMute(!mute);
    //     }
    // }
}

function recTrack(elem){

}

function timer(seconds){
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const time = [m > 9 ? m : '0' + m,
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
initAudioElement(peakMetersId[0], audioElementsId[0], { audioMeterStandard: 'true-peak' }, audioCtx);
initAudioElement(peakMetersId[1], audioElementsId[1], { audioMeterStandard: 'true-peak' }, audioCtx);


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