let eventId = 0;
let eventsBatch = [];
let animationId;
let running = false;

const originalContent = document.querySelector('#main-content').innerHTML;

document.getElementById('play-btn').addEventListener('click', startAnimation);

function startAnimation() {

    const block3 = document.querySelector('.block3');
    block3.innerHTML = `
    <div id="work">
        <div id="controls">
            <div id="controls-panel">
                <button id="start-btn" class="controls-btn">Start</button>
                <button id="close-btn" class="controls-btn">Close</button>
            </div>
            <div id="messages"></div>
        </div>
        <div id="anim">
            <div id="red-square" class="square" style="width:20px;height:20px;background:red;"></div>
            <div id="green-square" class="square" style="width:10px;height:10px;background:green;"></div>
        </div>
    </div>`;

    // Очищаємо повідомлення, але НЕ скидаємо лічильники!
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        messagesDiv.innerHTML = '';
    }
    
    setupAnimation();
}

/*
function setupAnimation() {
    const anim = document.getElementById('anim');
    const animRect = anim.getBoundingClientRect(); // розміри anim не змінюються під час анімації
    
    let red = {
        el: document.getElementById('red-square'),
        // x: 0,
        // y: animRect.height / 2 - 10,
        dx: 2,
        dy: 2
    };
    
    let green = {
        el: document.getElementById('green-square'),
        // x: animRect.width / 2 - 5,
        // y: 0,
        dx: 3,
        dy: -3
    };

    // Функція для оновлення позицій при зміні розміру
    function updatePositions() {
        const animRect = anim.getBoundingClientRect();
        
        // Початкові позиції (оновлюються при кожному виклику)
        red.x = 0;
        red.y = animRect.height / 2 - 10;
        green.x = animRect.width / 2 - 5;
        green.y = 0;
        
        // Застосовуємо позиції
        red.el.style.left = red.x + 'px';
        red.el.style.top = red.y + 'px';
        green.el.style.left = green.x + 'px';
        green.el.style.top = green.y + 'px';
    }
    
    // Спочатку встановлюємо позиції
    updatePositions();
    
    // Оновлюємо при зміні розміру вікна
    window.addEventListener('resize', () => {
        if (!running) { // Якщо анімація не запущена
            updatePositions();
        }
        // Якщо анімація запущена, квадрати продовжать рух у нових межах
    });
    
    // Початкові позиції
    red.el.style.left = red.x + 'px';
    red.el.style.top = red.y + 'px';
    green.el.style.left = green.x + 'px';
    green.el.style.top = green.y + 'px';
    
    // Кнопка Start
    document.getElementById('start-btn').addEventListener('click', () => {
        logEvent('Натискання Start');
        startMovement();
    });
    
    // Кнопка Close
    document.getElementById('close-btn').addEventListener('click', closeAnimation);
    
    function startMovement() {
        if (running) return;
        running = true;
        
        // Ховаємо Start
        const startBtn = document.getElementById('start-btn');
        // startBtn.remove();
        startBtn.style.display = 'none';

        
        // Створюємо і вставляємо Stop перед Close
        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop';
        stopBtn.className = 'controls-btn';
        stopBtn.id = 'stop-btn'; // для зручності
        
        stopBtn.addEventListener('click', () => {
            logEvent('Натискання Stop');
            cancelAnimationFrame(animationId);
            running = false;

            stopBtn.remove();
            startBtn.style.display = 'inline-block';  // Показуємо Start


            
            // Вставляємо Reload перед Close
            const panel = document.getElementById('controls-panel');
            panel.insertBefore(reloadBtn, document.getElementById('close-btn'));
        });
        
        // Вставляємо Stop перед Close
        const panel = document.getElementById('controls-panel');
        panel.insertBefore(stopBtn, document.getElementById('close-btn'));
        
        // Запускаємо анімацію
        animate();
    }
    
    function animate() {
        moveSquare(red);
        moveSquare(green);
        logEvent('Крок анімації');
        
        if (checkCollision(red, green)) {
            logEvent('Повне накладання квадратів - стоп');
            cancelAnimationFrame(animationId);
            running = false;

            // Автоматична зупинка — міняємо Stop на Reload
            const stopBtn = document.getElementById('stop-btn');
            if (stopBtn) {
                stopBtn.remove();

                const reloadBtn = document.createElement('button');
                reloadBtn.textContent = 'Reload';
                reloadBtn.className = 'controls-btn';
                reloadBtn.id = 'reload-btn';

                reloadBtn.addEventListener('click', () => {
                    logEvent('Натискання Reload');
                    resetPositions();

                    reloadBtn.remove();
                    //const panel = document.getElementById('controls-panel');
                    //const startBtn = document.getElementById('start-btn');
                    // panel.insertBefore(startBtn, document.getElementById('close-btn'));
                    //startBtn.style.display = 'inline';

                    // startBtn.style.display = 'none';
                    // startMovement();

                    // startBtn.style.display = 'inline-block';
                    // running = false;

                    // startBtn.style.display = 'inline-block';
                    // running = false;
                    document.getElementById('start-btn').style.display = 'inline-block';
                });

                const panel = document.getElementById('controls-panel');
                panel.insertBefore(reloadBtn, document.getElementById('close-btn'));
            }

            return;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    function moveSquare(sq) {
        sq.x += sq.dx;
        sq.y += sq.dy;

        const width = anim.clientWidth;
        const height = anim.clientHeight;

        if (sq.x <= 0 || sq.x + sq.el.offsetWidth >= width) {
            sq.dx = -sq.dx;
            logEvent('Відбиття від вертикальної стінки');
        }
        if (sq.y <= 0 || sq.y + sq.el.offsetHeight >= height) {
            sq.dy = -sq.dy;
            logEvent('Відбиття від горизонтальної стінки');
        }

        // Додаємо невеликий "буфер" — якщо трохи вилізли, трохи відсуваємо назад
        if (sq.x < 0) sq.x = 0;
        if (sq.x + sq.el.offsetWidth > width) sq.x = width - sq.el.offsetWidth;
        if (sq.y < 0) sq.y = 0;
        if (sq.y + sq.el.offsetHeight > height) sq.y = height - sq.el.offsetHeight;

        sq.el.style.left = sq.x + 'px';
        sq.el.style.top = sq.y + 'px';
    }
    
    function checkCollision(a, b) {
        // Повне накладання: менший (зелений) повністю всередині більшого (червоного)
        // Але оскільки розміри різні, проста перевірка на однакові координати центра
        // (бо менший 10px, більший 20px — центр різний, тому перевіряємо, чи зелений в межах червоного)
        const ax1 = a.x;
        const ax2 = a.x + 20;
        const ay1 = a.y;
        const ay2 = a.y + 20;
        const bx1 = b.x;
        const bx2 = b.x + 10;
        const by1 = b.y;
        const by2 = b.y + 10;
        
        return bx1 >= ax1 && bx2 <= ax2 && by1 >= ay1 && by2 <= ay2;
    }
    
    function resetPositions() {
        red.x = 0;
        red.y = animRect.height / 2 - 10;
        green.x = animRect.width / 2 - 5;
        green.y = 0;
        
        red.el.style.left = red.x + 'px';
        red.el.style.top = red.y + 'px';
        green.el.style.left = green.x + 'px';
        green.el.style.top = green.y + 'px';
    }
}
*/
function setupAnimation() {
    const anim = document.getElementById('anim');
    
    // Об'єкти квадратів (без початкових позицій)
    let red = {
        el: document.getElementById('red-square'),
        dx: 2,
        dy: 2
    };
    
    let green = {
        el: document.getElementById('green-square'),
        dx: 3,
        dy: -3
    };

    // Функція для оновлення позицій при зміні розміру
    function updatePositions() {
        const animRect = anim.getBoundingClientRect();
        
        // Початкові позиції (оновлюються при кожному виклику)
        red.x = 0;
        red.y = animRect.height / 2 - 10;  // посередині вертикалі
        green.x = animRect.width / 2 - 5;  // посередині горизонталі
        green.y = 0;
        
        // Застосовуємо позиції
        red.el.style.left = red.x + 'px';
        red.el.style.top = red.y + 'px';
        green.el.style.left = green.x + 'px';
        green.el.style.top = green.y + 'px';
    }
    
    // Дебаунс для resize події
    let resizeTimer;
    
    // Обробник зміни розміру вікна
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!running) { // Якщо анімація не запущена
                updatePositions();
            }
            // Якщо анімація запущена, квадрати продовжать рух у нових межах
            // moveSquare() буде використовувати поточні anim.clientWidth/Height
        }, 100);
    }
    
    // Спочатку встановлюємо позиції
    updatePositions();
    
    // Додаємо обробник resize
    window.addEventListener('resize', handleResize);
    
    // Кнопка Start
    document.getElementById('start-btn').addEventListener('click', () => {
        logEvent('Натискання Start');
        startMovement();
    });
    
    // Кнопка Close
    document.getElementById('close-btn').addEventListener('click', closeAnimation);
    
    function startMovement() {
        if (running) return;
        running = true;
        
        // Ховаємо Start
        const startBtn = document.getElementById('start-btn');
        startBtn.style.display = 'none';
        
        // Створюємо Stop
        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop';
        stopBtn.className = 'controls-btn';
        stopBtn.id = 'stop-btn';
        
        stopBtn.addEventListener('click', () => {
            logEvent('Натискання Stop');
            cancelAnimationFrame(animationId);
            running = false;
            
            // ✅ За завданням: Stop → Start (квадрати залишаються на місці)
            stopBtn.remove();
            startBtn.style.display = 'inline-block';
        });
        
        // Вставляємо Stop перед Close
        const panel = document.getElementById('controls-panel');
        panel.insertBefore(stopBtn, document.getElementById('close-btn'));
        
        // Запускаємо анімацію
        animate();
    }
    
    function animate() {
        moveSquare(red);
        moveSquare(green);
        logEvent('Крок анімації');
        
        if (checkCollision(red, green)) {
            logEvent('Повне накладання квадратів - стоп');
            cancelAnimationFrame(animationId);
            running = false;

            // Автоматична зупинка — міняємо Stop на Reload
            const stopBtn = document.getElementById('stop-btn');
            if (stopBtn) {
                stopBtn.remove();

                const reloadBtn = document.createElement('button');
                reloadBtn.textContent = 'Reload';
                reloadBtn.className = 'controls-btn';
                reloadBtn.id = 'reload-btn';

                reloadBtn.addEventListener('click', () => {
                    logEvent('Натискання Reload');
                    resetPositions(); // Повертаємо квадрати на початок
                    
                    // Reload → Start
                    reloadBtn.remove();
                    document.getElementById('start-btn').style.display = 'inline-block';
                });

                const panel = document.getElementById('controls-panel');
                panel.insertBefore(reloadBtn, document.getElementById('close-btn'));
            }

            return;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    function moveSquare(sq) {
        // Отримуємо актуальні розміри anim кожен кадр
        const width = anim.clientWidth;
        const height = anim.clientHeight;
        
        sq.x += sq.dx;
        sq.y += sq.dy;

        // Перевірка на зіткнення зі стінками (з урахуванням розмірів квадрата)
        if (sq.x <= 0 || sq.x + sq.el.offsetWidth >= width) {
            sq.dx = -sq.dx;
            logEvent(sq === red ? 'Відбиття від вертикальної стінки (червоний)' : 
                                 'Відбиття від вертикальної стінки (зелений)');
        }
        if (sq.y <= 0 || sq.y + sq.el.offsetHeight >= height) {
            sq.dy = -sq.dy;
            logEvent(sq === red ? 'Відбиття від горизонтальної стінки (червоний)' : 
                                 'Відбиття від горизонтальної стінки (зелений)');
        }

        // Корекція позицій, щоб не виходили за межі
        if (sq.x < 0) sq.x = 0;
        if (sq.x + sq.el.offsetWidth > width) sq.x = width - sq.el.offsetWidth;
        if (sq.y < 0) sq.y = 0;
        if (sq.y + sq.el.offsetHeight > height) sq.y = height - sq.el.offsetHeight;

        // Застосовуємо нові позиції
        sq.el.style.left = sq.x + 'px';
        sq.el.style.top = sq.y + 'px';
    }
    
    function checkCollision(a, b) {
        // Повне накладання: менший (зелений) повністю всередині більшого (червоного)
        const ax1 = a.x;
        const ax2 = a.x + 20;
        const ay1 = a.y;
        const ay2 = a.y + 20;
        const bx1 = b.x;
        const bx2 = b.x + 10;
        const by1 = b.y;
        const by2 = b.y + 10;
        
        return bx1 >= ax1 && bx2 <= ax2 && by1 >= ay1 && by2 <= ay2;
    }
    
    function resetPositions() {
        updatePositions(); // Використовуємо ту ж функцію
    }
    
    // Прибираємо обробник resize при закритті анімації
    document.getElementById('close-btn').addEventListener('click', () => {
        window.removeEventListener('resize', handleResize);
    }, { once: true });
}

function logEvent(message) {
    eventId++;
    const clientTime = new Date().toISOString();
    addMessage(`${eventId}: ${message} (${clientTime})`);
    
    // Immediate логування
    fetch('php/log_immediate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, time: clientTime, msg: message })
    }).catch(err => console.error('Immediate log error:', err));
    
    // Batch (LocalStorage)
    eventsBatch.push({ id: eventId, time: clientTime, msg: message });
    localStorage.setItem('eventsBatch', JSON.stringify(eventsBatch));
}

