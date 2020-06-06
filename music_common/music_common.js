
console.log("IN MUSIC_COMMON.JS");

var quarter_duration = 256;
var divisions = 256;

var mode = "major";
var xml_out = "";

var measure_number = 0;


var note_letters_flat = ["", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
var note_letters_sharp = ["", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var sharp_flat_from_note = {
    "C": "b",
    "C#": "#",
    "Db": "b",
    "D": "#",
    "D#": "#",
    "Eb": "b",
    "E": "#",
    "E#": "#",
    "Fb": "b",
    "F": "b", 
    "F#": "#",
    "Gb": "b",
    "G": "#",
    "G#": "#",
    "Ab": "b", 
    "A": "#",
    "A#": "#",
    "B": "#",
    "B#": "#",
    "Cb": "b", 
};

var note_numbers = {
        
    "B#" : 1,
    "C" : 1,
    "C#" : 2,
    "Db" : 2,
    "D" : 3,
    "D#" : 4,
    "Eb" : 4,
    "E" : 5,

    "Fb" : 5,
    "E#" : 6,

    "F" : 6,
    "F#" : 7,
    "Gb" : 7,
    "G" : 8,
    "G#" : 9,
    "Ab" : 9,
    "A" : 10,
    "A#" : 11,
    "Bb" : 11,
    "B" : 12,
    "Cb" : 12
};


// when to bump the octave
var octave_numbers = {
    "Cb" : 1,

    "C" : 2,
    "C#" : 3,
    "Db" : 4,
    "D" : 5,
    "D#" : 6,
    "Eb" : 7,
    "E" : 8,

    "Fb" : 9,
    "E#" : 10,

    "F" : 11,
    "F#" : 12,
    "Gb" : 13,
    "G" : 14,
    "G#" : 15,
    "Ab" : 16,
    "A" : 17,
    "A#" : 18,
    "Bb" : 19,
    "B" : 20,

    "B#" : 21
    
};




var c_chord_data = {
    "Cmaj": { notes: ["C", "E", "G"], 
    chord_kind: "major", tritone: false, leading: false },
    "CM": { notes: ["C", "E", "G"], 
    chord_kind: "major", tritone: false, leading: false },

    "CM7": {chord: "", notes: ["C", "E", "G", "B"], 
        chord_kind: "major-seventh", tritone: false, leading: false, ninth_ok: true },
    "Cmaj7": {chord: "", notes: ["C", "E", "G", "B"], 
            chord_kind: "major-seventh", tritone: false, leading: false, ninth_ok: true },

   

    "C7": {chord: "", notes: ["C", "E", "G", "Bb"], 
        chord_kind: "dominant", tritone: true, leading: true, ninth_ok: true },

    "C9": {chord: "", notes: ["C", "E", "G", "Bb"], // 9th:, "D"], 
        chord_kind: "dominant-ninth", tritone: true, leading: true, ninth_ok: false },

    
    "Cm7b5": {chord: "", notes: ["C", "Eb", "Gb", "Bb"], 
        chord_kind: "half-diminished", tritone: true, leading: true, ninth_ok: false },
    "C7b5": {chord: "", notes: ["C", "E", "Gb", "Bb"], 
        chord_kind: "dominant", tritone: true, leading: true, ninth_ok: true },
    "Cm7": {chord: "", notes: ["C", "Eb", "G", "Bb"], 
        chord_kind: "minor-seventh", tritone: false, leading: false, ninth_ok: true },
    "Cmmaj7": {chord: "", notes: ["C", "Eb", "G", "B"], 
        chord_kind: "major-minor", tritone: false, leading: false, ninth_ok: true },
    "Cm6": {chord: "", notes: ["C", "Eb", "G", "A"], 
        chord_kind: "minor-sixth", tritone: false, leading: false },
    "C6": {chord: "", notes: ["C", "E", "G", "A"], 
        chord_kind: "major-sixth", tritone: false, leading: false },
        
    "Cmaj6": {chord: "", notes: ["C", "E", "G", "A"], 
            chord_kind: "major-sixth", tritone: false, leading: false },

    // C69
    "C69": {chord: "", notes: ["C", "D", "E", "A"],
        chord_kind: "major-sixth", tritone: true, leading: false, ninth_ok: false,
        degree: `
            <degree>
                <degree-value>9</degree-value>
                <degree-alter>0</degree-alter>
                <degree-type>add</degree-type>
                </degree>` },
    //Bb69 - Bb F D G C F (Bb D F G C) 5th = F

    "Cm": { notes: ["C", "Eb", "G"], 
        chord_kind: "minor", tritone: false, leading: false },

    // if we put D last, we get strange inversions
    "Cadd9": { notes: ["C", "D", "E", "G"],
        chord_kind: "major", tritone: false, leading: false, ninth_ok: false },
    
    "C7b5": {chord: "", notes: ["C", "E", "Gb", "Bb"], 
        chord_kind: "dominant", tritone: true, leading: true, ninth_ok: true ,
        degree:`
            <degree>
            <degree-value>5</degree-value>
            <degree-alter>-1</degree-alter>
            <degree-type>alter</degree-type>
        </degree>`},

    "C9b5": {chord: "", notes: ["C", "E", "Gb", "Bb"], 
        chord_kind: "dominant-ninth", tritone: true, leading: true, ninth_ok: true ,
        degree:`
            <degree>
            <degree-value>5</degree-value>
            <degree-alter>-1</degree-alter>
            <degree-type>alter</degree-type>
        </degree>`},
        
    

    // need to mark as dominant and add supended with degree    
    "C7sus4": {chord: "", notes: ["C", "F", "G", "Bb"], 
                chord_kind: "dominant", tritone: false, leading: false, ninth_ok: true ,
                degree: `
                    <degree>
                    <degree-value>4</degree-value>
                    <degree-alter>0</degree-alter>
                    <degree-type>add</degree-type>
                    </degree>
                    <degree>
                    <degree-value>3</degree-value>
                    <degree-alter>0</degree-alter>
                    <degree-type>subtract</degree-type>
                    </degree>` },

    // drop 5th for 6/9 chord
    "C7add6": {chord: "", notes: ["C", "E", "A", "Bb"],
        chord_kind: "dominant", tritone: true, leading: true, ninth_ok: true },
    
        
    

     // will this get found here?
    "C7(#9)": {chord: "", notes: ["C", "E", "G", "Bb"], 
        chord_kind: "dominant", tritone: true, leading: true, ninth_ok: false,
        degree: `
            <degree>
                <degree-value>9</degree-value>
                <degree-alter>1</degree-alter>
                <degree-type>add</degree-type>
                </degree>`},


      "C7(b9)": {chord: "", notes: ["C", "E", "G", "Bb"], 
                chord_kind: "dominant", tritone: true, leading: true, ninth_ok: false,
                degree: `
                    <degree>
                        <degree-value>9</degree-value>
                        <degree-alter>-1</degree-alter>
                        <degree-type>add</degree-type>
                        </degree>`},


    "CM9": {chord: "", notes: ["C", "E", "G", "B"], // 9th:, "D"], 
        chord_kind: "major-ninth", tritone: true, leading: false, ninth_ok: false },
    "Cmaj9": {chord: "", notes: ["C", "E", "G", "B"], // 9th:, "D"], 
            chord_kind: "major-ninth", tritone: true, leading: false, ninth_ok: false },
    "Cm9": {chord: "", notes: ["C", "Eb", "G", "Bb"], // 9th:, "D"], 
        chord_kind: "minor-ninth", tritone: true, leading: false, ninth_ok: false },

    "C11": {chord: "", notes: ["C", "E", "G", "Bb"], // 9th:, "D", "F"], 
        chord_kind: "dominant-11th", tritone: true, leading: true },
    "CM11": {chord: "", notes: ["C", "E", "G", "B"], // 9th:, "D", "F"], 
        chord_kind: "major-11th", tritone: true, leading: true },
    "Cmaj11": {chord: "", notes: ["C", "E", "G", "B"], // 9th:, "D", "F"], 
            chord_kind: "major-11th", tritone: true, leading: true },
    "Cm11": {chord: "", notes: ["C", "Eb", "G", "Bb"], // 9th:, "D", "F"], 
        chord_kind: "minor-11th", tritone: false, leading: false },


    "Cdim7": {chord: "", notes: ["C", "Eb", "Gb", "A"], 
        chord_kind: "diminished-seventh", tritone: true, leading: false, ninth_ok: false },
    "Cdim": {chord: "", notes: ["C", "Eb", "Gb"], 
        chord_kind: "diminished", tritone: false, leading: false },
    // sibelius likes this marked as dominant, and add sharp 5
    // musicxml allows augmented-seventh
    "Caug7": {chord: "", notes: ["C", "E", "G#", "Bb"], 
                chord_kind: "dominant", tritone: false, leading: false, ninth_ok: true ,
                degree:`
                    <degree>
                    <degree-value>5</degree-value>
                    <degree-alter>1</degree-alter>
                    <degree-type>alter</degree-type>
                </degree>`},

    // 9 will get added later
    "Caug9": {chord: "", notes: ["C", "E", "G#", "Bb"],
                chord_kind: "dominant-ninth", tritone: false, leading: false, ninth_ok: false,
                degree: `
                <degree>
                 <degree-value>5</degree-value>
                 <degree-alter>1</degree-alter>
                 <degree-type>alter</degree-type>
                </degree>`},

    "Caug": {chord: "", notes: ["C", "E", "G#"], 
        chord_kind: "augmented",tritone: false, leading: false },

   
    
    "Csus2": {chord: "", notes: ["C", "D", "G"], 
        chord_kind: "suspended-second", tritone: false, leading: false, },

    "Csus4": {chord: "", notes: ["C", "F", "G"], 
        chord_kind: "suspended-fourth", tritone: false, leading: false },

    "Csus": {chord: "", notes: ["C", "F", "G"], 
        chord_kind: "suspended-fourth", tritone: false, leading: false },

    "C7sus2": {chord: "", notes: ["C", "D", "G", "Bb"], 
        chord_kind: "dominant", tritone: false, leading: false, ninth_ok: false,
        degree: `
            <degree>
            <degree-value>2</degree-value>
            <degree-alter>0</degree-alter>
            <degree-type>add</degree-type>
            </degree>
            <degree>
            <degree-value>3</degree-value>
            <degree-alter>0</degree-alter>
            <degree-type>subtract</degree-type>
            </degree>`},

    "C9sus4": {chord: "", notes: ["C", "F", "G", "Bb"], 
            chord_kind: "dominant-ninth", tritone: false, leading: false, ninth_ok: false ,
            degree: `
                <degree>
                <degree-value>4</degree-value>
                <degree-alter>0</degree-alter>
                <degree-type>add</degree-type>
                </degree>
                <degree>
                <degree-value>3</degree-value>
                <degree-alter>0</degree-alter>
                <degree-type>subtract</degree-type>
                </degree>`},
    
    "C": {chord: "", notes: ["C", "E", "G"], 
        chord_kind: "major", tritone: false, leading: false },
};

    var  chord_keys = Object.keys(c_chord_data);
    for (ii = 0; ii < chord_keys.length; ii++) {
        skey = chord_keys[ii];
        chord0 = c_chord_data[skey];
        chord0.chord = skey;
    }


    function start_measure()
    {
        measure_number++;
        console.log(get_self(measure_number));

        if (measure_number == 1)
    {
        xml_out = sprintf(`<?xml version="1.0" encoding='UTF-8' standalone='no' ?>
            <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
            <score-partwise version="3.0">
            <work>
            <work-title>%s</work-title>
            </work>
            <identification>
            <encoding>
            <encoding-date>2020-02-18</encoding-date>
            <encoder>AlHart</encoder>
            <software>ms_notation</software>
            <encoding-description>Sibelius / MusicXML 3.0</encoding-description>
            <supports element="print" type="yes" value="yes" attribute="new-system" />
            <supports element="print" type="yes" value="yes" attribute="new-page" />
            <supports element="accidental" type="yes" />
            <supports element="beam" type="yes" />
            <supports element="stem" type="yes" />
            </encoding>
            </identification>`, page_header );


        xml_out += `<part-list>
            <part-group type="start" number="1">
            <group-symbol>brace</group-symbol>
            </part-group>
            <score-part id="P1">
            <identification>
                <miscellaneous>
                <miscellaneous-field name="show-rhythms">false</miscellaneous-field>
                </miscellaneous>
            </identification>
            <part-name>Piano</part-name>
            <part-name-display>
                <display-text>Piano</display-text>
            </part-name-display>
            <part-abbreviation>Pno.</part-abbreviation>
            <part-abbreviation-display>
                <display-text>Pno.</display-text>
            </part-abbreviation-display>
            <score-instrument id="P1-I1">
                <instrument-name>Piano (2)</instrument-name>
                <instrument-sound>keyboard.piano.grand</instrument-sound>
                <solo />
                <virtual-instrument>
                <virtual-library>General MIDI</virtual-library>
                <virtual-name>Acoustic Piano</virtual-name>
                </virtual-instrument>
            </score-instrument>
            </score-part>
            <part-group type="stop" number="1" />
            </part-list>

            <part id="P1">\n`;

    }

    

 
 
        xml_out += sprintf(`<!--============== Part: P1, Measure: %s ==============-->
            <measure number="%s" width="651">\n`, measure_number, measure_number);

        if (measure_number == 1)
        {        
            // perhaps only for measure 1
            xml_out += sprintf(`<print new-page="yes">
                <system-layout>
                <system-margins>
                    <left-margin>22</left-margin>
                    <right-margin>0</right-margin>
                </system-margins>
                <top-system-distance>218</top-system-distance>
                </system-layout>
                <staff-layout number="2">
                <staff-distance>90</staff-distance>
                </staff-layout>
                </print>
                <attributes>
                <divisions>%s</divisions>\n`, divisions);

            // positive fifths is the number of sharps
            // negative fifths is the number of flats
            fifths = line_of_fifths_numbers[transpose_key] - line_of_fifths_numbers["C"];
            xml_out += sprintf(`<key color="#000000">
                <fifths>%s</fifths>
                <mode>%s</mode>
                </key>\n`, fifths, mode);


            xml_out += sprintf(`<time color="#000000">
                <beats>4</beats>
                <beat-type>4</beat-type>
                </time>
                <staves>2</staves>
                <clef number="1" color="#000000">
                <sign>G</sign>
                <line>2</line>
                </clef>
                <clef number="2" color="#000000">
                <sign>F</sign>
                <line>4</line>
                </clef>
                <staff-details number="1" print-object="yes" />
                <staff-details number="2" print-object="yes" />
                </attributes>\n`);
        }
        else
        {
            xml_out += `<attributes />\n`;
        }


        
    }

    function do_harmony(chord, staff)
    {

        schord = chord.chord_out;
        root_step = schord.substr(0,1);  // Letter for chord
        if (schord.substr(1,1) == "#")
        {
            sroot = schord.substr(0,2);
            chord_alter = 1;
            accidental = "#";
            ssub = schord.substr(2);
        }
        else if (schord.substr(2,1) == "#")
        {
            sroot = schord.substr(0,3);
            chord_alter = 1;
            accidental = "#";
            ssub = schord.substr(3);
        }
        else if (schord.substr(1,1) == "b")
        {
            sroot = schord.substr(0,2);
            chord_alter = -1;
            accidental = "b";
            ssub = schord.substr(2);
        }
        else if (schord.substr(2,1) == "b")
        {
            sroot = schord.substr(0,3);
            chord_alter = -1;
            accidental = "b";
            ssub = schord.substr(3);
        }
        else
        {
            sroot = schord.substr(0,1)
            chord_alter = 0;
            accidental = "";
            ssub = schord.substr(1);
        }

        xml_out += sprintf("<!-- CHORD: %s KIND: %s -->\n", chord.chord_out, chord.kind);
        xml_out += sprintf(`<harmony color="#000000" default-y="25">
            <root>
            <root-step>%s</root-step>\n`, root_step);
        
        if (chord_alter != 0)
        {
            xml_out += sprintf(`<root-alter>%s</root-alter>\n`, chord_alter);
        }
            
        xml_out += sprintf(`</root>
            <kind>%s</kind>\n`, chord.kind);

        if (chord.degree && chord.degree != "")
            xml_out += chord.degree + "\n";

        xml_out += sprintf(`<staff>%s</staff>
            </harmony>\n`, staff);
        
    }

    var quarter_divs = 256; // sibelius shows divisions and quarter notes as 256

    var note_duration = {quarter: quarter_divs, eighth: quarter_divs/2, sixteenth: quarter_divs/4,
        half: quarter_divs * 2, whole: quarter_divs * 4};

    function get_duration(type, dotted)
    {
        duration = note_duration[type];
        if (dotted)
            duration *= 1.5;
        return(duration);
    }

    function get_alter(snote)
    {
        if (snote.substr(1,1) == "#")
            ret = 1;
        else if (snote.substr(1,1) == "b")
            ret = -1;
        else
            ret = 0;
        return(ret);
    }
    function get_accidental(snote)
    {
        if (snote.substr(1,1) == "#")
            sret = "sharp";
        else if (snote.substr(1,1) == "flat")
            sret = "flat";
        else
            sret = "";
        //console.log("get_accidental: %s: %s", snote, sret);
        return sret;
    }

 
    

    
    function do_note(note, is_note_in_harmony_chord, octave, voice, type, dotted, stem, staff, lyric)
    {
        console.log(get_self(note, is_note_in_harmony_chord, octave, voice, type, stem, staff));
        console.log("note: %s. type: %s stem: %s staff: %s", note, type, stem, staff);
        do_comment(sprintf("do_note: %s is_note_in_harmony_chord: %s", note, is_note_in_harmony_chord)    );

        step = note.substr(0,1);
        alter = get_alter(note);
    
        duration = get_duration(type, dotted);
        xml_out += sprintf(`<note color="#000000" >\n`);
        if (is_note_in_harmony_chord)
            xml_out += `<chord />\n`;


        xml_out += sprintf(`<pitch>
            <step>%s</step>\n`, step);

        if (alter != 0)
        {
            xml_out += sprintf(`<alter>%s</alter>\n`, alter);
        }

        xml_out += sprintf(`<octave>%s</octave>
            </pitch>
            <duration>%s</duration>
            <instrument id="P1-I1" />\n`, octave, duration);


        if (!is_note_in_harmony_chord)
        {
            xml_out += sprintf(`<voice>%s</voice>\n`, voice);
        }

        xml_out += sprintf(`<type>%s</type>\n`, type);
        if (dotted)
            xml_out += `<dot />`;

        // accidental has to come before <staff>
        // see if we need accidental to be set
        // either from key or last note output
        // ADH (not yet)
        //if (new_note_accidental != "")
        //    xml_out += sprintf(`<accidental>%s</accidental>\n`, new_note_accidental)


        if (!is_note_in_harmony_chord && stem != "")
        {
            xml_out += sprintf(`<stem>%s</stem>\n`, stem);
        }
        xml_out += sprintf(`<staff>%s</staff>\n`, staff);

        if (!is_note_in_harmony_chord && lyric != "")
        {
            lyric = lyric.replace(/\//g, "  ");
            xml_out += sprintf(`<lyric  number="part1verse1" color="#000000">
                <syllabic>single</syllabic>
                <text>%s </text>
                </lyric>\n`, lyric);
        }
        xml_out += `</note>\n`;
        

    }


    function do_rest(type, dotted, voice, staff)
    {
        console.log(get_self(type, dotted, voice, staff));
        duration = get_duration(type, dotted);
        xml_out += sprintf(`<note >
            <rest />
            <duration>%s</duration>
            <instrument id="P1-I1" />
            <voice>%s</voice>
            <type>%s</type>`, duration, voice, type);
        if (dotted)
            xml_out += `<dot />`;
        xml_out += sprintf(`<staff>%s</staff>
            </note>\n`, staff);
        
    }


    function do_backup(duration)
    {
        xml_out += sprintf(`<backup>
            <duration>%s</duration>
            </backup>\n`, duration);
            
    }


    function end_measure()
    {
        xml_out += `</measure>\n`;
        
    }

    function do_comment(comment)
    {
        xml_out += sprintf(`<!-- %s -->\n`, comment);
        
    }




