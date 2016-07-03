Web MIDI Sequencer, Router & Drum Machine
=========================================

This is an experimental Polyrhythmic MIDI Pattern generator.

This is a completely rewritten version of the previous sequencer which used the Jazz Plugin. This one works native in modern browsers (Chrome/Firefox).

This version is rewritten using React, Redux and System JS / JSPM. All in modern ES6.

See it live at http://midi.tomarus.io

![Screenshot](http://s.chiparus.org/4/41482956ba7d84a8.png)

Watch a video on youtube seeing this in action: https://www.youtube.com/watch?v=p_IkbFeEmdg (This video has low audio quality and doesn't show all functionality).

## Quick Start

1. Clone the source code.
1. Make sure you have jspm installed, if not; `npm install jspm`
1. Install jspm dependencies, `jspm install`
1. Start a webserver to serve the index.html or use the supplied go webserver `go run webserver.go`

## Building

1. `make dist` or use jspm build.

I'm a NodeJS noob so this it for now. If you want to work on this project, you probably know how to get it running.

## Notes & Limitations

Most of the time, it should work near realtime. For best results however you better use an external clock input.

If there are lots of (or continuous) MIDI controller messages, the monitor panel might be slow, so leave it collapsed during playing.

Use CLK and SYS options to send Clock or System messages (play/stop etc) to MIDI ports.

Feedback and contributions are welcome!
