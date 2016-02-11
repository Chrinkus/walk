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
