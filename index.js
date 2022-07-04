const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        imgOffset = { x: 0, y: 0 },
    }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesEllapsed = 0;
        this.framesHold = 7;
        this.imgOffset = imgOffset;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.imgOffset.x,
            this.position.y - this.imgOffset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();
        this.framesEllapsed++;

        if (this.framesEllapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color,
        offset,
        imageSrc,
        scale = 1,
        framesMax = 1,
        imgOffset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            imgOffset,
        });
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastkey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: attackBox.width,
            height: attackBox.height,
            offset: attackBox.offset,
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesEllapsed = 0;
        this.framesHold = 7;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.imgOffset.x,
            this.position.y - this.imgOffset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();

        if (!this.dead) {
            this.framesEllapsed++;
            if (this.framesEllapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++;
                } else {
                    this.framesCurrent = 0;
                }
            }
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite("attack1");
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;

        if (this.health <= 0) {
            this.switchSprite("death");
        } else this.switchSprite("takeHit");
    }

    switchSprite(sprite) {
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return;

        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return;
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }

        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "attack1":
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "takeHit":
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "death":
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}

//drawing out various items on canvas

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background.png",
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6,
});

const player = new Fighter({
    position: {
        x: 250,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    imgOffset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50,
    },
});

const enemy = new Fighter({
    position: {
        x: 650,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: "./img/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    imgOffset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: "./img/Kenji/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "./img/Kenji/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/Kenji/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/Kenji/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/Kenji/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "./img/Kenji/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "./img/Kenji/Death.png",
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -165,
            y: 50,
        },
        width: 180,
        height: 50,
    },
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    //enemy keys
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

let lastkey;

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector("#displayText").style.display = "flex";
    if (player.health === enemy.health) {
        document.querySelector("#displayText").innerHTML = "ITS A TIE";
    } else if (player.health > enemy.health) {
        document.querySelector("#displayText").innerHTML = "PLAYER 1 WON";
    } else if (player.health < enemy.health) {
        document.querySelector("#displayText").innerHTML = "PLAYER 2 WON";
    }
}

let timer = 60;
let timerId;

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, 0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //player movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastkey === "a" && player.position.x > 0) {
        player.velocity.x = -5;
        player.switchSprite("run");
    } else if (
        keys.d.pressed &&
        player.lastkey === "d" &&
        player.position.x < 1024 - player.width
    ) {
        player.velocity.x = 5;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    //enemy movement
    enemy.velocity.x = 0;
    if (
        keys.ArrowLeft.pressed &&
        enemy.lastkey === "ArrowLeft" &&
        enemy.position.x > 0 - enemy.width
    ) {
        enemy.velocity.x = -5;
        enemy.switchSprite("run");
    } else if (
        keys.ArrowRight.pressed &&
        enemy.lastkey === "ArrowRight" &&
        enemy.position.x < 1024 - enemy.width
    ) {
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    //detect collisions
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to("#enemyHealth", {
            width: enemy.health + "%",
        });
    }

    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to("#playerHealth", {
            width: player.health + "%",
        });
    }
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    //end game (not Avengers)
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener("keydown", (event) => {
    if (player.health > 0) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true;
                player.lastkey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.lastkey = "a";
                break;
            case "w":
                player.velocity.y = -20;
                break;
            case " ":
                player.attack();
                break;
        }
    }
    //enemy keys
    if (enemy.health > 0) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastkey = "ArrowRight";
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastkey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemy.velocity.y = -20;
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
});

window.addEventListener("keyup", (event) => {
    //player key action
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;
    }
    //enemy key action
    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;
        case "ArrowDown":
            enemy.isAttacking = false;
            break;
    }
});