//document.addEventListener('DOMContentLoaded', function() {
    var music = document.getElementById("backgroundMusic"); // 获取音频元素
    var lyricsDiv = document.getElementById('lyrics'); // 获取歌词元素
    var lyricsArray = [];
    var lyricsTimeArray = []; // 存储每行歌词对应的时间

    function parseLyrics(data) {
        lyricsArray = [];
        lyricsTimeArray = [];
        var lines = data.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var timeAndLyric = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
            if (timeAndLyric) {
                var seconds = parseInt(timeAndLyric[1]) * 60 + parseFloat(timeAndLyric[2]);
                lyricsTimeArray.push(seconds);
                lyricsArray.push(timeAndLyric[3]);
            }
        }
    }

    function updateLyrics() {
        var currentTime = music.currentTime;
        for (var i = 0; i < lyricsTimeArray.length; i++) {
            if (currentTime + buffer < lyricsTimeArray[i]) {
                break;
            }
        }
        var currentLine = i > 0 ? i - 1 : 0;
        lyricsDiv.innerHTML = lyricsArray[currentLine] || "";
    }
    

    window.openMusic = function() {
        if (music.paused) {
            music.play(); // 如果音乐暂停，则播放
            fetch('music/1.txt')
                .then(response => response.text())
                .then(data => {
                    parseLyrics(data);
                    updateLyrics();
                    music.addEventListener('timeupdate', updateLyrics); // 当音乐时间更新时更新歌词
                });
        } else {
            music.pause(); // 如果音乐正在播放，则暂停
            music.removeEventListener('timeupdate', updateLyrics); // 移除时间更新监听器
            lyricsDiv.innerHTML = ''; // 清空歌词
        }
    }
//});
document.addEventListener('DOMContentLoaded', function() {
    var music = document.getElementById("backgroundMusic"); // 获取音频元素
    var lyricsDiv = document.getElementById('lyrics'); // 获取歌词元素
    var lyricsArray = [];
    var lyricsTimeArray = []; // 存储每行歌词对应的时间

    function parseLyrics(data) {
        lyricsArray = [];
        lyricsTimeArray = [];
        var lines = data.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var timeAndLyric = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
            if (timeAndLyric) {
                var seconds = parseInt(timeAndLyric[1]) * 60 + parseFloat(timeAndLyric[2]);
                lyricsTimeArray.push(seconds);
                lyricsArray.push(timeAndLyric[3]);
            }
        }
    }

    function updateLyrics() {
        var currentTime = music.currentTime;
        var currentLine = lyricsTimeArray.findIndex(time => currentTime < time) - 1;
        lyricsDiv.innerHTML = lyricsArray[currentLine] || "";
    }

    window.openMusic = function() {
        if (music.paused) {
            music.play(); // 如果音乐暂停，则播放
            fetch('music/1.txt')
                .then(response => response.text())
                .then(data => {
                    parseLyrics(data);
                    updateLyrics();
                    music.addEventListener('timeupdate', updateLyrics); // 当音乐时间更新时更新歌词
                });
        } else {
            music.pause(); // 如果音乐正在播放，则暂停
            music.removeEventListener('timeupdate', updateLyrics); // 移除时间更新监听器
            lyricsDiv.innerHTML = ''; // 清空歌词
        }
    };

    var playButton = document.getElementById('playButton');
    playButton.addEventListener('click', openMusic);
});