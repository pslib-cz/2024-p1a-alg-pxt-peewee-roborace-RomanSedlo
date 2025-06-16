radio.setGroup(12)
radio.setTransmitPower(7)
radio.setFrequencyBand(39)
radio.setTransmitSerialNumber(true)

type lightDirection = {
    c: DigitalPin;
    r: DigitalPin;
    l: DigitalPin;
};
type data = {
    c: number;
    r: number;
    l: number;
};

const IR: lightDirection = {
    c: DigitalPin.P15,
    r: DigitalPin.P13,
    l: DigitalPin.P14
};

pins.setPull(IR.c, PinPullMode.PullNone);
pins.setPull(IR.r, PinPullMode.PullNone);
pins.setPull(IR.l, PinPullMode.PullNone);

let dataPack: data = { c: 0, r: 0, l: 0 }
let run: boolean = true;

let defSpeed: number = 160;
let speed: number = defSpeed;
let divider: number = 2;
let less: number = speed / 1.2;

let side: string;

function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}

function followLine(ir: data) {
    if (ir.c === 1 && ir.l === 0 && ir.r === 0 && run) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -defSpeed)
        PCAmotor.MotorRun(PCAmotor.Motors.M4, defSpeed)
    } else if (ir.r === 0 && ir.l === 1 && run) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -(defSpeed - less))
        PCAmotor.MotorRun(PCAmotor.Motors.M4, -(defSpeed / divider))
    } else if (ir.r === 1 && ir.l === 0 && run) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -(defSpeed / divider))
        PCAmotor.MotorRun(PCAmotor.Motors.M4, -(defSpeed - less))
    }
}

function turn90(dir: string, ir: data) {
    if (dir === "left") {
        speed = -defSpeed
    } else if (dir === "right") {
        speed = defSpeed
    }
    PCAmotor.MotorStopAll()
    control.waitMicros(60)
    PCAmotor.MotorRun(PCAmotor.Motors.M1, speed)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, speed)
    while (ir.c === 1 && ir.r === 0 && ir.l === 0) {
        PCAmotor.MotorStopAll()
    }
    run = true
}

radio.onReceivedString(function (receivedString: string) {
    if (receivedString === "run") {
        side = "left"
    }
    if (receivedString === "turn") {
        side = "right"
    }
})

basic.forever(function () {
    dataPack = readIR();
    followLine(dataPack)
    basic.pause(40)
})


