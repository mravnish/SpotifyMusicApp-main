
// Create a notification element
// let notification = document.createElement("div");
// notification.className = "welcome";
// notification.textContent = "welcome to SpotifyAviMusic!";
// // Append the notification to the body
// document.body.appendChild(notification);
// // Remove the notification after 3 seconds
// setTimeout(function () {
//     document.body.removeChild(notification);
// }, 3000);





// It is use for footer:
document.getElementById('year').textContent = new Date().getFullYear();


console.log("Lets write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    console.log("Fetching songs from folder:", folder);

    let response = await fetch(folder).then(res => res.text()).catch(err => {
        console.error("Failed to fetch songs:", err);
        return "";
    });

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");

    songs = Array.from(anchors)
        .filter(anchor => anchor.href.endsWith(".mp3"))
        .map(anchor => anchor.href.split(`${folder}/`)[1]);

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = ""; // Clear previous songs

    let fragment = document.createDocumentFragment();
    for (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>
Udit & Alka</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>`;
        li.addEventListener("click", () => playMusic(song.trim()));
        fragment.appendChild(li);
    }
    songUL.appendChild(fragment);

    return songs;
}

const playMusic = (track, pause = false) => {
    if (!track) {
        console.error("No track provided to playMusic.");
        return;
    }
    currentSong.src = `${currFolder}/${track}`;
    console.log("Playing track:", currentSong.src);

    if (!pause) {
        currentSong.play().catch(err => console.error("Failed to play song:", err));
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
    console.log("Displaying albums");
    let response = await fetch("/songs/").then(res => res.text()).catch(err => {
        console.log(response);
        console.error("Failed to fetch albums:", err);
        return "";
    });

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ""; // Clear previous albums

    let fragment = document.createDocumentFragment();
    for (const e of anchors) {
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.replace("http//", "http://").replace(/\/+$/, ""); // Sanitize URL
            console.log("Folder URL:", folder);

            let metadata = await fetch(`${folder}/info.json`).then(res => res.json()).catch(err => {
                console.error(`Failed to fetch metadata for ${folder}:`, err);
                return {};
            });

            if (!metadata || !metadata.title || !metadata.description) {
                console.log(`Skipping album without metadata: ${folder}`);
                continue; // Skip if metadata is missing or incomplete
            }

            let card = document.createElement("div");
            card.classList.add("card");
            card.dataset.folder = folder;
            card.innerHTML = `
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="${folder}/cover.jpg" alt="Cover">
                <h2>${metadata.title}</h2>
                <p>${metadata.description}</p>`;
                console.log("hiiiiiiiii")

            card.addEventListener("click", async () => {
                console.log("Fetching Songs");
                songs = await getSongs(folder);
                if (songs && songs.length > 0) {
                    playMusic(songs[0]); // Play the first song if available
                } else {
                    console.error("No songs found in folder:", folder);
                }
            });

            fragment.appendChild(card);
        }
    }
    cardContainer.appendChild(fragment);
}

// Change here
async function main() {
    await getSongs("/songs/ncs");
    playMusic(songs[0], true);

    await displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}

main();
