namespace SpriteKind {
    export const BAR = SpriteKind.create()
}
/**
 * based on http://www.extentofthejam.com/pseudo/
 */
function nextCurve () {
    if (0 != remainingLaps && remainingLaps != 0) {
        if (trackTurns.length >= currentCurve) {
            currentCurve += 1
        } else {
            currentCurve = 0
            remainingLaps += -1
        }
    } else {
        game.over(true)
    }
    return (trackTurns[currentCurve] - 1) * 7
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    if (barStatus == "Coin") {
        info.changeScoreBy(200)
    } else if (barStatus == "Shell") {
        projectile = sprites.createProjectileFromSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . 7 7 6 6 7 7 . . . . . 
            . . . . 6 6 6 7 7 6 6 6 . . . . 
            . . . 6 7 7 7 6 6 7 7 7 6 . . . 
            . . 7 7 6 6 6 7 7 6 6 6 7 7 . . 
            . . 1 6 7 7 7 6 6 7 7 7 6 1 . . 
            . . f 1 1 1 1 1 1 1 1 1 1 f . . 
            . . f d b d d f f d d b d d . . 
            . . . d b d d f f d d b d . . . 
            . . . . d b d d b d b d . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, car, 0, -50)
    }
    barStatus = "Empty"
})
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    carScreenX += 2
})
controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
	
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    if (barStatus == "Empty") {
        if (Math.percentChance(75)) {
            barStatus = "Shell"
        } else {
            barStatus = "Coin"
        }
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.destroy()
    speed = 200
    scene.cameraShake(5, 100)
})
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    carScreenX += -2
})
let mySprite: Sprite = null
let projectile: Sprite = null
let speed = 0
let car: Sprite = null
let remainingLaps = 0
let trackTurns: number[] = []
let z = 0
let barStatus = ""
let currentCurve = 0
let obstacles: Sprite[] = []
let nextObstactle = 0
let carX = 0
let segPos = 0
let botSegDx = 0
let segDx = 0
let off = 0
let xOff: number[] = []
let zArr: number[] = []
let scaleArr: number[] = []
let horizon = 80
let y_w = -10000
let player_pos = 115
currentCurve = 0
let scale = -256 * (y_w / (horizon - 5))
let mySprite2 = sprites.create(img`
    . b b b b b b b b b b b b b b . 
    b c c c c c c c c c c c c c c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c f f f f f f f f f f f f c b 
    b c c c c c c c c c c c c c c b 
    . b b b b b b b b b b b b b b . 
    `, SpriteKind.BAR)
barStatus = "Empty"
for (let i = 0; i <= horizon - 1; i++) {
    z = y_w / (i - horizon)
    scaleArr.push((scale / z) | 0)
    zArr.push(z | 0)
    xOff.push(0)
}
let obstImg = [img`
    5 
    `, img`
    e 5 
    5 5 
    `, img`
    . e e . 
    . 5 5 . 
    . 5 5 . 
    5 5 5 5 
    `, img`
    . . . e e . . . 
    . . . 5 5 . . . 
    . . . 5 5 . . . 
    . . . 5 5 . . . 
    . . . 5 5 5 . . 
    . . 5 5 5 5 . . 
    . 5 5 5 5 5 5 . 
    5 5 . 5 5 . 5 5 
    `, img`
    . . . . . . e e e e . . . . . . 
    . . . . . . e e e e . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . . 5 5 5 5 . . . . . . 
    . . . . . 5 5 5 5 5 5 . . . . . 
    . . . . . 5 5 d 5 d 5 5 . . . . 
    . . . . 5 5 5 d 5 d 5 5 . . . . 
    . . 5 5 5 5 5 d 5 d 5 5 5 . . . 
    . 5 5 5 5 5 d 5 5 d 5 5 5 5 . . 
    5 5 5 5 5 d 5 5 5 5 d 5 5 5 5 5 
    `]
