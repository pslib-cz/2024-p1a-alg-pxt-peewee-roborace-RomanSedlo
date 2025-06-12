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

pins.setPull(IR.c, PinPullMode.PullNone);
pins.setPull(IR.r, PinPullMode.PullNone);
pins.setPull(IR.l, PinPullMode.PullNone);

let dataPack: data = { c: 0, r: 0, l: 0 }
let speed: number = 120;
let vojta: number = 1;
let levo: number;
let drevo: number;
let strevo: number;
let karta: number;
let mrbeast: number;
let dislexie: number;

function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}



basic.forever(function () {
    dataPack = readIR();
    
    if(dataPack.r === 1) {
        levo += 10
    }


    

    PCAmotor.MotorRun(PCAmotor.Motors.M1, mrbeast)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, dislexie)

    basic.pause(40)
})
