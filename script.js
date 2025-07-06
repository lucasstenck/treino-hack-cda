// Variáveis principais
let current_pos = 43;  // Posição inicial do seletor
let codes_pos = 0;  // Posição dos códigos no carrossel
let game_started = false;  // Flag que indica se o jogo foi iniciado
let countdown = 18.00;  // Tempo inicial ajustado para 18.00 segundos
let timer_start, timer_game, timer_finish, timer_time, timer_hide, correct_pos, to_find, codes, sets, timerStart;  // Variáveis para o gerenciamento do tempo e códigos

// Função para gerar um número aleatório entre min e max (exclusivo)
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

// Função para gerar um caractere aleatório baseado no conjunto definido (numeric, alphabet, etc.)
const randomSetChar = () => {
    let str = '?';  // Inicializa a variável 'str' com um valor padrão
    switch (sets) {  // Verifica o conjunto de caracteres selecionado
        case 'numeric':
            str = "0123456789";  // Conjunto de números
            break;
        case 'alphabet':
            str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";  // Conjunto de letras maiúsculas
            break;
        case 'alphanumeric':
            str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";  // Conjunto alfanumérico
            break;
        case 'greek':
            str = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";  // Conjunto de caracteres gregos
            break;
        case 'braille':
            str = "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿";  // Conjunto de caracteres Braille
            break;
        case 'runes':
            str = "ᚠᚥᚧᚨᚩᚬᚭᚻᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟᛤ";  // Conjunto de runas
            break;
    }
    return str.charAt(random(0, str.length));  // Retorna um caractere aleatório do conjunto
};

// Função para simular um delay antes de executar uma ação
const sleep = (ms, fn) => { return setTimeout(fn, ms); };

// Função para resetar o jogo quando o botão de reiniciar for clicado
document.querySelector('.btn_again').addEventListener('click', function () {
    reset();  // Chama a função reset
});

