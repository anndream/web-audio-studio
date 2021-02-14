// TODO: 
// fazer classes
// classe Vu
// classe wave
// classe track extend Vu, wave
// função reset para vu e play


var numOfTracks = 2
var emptyAudioLenght = 30
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate, audioCtx.sampleRate);
var timeLine = window.WaveSurfer.timeline

var isPlaying = false;
var audioElementsId = ['audio-id-1','audio-id-2'];
var peakMetersId = ['peak-meter-id-1','peak-meter-id-2'];
var wavesId = ['wave-id-1','wave-id-2'];
var volumeId = ['volume-id-1','volume-id-2'];
var panId = ['pan-id-1','pan-id-2'];
var wavesurfer = [];
var recEnable = [false,false];
var loadOnTrack = 0;
var tracks = [];


// Audio setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

for(var i=0; i<numOfTracks;i++){
    var waveId = '#wave-id-'+(i+1);
    var timeLineId = '#timeline-id-'+(i+1);

    var wsParams = {
        container: document.querySelector(waveId),
        audioContext: audioCtx,
        waveColor: 'rgb(96, 170, 130)',
        progressColor: 'grey',
        cursorColor:'white',
        hideScrollbar: true,
        splitChannels: true,
        maxCanvasWidth: 200,
        height:80,
        // barWidth: 0.8,
        backend: 'MediaElement',
        responsive: 0.02,
        plugins:[
            timeLine.create({
                container: timeLineId,
                showTime: true,
                opacity: 0,
                // timeInterval: 2,
                secondaryColor :'#fff',
                secondaryFontColor: '#fff'
            })
        ]
    }
    wavesurfer[i] = WaveSurfer.create(wsParams);

    var trackObj = {
        id: i,
        name:'',
        isPaused:false,
        isSolo:false,
        isRec:false,
        audioLen:0,
        currentTime:0,
        wavesurfer:wavesurfer[i]
    }
    tracks[i]= trackObj;  // atualizar para utilizar objetos pela lista
}

function bufferToWave(abuffer, len) {
    let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;
  
    // write WAVE header
    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
  
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
  
    setUint32(0x61746164);
    setUint32(length - pos - 4);
  
    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));
  
    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        // view.setInt16(pos, sample, true);          // write 16-bit sample
        pos += 2;
      }
      offset++                                     // next source sample
    }
  
    // console.log("criou audio vazio ")
  
    // create Blob
    return  URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
  
    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
  
    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
}

function setAudioSource(elem,src){
    var id = getIdNumber(elem)
    var track = 'track-id-'+id
    document.getElementById(elem).setAttribute('src','./samples/'+src);
    wavesurfer[id-1].load(document.getElementById(elem));
    document.getElementById(track).innerHTML = src;
}

function initAudioElement(meterId, audioId, options, ctx) {
    const id = getIdNumber(audioId) -1;
    var meterElement = document.getElementById(meterId);
    var audioElement = document.getElementById(audioId);
    var sourceNode = ctx.createMediaElementSource(audioElement);
    sourceNode.connect(ctx.destination);
    var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, ctx);
    webAudioPeakMeter.createMeter(meterElement, meterNode, options);
    document.getElementById(audioElementsId[id]).setAttribute('type','audio/mpeg');

    const length = emptyAudioLenght*ctx.sampleRate;
    const silentAudio = bufferToWave(audioBuffer, length);
    audioElement.src = silentAudio;
    wavesurfer[id].zoom(Number(0));
    wavesurfer[id].setMute(false);
    wavesurfer[id].load(audioElement);
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

wavesurfer[0].on('audioprocess', function() {
    if(wavesurfer[0].isPlaying()) {
        var totalTime = wavesurfer[0].getDuration(),
            currentTime = wavesurfer[0].getCurrentTime(),
            remainingTime = totalTime - currentTime;
        // document.getElementById('time-id').innerText = totalTime.toFixed(1);
        timer(currentTime.toFixed(1));
    }
});

wavesurfer[0].on('ready', function() {
    console.log('ready');
    emptyAudioLenght = wavesurfer[0].getDuration();
    const length = audioCtx.sampleRate*emptyAudioLenght;
    const silentAudio = bufferToWave(audioBuffer, length);
    audioElementsId[1].src = silentAudio;
    wavesurfer[1].load(silentAudio);
});

wavesurfer[1].on('ready', function() {
    console.log(wavesurfer[0].getDuration(),wavesurfer[1].getDuration())
});

wavesurfer[0].on('finish', function(){
    stopAudio();
});

// wavesurfer[1].on('finish', function(){
//     stopAudio();
// });

function setVolume(elem){
    var id = getIdNumber(elem)-1;
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
        if(mute){
            document.getElementById('mute-id-'+(id+1)).className="msr-btn btn";
        }else{
            document.getElementById('mute-id-'+(id+1)).className="msr-btn mute-btn-sel btn";
        }
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

    var id = getIdNumber(elem)-1;

    if(wavesurfer[id].isPlaying()){
        var mute = wavesurfer[id].getMute();
        wavesurfer[id].setMute(!mute);
        if(mute){
            document.getElementById('solo-id-'+(id+1)).className="msr-btn btn";
        }else{
            document.getElementById('solo-id-'+(id+1)).className="msr-btn solo-btn-sel btn";
        }
    }
}

function recTrack(elem){
    var id = getIdNumber(elem)-1;
    var mute = wavesurfer[id].getMute();
    wavesurfer[id].setMute(!mute);
    if(mute){
        document.getElementById('rec-id-'+(id+1)).className="msr-btn btn";
    }else{
        document.getElementById('rec-id-'+(id+1)).className="msr-btn rec-btn-sel btn";
    }
}

function timer(seconds){
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const time = [m > 9 ? m : '0' + m,
                    s > 9 ? s : '0' + s
                ].filter(Boolean).join(':');

      document.getElementById('time-id').innerText = time;
}

// F functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
            if(isPlaying){
                stopAudio();
            }
            var track = this.cells[0].innerHTML;
            setAudioSource(audioElementsId[loadOnTrack],track);
            document.getElementById('play-pause-id-i').className="fa fa-play";

          }}(row)

          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        table.appendChild(row)
    }
    if(isPlaying){
        stopAudio();
    }
    if(data.length>0){
        setAudioSource(audioElementsId[0],data[0].name);
    }
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