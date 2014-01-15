//
// Sequencer.js
// A variable length fixed step midi pattern sequencer.
// Needs jQuery and uses bootstrap 3 css tags.
// (c) Tommy van Leeuwen <tommy@chiparus.org>
//
// This code is in the public domain. Feel free to copy and modify.
//
// Code: https://github.com/tomarus/midiseq
// Demo: http://www.youtube.com/watch?v=rxanzYEwgJg
// Live: http://sandbox.dev.chiparus.net/midi/
//

var tcount = 0; // total ticks playing
var player;     // global player object

var ntable = new Array('C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-');
function notestr(n) {
    return ntable[n%12]+(Math.round(n/12-0.5));
}

// from http://www.g200kg.com/teburin/
var scaletab = [
    { name: "Chromatic",         notes: [1,1,1,1,1,1,1,1,1,1,1,1] },
    { name: "Major",             notes: [1,0,1,0,1,1,0,1,0,1,0,1] },
    { name: "Natural Minor",     notes: [1,0,1,1,0,1,0,1,1,0,1,0] },
    { name: "Harmonic Minor",    notes: [1,0,1,1,0,1,0,1,1,0,0,1] },
    { name: "Whole Tone",        notes: [1,0,1,0,1,0,1,0,1,0,1,0] },
    { name: "Diminish",          notes: [1,0,1,1,0,1,1,0,1,1,0,1] },
    { name: "Major Pentatonic",  notes: [1,0,1,0,1,0,0,1,0,1,0,0] },
    { name: "Minor Pentatonic",  notes: [1,0,0,1,0,1,0,1,0,0,1,0] },
    { name: "Blues",             notes: [1,0,0,1,0,1,1,1,0,1,1,0] },
    { name: "Gamelan",           notes: [1,1,0,1,0,0,0,1,1,0,0,0] },
];

