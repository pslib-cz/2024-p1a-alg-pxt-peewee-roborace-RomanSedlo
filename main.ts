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

let dataPack: data = {c:0,r:0,l:0}
let speed = 220;

// Read IR sensors
function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}

function followLine(ir: data) {
    if (ir.c === 0 && ir.l === 1 && ir.r === 1) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, speed);
        PCAmotor.MotorRun(PCAmotor.Motors.M2, speed);
    } else if (ir.l === 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, 0);
        PCAmotor.MotorRun(PCAmotor.Motors.M2, speed);
    } else if (ir.r === 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, speed);
        PCAmotor.MotorRun(PCAmotor.Motors.M2, 0);
    } else {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, 0);
        PCAmotor.MotorRun(PCAmotor.Motors.M2, 0);
    }
}


basic.forever(function(){
    let ir = readIR();
    followLine(ir)
    control.waitMicros(10)
})