
(function() {
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
            key = getCookie(move);
            key2move[key] = move;
            console.log('loaded mapping:', move, key);
        }
    };

    var mouseMove = function (e) {
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    };

    let keyDown = function(event) {
        let lichess_board = document.getElementsByTagName('cg-board');
        if (lichess_board.length != 1) {
            return;
        }
            
        if (!initialized) {
            readConfig();
            initialized = true;
        }

        let key = event.key.toLowerCase();
        if (!(key in key2move)) {
            return;
        }

        let rect = lichess_board[0].getBoundingClientRect();
        if (mouse_x < rect.left || mouse_x >= rect.right || mouse_y < rect.top || mouse_y >= rect.bottom) {
            return;
        }

        const x = Math.floor((mouse_x - rect.left) / rect.width * 8);
        const y = Math.floor((mouse_y - rect.top) / rect.height * 8);

        let move = key2move[key];
        console.log('wanna move', move, 'to', x, y);

        event.stopPropagation();
        event.preventDefault();    
    };

    console.log('lichess keyboard extension loaded');

    
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("mousemove", mouseMove, false);
})();

