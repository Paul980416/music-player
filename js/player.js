// ===============================
// 音乐列表
// ===============================

const songs = [

    {
        title: "Song 01",
        artist: "My Artist",
        src: "music/song01.mp3",
        cover: "images/cover01.jpg"
    },

    {
        title: "Song 02",
        artist: "My Artist",
        src: "music/song02.mp3",
        cover: "images/cover02.jpg"
    },

    {
        title: "Song 03",
        artist: "My Artist",
        src: "music/song03.mp3",
        cover: "images/cover03.jpg"
    }

];


// ===============================
// 获取 HTML 元素
// ===============================

const audio = document.getElementById("audio");

const playButton =
    document.getElementById("play");

const prevButton =
    document.getElementById("prev");

const nextButton =
    document.getElementById("next");

const cover =
    document.getElementById("cover");

const title =
    document.getElementById("title");

const artist =
    document.getElementById("artist");

const progress =
    document.getElementById("progress");

const currentTime =
    document.getElementById("current-time");

const duration =
    document.getElementById("duration");

const volume =
    document.getElementById("volume");

const playlistContainer =
    document.getElementById(
        "playlist-container"
    );


// ===============================
// 当前歌曲
// ===============================

let currentSong = 0;


// ===============================
// 时间格式
// ===============================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "00:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0")
        + ":"
        +
        String(secs).padStart(2, "0")
    );

}


// ===============================
// 加载歌曲
// ===============================

function loadSong(index) {

    currentSong = index;

    const song = songs[index];

    audio.src = song.src;

    title.textContent =
        song.title;

    artist.textContent =
        song.artist;

    cover.src =
        song.cover;

    progress.value = 0;

    currentTime.textContent =
        "00:00";

    duration.textContent =
        "00:00";

    updatePlaylist();

}


// ===============================
// 播放
// ===============================

function playSong() {

    audio.play();

    playButton.textContent =
        "⏸";

}


// ===============================
// 暂停
// ===============================

function pauseSong() {

    audio.pause();

    playButton.textContent =
        "▶";

}


// ===============================
// 播放 / 暂停
// ===============================

playButton.addEventListener(
    "click",
    function () {

        if (audio.paused) {

            playSong();

        } else {

            pauseSong();

        }

    }
);


// ===============================
// 上一首
// ===============================

prevButton.addEventListener(
    "click",
    function () {

        currentSong--;

        if (currentSong < 0) {

            currentSong =
                songs.length - 1;

        }

        loadSong(currentSong);

        playSong();

    }
);


// ===============================
// 下一首
// ===============================

nextButton.addEventListener(
    "click",
    function () {

        currentSong++;

        if (
            currentSong >=
            songs.length
        ) {

            currentSong = 0;

        }

        loadSong(currentSong);

        playSong();

    }
);


// ===============================
// 音乐播放进度
// ===============================

audio.addEventListener(
    "timeupdate",
    function () {

        if (!audio.duration) {
            return;
        }

        const percent =
            (audio.currentTime /
            audio.duration) * 100;

        progress.value =
            percent;

        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


// ===============================
// 音乐加载完成
// ===============================

audio.addEventListener(
    "loadedmetadata",
    function () {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


// ===============================
// 点击进度条
// ===============================

progress.addEventListener(
    "input",
    function () {

        if (!audio.duration) {
            return;
        }

        audio.currentTime =
            (progress.value / 100)
            * audio.duration;

    }
);


// ===============================
// 音量
// ===============================

volume.addEventListener(
    "input",
    function () {

        audio.volume =
            volume.value;

    }
);


// ===============================
// 播放结束
// 自动下一首
// ===============================

audio.addEventListener(
    "ended",
    function () {

        nextButton.click();

    }
);


// ===============================
// Playlist
// ===============================

function createPlaylist() {

    playlistContainer.innerHTML =
        "";

    songs.forEach(
        function(song, index) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "song-item";

            item.innerHTML = `

                <div
                    class="song-item-title">
                    ${song.title}
                </div>

                <div
                    class="song-item-artist">
                    ${song.artist}
                </div>

            `;

            item.addEventListener(
                "click",
                function() {

                    loadSong(index);

                    playSong();

                }
            );

            playlistContainer.appendChild(
                item
            );

        }
    );

}


// ===============================
// 更新当前歌曲
// ===============================

function updatePlaylist() {

    const items =
        document.querySelectorAll(
            ".song-item"
        );

    items.forEach(
        function(item, index) {

            if (
                index === currentSong
            ) {

                item.classList.add(
                    "active"
                );

            } else {

                item.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ===============================
// NFC / URL 指定歌曲
//
// 例如：
//
// https://你的域名.com/?song=2
//
// 表示播放第3首
// ===============================

function loadSongFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const song =
        params.get("song");

    if (song !== null) {

        const index =
            parseInt(song);

        if (
            !isNaN(index) &&
            index >= 0 &&
            index < songs.length
        ) {

            currentSong = index;

        }

    }

}


// ===============================
// 初始化
// ===============================

loadSongFromURL();

createPlaylist();

loadSong(currentSong);
