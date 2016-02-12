function Flake(x, s) {
    this.sprite = new Image();
    this.sprite.src = "./snow_flake.png";
    this.x = x;
    this.y = -25;
    this.scale = s;
}

function fillSnow(density) {
    var snow = [];
    var scale = 0;
    for (var i = 0; i < density; i++) {
        if (i % 4 === 0) {
            scale = 0.632;
        } else if (i % 5 === 0) {
            scale = 0.4;
        } else {
            scale = 1;
        }
        snow[i] = new Flake(Math.floor(Math.random() * (775 / scale)), scale);
    }
    return snow;
}

function guster(ms) {
    var index = Math.floor(ms / 100);
    var schedule = [
        1, 1.2, 1.5, 1.9, 2.2, 2.5, 2.7, 2.8, 2.9, 3,
        3, 3, 3, 2.9, 2.9, 2.8, 2.8, 2.7, 2.6, 2.5,
        2.6, 2.8, 3.1, 3.5, 3.9, 4.3, 4.6, 4.8, 4.9, 4.9,
        5, 5, 4.9, 4.8, 4.7, 4.6, 4.4, 4.2, 4, 3.7,
        3.4, 3, 2.6, 2.2, 1.9, 1.6, 1.4, 1.2, 1.1, 1
    ];
    return schedule[index];
}
