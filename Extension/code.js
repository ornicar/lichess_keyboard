
// (function() {
var innerContent = function () {
    "use strict";

    let initialized = false;
    const moves = ['king', 'queen', 'rookl', 'rookr', 'bishop', 'knightl', 'knightr',
                   'pawnl', 'pawn', 'pawnr'];
    let key2move = {};
    let mouse_x = 0, mouse_y = 0;

    let getCookie = function(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }

        return "";
    };

    let setCookie = function(cname, cvalue) {
        let d = new Date;
        d.setTime(d.getTime() + 1000 * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();

        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    let readConfig = function() {
        for (let move of moves) {
            let key = getCookie(move);
            key2move[key] = move;
            console.log('loaded mapping:', move, key);
        }
    };

    let mouseMove = function (e) {
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    };

    let mouseEvent = function (board, type, x, y) {
        console.log('clicking', x, y);
        let e = new MouseEvent(type, {view: window, bubbles: true, cancelable: false,
                                      clientX: x, clientY: y});
        board.dispatchEvent(e);
    }

    let keyDown = function(event) {
        let board = document.getElementsByTagName('cg-board');

        if (board.length != 1) {
            return;
        } else {
            board = board[0];
        }
            
        if (!initialized) {
            readConfig();
            initialized = true;
        }

        let key = event.key.toLowerCase();
        if (!(key in key2move)) {
            return;
        }

        const rect = board.getBoundingClientRect();
        const square_size = rect.height / 8;

        if (mouse_x < rect.left || mouse_x >= rect.right || mouse_y < rect.top || mouse_y >= rect.bottom) {
            return;
        }

        console.log('rect', rect, 'square_size', square_size);

        const x = Math.floor((mouse_x - rect.left) / rect.width * 8);
        const y = Math.floor((mouse_y - rect.top) / rect.height * 8);

        let move = key2move[key];
        console.log('wanna move', move, 'to', x, y);

        event.stopPropagation();
        event.preventDefault();    

        if (move == 'pawn' && y < 7) 
        {
            mouseEvent(board, 'mousedown', mouse_x, mouse_y + square_size);
            mouseEvent(board, 'mouseup', mouse_x, mouse_y + square_size);

            mouseEvent(board, 'mousedown', mouse_x, mouse_y);
            mouseEvent(board, 'mouseup', mouse_x, mouse_y);
        }
    };

    console.log('lichess keyboard extension loaded');

    
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("mousemove", mouseMove, false);
};
// })();

{
    let nonce, src, text;
    const observer = new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].tagName && mutation.addedNodes[0].tagName.toLowerCase() === 'script') {
                let script = mutation.addedNodes[0];
                if (script.src.indexOf('round') !== -1) {
                    console.log('found and removed', script.src, script);
                    src = script.src;
                    script.parentElement.removeChild(script)
                } else if (script.innerText.indexOf('lichess.load.then(()=>{LichessRound') !== -1) {
                    console.log('found and removed 2', script.src, script);
                    nonce = script.getAttribute('nonce');
                    text = script.innerText;
                    script.parentElement.removeChild(script)
                    observer.disconnect();
                    finishLoading();
                }
            }
        })
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const finishLoading = () => {
        Promise.all([src].map(u => fetch(u))).then(responses =>
            Promise.all(responses.map(res => res.text()))
        ).then(info => {
            let completed = info[0].replace(/\w+\.isTru\w{4}/, 'true');
            let firstOne = document.createElement('script');
            let secondOne = document.createElement('script');
            firstOne.innerHTML = `${completed}`;
            secondOne.innerHTML = `${text}`;
            firstOne.setAttribute('nonce', nonce)
            firstOne.setAttribute('defer', 'defer')
            secondOne.setAttribute('nonce', nonce)
            document.body.appendChild(firstOne);
            document.body.appendChild(secondOne);
            let windowScript = document.createElement('script');
            windowScript.setAttribute('nonce', nonce)
            windowScript.innerHTML = `(${innerContent.toString()})()`
            document.body.appendChild(windowScript);
        });
    }
}

