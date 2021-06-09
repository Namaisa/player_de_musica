let musics = null,
musicPlaying = null;

function pegarSRC(music, file) {
    let reader = new FileReader();
    reader.onload = () => { music.src = reader.result; }
    reader.readAsDataURL(file);  
}

function createPlaylist(e) {
    let files = e.target.files;
    if(files) {
        const musicsContainer = document.getElementById("musicsContainer");
        for(let i = 0; i < files.length; i++) {
            let music = document.createElement("div");
            pegarSRC(music, files[i]);
            !musics? music.id = i: music.id = i + musics.length;
            music.classList.add("music");
            music.innerText = files[i].name;
            music.addEventListener("click", e => {
                musicPlaying = parseInt(e.target.id); 
                mudarDeMusica(musicPlaying);
            })
            musicsContainer.appendChild(music);
        }
        musics = document.querySelectorAll(".music");
    }
}
const input = document.getElementById("input");
input.addEventListener("change", createPlaylist)

function formatSecondsAsTime(secs) {
    let hr = Math.floor(secs / 3600),
    min = Math.floor((secs - (hr * 3600))/60),
    sec = Math.floor(secs - (hr * 3600) -  (min * 60));

    if (min < 10){ min = "0" + min; }
    if (sec < 10){ sec  = "0" + sec; }
    return min + ':' + sec;
}

const visualizadorDeTempo = document.getElementById("visualizadorDeTempo");

function atualizarVisualizador(atual, total) {
    let porcentagem = (atual * 100) / total;
    visualizadorDeTempo.style.width = porcentagem + "%";
}

const audio = document.getElementById("audio"),
tempoAtual = document.getElementById("tempoAtual"),
tempoTotal = document.getElementById("tempoTotal");
audio.addEventListener("timeupdate", verificarTempoCorrido);

function verificarTempoCorrido() {
    let cTime = Math.floor(audio.currentTime),
    duracao = Math.floor(audio.duration);
    if(duracao) {
        tempoAtual.innerText = formatSecondsAsTime(cTime);
        tempoTotal.innerText = formatSecondsAsTime(duracao);
        atualizarVisualizador(cTime, duracao);
        if(cTime == duracao - 1) { mudarDeMusica(++musicPlaying); }
    } 
}
    
function leitorDeMusica(index) {
    audio.src = musics[index].src;
    audio.play();
}

function destacarMusica(index) {
    musics.forEach(music => { music.classList.remove("play") });
    if(index !== null) { musics[index].classList.add("play"); }
}

function mudarDeMusica(index) {
    destacarMusica(index);
    leitorDeMusica(index);
    musicPlaying = index;
}

const voltarMusica = document.getElementById("voltarMusica");
voltarMusica.addEventListener("click", () => {
    if(musicPlaying) { mudarDeMusica(musicPlaying - 1); }
})

const pause = document.getElementById("pause");
pause.addEventListener("click", () => { audio.pause() });

const playCont = document.getElementById("playCont");
playCont.addEventListener("click", () => { 
    !musicPlaying? mudarDeMusica(0): audio.play(); 
})

const stop = document.getElementById("stop");
stop.addEventListener("click", () => {
    audio.pause();
    destacarMusica(null);
    musicPlaying = null;
    setTimeout(() => {
        tempoAtual.innerText = "00:00";
        tempoTotal.innerText = "00:00";
        visualizadorDeTempo.removeAttribute("style");
    }, 200)
})

const proxMusica = document.getElementById("proxMusica");
proxMusica.addEventListener("click", () => {
    if(musicPlaying !== null && musicPlaying !== musics.length - 1) {
        mudarDeMusica(musicPlaying + 1);
    }
})