const addTimerBtn = document.getElementById('addTimer');
const presetButtons = document.querySelectorAll('.preset');
const timersContainer = document.getElementById('timers');

addTimerBtn.addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    const totalTime = minutes * 60 + seconds;
    createTimer(totalTime);
});

presetButtons.forEach(presetBtn => {
    presetBtn.addEventListener('click', () => {
        const totalTime = parseInt(presetBtn.dataset.time);
        createTimer(totalTime);
    });
});

let interval;

function createTimer(totalTime) {
    const timer = document.createElement('div');
    timer.className = 'timer';

    const initialTimeDisplay = document.createElement('span');
    initialTimeDisplay.className = 'initial-time-display';
    initialTimeDisplay.textContent = `初期設定: ${formatTime(totalTime)}`;
    timer.appendChild(initialTimeDisplay);

    const timerDisplay = document.createElement('span');
    timerDisplay.className = 'timer-display';
    timerDisplay.textContent = formatTime(totalTime);
    timer.appendChild(timerDisplay);

    const startBtn = document.createElement('button');
    startBtn.className = 'start'; // 追加
    startBtn.textContent = '開始';
    startBtn.addEventListener('click', () => startTimer(timer, totalTime, startBtn));
    timer.appendChild(startBtn);

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '停止';
    stopBtn.addEventListener('click', () => stopTimer(timer, startBtn));
    timer.appendChild(stopBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'リセット';
    resetBtn.addEventListener('click', () => resetTimer(timer, totalTime, startBtn));
    timer.appendChild(resetBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTimer(timer));
    timer.appendChild(deleteBtn);

    const startStopButtons = document.createElement('div');
    startStopButtons.className = 'start-stop-buttons';

    startStopButtons.appendChild(startBtn);
    startStopButtons.appendChild(stopBtn);

    timer.appendChild(startStopButtons);
    timer.appendChild(resetBtn);
    timer.appendChild(deleteBtn); // 削除ボタンも追加

    timersContainer.appendChild(timer);
}

function startTimer(timer, totalTime, startBtn) {
    if (timer.timerId) return;

    startBtn.disabled = true;
    const startTime = Date.now();
    const endTime = startTime + totalTime * 1000;

    timer.timerId = setInterval(() => {
        const remainingTime = Math.round((endTime - Date.now()) / 1000);
        if (remainingTime <= 0) {
            if (!timer.classList.contains('finished')) {
                timer.querySelector('.timer-display').textContent = '00:00';
                timer.classList.add('finished');
            } else {
                const elapsedTime = Math.abs(remainingTime);
                timer.querySelector('.timer-display').textContent = `+${formatTime(elapsedTime)}`;
            }
        } else {
            timer.querySelector('.timer-display').textContent = formatTime(remainingTime);
        }
    }, 1000);
}

function stopTimer(timer, startBtn) {
    if (!timer.timerId) return;
    clearInterval(timer.timerId);
    timer.timerId = null;
    startBtn.disabled = false; // startBtnを指定するために変更
}

function resetTimer(timer, totalTime, startBtn) {
    clearInterval(timer.timerId); // タイマーを停止
    timer.timerId = null; // タイマーIDをリセット
    startBtn.disabled = false; // 開始ボタンを有効にする
    timer.querySelector('.timer-display').textContent = formatTime(totalTime);
    timer.classList.remove('finished'); // 強調表示を解除
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function deleteTimer(timer) {
    timer.remove();
}