// Evento que detecta pressionamento de tecla
document.addEventListener("keydown", function (ev) {
    let key_pressed = ev.key;  // Armazena a tecla pressionada
    let valid_keys = ['a', 'w', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Enter'];  // Teclas válidas para movimentação e ações

    if (game_started && valid_keys.includes(key_pressed)) {  // Verifica se o jogo foi iniciado e se a tecla pressionada é válida
        ev.preventDefault();  // Previne o comportamento padrão da tecla (ex: rolar a página)
        switch (key_pressed) {  // Realiza ações baseadas na tecla pressionada
            case 'w':  // Movimento para cima
            case 'ArrowUp':
                current_pos -= 10;  // Diminui a posição de 10 em 10
                if (current_pos < 0) current_pos += 80;  // Se a posição for menor que 0, volta para a última linha
                break;
            case 's':  // Movimento para baixo
            case 'ArrowDown':
                current_pos += 10;  // Aumenta a posição de 10 em 10
                current_pos %= 80;  // Garante que a posição não ultrapasse 80 (volta ao topo)
                break;
            case 'a':  // Movimento para a esquerda
            case 'ArrowLeft':
                current_pos--;  // Diminui a posição em 1
                if (current_pos < 0) current_pos = 79;  // Se a posição for menor que 0, vai para o final
                break;
            case 'd':  // Movimento para a direita
            case 'ArrowRight':
                current_pos++;  // Aumenta a posição em 1
                current_pos %= 80;  // Garante que a posição não ultrapasse 80
                break;
            case 'Enter':  // Ação de pressionar Enter
                check();  // Chama a função para verificar a posição correta
                return;
        }
        drawPosition();  // Atualiza a posição do seletor na tela
    }
});



// Função para mover os códigos no carrossel
let moveCodes = () => {
    codes_pos++;  // Aumenta a posição dos códigos
    codes_pos = codes_pos % 80;  // Garante que a posição não ultrapasse 80 (loop)

    let codes_tmp = [...codes];  // Cria uma cópia dos códigos atuais
    // Empurra os códigos para a direita (movimento do carrossel)
    for (let i = 0; i < codes_pos; i++) {
        codes_tmp.push(codes_tmp[i]);
    }
    codes_tmp.splice(0, codes_pos);  // Remove os elementos desnecessários do começo

    // Atualiza o conteúdo da área de códigos na tela
    let codesElem = document.querySelector('.minigame .codes');
    codesElem.innerHTML = '';  // Limpa a área de códigos
    for (let i = 0; i < 80; i++) {  // Cria novos elementos div para cada código
        let div = document.createElement('div');
        div.innerHTML = codes_tmp[i];  // Insere o código na div
        codesElem.append(div);  // Adiciona a div à área de códigos
    }

    drawPosition();  // Atualiza a posição do seletor após o movimento
}

// Função para verificar se o jogador acertou a posição correta
function check() {
    stopTimer();  // Para o cronômetro

    // Calcula a tentativa atual, levando em consideração o deslocamento dos códigos
    let current_attempt = (current_pos + codes_pos);
    current_attempt %= 80;  // Garante que a posição não ultrapasse 80

    if (game_started && current_attempt === correct_pos) {  // Se o jogador acertou a posição correta
        // Destaca o código correto em verde
        drawPosition('green', false);
        clearInterval(timer_game);  // Para o cronômetro do jogo
        setTimeout(() => {
            reset();  // Reinicia o site ou a lógica do jogo
        }, 1000);  // 1 segundo de atraso para dar tempo de visualização

        let time = document.querySelector('.time').innerHTML;  // Obtém o tempo atual
        if (parseFloat(time) < best_time) {  // Se o tempo for melhor que o anterior
            best_time = parseFloat(time);  // Atualiza o melhor tempo
            document.cookie = "best-time_hackingdevice=" + best_time;  // Salva o melhor tempo nos cookies
        }

        // Aguardar um segundo para reiniciar o jogo e permitir que o jogador veja a correção
        setTimeout(() => {
            reset();  // Reinicia o jogo
        }, 1000);  // 1 segundo de espera

    } else {  // Se o jogador errou
        reset(false);  // Reinicia o jogo sem dar feedback de correção
        current_pos = correct_pos - codes_pos;  // Ajusta a posição do seletor para a posição correta
        drawPosition('green', false);  // Destaca a posição correta em verde
        setTimeout(() => {
            reset();  // Reinicia o site ou a lógica do jogo
        }, 1000);  // 1 segundo de atraso
    }
}



// Função para resetar o jogo
function reset(restart = true) {
    game_started = false;  // Define o estado do jogo como não iniciado

    resetTimer();  // Reseta o cronômetro
    clearTimeout(timer_start);  // Limpa o timeout de início
    clearTimeout(timer_game);  // Limpa o timeout do cronômetro do jogo
    clearTimeout(timer_finish);  // Limpa o timeout de finalização
    clearTimeout(timer_hide);  // Limpa o timeout de ocultação

    // Se o jogo deve ser reiniciado, esconde a seção de hack e inicia o jogo
    if (restart) {
        document.querySelector('.minigame .hack').classList.add('hidden');  // Esconde a tela de hack
        start();  // Inicia o jogo
    }
}

// Função para desenhar a posição do seletor na tela
let drawPosition = (className = 'red', deleteClass = true) => {
    let toDraw = getGroupFromPos(current_pos);  // Obtém o grupo de posições a ser desenhado com base na posição atual

    // Se deleteClass for verdadeiro, remove a classe 'red' de todos os elementos de código
    if (deleteClass) {
        document.querySelectorAll('.minigame .codes > div.red').forEach((el) => {
            el.classList.remove('red');  // Remove a classe 'red' de cada elemento
        });
    }

    // Seleciona todos os elementos de código
    let codesElem = document.querySelectorAll('.minigame .codes > div');

    // Para cada posição em 'toDraw', adiciona a classe 'className' (por padrão 'red')
    toDraw.forEach((draw) => {
        // Se a posição for negativa, ajusta para o valor positivo correspondente (circular)
        if (draw < 0) draw = 80 + draw;
        codesElem[draw].classList.add(className);  // Adiciona a classe 'className' ao elemento de código
    });
}

// Função para obter um grupo de posições baseado na posição inicial 'pos' e no número de elementos 'count' (padrão 4)
let getGroupFromPos = (pos, count = 4) => {
    let group = [pos];  // Inicializa o grupo com a posição inicial
    for (let i = 1; i < count; i++) {  // Para cada índice até 'count' (exceto o primeiro)
        // Se a posição somada for maior ou igual a 80, ajusta para um valor circular
        if (pos + i >= 80) {
            group.push((pos + i) - 80);  // Ajusta a posição circularmente
        } else {
            group.push(pos + i);  // Senão, simplesmente adiciona a posição
        }
    }
    return group;  // Retorna o grupo de posições
}

// Array que contém os tipos de conjuntos de caracteres disponíveis
let setsArray = ['numeric', 'alphabet', 'alphanumeric', 'greek', 'braille', 'runes'];

// Função que inicia o jogo
let start = () => {
    codes_pos = 0;  // Reinicia a posição dos códigos
    current_pos = 43;  // Define a posição inicial do seletor

    sets = setsArray[random(0, setsArray.length)];  // Escolhe aleatoriamente um conjunto de caracteres

    let show_type = random(0, 3);  // Escolhe aleatoriamente o tipo de exibição (normal ou espelhada)
    let hack = document.querySelector('.minigame .hack');  // Seleciona o elemento da tela de hack

    switch (show_type) {  // Define o comportamento da tela de hack com base no tipo selecionado
        case 0:
            hack.classList.remove('mirrored');  // Não espelha a tela
            break;
        case 1:
            if (Math.round(Math.random()) === 1)  // Chance de 50% de espelhar a tela
                hack.classList.add('mirrored');
            else
                hack.classList.remove('mirrored');
            break;
        case 2:
            hack.classList.add('mirrored');  // Sempre espelha a tela
            break;
    }

    document.querySelector('.btn_again').blur();  // Remove o foco do botão de reiniciar

    document.querySelector('.splash .text').innerHTML = 'GERANDO CÓDIGO';  // Exibe a mensagem "GERANDO CÓDIGO" na tela inicial

    codes = [];  // Cria um array vazio para os códigos
    for (let i = 0; i < 80; i++) {  // Preenche o array 'codes' com 80 códigos aleatórios
        codes.push(randomSetChar() + randomSetChar());
    }

    correct_pos = random(0, 80);  // Define aleatoriamente a posição correta
    to_find = getGroupFromPos(correct_pos);  // Obtém o grupo de posições ao redor da posição correta
    to_find = '<div>' + codes[to_find[0]] + '</div> <div>' + codes[to_find[1]] + '</div> ' +
        '<div>' + codes[to_find[2]] + '</div> <div>' + codes[to_find[3]] + '</div>';  // Formata os códigos a serem encontrados

    let codesElem = document.querySelector('.minigame .codes');  // Seleciona o elemento onde os códigos serão exibidos
    codesElem.innerHTML = '';  // Limpa os códigos existentes
    for (let i = 0; i < 80; i++) {  // Cria 80 divs para os códigos gerados e os adiciona na tela
        let div = document.createElement('div');
        div.innerHTML = codes[i];
        codesElem.append(div);
    }

    document.querySelector('.minigame .hack .find').innerHTML = to_find;  // Exibe os códigos a serem encontrados na tela

    drawPosition();  // Desenha a posição inicial do seletor

    // Inicia o temporizador de início após 1 segundo
    timer_start = sleep(1000, function () {
        document.querySelector('.splash .text').innerHTML = 'CONNECTED_TO_PROXYDATABASE';  // Exibe a mensagem "CONEXÃO COM PROXY DATABASE"
        document.querySelector('.minigame .hack').classList.remove('hidden');  // Torna visível a tela de hack

        timer_game = setInterval(moveCodes, 1500);  // Inicia o movimento dos códigos a cada 1,5 segundos

        game_started = true;  // Define o estado do jogo como iniciado

        startTimer();  // Inicia o cronômetro normalmente (sem depender de timeout)

        // Lógica adicional relacionada ao tempo pode ser ajustada aqui
    });
}



// Função para simular o pressionamento da tecla 'Enter'
function pressEnter() {
    // Cria um evento de teclado simulando o pressionamento da tecla 'Enter'
    const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        code: 'Enter',
        which: 13,
        bubbles: true  // Permite que o evento se propague
    });

    // Dispara o evento 'Enter' no documento
    document.dispatchEvent(event);

    // Log para verificar que o evento foi disparado
    console.log("Evento 'Enter' disparado.");
}