Sequencer = function(n, c) {
    this.channel   = c;
    this.trigger   = 6;
    this.transpose = 0;
    this.muted     = 0;
    this.name      = n;
    this.loop      = 1; // 1=fwd, 2=rev, 3=pingpong, 4=inner pingpong

    this.notes     = new Array();
    this.repeat    = new Array();
    this.noteoff   = new Array();
    this.retrig    = new Array();

    this.note        = 0;
    this.lastnote    = 0;
    this.reppos      = 0;
    this.lastnoteoff = 0;
    this.looppos     = 0;

    // DOM id's of form elements
    this.chanid  = this.name+'_channel';
    this.trigid  = this.name+'_trigger';
    this.transid = this.name+'_transpose';
    this.seqid   = this.name+'_seq';
    this.muteid  = this.name+'_mute';
    this.loopid  = this.name+'_loop';
    this.scaleid = this.name+'_scale';
    this.rangeid = this.name+'_range';

    // Init patch, see this.Reset()
    for(i=0;i<8;i++) {
        this.notes[i]   = i%2==0?48:60; // c4/c5
        this.repeat[i]  = 1;
        this.noteoff[i] = 0;
        this.retrig[i]  = 1;
    }

    this.Export = function() {
        return {
            channel: this.channel,
            trigger: this.trigger,
            transpose: this.transpose,
            mute: this.muted,
            loop: this.loop,
            notes: this.notes,
            repeat: this.repeat,
            retrig: this.retrig,
            noteoff: this.noteoff,
        };
    }

    this.totsteps = function() {
        var ts = 0;
        for(var i=0; i<this.notes.length; i++) {
            ts += this.repeat[i];
        }
        $('#'+this.name+'steps').text(ts);
    }

    this.change_channel = function() {
        var id = document.getElementById(this.chanid);
        this.channel = parseInt(id.options[id.selectedIndex].value);
        console.log(this.name+' change_channel: '+this.channel);
    }

    this.change_trigger = function() {
        var id = document.getElementById(this.trigid);
        this.trigger = parseInt(id.options[id.selectedIndex].value);
        console.log(this.name+' change_trigger: '+this.trigger);
    }

    this.change_transpose = function() {
        var id = document.getElementById(this.transid);
        this.transpose = parseInt(id.options[id.selectedIndex].value);
        console.log(this.name+' change_transpose: '+this.transpose);
    }

    this.change_mute = function() {
        var id = document.getElementById(this.muteid);
        this.muted = id.checked;
        this.Stop();
        console.log(this.name+' change_muted: '+this.muted);
    }

    this.change_loop = function() {
        var id = document.getElementById(this.loopid);
        this.loop = parseInt(id.options[id.selectedIndex].value);
        console.log(this.name+' change_loop: '+this.loop);
    }

    this.Draw = function() {
        var me = this;
        var x = ' \
            <div class="panel panel-default"> \
            <div class="panel-heading"> \
                <b class="panel-title"><span style="color:#ff4422">SEQ</span></b> \
                Channel:   <select id='+this.chanid+' onchange="'+this.name+'.change_channel()"></select> \
                Trigger:   <select id='+this.trigid+' onchange="'+this.name+'.change_trigger()"></select> \
                Transpose: <select id='+this.transid+' onchange="'+this.name+'.change_transpose()"></select> \
                Mute:      <input type=checkbox id='+this.muteid+' onchange="'+this.name+'.change_mute()"></select> \
                Loop:       <select id='+this.loopid+' onchange="'+this.name+'.change_loop()"> \
                            <option value=1>Forward</option><option value=2>Backward</option><option value=3>Pingpong</option><option value=4>Inner</option> \
                            </select> \
                <div class="pull-right"> \
                    <select id='+this.scaleid+'></select> \
                    <select id='+this.rangeid+'></select> Oct \
                    <button onclick="'+this.name+'.Randomize()">Randomize</button> \
                    <button onclick="'+this.name+'.Reset()">Init</button> \
                </div> \
            </div> \
                <div id='+this.seqid+'></div> \
                Total Steps: <span id='+this.name+'steps></span> \
            </div> \
        ';
        $('#'+this.name).append(x);

        for(var i=0;i<scaletab.length;i++){ 
                                  ($('#'+this.scaleid)[0])[i]    = new Option(scaletab[i].name,i,0,0);}
        for(var i=1;i<=6;i++){    ($('#'+this.rangeid)[0])[i-1]  = new Option(i,i,i==3,i==3);}
        for(var i=1;i<=16;i++){   ($('#'+this.chanid)[0])[i-1]   = new Option(i,i,i==me.channel,i==me.channel);}
        for(var i=1;i<=24;i++){   ($('#'+this.trigid)[0])[i-1]   = new Option(i,i,i==me.trigger,i==me.trigger);}
        for(var i=-48;i<=48;i++){ ($('#'+this.transid)[0])[48-i] = new Option(i,i,i==me.transpose,i==me.transpose);}

        // Draw sequencer table.
        var table = $('<table></table>').addClass('table').addClass('table-condensed table-striped');
        var hdr = $('<tr></tr>').html('<th>Pos</th><th>Note</th><th>Repeat</th><th>Retrig</th><th>Len</th>');
        table.append(hdr);

        for(i=0;i<this.notes.length;i++) {
            var cells = '<td>'+(i+1)+'.</td>';
            cells += '<td><select id=not'+this.seqid+i+' data-row='+i+'></select><div id=notslide'+this.seqid+i+'></div></td>';
            cells += '<td><select id=rep'+this.seqid+i+' data-row='+i+'></select></td>';
            cells += '<td><input type=checkbox id=retr'+this.seqid+i+' data-row='+i+'></input></td>';
            cells += '<td><select id=noff'+this.seqid+i+' data-row='+i+'></select></td>';
            var row = $('<tr></tr>').html(cells);
            table.append(row);
        }
        $('#'+this.seqid).append(table);

        for(i=0;i<this.notes.length;i++) {
            var sid = $('#not'+this.seqid+i)[0];
            for(var j=127;j>=1;j--){ sid[127-j] = new Option(notestr(j),j,j==this.notes[i],j==this.notes[i]);}
            $('#not'+this.seqid+i).change(function(){
                var row = $(this).data('row');
                me.notes[row] = parseInt($(this).val());
            });
            var sid = $('#rep'+this.seqid+i)[0];
            for(var j=1;j<=8;j++){ sid[j-1] = new Option(j,j,j==this.repeat[i],j==this.repeat[i]);}
            $('#rep'+this.seqid+i).change(function(){
                var row = $(this).data('row');
                me.repeat[row] = parseInt($(this).val());
                me.totsteps();
            });
            var sid = $('#retr'+this.seqid+i)[0];
            sid.checked = this.retrig[i];
            $('#retr'+this.seqid+i).change(function(){
                var row = $(this).data('row');
                me.retrig[row] = this.checked;
            });
            var sid = $('#noff'+this.seqid+i)[0];
            for(var j=0;j<=24;j++){ sid[j] = new Option(j,j,j==this.noteoff[i],j==this.noteoff[i]);}
            $('#noff'+this.seqid+i).change(function(){
                var row = $(this).data('row');
                me.noteoff[row] = parseInt($(this).val());
            });
        }

        this.totsteps();
    }

    this.Refresh = function() {
        for(i=0;i<this.notes.length;i++) {
            var sid = $('#not'+this.seqid+i)[0];
            for(var j=127;j>=1;j--){ sid[127-j].selected = j==this.notes[i];}
            var sid = $('#rep'+this.seqid+i)[0];
            for(var j=1;j<=8;j++){ sid[j-1].selected = j==this.repeat[i];}
            var sid = $('#retr'+this.seqid+i)[0];
            sid.checked = this.retrig[i];
            var sid = $('#noff'+this.seqid+i)[0];
            for(var j=0;j<=24;j++){ sid[j].selected = j==this.noteoff[i];}
        }
        this.totsteps();
    }

    this.Randomize = function() {
        var scale = $('#'+this.scaleid).val();
        var range = $('#'+this.rangeid).val();
        for(i=0;i<this.notes.length;i++) {
            var not = Math.floor(Math.random()*12);
            while(scaletab[scale].notes[not] != 1) {
                not = Math.floor(Math.random()*12);
            }
            // calc transpose octave using base note 48. greater ranges starts lower.
            not += 48 + (Math.floor(Math.random()*range) - (range>3?range-3:0)) * 12
            this.notes[i] = not;

            this.repeat[i]  = Math.floor((Math.random()*4)+1);
            this.noteoff[i] = Math.floor(Math.random()*12);
            this.retrig[i]  = Math.floor(Math.random()+0.5);
        }
        this.Refresh();
        // all note off msg
        Jazz.MidiOut(0xb0+this.channel-1, 123, 0);
    }

    this.Reset = function() {
        for(i=0;i<this.notes.length;i++) {
            this.notes[i]   = i%2==0?48:60; // c4/c5
            this.repeat[i]  = 1;
            this.noteoff[i] = 0;
            this.retrig[i]  = 1;
        }
        this.Refresh();
        // all note off msg
        Jazz.MidiOut(0xb0+this.channel-1, 123, 0);
    }

    this.SetDefault = function() {
        if ( this.channel == 1 ) {
            Jazz.MidiOut(0xc0+this.channel-1, 38, 0); // synth bass
        } else if ( this.channel == 2 ) {
            Jazz.MidiOut(0xc0+this.channel-1, 81, 0); // saw lead
        }
    }

    this.Init = function() {
        this.note        = 0;
        this.lastnote    = 0;
        this.reppos      = 0;
        this.lastnoteoff = 0;
        this.looppos     = 0;

        if (this.loop == 2) // start backwards
            this.note = this.notes.length-1;
    }

    this.Stop = function() {
        Jazz.MidiOut(0x80+this.channel-1, this.lastnote, 0);
        Jazz.MidiOut(0xb0+this.channel-1, 120, 0);
        Jazz.MidiOut(0xb0+this.channel-1, 123, 0);
    }

    // called each midi event 1/24 trig
    this.Playnote = function() {
        if ( --this.lastnoteoff == 0 ) { Jazz.MidiOut(0x80+this.channel-1, this.lastnote, 0); }
        if (tcount%this.trigger > 0 ) return;

        var trg = this.retrig[this.note] || this.reppos == 0;
        if ( !this.muted && trg ) {
            Jazz.MidiOut(0x80+this.channel-1, this.lastnote, 0);
            Jazz.MidiOut(0x90+this.channel-1, this.notes[this.note]+this.transpose, 127);
            $('#'+this.seqid).find('tbody tr:nth-child('+(this.note+2)+') td:nth-child(1)').effect("highlight", {'color': '#f00'}, 50);
        } else if (this.muted && trg) {
            $('#'+this.seqid).find('tbody tr:nth-child('+(this.note+2)+') td:nth-child(1)').effect("highlight", {'color': '#ccc'}, 50);
        }

        this.lastnote    = this.notes[this.note]+this.transpose;
        this.lastnoteoff = this.noteoff[this.note] * (this.retrig[this.note] ? 1 : this.repeat[this.note]);

        this.reppos++;
        if (this.reppos>=this.repeat[this.note]) {
            this.reppos = 0;
            if ( this.loop == 1 ) { // forward
                this.note++; if (this.note>=this.notes.length) { this.note=0; }
            } else if ( this.loop == 2 ) { // backward
                this.note--; if (this.note<0) { this.note=this.notes.length-1; }
            } else if ( this.loop == 3 && this.looppos == 0 ) { // pingpong forward
                this.note++; if (this.note>=this.notes.length) { this.note=this.notes.length-1; this.looppos = 1 }
            } else if ( this.loop == 3 && this.looppos == 1 ) { // pingpong backward
                this.note--; if (this.note<0) { this.note = 0; this.looppos = 0 }
            } else if ( this.loop == 4 && this.looppos == 0 ) { // innerpong forward
                this.note++; if (this.note>=this.notes.length) { this.note=this.notes.length-2; this.looppos = 1 }
            } else if ( this.loop == 4 && this.looppos == 1 ) { // innerpong backward
                this.note--; if (this.note<0) { this.note = 1; this.looppos = 0 }
            } else {
                alert("Cant be here.");
            }
        }
    }
}; // Sequencer

