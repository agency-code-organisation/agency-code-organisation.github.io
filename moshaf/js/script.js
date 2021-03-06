
function showSurah(data) {
    let ListOfSurah = document.getElementById('ListOfSurah')
    let HTML = ''
    data.forEach(element => {
        HTML += `
        <button  id='${element.number}' class=" surah list-group-item list-group-item-action bg-light text-dark ">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${element.name}</h5>
          <small class="text-muted">عدد الايات ${element.numberOfAyahs}  <span class="badge bg-success badge-pill ">${element.number}</span> </small>
        </div>
        <p class="mb-1">${element.englishName}</p>
        <small class="text-muted">${element.englishNameTranslation}</small>
        </button>`
    })
    if (ListOfSurah) {
        ListOfSurah.innerHTML = HTML
    }
}


const URL = 'https://api.alquran.cloud/v1/surah'
fetch(URL).then(response => response.json()
).then(data => {
    // console.log(data.data);
    showSurah(data.data)
    getSurah()

})

function getSurah() {
    let AllSurah = document.querySelectorAll('.list-group-item')
    AllSurah.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('ListOfSurah').style.display = 'none'
            container = document.getElementById('container').style.display = 'block'
            mainAudioPlayer = document.getElementById('mainAudioPlayer').style.display = 'flex'
            Back_button = document.getElementById('w-actions').style.display = 'flex'

            const Id = btn.id
            fetch(`https://api.alquran.cloud/v1/surah/${Id}/ar.alafasy`).then(response => response.json()
            ).then(data => {
                // console.log(data.data.ayahs);
                surahDatiles(data.data.ayahs)
            })
        })
    })
}


function surahDatiles(data) {
    let container = document.getElementById('container')

    let html = ''
    data.forEach((element, index) => {
        // console.log(element)
        html += `<div class="card text-center mb-3 bg-light">
        <div class="card-header">
            <a  href="#ayah${index + 1}" id="ayahsNo${index}"  class="card-title btn btn-outline-secondary" >آیت${index + 1}</a> 
            </div>
            <div class="card-body" id='ayah${index + 1}'>
            <h5 class="card-title " id="text-${index}">${element.text}</h5>
            <audio src='${element.audio}' controls></audio>
            <a  href="#" id='${index}'  class="card-title  ayahs " data-url="${element.audio}"></a>
            </div>
            <div class="card-footer text-muted">
            Ruku - ${element.ruku} | juz - ${element.juz} | Page - ${element.page} | Manzil - ${element.manzil} - 
            </div>
        </div>`
    })
    container.innerHTML = html
    const ayahsArray = document.getElementsByClassName('ayahs')
    let i = 0
    let player = document.getElementById('player')
    player.src = ayahsArray[i].getAttribute('data-url')
    document.getElementById(`text-${i}`).style.color = 'green'


    player.addEventListener('ended', () => {
        document.getElementById(`text-${i}`).style.color = 'black'
        i++;
        if (i < ayahsArray.length) {

            player.src = ayahsArray[i].getAttribute('data-url');
            document.getElementById(`text-${i}`).style.color = 'green'
            document.getElementById(`ayahsNo${i}`).click()
            // ayahsArray[i]
            return;
        }
        i = 0;
        player.src = ayahsArray[i].getAttribute('data-url');
        document.getElementById(`text-${i}`).style.color = 'green'
        document.getElementById(`ayahsNo${i}`).click()
    })
}



let BackBtn = document.getElementById('back').addEventListener('click', () => {
    window.location = 'index.html'
})
const audioTag = document.querySelector('audio')
const currentTimeTag = document.querySelector('.current')
const durationTag = document.querySelector('.total')
const fillDuration = document.querySelector('.fill-duration')

const startTimer = () => {
    const duration = parseInt(audioTag.duration)
    const strTime = (currentTime) => {
        let hour = undefined
        let minutes = undefined
        let seconds = undefined
        seconds = (currentTime % 60)
        minutes = parseInt(currentTime / 60)
        if (minutes >= 60) {
            hour = (minutes / 60)
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        const returningTime = `${hour ? hour + ":" : ""}${minutes ? minutes + ":" : "00:"}${seconds}`
        // console.log(returningTime);
        return returningTime
    }
    durationTag.innerText = strTime(duration)
    setInterval(() => {
        const duration = parseInt(audioTag.duration)
        const currentTime = parseInt(audioTag.currentTime)
        const time = (currentTime / duration) * 100
        const currentTimeInStr = strTime(currentTime)
        currentTimeTag.innerText = currentTimeInStr
        fillDuration.style.width = `${time}%`

    }, 1000)
}



audioTag.addEventListener('loadeddata', startTimer)
// startTimer()
let controls = document.getElementById("controls")


const pause = document.getElementById("pause")


pause.addEventListener('click', () => {

    audioTag.pause()

})

const play = document.getElementById("play")

play.addEventListener('click', () => {
    audioTag.play()


})