function addMessage(text) {
    const msgDiv = document.getElementById('messages');
    if (msgDiv) {
        msgDiv.innerHTML += text + '<br>';
        msgDiv.scrollTop = msgDiv.scrollHeight;
    }
}

async function closeAnimation() {
    logEvent('Натискання Close');
    
    // Відправляємо batch, якщо є дані
    if (eventsBatch.length > 0) {
        try {
            await fetch('php/log_batch.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventsBatch)
            });

             // ✅ Тільки після успішної відправки очищаємо
            eventsBatch = [];
            localStorage.removeItem('eventsBatch');
        } catch (err) {
            console.warn('Batch log failed, but stored locally:', err);
            // Дані вже в LocalStorage, можна спробувати пізніше
        }
    }

    // Завантажуємо логи з сервера
    try {
        const [immRes, batchRes] = await Promise.all([
            fetch('php/get_immediate.php').then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            }),
            fetch('php/get_batch.php').then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
        ]);
        
        displayLogs(immRes, batchRes);
    } catch (err) {
        console.error('Error loading logs:', err);
        document.getElementById('logs-table').innerHTML = 
            `<p style="color:red;">Помилка завантаження логів: ${err.message}</p>`;
    }
    
    // Повертаємо оригінальний контент
    document.querySelector('.block3').innerHTML = originalContent;
}