let carLeft = img`
    . . . . . . . . . . . . . . . . 
    . . . . . e e e e e . . . . . . 
    . . . . . d d e e e . . . . . . 
    . . . . . f d d e e . . . . . . 
    . . . . . d d d e e . . . . . . 
    . . . . . d d d d d . . . . . . 
    . . . . . f f f f f . . . . . . 
    . . . . f f f f f f f f . . . . 
    . . . f f f f f f f f f . . . . 
    . . . f f f f f f f f f . . . . 
    . . . f f f f f f f f f . . . . 
    . . . . f f 1 1 1 1 1 f . . . . 
    . . . b b 1 f f f f f 1 . . . . 
    . . f f f 1 f b b b f 1 f . . . 
    . . f f f 1 f f f f f 1 f . . . 
    . . . f f b 1 1 1 1 1 b f . . . 
    `
let carRight = carLeft.clone()
carRight.flipX()
let carFwd = img`
    . . . . . . . . . . . . . . . . 
    . . . . . e e e e e . . . . . . 
    . . . . . e e e e e . . . . . . 
    . . . . . e e e e e . . . . . . 
    . . . . . e e e e e . . . . . . 
    . . . . . d d d d d . . . . . . 
    . . . . . f f f f f . . . . . . 
    . . . f f f f f f f f f . . . . 
    . . . f f f f f f f f f . . . . 
    . . . f f f f f f f f f . . . . 
    . . . f f f f f f f f f . . . . 
    . . . f f 1 1 1 1 1 f f . . . . 
    . . . . 1 f f f f f 1 . . . . . 
    . . f f 1 f b b b f 1 f f . . . 
    . . f f 1 f f f f f 1 f f . . . 
    . . f f b 1 1 1 1 1 b f f . . . 
    `
