const prevButton = document.getElementById("prev")
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')




//SIRA
let index = 4

//döngü
let loop = true

//JSON
const songsList = [
    {
        name : "Güneş",
        link : "sounds/gunes.mp3",
        artist : "M Lisa",
        image : "images/gunes.jpg"
    },
    {
        name : "Aramayı Bırakınca",
        link : "sounds/deniz.mp3",
        artist : "Deniz Tekin",
        image : "images/deniz.jpg"
    },
    {
        name : "Uçurum",
        link : "sounds/mlisa.mp3",
        artist : "M Lisa",
        image : "images/m.jpg"
    },
    {
        name : "İstedim",
        link : "sounds/mfo.mp3",
        artist : "MFÖ",
        image : "images/mfo.jpg"
    },
    {
        name : "Senden Güzeli Mi Var?",
        link : "sounds/emre.mp3",
        artist : "Emre Fel",
        image : "images/emre.jpg"
    },
]


//OYNAT

const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide') //gösterir
    playButton.classList.add('hide') //gizler

    
}

//DURDUR

const pauseAudio = () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//ŞARKI ATAMA

const setSong = (arrayIndex) => {
    let {name, link, artist, image} = songsList[arrayIndex];

    
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)
    }

    playListContainer.classList.add('hide')
    playAudio()
}

//SANİYE KONTROLÜ

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

//süre değişim tıklanıldığında
progressBar.addEventListener('click',(event)=>{

    //başlangıç
    let coordStart = progressBar.getBoundingClientRect().left
    console.log(coordStart)

        //x ekseninde tıklama noktası
    let coordEnd = event.clientX
    console.log(coordEnd)
    console.log(progressBar.offsetWidth)

        //yüzdelik hesaplama
    let progress = (coordEnd - coordStart)/ progressBar.offsetWidth
    console.log(progress)

        //progressi ilerlet
    currentProgress.style.width = progress * 100 + "%"

    //sesin anlık süresini değiştirme
    audio.currentTime = progress * audio.duration

    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

//ZAMAN FORMATLA
const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0"+minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0"+second : second
    return `${minute}:${second}`
}





const previousSong = () =>{
    if (index > 0) {
        pauseAudio()
        index = index - 1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
}

const nextSong = () =>{
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        }else {
            index = index + 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
}

//karıştırıcı tıklandığında
shuffleButton.addEventListener('click',()=>{
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        audio.loop = true
    } else {
        shuffleButton.classList.add('active')
        audio.loop = false
    }
})


playListButton.addEventListener('click', () => {
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click', () =>{
    playListContainer.classList.add('hide')
})


//oynat butonuna tıklayınca
playButton.addEventListener('click',playAudio)

//durdur butonuna tıklayınca
pauseButton.addEventListener('click' , pauseAudio)

//önceki buton
prevButton.addEventListener('click',previousSong)

//sonraki buton
nextButton.addEventListener('click',nextSong)

//tekrar buton
repeatButton.addEventListener('click', () =>{
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop = false
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
    }
})

//şarkı bitince sonraki
audio.onended = () =>{
    nextSong()
}

const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
         <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
         <span id="playlist-song-name">
          ${songsList[i].name}
         </span>
         <span id="playlist-song-artist-album">
         ${songsList[i].artist}
         </span>
        </div>
       </li>`
    }
}



window.onload = () => {
    index = 0
    setSong(index)
    pauseAudio()
    initializePlaylist()
}