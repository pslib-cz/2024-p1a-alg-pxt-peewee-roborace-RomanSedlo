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
let speed: number = 200;
let vojta: number = 1.4; //speed divider
let knedlik: number = 40;
let onLine: boolean;

function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}

function ramp(speed: number, invert?: boolean): number {
    if(invert){
        speed -= 20
    } else speed += 20
    return speed
}

function determineOnLine(ir: data, onL: boolean) {
    if (ir.c === 1) {
        onL = true
    } else if (ir.r === 0 && ir.l === 1 && ir.c === 0) {
        onL = false
    } else if (ir.r === 1 && ir.l === 0 && ir.c === 0) {
        onL = false
    }
}

function followLine(ir: data, onL: boolean) {
    if (ir.c === 1 && ir.l === 0 && ir.r === 0) {
        if(onL) {
            basic.showString("C", 0)
            PCAmotor.MotorRun(PCAmotor.Motors.M1, speed)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -speed)
        }
    } else if (ir.r === 0 && ir.l === 1 && ir.c === 0) {
        if(!onL){
            knedlik = ramp(knedlik)
            basic.showString("L", 0)
            PCAmotor.MotorRun(PCAmotor.Motors.M1, -knedlik)
            knedlik = ramp(knedlik, true)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -speed - vojta * knedlik)
        }
    } else if (ir.r === 1 && ir.l === 0 && ir.c === 0) {
        if(!onL){
            knedlik = ramp(knedlik)
            basic.showString("R", 0)
            PCAmotor.MotorRun(PCAmotor.Motors.M1, speed - vojta * knedlik)
            knedlik = ramp(knedlik, true)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, knedlik)
        }
        
    }
}


basic.forever(function () {
    dataPack = readIR();

    followLine(dataPack, onLine)
    basic.pause(40)
})