// Global midi input handler

var midi_handler_id;
var midi_in_playing = 0;

function midi_handler(t,a,b,c) {
    switch(a) {
        case 0xf8: // clock msg
            if (midi_in_playing) player.tick();
            break;
        case 0xfa: // start msg
            player.Init();
            midi_in_playing = 1;
            console.log("Remote start.");
            break;
        case 0xfc: // stop msg
            player.Stop();
            midi_in_playing = 0;
            console.log("Remote stop.");
            break;
        default:
            //console.log(t,a,b,c);
    }
}

// Player object which holds one or more sequencers.

var seq01;
var seq02;

Player = function() {
    if (!(Jazz && Jazz.isJazz)) { console.log("Jazz not ready."); return; }

    this.playing  = 0;
    this.interval = 20;
    this.timeout  = 0;
    this.midi_in;
    this.midi_out;
    this.sync     = 1; // 1 = send, 2 = receive, 3 = nothing

    seq01 = new Sequencer("seq01", 1);
    seq02 = new Sequencer("seq02", 2);

    this.Export = function() {
        var out = {
            seq: new Array(seq01.Export(), seq02.Export()),
        };
        console.log(JSON.stringify(out));
    }

    this.Draw = function() {
        var x = ' \
            <div class="setuppanel"><div class="panel panel-default"> \
            <div class="panel-heading"> \
                <a data-toggle="collapse" data-parent="setuppanel" href="#setuppanelbody"> \
                    <button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-sort"></span></button> \
                </a> \
                <b class="panel-title"><span style="color:#ff4422">MIDI</span> Setup</b> \
            </div> \
            <div id="setuppanelbody" class="panel-collapse collapse in"> \
            <div class="panel-body"> \
                <table> \
                <tr><td>MIDI Output Device:</td><td><select id="select_out" onchange="player.initmidi();"></select></td></tr> \
                <tr><td>MIDI Input Device:</td><td><select id="select_in" onchange="player.initmidi();"></select></td></tr> \
                <tr><td>Clock Sync:</td><td><select id="clocksync" onchange="player.changesync();"> \
                    <option value=1>Send</option><option value=2>Receive</option><option value=3>Neither</option> \
                    </select></td></tr> \
                </table> \
            </div> \
            </div> \
            </div> \
            </div> \
            <div class="panel panel-default"> \
            <div class="panel-body"> \
                BPM: <select id=tempo onchange="player.changetempo();"></select> \
                <button id=play onclick="player.Play()">Play</button> \
                <button id=export onclick="player.Export()">Export</button> \
            </div> \
            </div> \
            <div id="seq01"></div> \
            <div id="seq02"></div> \
        ';
        $("#player").append(x);

        for(var i=40;i<=240;i++){ ($('#tempo')[0])[i-40] = new Option(i,i,i==120,i==120);}

        var list=Jazz.MidiOutList();
        for(var i in list){
            ($("#select_out")[0])[i] = new Option(list[i],list[i],i==0,i==0);
        }

        var list=Jazz.MidiInList();
        for(var i in list){
            ($("#select_in")[0])[i] = new Option(list[i],list[i],i==0,i==0);
        }

        this.initmidi();
        this.setdefaults();
        seq01.Draw();
        seq02.Draw();
    }

    this.Stop = function() {
        seq01.Stop();
        seq02.Stop();
    }

    this.Init = function() {
        tcount = 0;
        seq01.Init();
        seq02.Init();
        this.tick();
    }

    this.Play = function() {
        if (this.playing==1) {
            this.Stop();
            if ( this.sync == 1 ) Jazz.MidiOut(0xfc);
            this.playing=0;
            document.getElementById('play').innerHTML='Play';
            clearInterval(this.timeout);
            console.log("Stopped.");
        } else {
            if ( this.sync == 1 ) Jazz.MidiOut(0xfa);
            this.playing=1;
            document.getElementById('play').innerHTML='Stop';
            this.Init();
            this.timeout = setInterval(function(){player.tick();}, this.interval);
            console.log("Playing.");
        }
    }

    this.tick = function() {
        if ( this.sync == 1 ) Jazz.MidiOut(0xf8);
        seq01.Playnote();
        seq02.Playnote();
        tcount++;
    }

    this.initmidi = function() {
        if (!(Jazz && Jazz.isJazz)) return;
        var select_out = document.getElementById("select_out");
        var select_in = document.getElementById("select_in");
        this.midi_out = select_out.options[select_out.selectedIndex].value;
        this.midi_in = select_in.options[select_in.selectedIndex] ? select_in.options[select_in.selectedIndex].value : 0;
        console.log('Output Device: '+this.midi_out+' Input Device: '+this.midi_in);
        Jazz.MidiOutOpen(this.midi_out);
        if (this.midi_in!=0) Jazz.MidiInOpen(this.midi_in, midi_handler);
    }

    this.setdefaults = function() {
        // Set default sounds on default os synths.
        if ( this.midi_out == "Apple DLS Synth" || this.midi_out == "Microsoft GS Wavetable Synth" ) {
            seq01.SetDefault();
            seq02.SetDefault();
        }
    }

    this.changetempo = function() {
        var select_tempo = document.getElementById('tempo');
        this.interval = 60000.0/select_tempo.options[select_tempo.selectedIndex].value/24;
    }

    this.changesync = function() {
        var select_sync = document.getElementById('clocksync');
        this.sync = select_sync.options[select_sync.selectedIndex].value;

        $("#play").removeAttr("disabled");
        $("#tempo").removeAttr("disabled");

        // setup midi input
        if ( this.sync == 2 ) {
            $("#play").attr("disabled", "disabled");
            $("#tempo").attr("disabled", "disabled");
            midi_handler_id = Jazz.MidiInOpen(this.midi_in, midi_handler);
        }
    }
};