// Função para exibir o código correto em verde
function showCorrectCodeInGreen() {
    // Coloca o jogador na posição correta
    current_pos = correct_pos;
    
    // Exibe a posição correta em verde (destaca o código correto)
    drawPosition('green', false);
}

// Adiciona um ouvinte de evento para capturar o 'Enter' em qualquer lugar no documento
document.addEventListener('keydown', function (event) {
    // Verifica se a tecla pressionada é 'Enter'
    if (event.key === 'Enter') {
        console.log("O 'Enter' foi pressionado.");
        check();  // Chama a função check() para verificar o código
    }
});

// Função para iniciar o cronômetro
function startTimer() {
    countdown = 18.3;  // Tempo inicial do cronômetro
    let isEnterPressed = false;  // Flag para garantir que o 'Enter' só seja pressionado uma vez

    // Define o intervalo para atualizar o cronômetro a cada 10ms
    timer_time = setInterval(() => {
        if (countdown > 0) {
            document.querySelector('.time').innerHTML = countdown.toFixed(2);  // Exibe o tempo no formato 00.00
            countdown -= 0.01;  // Decrementa o tempo a cada 10ms
        }

        // Condição para pressionar o 'Enter' automaticamente entre 1.0 e 2.0 segundos no cronômetro
        if (!isEnterPressed && countdown <= 0.3 && countdown >= 0.1) {
            console.log('Cronômetro atingiu entre 1.0 e 2.0, chamando a função pressEnter');
            pressEnter();  // Chama a função pressEnter automaticamente
            isEnterPressed = true;  // Marca que o 'Enter' foi pressionado
        }

        // Se o cronômetro atingir 0.20 segundos
        if (countdown <= 0.20 && countdown > 0.02) {
            clearInterval(timer_time);  // Para o cronômetro
            document.querySelector('.time').innerHTML = "00.20";  // Exibe 00.20 no display
            showCorrectCodeInGreen();  // Destaca o código correto em verde
        }

        // Se o cronômetro atingir 0.02 segundos
        if (countdown <= 0.02) {
            clearInterval(timer_time);  // Para o cronômetro
            document.querySelector('.time').innerHTML = "00.00";  // Exibe 00.00 no display
            setTimeout(() => {
                reset();  // Reinicia o site ou a lógica do jogo
            }, 1000);  // Aguarda 1 segundo antes de reiniciar
        }

    }, 10);  // Atualiza a cada 10ms
}



