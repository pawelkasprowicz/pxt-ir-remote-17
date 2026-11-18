
# IR Remote 17 for BBC micro:bit

An independent MakeCode extension for controlling
BBC micro:bit V2 using a 17-button infrared remote.

The extension supports the NEC infrared protocol
and does not require any external IR libraries.

## Features

- 17 supported remote control buttons
- NEC infrared signal decoding
- Configurable IR receiver pin
- Button press events
- Button release events
- Long-press detection
- Adjustable long-press duration
- Adjustable button release timeout
- Current and last button detection
- MakeCode blocks and JavaScript support

## Supported buttons

The following buttons are supported:

- Numbers: 0–9
- Special buttons: * and #
- Direction buttons: UP, DOWN, LEFT, RIGHT
- OK button

## Hardware

- BBC micro:bit V2
- NEC-compatible 17-button IR remote control
- 38 kHz IR receiver module

## Wiring

| IR receiver | micro:bit |
|-------------|-----------|
| VCC         | 3V        |
| GND         | GND       |
| OUT         | P15       |

P15 is the default pin used in the examples.

Other digital pins can be selected during
initialization.

Make sure the IR receiver module is compatible
with 3.3V operation.

## Installation

1. Open https://makecode.microbit.org/
2. Create a new project.
3. Open Extensions.
4. Enter the repository URL:
   https://github.com/pawelkasprowicz/pxt-ir-remote-17
5. Select the extension.

## Initialize the receiver

```typescript
irremote.init(DigitalPin.P15)
```

## Button press event

```typescript
irremote.onPressed(irremote.Button.B1, function () {
    basic.showNumber(1)
})
```

## Button release event

```typescript
irremote.onReleased(irremote.Button.OK, function () {
    basic.showIcon(IconNames.Yes)
})
```

## Long-press event

```typescript
irremote.setHoldTime(1000)

irremote.onHeld(irremote.Button.OK, function () {
    basic.showIcon(IconNames.Heart)
})
```

The long-press event is triggered once when
the configured hold duration is reached.

## Check button state

```typescript
basic.forever(function () {
    if (irremote.isPressed(irremote.Button.Up)) {
        basic.showArrow(ArrowNames.North)
    }
})
```

## Configure release timeout

```typescript
irremote.setReleaseTimeout(220)
```

The receiver uses NEC repeat frames to track
button holding.

A button is considered released when no
additional IR signal is received within
the configured timeout.

## Read the last button

```typescript
let button = irremote.last()
serial.writeNumber(button)
```

The returned value is the decoded NEC command.

## Clear the last button

```typescript
irremote.clear()
```

## NEC command codes

| Button | Command |
|--------|---------|
| 1      | 0xA2 |
| 2      | 0x62 |
| 3      | 0xE2 |
| 4      | 0x22 |
| 5      | 0x02 |
| 6      | 0xC2 |
| 7      | 0xE0 |
| 8      | 0xA8 |
| 9      | 0x90 |
| *      | 0x68 |
| 0      | 0x98 |
| #      | 0xB0 |
| UP     | 0x18 |
| DOWN   | 0x4A |
| LEFT   | 0x10 |
| RIGHT  | 0x5A |
| OK     | 0x38 |

These codes were verified using a 17-button
NEC infrared remote control.

Other NEC remotes may use different codes.

## Notes

- Only one IR receiver should be initialized
  per program.
- Button release detection is based on
  signal timeout.
- Long-press detection requires NEC repeat
  frames from the remote control.
- Button events were tested on BBC micro:bit V2.

## License

MIT



> Otwórz tę stronę na [https://pawelkasprowicz.github.io/pxt-ir-remote-17/](https://pawelkasprowicz.github.io/pxt-ir-remote-17/)

## Użyj jako rozszerzenia

To repozytorium można dodać jako **rozszerzenie** w MakeCode.

* otwórz [https://makecode.microbit.org/](https://makecode.microbit.org/)
* kliknij na **Nowy Projekt**
* kliknij **Rozszerzenia** w menu oznaczonym kołem zębatym
* szukaj **https://github.com/pawelkasprowicz/pxt-ir-remote-17** i importuj

## Edytuj ten projekt

Aby edytować to repozytorium w MakeCode.

* otwórz [https://makecode.microbit.org/](https://makecode.microbit.org/)
* kliknij **Importuj**, a następnie **Importuj URL**
* wklej **https://github.com/pawelkasprowicz/pxt-ir-remote-17** i kliknij importuj

#### Metadane (używane do wyszukiwania, renderowania)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
