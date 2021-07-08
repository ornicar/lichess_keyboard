
let innerContent = function () {
    "use strict";

    const moves = ['pawn', 'pawnl', 'pawnr', 'queen', 'queen2', 'rookl', 'rookr',
                   'knightl', 'knightr', 'bishop', 'king'];

    const readable_names = {'pawn': 'Pawn Up', 'pawnl': 'Pawn \u21d6 ', 'pawnr': 'Pawn \u21d7 ',
        'queen': 'Queen', 'queen2': 'Queen \u25a3', 'rookl': 'Rook', 'rookr': 'Rook \u25a3',
        'knightl': 'Knight', 'knightr': 'Knight \u25a3', 'bishop': 'Bishop', 'king': 'King'};

    const defaults = {'pawn': 'w', 'pawnl': 'q', 'pawnr': 'e', 'queen': 's', 'queen2': 'z', 'rookl': '1',
                      'rookr': '3', 'knightl': 'a', 'knightr': 'd', 'bishop': 'space', 'king': 'shift'};

    const move2piece = {king: 'king', queen: 'queen', queen2: 'queen', rookl: 'rook',
                        rookr: 'rook', bishop: 'bishop', knightl: 'knight', knightr: 'knight',
                        pawnl: 'pawn', pawn: 'pawn', pawnr: 'pawn'};

    let key2move = new Map();
    let mouse_x = 0, mouse_y = 0;
    let my_color = 'white';
    let left_rook = 0, right_rook = 1, left_knight = 0, right_knight = 1, left_queen = 0, right_queen = 1;
    let menu_active = false;
    let current_key;

    let get_cookie = function(name) {
        const name_value = document.cookie.split(';').find(item => item.trim().startsWith(name + '='));
        return name_value !== undefined ? decodeURIComponent(name_value.substr(name.length + 2)) : '';
    }

    let read_kb_mapping = function(move) {
        const mapping = get_cookie(move);
        return mapping !== '' ? mapping : defaults[move];
    };

    let set_cookie = function(name, cvalue) {
        let d = new Date;
        d.setTime(d.getTime() + 1000 * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + cvalue + ";" + expires + ";path=/";
    };

    let read_config = function() {
        for (let move of moves) {
            let key = read_kb_mapping(move);
            key2move.set(key, move);
        }
    };

    let save_config = function() {
        key2move.forEach((move, key) => {
            set_cookie(move, (key === ' ') ? 'space' : key);
        });
    };

    let get_color = function() {
        let bparent = $(".cg-wrap")[0];
        return bparent.className.includes("orientation-black") ? "black" : "white";
    };

    let mark_doubled_pieces = function() {
        if (my_color == 'white') {
            if (document.getElementsByClassName(my_color + " rook")[right_rook] != undefined) {
                document.getElementsByClassName(my_color + " rook")[right_rook].style.backgroundImage =
                "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCA0NSA0NSIKICAgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ3aGl0ZV9yb29rLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45Mi4zICgyNDA1NTQ2LCAyMDE4LTAzLTExKSI+PG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNjg0Ij48cmRmOlJERj48Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcwogICAgIGlkPSJkZWZzNjgyIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg1MyIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlkPSJuYW1lZHZpZXc2ODAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjE2IgogICAgIGlua3NjYXBlOmN4PSIyMi41IgogICAgIGlua3NjYXBlOmN5PSIyMi41IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI2NyIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjciCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIiAvPjxzdHlsZQogICAgIHR5cGU9InRleHQvY3NzIgogICAgIGlkPSJzdHlsZTY2MyI+LnN0MHtmaWxsOiNGRkZGRkY7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5zdDF7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30uc3Qye2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O30uc3Qze2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO30uc3Q0e2ZpbGw6IzNFQUY0RTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4xODIxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9PC9zdHlsZT48ZwogICAgIGlkPSJnNjc1Ij48cGF0aAogICAgICAgY2xhc3M9InN0MCIKICAgICAgIGQ9Ik05LDM5aDI3di0zSDlWMzl6IE0xMiwzNnYtNGgyMXY0SDEyeiBNMTEsMTRWOWg0djJoNVY5aDV2Mmg1VjloNHY1IgogICAgICAgaWQ9InBhdGg2NjUiIC8+PHBhdGgKICAgICAgIGNsYXNzPSJzdDEiCiAgICAgICBkPSJNMzQsMTRsLTMsM0gxNGwtMy0zIgogICAgICAgaWQ9InBhdGg2NjciIC8+PHBhdGgKICAgICAgIGNsYXNzPSJzdDIiCiAgICAgICBkPSJNMzEsMTd2MTIuNUgxNFYxNyIKICAgICAgIGlkPSJwYXRoNjY5IiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgZD0iTTMxLDI5LjVsMS41LDIuNWgtMjBsMS41LTIuNSIKICAgICAgIGlkPSJwYXRoNjcxIiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QzIgogICAgICAgZD0iTTExLDE0aDIzIgogICAgICAgaWQ9InBhdGg2NzMiIC8+PC9nPjxyZWN0CiAgICAgeD0iMjguMjk5OTk5IgogICAgIHk9IjI4LjEyNSIKICAgICBjbGFzcz0ic3Q0IgogICAgIHdpZHRoPSIxMy44IgogICAgIGhlaWdodD0iMTMuOCIKICAgICBpZD0icmVjdDY3NyIKICAgICBzdHlsZT0iZmlsbDojM2VhZjRlO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjE4MjEwMDA2O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIgLz48L3N2Zz4=')";
            }

            if (document.getElementsByClassName(my_color + " knight")[right_knight] != undefined) {
                document.getElementsByClassName(my_color + " knight")[right_knight].style.backgroundImage =
                "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCA0NSA0NSIKICAgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ3aGl0ZV9rbmlnaHQuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjMgKDI0MDU1NDYsIDIwMTgtMDMtMTEpIj48bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE3NjAiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnM3NTgiIC8+PHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODUzIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMjUiCiAgICAgaWQ9Im5hbWVkdmlldzc1NiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9IjIyLjUiCiAgICAgaW5rc2NhcGU6Y3k9IjIyLjUiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjY3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNyIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9Imc3NTMiIC8+PHN0eWxlCiAgICAgdHlwZT0idGV4dC9jc3MiCiAgICAgaWQ9InN0eWxlNzQzIj4uc3Qwe2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9LnN0MXtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9LnN0MntmaWxsOiMzRUFGNEU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuMTgyMTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fTwvc3R5bGU+PGcKICAgICBpZD0iZzc1MyI+PHBhdGgKICAgICAgIGNsYXNzPSJzdDAiCiAgICAgICBkPSJtIDIyLDEwIGMgMTAuNSwxIDE2LjUsOCAxNiwyOSBIIDE1IGMgMCwtOSAxMCwtNi41IDgsLTIxIgogICAgICAgaWQ9InBhdGg3NDUiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIgLz48cGF0aAogICAgICAgY2xhc3M9InN0MCIKICAgICAgIGQ9Im0gMjQsMTggYyAwLjQsMi45IC01LjUsNy40IC04LDkgLTMsMiAtMi44LDQuMyAtNSw0IC0xLC0wLjkgMS40LC0zIDAsLTMgLTEsMCAwLjIsMS4yIC0xLDIgLTEsMCAtNCwxIC00LC00IDAsLTIgNiwtMTIgNiwtMTIgMCwwIDEuOSwtMS45IDIsLTMuNSAtMC43LC0xIC0wLjUsLTIgLTAuNSwtMyAxLC0xIDMsMi41IDMsMi41IGggMiBjIDAsMCAwLjgsLTIgMi41LC0zIDEsMCAxLDMgMSwzIgogICAgICAgaWQ9InBhdGg3NDciCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIgLz48cGF0aAogICAgICAgY2xhc3M9InN0MSIKICAgICAgIGQ9Ik0gOS41LDI1LjUgQyA5LjUsMjUuOCA5LjMsMjYgOSwyNiA4LjcsMjYgOC41LDI1LjggOC41LDI1LjUgOC41LDI1LjIgOC43LDI1IDksMjUgYyAwLjMsMCAwLjUsMC4yIDAuNSwwLjUgeiBtIDUuNCwtOS44IGMgLTAuNCwwLjcgLTAuOSwxLjIgLTEuMiwxLjEgLTAuMiwtMC4xIC0wLjEsLTAuOCAwLjMsLTEuNSAwLDAgMCwwIDAsMCAwLjQsLTAuNyAwLjksLTEuMiAxLjIsLTEuMSAwLjMsMC4xIDAuMiwwLjggLTAuMywxLjUgMCwwIDAsMCAwLDAgeiIKICAgICAgIGlkPSJwYXRoNzQ5IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIgLz48cmVjdAogICAgICAgeD0iMjguMTc0OTk5IgogICAgICAgeT0iMjguMDYyNSIKICAgICAgIGNsYXNzPSJzdDIiCiAgICAgICB3aWR0aD0iMTMuOCIKICAgICAgIGhlaWdodD0iMTMuOCIKICAgICAgIGlkPSJyZWN0NzUxIgogICAgICAgc3R5bGU9ImZpbGw6IzNlYWY0ZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4xODIxMDAwNjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQiIC8+PC9nPjwvc3ZnPg==')";
            }

            if (document.getElementsByClassName(my_color + " queen")[right_queen] != undefined) {
                document.getElementsByClassName(my_color + " queen")[right_queen].style.backgroundImage =
                "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCA0NSA0NSIKICAgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ3aGl0ZV9xdWVlbl9zcXVhcmUuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjMgKDI0MDU1NDYsIDIwMTgtMDMtMTEpIj48bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyODMiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PGRjOnRpdGxlPjwvZGM6dGl0bGU+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnMyODEiIC8+PHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODUzIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMjUiCiAgICAgaWQ9Im5hbWVkdmlldzI3OSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9IjIyLjk2NjE4IgogICAgIGlua3NjYXBlOmN5PSIyMi42NzE5NTEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjY3IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNyIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkxheWVyXzEiIC8+PHN0eWxlCiAgICAgdHlwZT0idGV4dC9jc3MiCiAgICAgaWQ9InN0eWxlMjYyIj4uc3Qwe2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lam9pbjpyb3VuZDt9LnN0MXtmaWxsOiNGRkZGRkY7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5zdDJ7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjU7fS5zdDN7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7fS5zdDR7ZmlsbDojM0VBRjRFO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxLjE4MjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO308L3N0eWxlPjxnCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wNTU3MTkxLC00LjYyMTU4OThlLTQpIgogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQiCiAgICAgaWQ9ImcxNDkiPjxwYXRoCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgZD0ibSA4LDEyIGEgMiwyIDAgMSAxIC00LDAgMiwyIDAgMSAxIDQsMCB6IE0gMjQuNSw3LjUgYSAyLDIgMCAxIDEgLTQsMCAyLDIgMCAxIDEgNCwwIHogTSA0MSwxMiBhIDIsMiAwIDEgMSAtNCwwIDIsMiAwIDEgMSA0LDAgeiBNIDE2LDguNSBhIDIsMiAwIDEgMSAtNCwwIDIsMiAwIDEgMSA0LDAgeiBNIDMzLDkgYSAyLDIgMCAxIDEgLTQsMCAyLDIgMCAxIDEgNCwwIHoiCiAgICAgICBpZD0icGF0aDE0MSIgLz48cGF0aAogICAgICAgc3R5bGU9InN0cm9rZS1saW5lY2FwOmJ1dHQiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgZD0ibSA5LDI2IGMgOC41LC0xLjUgMjEsLTEuNSAyNywwIEwgMzgsMTQgMzEsMjUgViAxMSBsIC01LjUsMTMuNSAtMywtMTUgLTMsMTUgLTUuNSwtMTQgViAyNSBMIDcsMTQgWiIKICAgICAgIGlkPSJwYXRoMTQzIiAvPjxwYXRoCiAgICAgICBzdHlsZT0ic3Ryb2tlLWxpbmVjYXA6YnV0dCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBkPSJtIDksMjYgYyAwLDIgMS41LDIgMi41LDQgMSwxLjUgMSwxIDAuNSwzLjUgLTEuNSwxIC0xLjUsMi41IC0xLjUsMi41IC0xLjUsMS41IDAuNSwyLjUgMC41LDIuNSA2LjUsMSAxNi41LDEgMjMsMCAwLDAgMS41LC0xIDAsLTIuNSAwLDAgMC41LC0xLjUgLTEsLTIuNSAtMC41LC0yLjUgLTAuNSwtMiAwLjUsLTMuNSAxLC0yIDIuNSwtMiAyLjUsLTQgLTguNSwtMS41IC0xOC41LC0xLjUgLTI3LDAgeiIKICAgICAgIGlkPSJwYXRoMTQ1IiAvPjxwYXRoCiAgICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIGQ9Ik0gMTEuNSwzMCBDIDE1LDI5IDMwLDI5IDMzLjUsMzAgTSAxMiwzMy41IGMgNiwtMSAxNSwtMSAyMSwwIgogICAgICAgaWQ9InBhdGgxNDciIC8+PC9nPjxyZWN0CiAgICAgeD0iMjguNDI0OTk5IgogICAgIHk9IjI4LjA2MjUiCiAgICAgY2xhc3M9InN0NCIKICAgICB3aWR0aD0iMTMuOCIKICAgICBoZWlnaHQ9IjEzLjgiCiAgICAgaWQ9InJlY3QyNzYiCiAgICAgc3R5bGU9ImZpbGw6IzNlYWY0ZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS4xODIxMDAwNjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQiIC8+PC9zdmc+')";
            }
        } else {
            left_rook = 1, left_knight = 1, right_rook = 0, right_knight = 0;

            if (document.getElementsByClassName(my_color + " rook")[right_rook] != undefined) {
                document.getElementsByClassName(my_color + " rook")[right_rook].style.backgroundImage =
                "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCA0NSA0NSIKICAgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBzb2RpcG9kaTpkb2NuYW1lPSJibGFja19yb29rLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45Mi4zICgyNDA1NTQ2LCAyMDE4LTAzLTExKSI+PG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNDgxIj48cmRmOlJERj48Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcwogICAgIGlkPSJkZWZzNDc5IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg1MyIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlkPSJuYW1lZHZpZXc0NzciCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjE2IgogICAgIGlua3NjYXBlOmN4PSIyMi41ODQyMjYiCiAgICAgaW5rc2NhcGU6Y3k9IjIxLjgxNDQ1MyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNjciCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI3IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSIgLz48c3R5bGUKICAgICB0eXBlPSJ0ZXh0L2NzcyIKICAgICBpZD0ic3R5bGU0NjIiPi5zdDB7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5zdDF7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTt9LnN0MntmaWxsOm5vbmU7c3Ryb2tlOiNFQ0VDRUM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7fS5zdDN7ZmlsbDojM0VBRjRFO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxLjE4MjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO308L3N0eWxlPjxnCiAgICAgaWQ9Imc0NzIiPjxwYXRoCiAgICAgICBjbGFzcz0ic3QwIgogICAgICAgZD0iTTksMzloMjd2LTNIOVYzOXogTTEyLjUsMzJsMS41LTIuNWgxN2wxLjUsMi41SDEyLjV6IE0xMiwzNnYtNGgyMXY0SDEyeiIKICAgICAgIGlkPSJwYXRoNDY0IiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QxIgogICAgICAgZD0iTTE0LDI5LjV2LTEzaDE3djEzSDE0eiIKICAgICAgIGlkPSJwYXRoNDY2IiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QwIgogICAgICAgZD0iTTE0LDE2LjVMMTEsMTRoMjNsLTMsMi41SDE0eiBNMTEsMTRWOWg0djJoNVY5aDV2Mmg1VjloNHY1SDExeiIKICAgICAgIGlkPSJwYXRoNDY4IiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QyIgogICAgICAgZD0iTTEyLDM1LjVoMjEgTTEzLDMxLjVoMTkgTTE0LDI5LjVoMTcgTTE0LDE2LjVoMTcgTTExLDE0aDIzIgogICAgICAgaWQ9InBhdGg0NzAiIC8+PC9nPjxyZWN0CiAgICAgeD0iMjguNDg3NDk5IgogICAgIHk9IjI4LjMxMjUiCiAgICAgY2xhc3M9InN0MyIKICAgICB3aWR0aD0iMTMuOCIKICAgICBoZWlnaHQ9IjEzLjgiCiAgICAgaWQ9InJlY3Q0NzQiCiAgICAgc3R5bGU9ImZpbGw6IzNlYWY0ZTtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MS4xODIxMDAwNjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQiIC8+PC9zdmc+')";
            }

            if (document.getElementsByClassName(my_color + " knight")[right_knight] != undefined) {
                document.getElementsByClassName(my_color + " knight")[right_knight].style.backgroundImage =
                "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCA0NSA0NSIKICAgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBzb2RpcG9kaTpkb2NuYW1lPSJibGFja19rbmlnaHQuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjMgKDI0MDU1NDYsIDIwMTgtMDMtMTEpIj48bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE4NDAiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnM4MzgiIC8+PHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxODUzIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMjUiCiAgICAgaWQ9Im5hbWVkdmlldzgzNiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9IjIyLjUiCiAgICAgaW5rc2NhcGU6Y3k9IjIxLjk4NTg0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI2NyIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjciCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIiAvPjxzdHlsZQogICAgIHR5cGU9InRleHQvY3NzIgogICAgIGlkPSJzdHlsZTgyMSI+LnN0MHtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9LnN0MXtmaWxsOiNFQ0VDRUM7c3Ryb2tlOiNFQ0VDRUM7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5zdDJ7ZmlsbDojRUNFQ0VDO30uc3Qze2ZpbGw6IzNFQUY0RTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MS4xODIxO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9PC9zdHlsZT48ZwogICAgIGlkPSJnODMxIj48cGF0aAogICAgICAgY2xhc3M9InN0MCIKICAgICAgIGQ9Ik0yMiwxMGMxMC41LDEsMTYuNSw4LDE2LDI5SDE1YzAtOSwxMC02LjUsOC0yMSIKICAgICAgIGlkPSJwYXRoODIzIiAvPjxwYXRoCiAgICAgICBjbGFzcz0ic3QwIgogICAgICAgZD0iTTI0LDE4YzAuNCwyLjktNS41LDcuNC04LDljLTMsMi0yLjgsNC4zLTUsNGMtMS0wLjksMS40LTMsMC0zYy0xLDAsMC4yLDEuMi0xLDJjLTEsMC00LDEtNC00YzAtMiw2LTEyLDYtMTJzMS45LTEuOSwyLTMuNWMtMC43LTEtMC41LTItMC41LTNjMS0xLDMsMi41LDMsMi41aDJjMCwwLDAuOC0yLDIuNS0zYzEsMCwxLDMsMSwzIgogICAgICAgaWQ9InBhdGg4MjUiIC8+PHBhdGgKICAgICAgIGNsYXNzPSJzdDEiCiAgICAgICBkPSJNOS41LDI1LjVDOS41LDI1LjgsOS4zLDI2LDksMjZzLTAuNS0wLjItMC41LTAuNVM4LjcsMjUsOSwyNVM5LjUsMjUuMiw5LjUsMjUuNXogTTE0LjksMTUuN2MtMC40LDAuNy0wLjksMS4yLTEuMiwxLjFjLTAuMi0wLjEtMC4xLTAuOCwwLjMtMS41YzAsMCwwLDAsMCwwYzAuNC0wLjcsMC45LTEuMiwxLjItMS4xQzE1LjUsMTQuMywxNS40LDE1LDE0LjksMTUuN0MxNC45LDE1LjcsMTQuOSwxNS43LDE0LjksMTUuN3oiCiAgICAgICBpZD0icGF0aDgyNyIgLz48cGF0aAogICAgICAgY2xhc3M9InN0MiIKICAgICAgIGQ9Ik0yNC41LDEwLjRsLTAuNSwxLjRsMC41LDAuMWMzLjEsMSw1LjYsMi41LDcuOSw2LjhzMy4zLDEwLjMsMi44LDIwLjJsMCwwLjVoMi4zbDAtMC41YzAuNS0xMC4xLTAuOS0xNi44LTMuMy0yMS4zcy01LjgtNi42LTkuMi03LjJDMjUuMSwxMC41LDI0LjYsMTAuNCwyNC41LDEwLjR6IgogICAgICAgaWQ9InBhdGg4MjkiIC8+PC9nPjxyZWN0CiAgICAgeD0iMjguODYyNDk5IgogICAgIHk9IjI4LjM3NSIKICAgICBjbGFzcz0ic3QzIgogICAgIHdpZHRoPSIxMy44IgogICAgIGhlaWdodD0iMTMuOCIKICAgICBpZD0icmVjdDgzMyIKICAgICBzdHlsZT0iZmlsbDojM2VhZjRlO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDoxLjE4MjEwMDA2O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIgLz48L3N2Zz4=')";
            }
            if (document.getElementsByClassName(my_color + " queen")[right_queen] != undefined) {
                document.getElementsByClassName(my_color + " queen")[right_queen].style.backgroundImage =
                "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iTGF5ZXJfMSIKICAgeD0iMHB4IgogICB5PSIwcHgiCiAgIHZpZXdCb3g9IjAgMCA0NSA0NSIKICAgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUgNDU7IgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBzb2RpcG9kaTpkb2NuYW1lPSJibGFja19xdWVlbl9zcXVhcmUuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkyLjMgKDI0MDU1NDYsIDIwMTgtMDMtMTEpIj48bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzODIxIj48cmRmOlJERj48Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPjxkYzp0aXRsZT48L2RjOnRpdGxlPjwvY2M6V29yaz48L3JkZjpSREY+PC9tZXRhZGF0YT48ZGVmcwogICAgIGlkPSJkZWZzMzgxOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE4NTMiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAyNSIKICAgICBpZD0ibmFtZWR2aWV3MzgxNyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9IjIyLjUiCiAgICAgaW5rc2NhcGU6Y3k9IjIxLjk4NTg0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI2NyIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjciCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJMYXllcl8xIiAvPjxzdHlsZQogICAgIHR5cGU9InRleHQvY3NzIgogICAgIGlkPSJzdHlsZTM4MDIiPi5zdDB7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5zdDF7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEuNTt9LnN0MntmaWxsOm5vbmU7c3Ryb2tlOiNFQ0VDRUM7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7fS5zdDN7ZmlsbDojM0VBRjRFO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxLjE4MjE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO308L3N0eWxlPjxnCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTllLTgsMC4yMTU5MDIpIgogICAgIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MS41O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZCIKICAgICBpZD0iZzM5MTEiPjxnCiAgICAgICBzdHlsZT0ic3Ryb2tlOm5vbmUiCiAgICAgICBpZD0iZzM5MDEiPjxjaXJjbGUKICAgICAgICAgY3g9IjYiCiAgICAgICAgIGN5PSIxMiIKICAgICAgICAgcj0iMi43NSIKICAgICAgICAgaWQ9ImNpcmNsZTM4OTEiIC8+PGNpcmNsZQogICAgICAgICBjeD0iMTQiCiAgICAgICAgIGN5PSI5IgogICAgICAgICByPSIyLjc1IgogICAgICAgICBpZD0iY2lyY2xlMzg5MyIgLz48Y2lyY2xlCiAgICAgICAgIGN4PSIyMi41IgogICAgICAgICBjeT0iOCIKICAgICAgICAgcj0iMi43NSIKICAgICAgICAgaWQ9ImNpcmNsZTM4OTUiIC8+PGNpcmNsZQogICAgICAgICBjeD0iMzEiCiAgICAgICAgIGN5PSI5IgogICAgICAgICByPSIyLjc1IgogICAgICAgICBpZD0iY2lyY2xlMzg5NyIgLz48Y2lyY2xlCiAgICAgICAgIGN4PSIzOSIKICAgICAgICAgY3k9IjEyIgogICAgICAgICByPSIyLjc1IgogICAgICAgICBpZD0iY2lyY2xlMzg5OSIgLz48L2c+PHBhdGgKICAgICAgIHN0eWxlPSJzdHJva2UtbGluZWNhcDpidXR0IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIGQ9Im0gOSwyNiBjIDguNSwtMS41IDIxLC0xLjUgMjcsMCBMIDM4LjUsMTMuNSAzMSwyNSAzMC43LDEwLjkgMjUuNSwyNC41IDIyLjUsMTAgMTkuNSwyNC41IDE0LjMsMTAuOSAxNCwyNSA2LjUsMTMuNSBaIgogICAgICAgaWQ9InBhdGgzOTAzIiAvPjxwYXRoCiAgICAgICBzdHlsZT0ic3Ryb2tlLWxpbmVjYXA6YnV0dCIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBkPSJtIDksMjYgYyAwLDIgMS41LDIgMi41LDQgMSwxLjUgMSwxIDAuNSwzLjUgLTEuNSwxIC0xLjUsMi41IC0xLjUsMi41IC0xLjUsMS41IDAuNSwyLjUgMC41LDIuNSA2LjUsMSAxNi41LDEgMjMsMCAwLDAgMS41LC0xIDAsLTIuNSAwLDAgMC41LC0xLjUgLTEsLTIuNSAtMC41LC0yLjUgLTAuNSwtMiAwLjUsLTMuNSAxLC0yIDIuNSwtMiAyLjUsLTQgLTguNSwtMS41IC0xOC41LC0xLjUgLTI3LDAgeiIKICAgICAgIGlkPSJwYXRoMzkwNSIgLz48cGF0aAogICAgICAgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpidXR0IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIGQ9Im0gMTEsMzguNSBhIDM1LDM1IDEgMCAwIDIzLDAiCiAgICAgICBpZD0icGF0aDM5MDciIC8+PHBhdGgKICAgICAgIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNlY2VjZWMiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgZD0ibSAxMSwyOSBhIDM1LDM1IDEgMCAxIDIzLDAgbSAtMjEuNSwyLjUgaCAyMCBtIC0yMSwzIGEgMzUsMzUgMSAwIDAgMjIsMCBtIC0yMywzIGEgMzUsMzUgMSAwIDAgMjQsMCIKICAgICAgIGlkPSJwYXRoMzkwOSIgLz48L2c+PHJlY3QKICAgICB4PSIyOC4zNjI0OTkiCiAgICAgeT0iMjguMjUiCiAgICAgY2xhc3M9InN0MyIKICAgICB3aWR0aD0iMTMuOCIKICAgICBoZWlnaHQ9IjEzLjgiCiAgICAgaWQ9InJlY3QzODE0IgogICAgIHN0eWxlPSJmaWxsOiMzZWFmNGU7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjEuMTgyMTAwMDY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kIiAvPjwvc3ZnPg==')";
            }
        }
    }

    let moveSomething = function() {

        let mouseEvent = function(type, x, y) {
            let e = new MouseEvent(type, {view: window, bubbles: true, cancelable: false,
                                          clientX: x, clientY: y});
            lichess_board.dispatchEvent(e);
        }

        // transforms screen coordinates to board logical coordinates (top left is 0, 0).
        let get_board_coords = function(screen_x, screen_y) {
            const x = Math.floor((screen_x - board_rect.left) / board_rect.width * 8);
            const y = Math.floor((screen_y - board_rect.top) / board_rect.height * 8);

            return [x, y]
        }

        // calculates logical coordinates of the piece
        let get_piece_coords = function(rect) {
            const x = (rect.left + rect.right) / 2, y = (rect.top + rect.bottom) / 2;
            return get_board_coords(x, y)
        }

        // find the first piece matching the criterio
        let find_piece = function(reverse_order, is_suitable) {
            const cls = `${my_color} ${piece}`;
            const pieces = lichess_board.getElementsByClassName(cls);

            const start = (reverse_order ? pieces.length - 1 : 0);
            const end = (reverse_order ? -1 : pieces.length);
            const delta = (reverse_order ? -1 : 1);

            for (let idx = start; idx != end; idx += delta) {
                const [a, b] = get_piece_coords(pieces[idx].getBoundingClientRect());

                if ((a != x || b != y) && is_suitable(a, b)) {
                    return [true, a, b];
                }
            }

            return [false, 0, 0];
        };

        // find the piece that can be moved here
        let find_legal_move = function() {
            if (move === 'pawn') {
                return find_piece(false, (a, b) => {
                    return a == x && (b == y + 1 || b == y + 2);
                });
            } else if (move === 'pawnl') {
                return find_piece(false, (a, b) => {
                    return a == x + 1 && b == y + 1;
                });
            } else if (move === 'pawnr') {
                return find_piece(false, (a, b) => {
                    return a == x - 1 && b == y + 1;
                });
            } else if (piece === 'knight') {
                return find_piece((move === 'knightr') ^ (my_color === 'black'), (a, b) => {
                    const d1 = Math.round(Math.abs(a - x)), d2 = Math.round(Math.abs(b - y));
                    return (d1 == 1 && d2 == 2) || (d1 == 2 && d2 == 1);
                });
            } else if (piece === 'rook') {
                return find_piece((move === 'rookr') ^ (my_color === 'black'), (a, b) => {
                    return (a == x || b == y);
                });
            } else if (move === 'bishop') {
                return find_piece(false, (a, b) => {
                    return Math.round(Math.abs(a - x)) == Math.round(Math.abs(b - y));
                });
            } else if (move === 'queen') {
                return find_piece((move === 'queen2'), (a, b) => {
                    return (a == x || b == y ||
                           Math.round(Math.abs(a - x)) == Math.round(Math.abs(b - y)));
                });
            } else if (move === 'king') {
                return find_piece(false, (a, b) => true);
            }

            return [false, 0, 0];
        }


        let lichess_board = document.getElementsByTagName('cg-board');

        if (lichess_board.length != 1) { // || menu_active) {
            return;
        } else {
            lichess_board = lichess_board[0];
        }

        const board_rect = lichess_board.getBoundingClientRect();
        const square_size = board_rect.height / 8;

        if (mouse_x < board_rect.left || mouse_x >= board_rect.right ||
            mouse_y < board_rect.top || mouse_y >= board_rect.bottom) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();


        const [x, y] = get_board_coords(mouse_x, mouse_y);

        const move = key2move.get(current_key);
        const piece = move2piece[move];

        let [found, piece_x, piece_y] = find_legal_move();

        if (found) {
            const rel_x = piece_x - x, rel_y = piece_y - y;

            mouseEvent('mousedown', mouse_x + rel_x * square_size, mouse_y + rel_y * square_size);
            mouseEvent('mouseup', mouse_x + rel_x * square_size, mouse_y + rel_y * square_size);

            mouseEvent('mousedown', mouse_x, mouse_y);
            mouseEvent('mouseup', mouse_x, mouse_y);
        }
    };

    let mouseMove = function(e) {
        mouse_x = e.clientX;
        mouse_y = e.clientY;

        if (current_key) {
            moveSomething();
        }
    };

    let keyDown = function(event) {
        const key = event.key.toLowerCase();
        if (!key2move.has(key)) {
            return;
        }

        current_key = key;
        moveSomething();
    };

    let keyUp = function(event) {
        current_key = undefined;
    }


    let generateConfigMenu = function(event) {
        let container = document.createElement("div");
        let main_wrap = document.getElementById("main-wrap");

        main_wrap.appendChild(container);
        container.innerHTML = `
            <div id="container">
                <button id="show_btn">Keys</button>
                <div id="pieces">
                    <summary>Hover the cursor over a destination square and press a corresponding key</summary>
                </div>
            </div>`;

        const show_btn = document.getElementById("show_btn");
        const pieces = document.getElementById("pieces");
        const summary = document.getElementsByTagName("summary")[0];

        let invertMapping = function(map) {
            return new Map(Array.from(map, pair => pair.reverse()));
        }

        let current_bindings = invertMapping(key2move);
        let all_inputs = new Map();


        let configKeyDown = function(event) {
            event.preventDefault();
            const key = event.key.toLowerCase();
            const input_id = this.id;
            const move = input_id.substr(4);

            document.getElementById(input_id).value = (key === ' ') ? 'space' : key;
            current_bindings.set(move, key);

            // check for conflicts
            const unique_vals = new Set(Array.from(current_bindings, ([move, key]) => key));

            // if there are conflicts, mark them
            if (unique_vals.size !== current_bindings.size) {
                let used_keys = new Map();

                current_bindings.forEach((key, move) => {
                    if (used_keys.has(key)) {
                        all_inputs.get(move).style.backgroundColor = "#971400";
                        all_inputs.get(used_keys.get(key)).style.backgroundColor = "#971400";
                    } else {
                        all_inputs.get(move).style.backgroundColor = "#636064";
                    }

                    used_keys.set(key, move);
                });

                summary.innerText = "Please make sure you use a unique key for each piece";
                summary.style.color = "red";
            } else {
                // save new bindings and set the background to normal
                all_inputs.forEach((input, move) => {
                    input.style.backgroundColor = "#636064";
                });

                key2move = invertMapping(current_bindings);
                save_config();

                summary.innerText = "Hover the cursor over a destination square and press a corresponding key";
                summary.style.color = "#b6a9b9";
            }
        }

        for (const move of moves) {
            let label = document.createElement('label');
            label.innerText = readable_names[move];
            pieces.insertBefore(label, summary);

            let input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('value', read_kb_mapping(move));
            input.setAttribute('id', 'key_' + move);
            input.setAttribute('class', 'key_mapping');
            input.addEventListener("keydown", configKeyDown, false);
            pieces.insertBefore(input, summary);
            all_inputs.set(move, input);
        }

        show_btn.addEventListener("click", function (e) {
            e.preventDefault();
            menu_active = !menu_active;
            show_btn.blur();

            if (!menu_active) {
                show_btn.innerText = "Keys";
                pieces.style.display = "none";
            } else {
                show_btn.innerText = "Hide";
                pieces.style.display = "block";
            }
        });
    }


    // console.log('lichess keyboard extension loaded');
    read_config();

    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", keyUp, false);
    document.addEventListener("mousemove", mouseMove, false);


    const observer = new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].tagName && mutation.addedNodes[0].tagName === 'CG-BOARD') {
                my_color = get_color();
                // console.log('added new board, color is', my_color);
                mark_doubled_pieces();
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    generateConfigMenu();
};

(function() {
    "use strict";
    let nonce, src, text;
    let activate = true;

    const observer = new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].tagName && mutation.addedNodes[0].tagName.toLowerCase() === 'script') {
                let script = mutation.addedNodes[0];

                if (script.src.endsWith('chessground.min.js') || script.src.endsWith('analysisBoard.min.js')) {
                    activate = false;
                }

                if (activate) {
                    if (src === undefined && script.src !== '' && !script.src.endsWith('lichess.min.js')) {
                        src = script.src;
                        script.parentElement.removeChild(script);
                    } else if (src !== undefined && script.src === '') {
                        nonce = script.getAttribute('nonce');
                        text = script.innerText;
                        script.parentElement.removeChild(script)
                        observer.disconnect();
                        finishLoading();
                    }
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
})();
