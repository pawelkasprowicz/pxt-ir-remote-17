
/**
 * IR Remote 17 - NEC infrared remote control
 * for BBC micro:bit V2.
 */
//% color=#D35400 icon="\uf1eb" block="IR Remote 17"
namespace irremote {

    export enum Button {
        //% block="1"
        B1 = 0xA2,
        //% block="2"
        B2 = 0x62,
        //% block="3"
        B3 = 0xE2,
        //% block="4"
        B4 = 0x22,
        //% block="5"
        B5 = 0x02,
        //% block="6"
        B6 = 0xC2,
        //% block="7"
        B7 = 0xE0,
        //% block="8"
        B8 = 0xA8,
        //% block="9"
        B9 = 0x90,
        //% block="*"
        Star = 0x68,
        //% block="0"
        B0 = 0x98,
        //% block="#"
        Hash = 0xB0,
        //% block="▲"
        Up = 0x18,
        //% block="▼"
        Down = 0x4A,
        //% block="◀"
        Left = 0x10,
        //% block="▶"
        Right = 0x5A,
        //% block="OK"
        OK = 0x38
    }

    const EVENT_PRESS = 7100
    const EVENT_RELEASE = 7101
    const EVENT_HOLD = 7102

    let irPin = DigitalPin.P15
    let initialized = false

    let receivedBits = 0
    let receivedData = 0
    let receiving = false

    let lastButton = -1
    let currentButton = -1
    let pressedTime = 0
    let lastSignalTime = 0

    let releaseTimeout = 220
    let holdThreshold = 1000
    let holdTriggered = false

    function validButton(code: number): boolean {
        switch (code) {
            case Button.B1:
            case Button.B2:
            case Button.B3:
            case Button.B4:
            case Button.B5:
            case Button.B6:
            case Button.B7:
            case Button.B8:
            case Button.B9:
            case Button.B0:
            case Button.Star:
            case Button.Hash:
            case Button.Up:
            case Button.Down:
            case Button.Left:
            case Button.Right:
            case Button.OK:
                return true
        }
        return false
    }

    function receiveButton(code: number): void {
        if (!validButton(code)) {
            return
        }

        let now = input.runningTime()
        lastSignalTime = now
        lastButton = code

        if (currentButton != code) {
            if (currentButton != -1) {
                control.raiseEvent(
                    EVENT_RELEASE,
                    currentButton
                )
            }

            currentButton = code
            pressedTime = now
            holdTriggered = false

            control.raiseEvent(
                EVENT_PRESS,
                currentButton
            )
        }
    }

    //% block="IR uruchom odbiornik na pinie %pin"
    //% pin.defl=DigitalPin.P15
    //% group="Odbiornik"
    //% weight=100
    export function init(pin: DigitalPin): void {
        if (initialized) {
            return
        }

        initialized = true
        irPin = pin

        pins.setPull(irPin, PinPullMode.PullNone)

        pins.onPulsed(
            irPin,
            PulseValue.Low,
            function () {
                let duration = pins.pulseDuration()

                if (duration > 8000 &&
                    duration < 10000) {
                    receivedBits = 0
                    receivedData = 0
                    receiving = true
                }

                // NEC repeat frame
                if (duration > 8000 &&
                    duration < 10000) {
                    // Repeat handled by high pulse
                }
            }
        )

        pins.onPulsed(
            irPin,
            PulseValue.High,
            function () {
                let duration = pins.pulseDuration()

                if (duration > 2000 &&
                    duration < 2600 &&
                    currentButton != -1) {
                    lastSignalTime = input.runningTime()
                    return
                }

                if (!receiving) {
                    return
                }

                if (duration > 400 &&
                    duration < 800) {
                    receivedData = receivedData << 1
                    receivedBits++
                } else if (duration > 1300 &&
                    duration < 1900) {
                    receivedData =
                        (receivedData << 1) | 1
                    receivedBits++
                }

                if (receivedBits == 32) {
                    let command =
                        (receivedData >> 8) & 0xFF

                    receiveButton(command)

                    receivedBits = 0
                    receivedData = 0
                    receiving = false
                }
            }
        )

        control.inBackground(function () {
            while (true) {
                if (currentButton != -1) {
                    let now = input.runningTime()

                    if (now - lastSignalTime >
                        releaseTimeout) {
                        let oldButton = currentButton
                        currentButton = -1
                        holdTriggered = false

                        control.raiseEvent(
                            EVENT_RELEASE,
                            oldButton
                        )
                    } else if (!holdTriggered &&
                        now - pressedTime >=
                        holdThreshold) {
                        holdTriggered = true

                        control.raiseEvent(
                            EVENT_HOLD,
                            currentButton
                        )
                    }
                }

                basic.pause(20)
            }
        })
    }

    //% block="IR po naciśnięciu %button"
    //% group="Zdarzenia"
    //% weight=90
    export function onPressed(
        button: Button,
        handler: () => void
    ): void {
        control.onEvent(
            EVENT_PRESS,
            button,
            handler
        )
    }

    //% block="IR po zwolnieniu %button"
    //% group="Zdarzenia"
    //% weight=80
    export function onReleased(
        button: Button,
        handler: () => void
    ): void {
        control.onEvent(
            EVENT_RELEASE,
            button,
            handler
        )
    }

    //% block="IR po przytrzymaniu %button"
    //% group="Zdarzenia"
    //% weight=70
    export function onHeld(
        button: Button,
        handler: () => void
    ): void {
        control.onEvent(
            EVENT_HOLD,
            button,
            handler
        )
    }

    //% block="IR ustaw czas przytrzymania %ms ms"
    //% ms.defl=1000
    //% ms.min=100
    //% group="Ustawienia"
    //% weight=60
    export function setHoldTime(ms: number): void {
        holdThreshold = Math.max(100, ms)
    }

    //% block="IR ustaw czas wykrycia zwolnienia %ms ms"
    //% ms.defl=220
    //% ms.min=100
    //% group="Ustawienia"
    //% weight=50
    export function setReleaseTimeout(ms: number): void {
        releaseTimeout = Math.max(100, ms)
    }

    //% block="IR czy przycisk %button jest wciśnięty"
    //% group="Odczyt"
    //% weight=40
    export function isPressed(button: Button): boolean {
        return currentButton == button
    }

    //% block="IR ostatni przycisk"
    //% group="Odczyt"
    //% weight=30
    export function last(): number {
        return lastButton
    }

    //% block="IR aktualny przycisk"
    //% group="Odczyt"
    //% weight=20
    export function current(): number {
        return currentButton
    }

    //% block="IR wyczyść ostatni przycisk"
    //% group="Odczyt"
    //% weight=10
    export function clear(): void {
        lastButton = -1
    }
}
