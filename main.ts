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
let speed = 120;
let vojta = 1; //speed divider

function readIR(): data {
    return {
        c: pins.digitalReadPin(IR.c),
        r: pins.digitalReadPin(IR.r),
        l: pins.digitalReadPin(IR.l)
    };
}

basic.forever(function () {
    dataPack = readIR();
    

    
    basic.pause(40)
})
