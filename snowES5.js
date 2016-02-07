function Flake(x) {
    this.sprite = new Image();
    this.sprite.src = "./snow_flake.png";
    this.x = x;
    this.y = -25;
}

function fillSnow(density) {
    var snow = [];
    for (var i = 0; i < density; i++) {
        snow[i] = new Flake(Math.floor(Math.random() * 775));
    }
    return snow;
}
