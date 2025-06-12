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
let vojta = 10;

// Read IR sensors
function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}

function followLine(ir: data) {
    if (ir.c === 1 && ir.l === 0 && ir.r === 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, speed);
        PCAmotor.MotorRun(PCAmotor.Motors.M4, -speed);
    } else if (ir.r === 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, 0);
        PCAmotor.MotorRun(PCAmotor.Motors.M4, -speed / vojta);
    } else if (ir.l === 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, speed / vojta);
        PCAmotor.MotorRun(PCAmotor.Motors.M4, 0);
    } else if (ir.c === 0 && ir.r === 0 && ir.l === 0){
        PCAmotor.MotorRun(PCAmotor.Motors.M1, 0);
        PCAmotor.MotorRun(PCAmotor.Motors.M4, 0);
    }
}


basic.forever(function(){
    dataPack = readIR();
    followLine(dataPack)
    basic.pause(20)
})