// Função para simular o pressionamento da tecla 'Enter'
function pressEnter() {
    // Cria um evento de teclado simulando o pressionamento da tecla 'Enter'
    const event = new KeyboardEvent('keydown', {
        key: 'Enter',  // Define a tecla pressionada como 'Enter'
        keyCode: 13,  // Define o código da tecla como 13 (código para 'Enter')
        code: 'Enter',  // Define o código de tecla
        which: 13,  // Define o valor de 'which' como 13 (outro valor associado ao 'Enter')
        bubbles: true  // Permite que o evento se propague para outros elementos
    });

    // Dispara o evento 'Enter' no documento
    document.dispatchEvent(event);

    // Log para verificar que o evento foi disparado
    console.log("Evento 'Enter' disparado.");
}

// Função para parar o cronômetro
function stopTimer() {
    clearInterval(timer_time);  // Cancela o intervalo do cronômetro
}

// Função para reiniciar o cronômetro
function resetTimer() {
    clearInterval(timer_time);  // Cancela o intervalo do cronômetro
    document.querySelector('.time').innerHTML = '0.00';  // Zera o tempo exibido na tela
}

// Adiciona um ouvinte de evento para capturar o 'Enter' em qualquer lugar no documento
document.addEventListener('keydown', function (event) {
    // Verifica se a tecla pressionada é 'Enter'
    if (event.key === 'Enter') {
        console.log("O 'Enter' foi pressionado.");
        check();  // Chama a função check() para verificar o código
    }
});

// Inicia o processo ou o jogo chamando a função start()
start();

