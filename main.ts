type drivingSignal = {
    x: number;
    y: number;
    z: number
};
type lightDirection = {
    c: DigitalPin;
    r: DigitalPin;
    l: DigitalPin
};
type data = {
    c: number;
    r: number;
    l: number
};

const IR: lightDirection = {
    c: DigitalPin.P15,
    r: DigitalPin.P13,
    l: DigitalPin.P14
};

let expectedSender = -1584843917;
let ready: boolean;
let drivingPackage: drivingSignal;
let dataPack: data = { c: 0, r: 0, l: 0 };
let speed: number = 220;
let eggMan: number = 20;
let vajco: number = 40;
let karelIV: number = vajco * eggMan ;
// tohle muj napad nebyl bro


function driveGo(dataPack: data) {
    if (dataPack.c === 1) {
        
    } else {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, speed)
        PCAmotor.MotorRun(PCAmotor.Motors.M2, speed)
    }
}

pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
pins.digitalReadPin(DigitalPin.P8)
pins.setPull(IR.c, PinPullMode.PullNone)
pins.setPull(IR.r, PinPullMode.PullNone)
pins.setPull(IR.l, PinPullMode.PullNone)

basic.forever(function () {
    dataPack.c = pins.digitalReadPin(IR.c)
    dataPack.r = pins.digitalReadPin(IR.r)
    dataPack.l = pins.digitalReadPin(IR.l)
    driveGo(dataPack)
    basic.pause(20)
})