/*
function displayLogs(immediate, batch) {
    let table = `<table border="1" style="width:100%; margin-top:20px; border-collapse: collapse;">
        <tr style="background:#f0f0f0;">
            <th style="padding:8px;">Immediate (серверний час)</th>
            <th style="padding:8px;">Batch (локальний час)</th>
        </tr>`;
    
    const maxLen = Math.max(immediate.length, batch.length);
    for (let i = 0; i < maxLen; i++) {
        const imm = immediate[i] || { id: '-', msg: '-', server_time: '-' };
        const bat = batch[i] || { id: '-', msg: '-', time: '-' };
        
        table += `<tr>
            <td style="padding:6px;">${imm.id}: ${imm.msg} (${imm.server_time})</td>
            <td style="padding:6px;">${bat.id}: ${bat.msg} (${bat.time})</td>
        </tr>`;
    }
    table += `</table>`;
    
    document.getElementById('logs-table').innerHTML = table;
}*/

function displayLogs(immediate, batch) {
    let table = `<table border="1" style="width:100%; margin-top:20px; border-collapse: collapse;">
        <tr style="background:#f0f0f0;">
            <th style="padding:8px;">Immediate (серверний час)</th>
            <th style="padding:8px;">Batch (локальний час)</th>
        </tr>`;
    
    const maxLen = Math.max(immediate.length, batch.length);
    
    for (let i = 0; i < maxLen; i++) {
        // Форматуємо immediate
        const imm = immediate[i] || {};
        const immText = imm.id ? `${imm.id}: ${imm.msg} (${imm.server_time})` : '-';
        
        // Форматуємо batch
        const bat = batch[i] || {};
        // batch зберігає client_time, але для таблиці показуємо time
        const batTime = bat.time || bat.client_time || '-';
        const batText = bat.id ? `${bat.id}: ${bat.msg} (${batTime})` : '-';
        
        table += `<tr>
            <td style="padding:6px;">${immText}</td>
            <td style="padding:6px;">${batText}</td>
        </tr>`;
    }
    
    table += `</table>`;
    document.getElementById('logs-table').innerHTML = table;
}