trackTurns = [
1,
1,
1,
1,
2,
0,
2,
2,
0,
2,
2,
0,
0,
2,
2,
1,
1,
1,
2
]
remainingLaps = 3
game.stats = true
car = sprites.create(carFwd, SpriteKind.Player)
let carScreenX = 80
let carScreenY = 110
speed = 300
class ObstactlePos {
    constructor(public x: number, public z: number) { }
}
game.onPaint(function () {
    const cdx = controller.dx(30000)// shifted by 8 bits!
    if (cdx < 0) car.setImage(carLeft)
    else if (cdx > 0) car.setImage(carRight)
    else car.setImage(carFwd)
    carX += -cdx
    let ddx = 0
    off += (game.eventContext().deltaTime * speed) | 0
    const endPos = horizon - 4
    if (off >= nextObstactle && obstacles.length < 5) {
        const sp = sprites.create(sprites.space.spaceSmallAsteroid0, SpriteKind.Enemy)
        sp.data = new ObstactlePos(Math.randomRange(-30, 30),
            zArr[endPos - 1] + off)
        obstacles.push(sp)
        nextObstactle = off + Math.randomRange(300, 400)
    }
    info.setScore(off)
    let x = carX | 0
    const segPosI = segPos | 0
    for (let j = 0; j < endPos; ++j) {
        const dx = (j < segPosI) ? botSegDx : segDx
        ddx += dx
        if (j == 40) carX += 30 * dx
        x += ddx
        xOff[j] = x
    }
    const endX = -xOff[endPos - 1]
    let obstIdx = 0
    for (let k = 0; k < endPos; ++k) {
        xOff[k] += Math.idiv(endX * k, endPos)
        while (obstIdx < obstacles.length) {
            const o = obstacles[obstIdx]
            const d = o.data as ObstactlePos
            if (d.z > off + zArr[k])
                break
            if (k == 0) {
                o.destroy()
                obstacles.shift()
            } else {
                o.y = 120 - k
                o.x = (xOff[k] >> 8) + 80 + (scaleArr[k] * d.x >> 8)
                const sz = scaleArr[k] * 20 >> 8
                o.setImage(obstImg[obstImg.length - 1])
                for (let img of obstImg) {
                    if (img.width > sz) {
                        o.setImage(img)
                        break
                    }
                }
                obstIdx++
            }
        }
    }

    for (let l = 0; l < endPos; ++l) {
        let y = 120 - l
        screen.drawRect(0, y, 160, 1, 6)
        const roadW = scaleArr[l] * 140 >> 8
        const roadL = ((160 - roadW) >> 1) + (xOff[l] >> 8)
        screen.drawRect(roadL, y, roadW, 1, 11)
        const sideW = 10 * scaleArr[l] >> 8
        if (sideW) {
            const sideColor = (zArr[l] + off) & 32 ? 1 : 2
            screen.drawRect(roadL, y, sideW, 1, sideColor)
            screen.drawRect(roadL + roadW - sideW, y, sideW, 1, sideColor)
        }
        if (l == 5) {
            if (carScreenX < roadL || carScreenX > roadL + roadW) {
                car.x = carScreenX + Math.randomRange(-1, 1)
                car.y = carScreenY + Math.randomRange(-1, 1)
                speed -= 200 * game.eventContext().deltaTime
            } else {
                car.x = carScreenX
                car.y = carScreenY
                if (cdx == 0)
                    speed += 50 * game.eventContext().deltaTime
                else
                    speed -= 20 * game.eventContext().deltaTime
            }
            speed = Math.clamp(70, 500, speed)
        }
    }

    screen.print((speed | 0) + "km/h", 115, 15)

    segPos += -0.003 * speed
    if (segPos < 0) {
        botSegDx = segDx
        segPos = horizon
        segDx = nextCurve()
    }
})
game.onUpdate(function () {
    controller.configureRepeatEventDefaults(0, 30)
    mySprite2.setPosition(10, 10)
    if (barStatus == "Empty") {
        mySprite2.setImage(img`
            . b b b b b b b b b b b b b b . 
            b c c c c c c c c c c c c c c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c c c c c c c c c c c c c c b 
            . b b b b b b b b b b b b b b . 
            `)
    } else if (barStatus == "Coin") {
        mySprite2.setImage(img`
            . b b b b b b b b b b b b b b . 
            b c c c c c c c c c c c c c c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f 5 5 f f f f f c b 
            b c f f f f 5 5 5 5 f f f f c b 
            b c f f f 5 5 5 4 5 5 f f f c b 
            b c f f f 5 5 5 4 5 5 f f f c b 
            b c f f f 5 5 5 4 5 5 f f f c b 
            b c f f f 5 5 5 4 5 5 f f f c b 
            b c f f f 5 5 5 4 5 5 f f f c b 
            b c f f f 5 5 4 4 5 5 f f f c b 
            b c f f f f 5 5 5 5 f f f f c b 
            b c f f f f f 5 5 f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c c c c c c c c c c c c c c b 
            . b b b b b b b b b b b b b b . 
            `)
    } else if (barStatus == "Shell") {
        mySprite2.setImage(img`
            . b b b b b b b b b b b b b b . 
            b c c c c c c c c c c c c c c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f 6 6 7 7 6 6 f f f c b 
            b c f f 6 7 7 6 6 7 7 6 f f c b 
            b c f 1 7 6 6 7 7 6 6 7 1 f c b 
            b c f d 1 1 1 1 1 1 1 1 d f c b 
            b c f d d d d d d d d d d f c b 
            b c f f d d d d d d d d f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c f f f f f f f f f f f f c b 
            b c c c c c c c c c c c c c c b 
            . b b b b b b b b b b b b b b . 
            `)
    }
})
game.onUpdateInterval(2000, function () {
    for (let value of sprites.allOfKind(SpriteKind.Food)) {
        animation.runMovementAnimation(
        value,
        animation.animationPresets(animation.bobbing),
        500,
        false
        )
    }
})
forever(function () {
    pause(randint(2000, 10000 - speed * 10))
    mySprite = sprites.create(img`
        . . 6 6 6 6 6 6 6 6 6 6 
        . 6 6 9 9 1 1 9 9 9 6 6 
        6 9 6 9 1 1 9 9 9 6 9 6 
        8 8 8 8 8 8 8 8 8 9 9 6 
        8 9 6 9 9 9 9 9 8 9 9 6 
        8 9 6 1 1 1 1 9 8 1 9 6 
        8 9 6 9 9 9 1 9 8 9 1 6 
        8 9 6 9 1 1 1 9 8 1 9 6 
        8 9 6 9 9 9 9 9 8 9 1 6 
        8 9 6 6 1 1 6 6 8 6 6 6 
        8 6 9 9 9 9 9 9 8 9 6 . 
        8 8 8 8 8 8 8 8 8 6 . . 
        `, SpriteKind.Food)
    mySprite.vy = 20
    mySprite.setFlag(SpriteFlag.AutoDestroy, true)
})
