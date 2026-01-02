export const CELL_SIZE = 40; 

export const GAME_STATE = {
    MENU: 0, PLAYING: 1, PAUSED: 2, GAMEOVER: 3, VICTORY: 4
};

export const TOWER_TYPES = {
    ARCHER: { name: 'Arquero', cost: 50, range: 150, damage: 20, fireRate: 40, imgKey: 'archer', projectileColor: '#FFFF00', fallbackColor: 'blue', effect: null, soundType: 'ARCHER' },
    CANNON: { name: 'Cañón', cost: 120, range: 120, damage: 100, fireRate: 120, imgKey: 'cannon', projectileColor: '#000000', fallbackColor: 'black', effect: null, soundType: 'CANNON' },
    ICE: { name: 'Hielo', cost: 80, range: 100, damage: 5, fireRate: 45, imgKey: 'ice', projectileColor: '#00FFFF', fallbackColor: 'cyan', effect: 'FREEZE', soundType: 'ICE' }
};

export const WAVES_CONFIG = [
    { count: 5,  interval: 60, speed: 2, hp: 100 }, 
    { count: 10, interval: 50, speed: 3, hp: 150 }, 
    { count: 15, interval: 40, speed: 4, hp: 300 }, 
    { count: 2,  interval: 100, speed: 1.5, hp: 2000, isBoss: true } 
];

export const SVG_ASSETS = {
    archer: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iMzAiIGZpbGw9IiM4QjQ1MTMiLz48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIGZpbGw9IiNBMDUyMkQiLz48cmVjdCB4PSI4IiB5PSIwIiB3aWR0aD0iNCIgaGVpZ2h0PSI1IiBmaWxsPSIjQTA1MjJEIi8+PHJlY3QgeD0iMTgiIHk9IjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiNBMDUyMkQiLz48cmVjdCB4PSIyOCIgeT0iMCIgd2lkdGg9IjQiIGhlaWdodD0iNSIgZmlsbD0iI0EwNTIyRCIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjUiIGZpbGw9IiMwMDAiLz48L3N2Zz4=`,
    cannon: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMzMzIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEwIiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTSAyMCAyMCBMIDMyIDMyIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+`,
    ice: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBvbHlnb24gcG9pbnRzPSIyMCw1IDM1LDM1IDIwLDMwIDUsMzUiIGZpbGw9IiMwMExMRkYiIHN0cm9rZT0iIzAwNzc3NyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsLW9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjUiIGZpbGw9IiNGRkYiLz48L3N2Zz4=`,
    orc: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTMiIGZpbGw9IiM2QzhFMjMiIHN0cm9rZT0iIzM4NTAxNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMiIgcj0iMyIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNIDEwIDIwIFEgMTUgMjUgMjAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+`,
    boss: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiM4MDAwODAiIHN0cm9rZT0iIzMwMDAzMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTSAxMCAxNSBMIDE1IDIwIEwgMTAgMjUiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNIDMwIDE1IEwgMjUgMjAgTCAzMCAyNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0gMTUgMzAgUSAyMCAzNSAyNSAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=`
};