// function createTexture(ctx) {
//   const size = 32;
//   const patternCanvas = document.createElement("canvas");
//   patternCanvas.width = size;
//   patternCanvas.height = size;
  

//   const pctx = patternCanvas.getContext("2d");

//   pctx.fillStyle = "#e0e0e0";
//   pctx.fillRect(0, 0, size, size);

//   pctx.strokeStyle = "#c0c0c0";
//   pctx.beginPath();
//   pctx.moveTo(0, 0);
//   pctx.lineTo(size, size);
//   pctx.stroke();

//   return ctx.createPattern(patternCanvas, "repeat");
// }

function downloadLog(events) {
  const content = events.join("\n");
  const blob = new Blob([content], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "events_immediate.txt";
  link.click();
}

document.getElementById('clear-logs-btn')?.addEventListener('click', async () => {
    if (confirm('Очистити всі логи на сервері та локально?')) {
        try {
            const response = await fetch('php/clear_logs.php');
            const result = await response.json();
            
            if (result.status === 'success') {
                // Очищаємо LocalStorage
                localStorage.removeItem('eventsBatch');
                eventsBatch = [];
                eventId = 0;
                
                // Очищаємо таблицю логів
                document.getElementById('logs-table').innerHTML = '<p>Логи успішно очищено!</p>';
                
                console.log('Clear logs result:', result);
            } else {
                document.getElementById('logs-table').innerHTML = 
                    `<p style="color:red;">Помилка: ${result.message || 'Невідома помилка'}</p>`;
            }
        } catch (err) {
            console.error('Clear logs error:', err);
            document.getElementById('logs-table').innerHTML = 
                `<p style="color:red;">Помилка очищення логів: ${err.message}</p>`;
        }
    }
});

// Додайте в ваш script.js
window.addEventListener('load', function() {
    const texture = new Image();
    texture.onload = function() {
        console.log('Текстура успішно завантажена');
    };
    texture.onerror = function() {
        console.error('Не вдалося завантажити текстуру. Шлях:', texture.src);
        // Можна встановити fallback фон
        document.getElementById('anim').style.backgroundColor = '#e0e0e0';
    };
    texture.src = 'images/texture2.jpg'; // той самий шлях
});
