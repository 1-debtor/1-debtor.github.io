let parsedLyrics = null;
document.addEventListener('DOMContentLoaded', function() {
  const songs = [
    {
      title: '台风',
      file: 'assets/music/台风.mp3',
      lyricsFile: 'assets/lyrics/taifeng.txt'
    },
    { 
      title: '稻香', 
      file: 'assets/music/1.mp3', 
      lyricsFile: 'assets/lyrics/1.txt' 
    },
    {
      title: '遥望',
      file: 'assets/music/遥望.mp3',
      lyricsFile: 'assets/lyrics/遥望.txt'
    },
    // ... Add more song objects as needed
  ];

  const audioPlayer = document.getElementById('audioPlayer'); // Reference to audio player
  const songListElement = document.getElementById('songList');
  const lyricsElement = document.getElementById('lyrics');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeControl = document.getElementById('volumeControl');

  let isPlaying = false;
  let currentSongIndex = -1; // To track the current song

  // Populate song list
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.title;
    li.classList.add('cursor-pointer', 'hover:text-gray-300', 'py-2');
    li.addEventListener('click', () => {
      playSong(index);
    });
    songListElement.appendChild(li);
  });

  // Function to play a song
  function playSong(index) {
    if (currentSongIndex !== index) {
      currentSongIndex = index;
      const song = songs[index];
      audioPlayer.src = song.file; // Set the source of the audio player
      loadLyrics(song.lyricsFile); // Fetch and display lyrics
      audioPlayer.play(); // Play the song
      isPlaying = true;
    } else {
      togglePlayPause(); // Play/Pause the current song
    }
    updatePlayPauseButton();
  }

  // 修改 loadLyrics 函数以支持歌词滚动显示
  function loadLyrics(lyricsFilePath) {
    fetch(lyricsFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.text();
      })
      .then(lyrics => {
        parsedLyrics = parseLyrics(lyrics); // 解析歌词并赋值给 parsedLyrics
        displayLyrics(parsedLyrics, 0); // 初始显示从第一行开始的30行歌词
      })
      .catch(error => {
        console.error('Error loading the lyrics:', error);
        lyricsElement.textContent = 'missing lyrics';
      });
  }

  // 解析歌词时间戳和文本
  function parseLyrics(lyricsText) {
    const lines = lyricsText.split('\n');
    return lines.map(line => {
        const parts = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (parts) {
            const time = parseInt(parts[1], 10) * 60 + parseFloat(parts[2]);
            const text = parts[3];
            return { time, text };
        }
        return null;
    }).filter(line => line !== null);
  }

  // 解析歌词时间戳和文本
  function syncLyrics(parsedLyrics) {
    const currentTime = audioPlayer.currentTime;
    const currentLineIndex = parsedLyrics.findIndex((line, index) => {
        return parsedLyrics[index + 1] ? currentTime < parsedLyrics[index + 1].time : true;
    });

    if (currentLineIndex !== -1) {
        displayLyrics(parsedLyrics, currentLineIndex);
    }
  }

  // 新增一个函数来处理歌词的显示逻辑
  function displayLyrics(parsedLyrics, startIndex) {
    lyricsElement.innerHTML = ''; // Clear current lyrics
    const lyricsToShow = parsedLyrics.slice(startIndex, startIndex + 2); // 只显示2行歌词
    lyricsToShow.forEach((line, index) => {
      const p = document.createElement('p');
      p.textContent = line.text;
      p.classList.add('lyric-line');
      if (index === 0) { // 高亮显示的是当前播放的那一行
        p.classList.add('highlight');
      }
      lyricsElement.appendChild(p);
    });
  }

  // Function to update the play/pause button icon
  function updatePlayPauseButton() {
    playPauseBtn.innerHTML = isPlaying
      ? '<img src="https://img.icons8.com/ios-filled/50/ffffff/pause--v1.png" alt="Pause" class="w-6 h-6">'
      : '<img src="https://img.icons8.com/ios-filled/50/ffffff/play--v1.png" alt="Play" class="w-6 h-6">';
  }

  // Function to toggle play/pause
  function togglePlayPause() {
    if (audioPlayer.src) {
      isPlaying = !isPlaying;
      if (isPlaying) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
      updatePlayPauseButton();
    }
  }

  playPauseBtn.addEventListener('click', togglePlayPause);

  // Adjust volume
  volumeControl.addEventListener('input', (event) => {
    const volume = event.target.value / 100;
    audioPlayer.volume = volume; // Adjust the volume of the audio player
  });

  // 进度条
  const progressBar = document.getElementById('progressBar');

  // 当音频元数据加载完成后，更新进度条的最大值
  audioPlayer.onloadedmetadata = function() {
    progressBar.max = audioPlayer.duration;
  };

  // 更新进度条的值以匹配当前播放时间
  audioPlayer.ontimeupdate = function() {
    progressBar.value = audioPlayer.currentTime; // 更新进度条
    if (parsedLyrics) {
      syncLyrics(parsedLyrics); // 同步歌词
    }
  };
  // 当用户拖动进度条时，改变音频播放的进度
  progressBar.addEventListener('input', function() {
    audioPlayer.currentTime = progressBar.value;
  });

  // 获取新元素的引用
  const progressTime = document.getElementById('progressTime');

  // 更新进度条的值以匹配当前播放时间
  audioPlayer.ontimeupdate = function() {
    progressBar.value = audioPlayer.currentTime; // 更新进度条
    if (parsedLyrics) {
      syncLyrics(parsedLyrics); // 同步歌词
    }

    // 更新时间显示
    const minutes = Math.floor(audioPlayer.currentTime / 60);
    const seconds = Math.floor(audioPlayer.currentTime % 60);
    progressTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  
  // Update the play/pause button when the song ends
  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayPauseButton();
  });
});