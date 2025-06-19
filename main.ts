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

const IRH: Array<DigitalPin> = [DigitalPin.P1, DigitalPin.P2];

pins.setPull(IR.c, PinPullMode.PullNone);
pins.setPull(IR.r, PinPullMode.PullNone);
pins.setPull(IR.l, PinPullMode.PullNone);
pins.setPull(IRH[0], PinPullMode.PullNone);
pins.setPull(IRH[1], PinPullMode.PullNone);

let dataPack: data = { c: 0, r: 0, l: 0 };
let headData: Array<number> = [0,0]
let run: boolean = true;
let sonicDetect: boolean;

const defSpeed: number = 140;
let speed: number = defSpeed;
let lowSpeed: number = defSpeed - 60
let divider: number = 1.2;
let less: number = defSpeed / 1.6;

const carScale = 250;
const ninetyDigrees = 360;

let side: string = "mid";
let speed2: number;
let liveIR: data = { c: 0, r: 0, l: 0 };
let bool: boolean;

function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}

function runMotors(speed: number, rotate?: boolean) {
    if(rotate) {
        speed2 = speed
    } else speed2 = -speed
    PCAmotor.MotorStopAll()
    control.waitMicros(40)
    PCAmotor.MotorRun(PCAmotor.Motors.M1, speed)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, speed2)
}

function detector(): boolean {
    headData[0] = pins.digitalReadPin(IRH[0])
    headData[1] = pins.digitalReadPin(IRH[1])
    if(headData[0] = 1) {
        basic.showNumber(0)
        bool = true
    } else bool = false
    return bool
}

function followLine(ir: data, sonicBool:boolean) {
    if(run) {
        if (sonicBool) {
            run = false
            PCAmotor.MotorStopAll()
            control.waitMicros(lowSpeed)
            driveAround()
        } else if (ir.c === 1 && ir.l === 0 && ir.r === 0) {
            PCAmotor.MotorRun(PCAmotor.Motors.M1, defSpeed)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -defSpeed)
        } else if (ir.r === 0 && ir.l === 1) {
            PCAmotor.MotorRun(PCAmotor.Motors.M1, -(defSpeed - less))
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -(defSpeed / divider))
        } else if (ir.r === 1 && ir.l === 0) {
            PCAmotor.MotorRun(PCAmotor.Motors.M1, (defSpeed / divider))
            PCAmotor.MotorRun(PCAmotor.Motors.M4, (defSpeed - less))
        } else if (ir.c === 1 && ir.r === 1 && ir.l === 1) {
            run = false
            if(side != "mid") {
                PCAmotor.MotorStopAll()
            }
            control.waitMicros(lowSpeed)
            turn90(side)
        }
    }
}

function turn90(dir: string) {
    if(side === "mid") {
        PCAmotor.MotorStopAll()
        control.waitMicros(40)
        PCAmotor.MotorRun(PCAmotor.Motors.M1, defSpeed)
        PCAmotor.MotorRun(PCAmotor.Motors.M4, -defSpeed)
        basic.pause(400)
    } else {
        if (dir === "left") {
            speed = -defSpeed
        } else if (dir === "right") {
            speed = defSpeed
        }
        runMotors(speed, true)
        basic.pause(250)
        while (true) {
            liveIR = readIR()
            if (!(liveIR.c === 1 && liveIR.r === 0 && liveIR.l === 0)) {
                PCAmotor.MotorStopAll()
                break;
            }
        }
    }
    run = true
}

function driveAround() {
    for(let i :number = 3; i <= 6; i +=1) {
        speed = lowSpeed
        runMotors(speed)
        basic.pause(carScale)

        if(i % 3 === 0) {
            speed = -speed
        } else speed = lowSpeed
        runMotors(speed, true)
        basic.pause(ninetyDigrees)
    }
    PCAmotor.MotorStopAll()
    speed = defSpeed
    run = true
}

radio.onReceivedString(function (receivedString: string) {
    if (receivedString === "run") {
        side = "left"
    }
    if (receivedString === "turn") {
        side = "right"
    }
    if(receivedString === "mid") {
        side = "mid"
    }
})

basic.forever(function () {
    dataPack = readIR();
    sonicDetect = detector()
    followLine(dataPack, sonicDetect)
    basic.pause(18)
})

