
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN ABMXMLLib_COMMON.JS");

// the routine which uses this needs something like:
// var MLIB = new MusicDOM(); 
// to declare an instance of this object

function MusicDOM() 
{

    this.show_all = false;
    this.SKIP_ERROR = true; // use this to skip error messages in DOM calls


    this.xml_string_out = ""; // output from processing


this.note_letters_flat = ["", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
this.note_letters_sharp = ["", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
this.sharp_flat_from_note = {
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

this.note_numbers = {
        
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
this.octave_numbers = {
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



    // Recognized chords in the key of C
    // changed to o
    this.c_chord_data = 
    {
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
            chord_kind: "dominant", tritone: true, leading: true, ninth_ok: true ,
            degree:`ac
                <degree>
                <degree-value>5</degree-value>
                <degree-alter>-1</degree-alter>
                <degree-type>alter</degree-type>
            </degree>`},


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

    // ADH - I don't think we need this any more (6/2020)
    /*** 
    this.musicxml_chords = {};

    let chord_keys = Object.keys(this.c_chord_data);
    for (let ii = 0; ii < chord_keys.length; ii++) {
        let skey = chord_keys[ii];
        chord_data = this.c_chord_data[skey];
        chord_data.chord = skey;

        chord_kind = chord_data.chord_kind;
        //stext = get_text_from_chord_kind(chord_kind);
        stext = "";
        //console.log("KEY: %s chord_kind: %s stext: %s", skey, chord_kind, stext);
        if (this.musicxml_chords[chord_kind])
        {
            //console.log("SKIP");
        }
        else
        {
            this.musicxml_chords[chord_kind] = skey;
        }

    }
    */

    // map alternates to main chord
    // these are ways the chord might be written
    this.chord_substitutions = [];
    this.chord_substitutions["maj7"] = "M7";
    this.chord_substitutions["maj9"] = "M9";

    this.chord_substitutions["7+9#5"] = "aug7(#9)";

    // Gaug7 can also be written as G+7, G7+ or G7#5
    this.chord_substitutions["+7"] = "aug7";
    this.chord_substitutions["+"] = "aug";
    this.chord_substitutions["7+5"] = "aug7";
    this.chord_substitutions["7#5"] = "aug7";
    this.chord_substitutions["7+"] = "aug7";
    this.chord_substitutions["+7"] = "aug7";
    this.chord_substitutions["7aug"] = "aug7";
    
    this.chord_substitutions["79aug"] = "aug9";

    this.chord_substitutions["9+5"] = "aug9";
    this.chord_substitutions["9#5"] = "aug9";
    this.chord_substitutions["9+"] = "aug9";
    this.chord_substitutions["+9"] = "aug9";
    this.chord_substitutions["9aug"] = "aug9";

    this.chord_substitutions["9sus"] = "9sus4";
    this.chord_substitutions["7sus"] = "7sus4";
   
    this.chord_substitutions["sus"] = "sus4";




    this.chord_substitutions["add6(9)"] = "69";
    //this.chord_substitutions["69"] = "6add9";

    this.chord_substitutions["2"] = "sus2";
    this.chord_substitutions["4"] = "sus4";


    this.chord_substitutions["7+9"] = "7(#9)";
    this.chord_substitutions["7#9"] = "7(#9)";
    this.chord_substitutions["7-9"] = "7(b9)";
    this.chord_substitutions["7b9"] = "7(b9)";

    this.chord_substitutions["7sus+9"] = "7sus4(#9)";
    this.chord_substitutions["7sus#9"] = "7sus4(#9)";
    this.chord_substitutions["7sus-9"] = "7sus4(b9)";
    this.chord_substitutions["7susb9"] = "7sus4(b9)";

    this.chord_substitutions["7sus4+9"] = "7sus4(#9)";
    this.chord_substitutions["7sus4#9"] = "7sus4(#9)";
    this.chord_substitutions["7sus4-9"] = "7sus4(b9)";
    this.chord_substitutions["7sus4b9"] = "7sus4(b9)";


    this.chord_substitutions["+9"] = "(#9)";
    this.chord_substitutions["-9"] = "(b9)";

    this.chord_substitutions["(add2)"] = "add2";
    this.chord_substitutions["(add4)"] = "add4";
    this.chord_substitutions["(add6)"] = "add6";
    this.chord_substitutions["(add9)"] = "add9";

    // when to bump the octave
    this.step_number = {
        
        "C" : 0,
        "D" : 1,
        "E" : 2,
        "F" : 3,
        "G" : 4,
        "A" : 5,
        "B" : 6,      
    };

     // ## and bb do not work yet
     this.accidentals_in_key = {
        "C": {"C": "", "D": "", "E": "", "F": "", "G": "", "A": "", "B": ""},
        "F": {"C": "", "D": "", "E": "", "F": "", "G": "", "A": "", "B": "flat"},
        "Bb": {"C": "", "D": "", "E": "flat", "F": "", "G": "", "A": "", "B": "flat"},
        "Eb": {"C": "", "D": "", "E": "flat", "F": "", "G": "", "A": "flat", "B": "flat"},
        "Ab": {"C": "", "D": "flat", "E": "flat", "F": "", "G": "", "A": "flat", "B": "flat"},
        "Db": {"C": "", "D": "flat", "E": "flat", "F": "", "G": "flat", "A": "flat", "B": "flat"},
        "Gb": {"C": "", "D": "flat", "E": "flat", "F": "flat", "G": "flat", "A": "flat", "B": "flat"},
        "Cb": {"C": "flat", "D": "flat", "E": "flat", "F": "flat", "G": "flat", "A": "flat", "B": "flat"},

        "G": {"C": "", "D": "", "E": "", "F": "sharp", "G": "", "A": "", "B": ""},
        "D": {"C": "sharp", "D": "", "E": "", "F": "sharp", "G": "", "A": "", "B": ""},
        "A": {"C": "sharp", "D": "", "E": "", "F": "sharp", "G": "sharp", "A": "", "B": ""},
        "E": {"C": "sharp", "D": "sharp", "E": "", "F": "sharp", "G": "sharp", "A": "", "B": ""},
        "B": {"C": "sharp", "D": "sharp", "E": "", "F": "sharp", "G": "sharp", "A": "sharp", "B": ""},
        "F#": {"C": "sharp", "D": "", "E": "sharp", "F": "sharp", "G": "sharp", "A": "sharp", "B": ""},
        "C#": {"C": "sharp", "D": "", "E": "sharp", "F": "sharp", "G": "sharp", "A": "sharp", "B": "sharp"},

        // We don't transpose to G#, D# or A#
        "G#": {"C": "sharp", "D": "", "E": "sharp", "F": "##", "G": "sharp", "A": "sharp", "B": "sharp"},
        "D#": {"C": "##", "D": "sharp", "E": "sharp", "F": "##", "G": "sharp", "A": "sharp", "B": "sharp"},

    };


    // f♭ – c♭ – g♭ – d♭ – a♭ – e♭ – b♭ – f – c – g – d – a – e – b – f# – c# – g# – d# – a# – e# – b# 
    
    // this has to mave room for offsets of -12 to 12
    this.line_of_fifths = [
        // 0
            "Db", "Ab", "Eb", "Bb", "F", "C", "G",
            "D", "A", "Fb", "Cb", "Gb", "Db", "Ab",      
            "Eb", "Bb", "F", "C", "G", "D", "A",

            "Fb", "Cb",
        // 23 start here
            "Gb", "Db", "Ab", "Eb", "Bb",
            "F", "C", "G", "D", "A", "E", "B",
            "F#", "C#", "G#", "D#", "A#",
        // 40
            "E#", "B#",

            "G", "D", "A", "E", "B", "F#", "C#",
            "G#", "D#", "A#", "E#", "B#", "G", "D", 
    ];

    // generate letters for each new line_)of_fifths number
    this.line_of_fifths_numbers = {
        "Gb": 23,
        "Db": 24,
        "Ab": 25,
        "Eb": 26, 
        "Bb": 27,
        "F": 28, "E#": 41,
        "C": 29, "B#": 42,
        "G": 30,
        "D": 31,
        "A": 32,
        "E": 33, "Fb": 21,
        "B": 34, "Cb": 22,
        "F#": 35,
        "C#": 36,
        "G#": 37,
        "D#": 38,
        "A#": 39,
    };

        // this is the center line note and octave for each clef sign and line
        this.clef_positions = [];
        //                   Sign Line
        this.clef_positions["G"] = [];
        this.clef_positions["G"][1] = {middle_letter: "D", middle_octave: 5, middle_number: 1};
        this.clef_positions["G"][2] = {middle_letter: "B", middle_octave: 4, middle_number: 6};
        this.clef_positions["G"][3] = {middle_letter: "G", middle_octave: 4, middle_number: 4};
        this.clef_positions["G"][4] = {middle_letter: "E", middle_octave: 4, middle_number: 2};
        this.clef_positions["G"][5] = {middle_letter: "C", middle_octave: 4, middle_number: 0};
    
        this.clef_positions["F"] = [];
        this.clef_positions["F"][1] = {middle_letter: "C", middle_octave: 3, middle_number: 0};
        this.clef_positions["F"][2] = {middle_letter: "A", middle_octave: 3, middle_number: 5};
        this.clef_positions["F"][3] = {middle_letter: "F", middle_octave: 3, middle_number: 3};
        this.clef_positions["F"][4] = {middle_letter: "D", middle_octave: 3, middle_number: 1};
        this.clef_positions["F"][5] = {middle_letter: "B", middle_octave: 2, middle_number: 6};
    
        this.clef_positions["C"] = [];
        this.clef_positions["C"][1] = {middle_letter: "G", middle_octave: 4, middle_number: 4};
        this.clef_positions["C"][2] = {middle_letter: "E", middle_octave: 4, middle_number: 2};
        this.clef_positions["C"][3] = {middle_letter: "C", middle_octave: 4, middle_number: 0};
        this.clef_positions["C"][4] = {middle_letter: "A", middle_octave: 3, middle_number: 5};
        this.clef_positions["C"][5] = {middle_letter: "F", middle_octave: 3, middle_number: 3};
    



    this.transpose_pitch = function(what, old_step, old_alter, old_octave, old_key, new_key) 
    {
        console.log(this.get_self(what, old_step, old_alter, old_octave, old_key, new_key));
        let old_note = old_step;
        if (old_alter == 1)
            old_note += "#";
        else if (old_alter == -1)
            old_note += "b";

        let transposed_note = this.transpose_note(what, old_note, old_octave, old_key, new_key);
        return(transposed_note);
    };

    // transpose_note(what, old_note, old_octave, old_key, new_key) 
    this.transpose_note = function(what, old_note, old_octave, old_key, new_key) 
    {
        console.log(this.get_self(what, old_note, old_octave, old_key, new_key));
        let parameters = this.parameters;
        let show_output = this.show_output;

        if (show_output)
            console.log("transpose_pitch: old_key: %s new_key: %s old_note: %s old_octave: %s", 
                old_key, new_key, old_note, old_octave);
        
        
        if (show_output)
            console.log("old_key: %s new_key: %s old_note: %s", old_key, new_key, old_note);

        let old_key_number = this.note_numbers[old_key];
        let new_key_number = this.note_numbers[new_key];
        let key_offset = new_key_number - old_key_number;

        let up_offset = (key_offset + 12) % 12; // move up
        let down_offset = (key_offset - 12) % 12; // move down

        if (parameters.transpose_direction == "up")
            key_offset = up_offset; // move up
        else if (parameters.transpose_direction == "down")
            key_offset = down_offset; // move down
        else    // closest
        {
            // get closest offset
            
            if (Math.abs(up_offset) <= Math.abs(down_offset))
                key_offset = up_offset;
            else
                key_offset = down_offset;
        }
        
        let new_fifths = this.line_of_fifths_numbers[new_key] - this.line_of_fifths_numbers["C"];
        if (show_output)
            console.log("old_key: %s new_key: %s key_offset: %s new_fifths: %s", old_key, new_key, key_offset, new_fifths);


        let kpos1 = this.line_of_fifths_numbers[old_key];
        
        let kpos2 = this.line_of_fifths_numbers[new_key];
        
        let fifths_offset = kpos2 - kpos1;
        
        if (show_output)
            console.log("kpos1: %s kpos2: %s fifths_offset: %s", kpos1, kpos2, fifths_offset);
        
        let npos1 = this.line_of_fifths_numbers[old_note]; 
        
        let npos2 = npos1 + fifths_offset;
        let new_note = this.line_of_fifths[npos2];
        if (show_output)
            console.log("npos1: %s npos2: %s fifths_offset: %s new_note: %s",
                npos1, npos2, fifths_offset, new_note);
        let new_step = new_note.substr(0,1);
        let new_alter = 0;
        if (new_note.substr(1,1) == '#')
            new_alter = "1";
        else if (new_note.substr(1,1) == 'b')
            new_alter = "-1";

        // offset octave
        let old_step = old_note.substr(0,1);
        let old_step_number = this.step_number[old_step];
        let new_step_number = this.step_number[new_step];

        let new_octave = Number(old_octave);    // ADH - calculate change of octave
        if (key_offset > 0 && new_step_number < old_step_number)
            new_octave += 1;
        else if (key_offset < 0 && new_step_number > old_step_number)
            new_octave -= 1;

        let new_accidental = "";
        if (new_alter < 0)
            new_accidental = "flat";
        else if (new_alter > 0)
            new_accidental = "sharp";

        //if (show_output)
            console.log(`transposed_note: %s %s \n` +
                        `     old_note: %s old_octave: %s \n` + 
                        `     new_note: %s new_octave: %s new_accidental: %s`, 
                what, this.get_caller(), 
                old_note, old_octave, 
                new_note, new_octave, new_accidental);
                
        let transposed_note = {
            "new_note": new_note,
            "new_step": new_step,
            "new_alter": new_alter,
            "new_octave": new_octave,
            "new_accidental": new_accidental,
        };
        return (transposed_note);
    };

    // parameters used:
    // transpose_key e.g. "Bb"
    // transpose_direction - "up" or "down" (use closest if not set)
    // song_name - not currently used
    // show_output - true to show all console.logs

    this.str_out = "";

    this.attributes = {divisions: 0, 
        time: {beats: 0, beat_type: 0}, 
        key: {fifths: 0, mode: null},
        staves: null, clef: []};

    

    let quarter_divs = 256; // sibelius shows divisions and quarter notes as 256

    this.note_duration = {quarter: quarter_divs, eighth: quarter_divs/2, sixteenth: quarter_divs/4,
        half: quarter_divs * 2, whole: quarter_divs * 4};

    this.get_duration = function(type, dotted)
    {
        let duration = this.note_duration[type];
        if (dotted)
            duration *= 1.5;
        return(duration);
    };

    this.get_alter = function(snote)
    {
        let ret = 0;
        if (snote.substr(1,1) == "#")
            ret = 1;
        else if (snote.substr(1,1) == "b")
            ret = -1;
        return(ret);
    };

    this.get_accidental = function(snote)
    {
        let sret = "";
        if (snote.substr(1,1) == "#")
            sret = "sharp";
        else if (snote.substr(1,1) == "flat")
            sret = "flat";
        //console.log("get_accidental: %s: %s", snote, sret);
        return sret;
    };

 
  

    this.get_caller = function() {
        let error_stack2 = (new Error).stack;
        let caller_stack_array = error_stack2.split("\n");
        //console.log("GET_CALLER: %s", error_stack2);
        let scaller = error_stack2;
        if (caller_stack_array.length > 2)
        {
            let caller_line2 = caller_stack_array[3];
            let ipos1 = caller_line2.indexOf("at");     
            let sname = caller_line2.substr(ipos1 + 3);
            let ipos2 = sname.indexOf(" ");
            sname = sname.substr(0, ipos2);
            //console.log("SNAME: %s", sname);
            let ipos3 = caller_line2.lastIndexOf(":");
            let ipos4 = caller_line2.substr(0, ipos3).lastIndexOf(":");
            let sline = caller_line2.substr(ipos4+1, ipos3-ipos4 - 1);
            scaller = "***Called by: " + sname + " " + sline;
        }

        return (scaller);

    };
    

    this.show_dom_element = function(parent_element, what)
    {
        if (!what)
            what = "";
        let parent = parent_element.parentElement;
        let sparent;
        if (parent)
            sparent = parent.tagName;
        else    
            sparent = "None";
        console.log("**********\nshow_dom_element: %s - %s PARENT: %s %s", parent_element.tagName, what, sparent, this.get_caller());
        //console.log("type: %s is_array: %s", typeof(parent_element), Array.isArray(parent_element));
        // display first level sub-elements

        let children = parent_element.children;
        //console.log("CHILDREN: %s", children.length);
        for (let  ii = 0; ii < children.length; ii++)
        {
            let child_element = children[ii];
            // console.log("CHILD %s: %s", ii, child_element.tagName);
            let sname = child_element.tagName;
            let satt = "";
            if (child_element.attributes)
            {
                for (let  ia = 0; ia < child_element.attributes.length && ia < 3; ia++)
                {
                    satt += child_element.attributes[ia].nodeName + "=\"" + child_element.attributes[ia].value + "\" ";
                }
            }
            let svalue = this.get_element_value(child_element);
            console.log("- %s SATT: %s VALUE: %s", sname, satt, svalue);
        }
        
    };

    this.show_dom_element_value = function(parent_element, name, sindent)
    {
        //console.log("show_dom_element_value parent_element: %s name: %s", parent_element.tagName, name);
        let sub_element = parent_element.querySelector(name);
        if (!sub_element)
        {
            console.error("Element to show not found: %s parent: %s name: %s %s", parent_element.tagName, name);
            return;
        }

        let value = sub_element.innerHTML;
        console.log("%s- %s: %s", sindent, name, value);
 
    };

    // const duration = +durationElem.innerHTML;
    this.get_dom_element_value = function(parent_element, name)
    {
        let sub_element = parent_element.querySelector(name);
        if (!sub_element)
        {
            console.error("get_dom_element_value sub_element not found: %s %s", parent_element.tagName, name);
            return("");
        }
        let value = sub_element.innerHTML;
        return(value);
    };

    this.get_dom_element_value_numeric = function(parent_element, name)
    {
        let value = this.get_dom_element_value(parent_element, name);
        let number = Number(value);
        if (number == "NaN")
            console.error("Bad Numeric Value: %s name: %s: %s", parent_element.tagName, name, value, number);
        console.log("get_dom_element_value_numeric: %s %s: value: '%s' number: %s", parent_element.tagName, name, value, number);
        return(number);
    };

     // let duration = +duration_elem.innerHTML;
     this.get_element_value = function(element)
     {
         let value = element.innerHTML;
         return(value);
     };

     this.get_element_value_numeric = function(element)
     {
         let value = this.get_element_value(element);
         let number = Number(value);
         if (number == "NaN")
         {
             console.error("Bad Numeric Value for %s: %s %s", element.tagName, value, number, this.get_caller());
         }
         //console.log("get_element_value_numeric: value: '%s' number: %s", value, number);
         return(number);
     };

 
     // let duration = +duration_elem.innerHTML;
     this.get_dom_element_value = function(parent_element, name, skip_error)
     {
         let sub_element = parent_element.querySelector(name);
         if (!sub_element)
         {
             if (!skip_error)
                 console.error("get_dom_element_value sub_element not found: %s %s", parent_element.tagName, name);
             return("");
         }
         let value = sub_element.innerHTML;
         return(value);
     };

     this.get_dom_element_value_numeric = function(parent_element, name, skip_error)
     {
         let value = this.get_dom_element_value(parent_element, name, skip_error);
         let number = Number(value);
         if (number == "NaN")
         {
             // always report this error
             console.error("Bad Numeric Value: %s name: %s: %s", parent_element.tagName, name, value, number);
         }
         if (this.show_output)
             console.log("get_dom_element_value_numeric: %s %s: value: '%s' number: %s", parent_element.tagName, name, value, number);
         return(number);
     };

     //step_elem.innerHTML = transposedRest.step;
    this.change_dom_element_value = function(parent_element, name, value)
    {
        if (this.show_output)
            console.log("*** change_dom_element_value: %s %s --> %s: %s", parent_element.tagName, name, value, this.get_caller());
        let sub_element = parent_element.querySelector(name);
        if (!sub_element)
        {
            console.error("Element to change not found: %s", name);
            //this.show_dom_element(parent_element, "PARENT_ELEMENT");
            return;
        }
        sub_element.innerHTML = value;
    };

    
    // this.insert_dom_value_after(pitch_elem, "step", "alter", note.transposed.new_alter);
    this.insert_dom_value_after = function(parent_element, existing_name, new_name, value)
    {
        if (this.show_output)
            console.log("*** insert_dom_value_after: parent_element: %s new_name:  %s existing_name: %s --> %s", 
            parent_element.tagName, new_name, existing_name, value);
    
        // create new element with value
        let new_element = document.createElementNS('', new_name);
        new_element.innerHTML = value;

        //console.log("outerHTML: %s", new_element.outerHTML);

        this.show_dom_element(new_element, "before CALL");

        this.insert_dom_element_after(parent_element, existing_name, new_element);
    };

    this.insert_dom_element_after = function(parent_element, existing_name, new_element)
    {
        if (this.show_output)
            console.log("*** insert_dom_value_after: parent_element: %s existing_name: %s new_element: %s", 
            parent_element.tagName, existing_name, new_element.tagName);

        let existing_element = parent_element.querySelector(existing_name);
        if (!existing_element)
        {
            console.error("Element to insert after not found: %s", existing_name);
            //this.show_dom_element(parent_element, "PARENT_ELEMENT");
            return;
        }
    
        let element_to_insert = this.clone_dom_element(new_element);
        existing_element.insertAdjacentElement("afterend", element_to_insert);
        //this.show_dom_element(parent_element, "PARENT AFTER INSERT");
    };

    this.append_dom_element = function(parent_element, new_element)
    {
        if (this.show_output)
            console.log("*** append_dom_element: parent_element: %s new_element:  %s ", 
                parent_element.tagName, new_element.tagName);
        
        //this.show_dom_element(new_element, "NEW ELEMENT");
        
        let element_to_append = this.clone_dom_element(new_element);
        parent_element.AppendElement(element_to_append);
        //this.show_dom_element(parent_element, "PARENT AFTER APPEND");
    };

    this.remove_dom_element_by_name = function(parent_element, name)
    {
        let sub_element = parent_element.querySelector(name);
        if (!sub_element)
        {
            console.error("Element to remove not found: %s", name);
            //this.show_dom_element(parent_element, "PARENT_ELEMENT");
            return;
        }

        sub_element.remove();
        
    };

    this.clone_dom_element = function(element)
    {
        let new_element = element.cloneNode(true);
        return (new_element);
                
    };

    this.show_object = function(object, what)
    {
        if (!what)
            what = "Object";
        let sout;
        if (object)
            sout = JSON.stringify(object).replace(/,"/g, "\n\"");
        else
            sout = "undefined";
        console.log("%s: %s %s", what, sout, this.get_caller());
    };

   

// parse xml string into a DOM object
// save the header to put backi into output
this.xml_to_dom_object = function(xml_string_in)
{
    // save header data and restore it when done
    let ipos = xml_string_in.indexOf("<score");

    if (ipos < 0) 
    {
        alert("<score not found in MusicXML");
        return(false);
    }
    this.xml_header = xml_string_in.substr(0, ipos);

    console.log("XML_HEADER: %s", this.xml_header);

    let parser = new DOMParser();
    let dom_object = parser.parseFromString(xml_string_in, 'application/xml');
    return(dom_object);
};

this.dom_object_to_string = function(dom_object)
{
    let xml_out = dom_object.firstElementChild.outerHTML;
    //console.log("BEFORE REPLACE: %s', xml_string_return);
    //xml_string_return = xml_string_return.replace(/></g, ">\n<");

    let xml_string_return = this.xml_header + xml_out;
    return(xml_string_return);
};



this.show_transposed_score = function()
{
    let elt = document.getElementById("transposed_score");
    elt.style.display = "block";
    elt.innerText = this.xml_string_out;
};

this.copy_transposed_score = function()
{
    if (this.this.xml_string_out === "")
    {
        alert("No Transposed Score available");
    }
    else
    {
        this.copyToClipboard(this.xml_string_out);
        alert(this.xml_string_out.length + " bytes copied to clipboard");
    }
};

this.copyToClipboard = function(text) {
    let dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
};

this.get_self = function(sarg, sarg2, sarg3, sarg4) {
    //console.log("SARG: %s SARG@: %s SARG3: %s", sarg, sarg2, sarg3);
    if (sarg  == undefined)
        sarg = "";
    else if (isNaN(sarg))
        sarg = "'" + sarg + "'";

    if (sarg2  == undefined)
        sarg2 = "";
    else if (isNaN(sarg2))
        sarg2 = ", '" + sarg2 + "'";
    else
        sarg2 = ", " + sarg2;

    if (sarg3  == undefined)
        sarg3 = "";
    else if (isNaN(sarg3))
        sarg3 = ", '" + sarg3 + "'";
    else
        sarg3 = ", " + sarg3;

    if (sarg4  == undefined)
        sarg4 = "";
    else if (isNaN(sarg4))
        sarg4 = ", '" + sarg4 + "'";
    else
        sarg4 = ", " + sarg4;

    let error_stack2 = (new Error).stack;

    let self_line2 = error_stack2.split("\n")[2];
    let caller_line2 = error_stack2.split("\n")[3];
    //console.log("GET_SELF: %s", caller_line2);

    // at show_game_setup (file:///C:/web/EasyHand/hh/EasyHandReplayer.js?v=2.62) 
    let ipos1 = self_line2.indexOf("at ");
    let self_name = self_line2.substr(ipos1 + 3);
    let ipos2 = self_name.indexOf(" ");
    self_name = self_name.substr(0, ipos2);
    let self = "";

    if (caller_line2) {
        let ipos1 = caller_line2.indexOf("at");
        let sname = caller_line2.substr(ipos1 + 3);
        let ipos2 = sname.indexOf(" ");
        sname = sname.substr(0, ipos2);
        //console.log("SNAME: %s", sname);

        let ipos3 = caller_line2.lastIndexOf(":");
        let ipos4 = caller_line2.lastIndexOf(":", ipos3-1);
        let sline = caller_line2.substr(ipos4 + 1, ipos3 - ipos4 - 1);

        self = sprintf("*** %s(%s%s%s%s) *** Called by: %s: %s\n", self_name, sarg, sarg2, sarg3, sarg4, sname, sline);
    }
    else {
        self = sprintf("*** %s(%s%s%s%s) *** No caller\n", self_name, sarg, sarg2, sarg3, sarg4);
    }
    //console.log("GET SELF: %s", self);
    return (self);
};

this.get_base_url = function()
{
    let curr_page = window.location.href;
    let base_page = curr_page;

    // If current page has a query string, append action to the end of the query string, else
    // create our query string
    let ipos = curr_page.indexOf("?");
    if (ipos >= 0)
        base_page = curr_page.substr(0, ipos);

    return(base_page);

};


    this.get_url_vars = function()
    {
        //console.log(this.get_self());
        if (this.url_vars)
            console.error("url_vars already defined");

        let url_string = window.location.href;
        let ipos = url_string.indexOf("#");
        if (ipos >= 0)
        {
            url_string = url_string.substr(0, ipos);
        }
        let url_vars = [];
        url_string.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key,value) 
        {
                url_vars[key] = unescape(value);
        });

        this.url_vars = url_vars;
        return this.url_vars;
    };

    this.get_url_var = function(svar)
    {
        console.log(this.get_self(svar));
        if (!this.url_vars)
        {
            console.log("getting url_vars");
            this.get_url_vars();
        }
        let sval = this.url_vars[svar];
        if (!sval)
            sval = "";
        return(sval);
};
    
 

  this.add_chord_notes = function(chord_data)
  {
      // chord_data = {schord: schord, sbass: sbass, octave; octave, one_note: false, start_at: 1, duration: one_beat_duration};

      console.log("add_chord_notes: %s", this.get_caller());
      //this.show_object(chord_data, "chord_data");
      

    let parameters = this.parameters;
      
    let schord = chord_data.schord;

    let sroot, chord_alter, accidental, ssub;
      let chord_step = schord.substr(0,1);  // single letter for chord
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
          sroot = schord.substr(0,1);
          chord_alter = 0;
          accidental = "";
          ssub = schord.substr(1);
      }
      
      console.log("schord: %s chord_step: %s sroot: %s chord_alter: %s accidental: %s ssub: %s",
         schord, chord_step, sroot, chord_alter, accidental, ssub);

      let schord_in_c = "C" + ssub;
      let c_chord = this.c_chord_data[schord_in_c];
      if (!c_chord)
      {
          console.log("CHORD NOT FOUND: %s", c_chord);

          return("");
      }

      let notes_array = c_chord.notes;
      console.log("schord: %s notes_array: %s", schord, notes_array.join("  "));

      


      // get inversion based on bass note
      let sbass = schord.sbass;
      let inversion = 0;  // none
      console.log("SROOT: %s SBASS: %s ", sroot, sbass);
      if (sbass !== "" && sbass != sroot)
      {
          // find first note at or above the bass note
          // chord offset from C
          let root_note_number = this.note_numbers[sroot];
          let root_note_offset = (root_note_number - this.note_numbers["C"] + 12) % 12;
          console.log("sroot: %s root_note_number: %s root_note_offset: %s", sroot, root_note_number, root_note_offset);

          let bass_note_number = this.note_numbers[sbass];
          let bass_note_offset = (bass_note_number - root_note_number + 12) % 12;
          console.log("sbass: %s bass_note_number: %s bass_note_offset: %s", sbass, bass_note_number, bass_note_offset);

          for (let  inote = 0; inote < notes_array.length; inote++)
          {
              let chord_note = notes_array[inote];
              let chord_note_number = this.note_numbers[chord_note];
              let chord_note_offset = (chord_note_number - this.note_numbers["C"] + 12) % 12;
              console.log("chord_note: %s chord_note_number: %s bass_note_offset: %s chord_note_offset: %s", 
                  chord_note, chord_note_number, bass_note_offset, chord_note_offset);
              if (chord_note_offset >= bass_note_offset)
              {
                  inversion = inote;
                  console.log("SET INVERSION: %s", inversion);
                  break;
              }
          }
          console.log("INVERSION: %s", inversion);

      }
      let chord_xml = "";

      
      /*
              xml_score += sprintf(`<harmony color="#000000" default-y="25">
                  <root>
                  <root-step>%s</root-step>
                  <root-alter>%s</root-alter>
                  </root>
                  <kind>%s</kind>
              </harmony>\n`, chord_step, chord_alter, chord_kind); 
      */



      let last_note_number = 1;

      let half_steps = 0;

      let new_chord = true;   // first note of chord

      console.log("chord_data.one_note: %s ", chord_data.one_note);

      for (let  ii = 0; ii < notes_array.length; ii++) 
      {
            // see it there are carried over notes
            let inote = (ii + inversion + notes_array.length) % notes_array.length;
            let note_letter = notes_array[inote];
            let note_number = this.note_numbers[note_letter];
            console.log("ii: %s inversion: %s inote: %s note_letter: %s note_number: %s last_note_number: %s", 
                ii, inversion, inote, note_letter, note_number, last_note_number);


        
            let half_steps_offset = note_number - last_note_number;
            if (half_steps_offset < 0)
                half_steps_offset += 12;
            half_steps = half_steps + half_steps_offset;
          
            last_note_number = note_number;

          


            console.log("ii: %s individual_notes: %s beats: %s new_chord: %s", 
                ii, parameters.individual_notes, this.attributes.time.beats,  new_chord);

            console.log("ii: %s note_letter: %s half_steps: %s new last_note_number: %s half_steps: %s", 
                ii, note_letter, half_steps, last_note_number, half_steps);



            if (ii < chord_data.start_at - 1)
                continue;   // skip notes alread out
          
            // add first note or rest of notes
            let chord_note_xml = this.add_note_to_chord(sroot, chord_data.octave, half_steps, chord_data.duration, new_chord); 
            chord_xml += chord_note_xml;
            console.log("chord_note_xml: %s", chord_note_xml);

            new_chord = false;

          
            if (chord_data.one_note)
                break;  // output just one note

      }
      
      return(chord_xml);


  };

  // sbase = Bb, D, F#
  this.add_note_to_chord = function(sbase, octave, half_steps, duration, new_chord)
  {
      console.log("add_note_to_chord: sbase: %s octave: %s half_steps: %s new_chord: %s  %s",
          sbase, octave, half_steps, new_chord, this.get_caller() );
      let base_number = this.note_numbers[sbase];

      let sharp_flat = this.sharp_flat_from_note[sbase];
      //console.log("sbase: %s base_number: %s sharp_flat: %s", sbase, base_number, sharp_flat);
      let new_number = base_number + half_steps;
      let new_octave = octave;
      while (new_number > 12)
      {
          new_number -= 12;
          new_octave++;
      }
      let new_note;
      if (sharp_flat == "#")
          new_note = this.note_letters_sharp[new_number];
      else 
          new_note = this.note_letters_flat[new_number];

      let new_note_step = new_note.substr(0,1);
      let new_note_alter = this.get_alter(new_note);
      let new_note_accidental = this.get_accidental(new_note);
      //console.log("add_note_to_chord: half_steps: %s new_number: %s new_note: %s new_note_step: %s new_note_alter: %s accidental: %s", 
      //    half_steps, new_number, new_note, new_note_step, new_note_alter, new_note_accidental);

      let stype = "quarter";
      if (duration == this.attributes.divisions)
      {
          stype = "quarter";
      }
      else if (duration == this.attributes.divisions / 2)
      {
          stype = "eighth";
      }
      else if (duration == this.attributes.divisions * 2)
      {
          stype = "half";
      }
      else if (duration == this.attributes.divisions * 4)
      {
          stype = "whole";
      }
      
      
      let note_html = `<note default-x="26">\n`;
      if (!new_chord)
      {
          // <chord is in the second note of the chord
          note_html += `<chord />\n`;
      }
      note_html += sprintf(`<pitch>
          <step>%s</step>
          <alter>%s</alter>
          <octave>%s</octave>
          </pitch>
          <duration>%s</duration>
          <instrument id="P1-I1" />
          <type>%s</type>\n`, new_note_step, new_note_alter, new_octave, duration, stype);
          
      //note_html += `<lyric default-y="-80" number="part1verse1" >
      //    <syllabic>single</syllabic>
      //    <text>. . . .</text>
      //</lyric>\n`;
      if (new_note_accidental !== "")
          note_html += sprintf(`<accidental>%s</accidental>\n`, new_note_accidental);
    
      note_html += `</note>\n`;
      return(note_html);

  };

    // steps above or below middle line of staff
    // for transposed note
    this.get_note_offset = function(note)
    {
        console.log("get_note_offset %s", this.get_caller());
        this.show_object(note, "note");
        if (this.attributes.clef[note.staff])
        {
            clef = this.attributes.clef[note.staff];
        }
        else
        {
            clef = this.attributes.clef[0];    // MuseScore does not store clefs by staff number
        }
        note_offset = (note.transposed.new_octave - clef.middle_octave) * 7 + this.step_number[note.transposed.new_step] - clef.middle_number;
        if (this.show_output)
            console.log("get_note_offset: new_octave: %s middle_octave: %s new_step: %s step_number: %s middle_number: %s note_offset: %s", 
            note.transposed.new_octave, clef.middle_octave, note.transposed.new_step, this.step_number[note.transposed.new_step], 
            clef.middle_number, note_offset);
        return(note_offset);
    };

    // after you get this, and changes will automatically be stored in array
    this.get_current_accidental = function(measure_data, voice, octave, note_step)
    {
        //console.log("get_current_accidental: voice: %s octave: %s note_step: %s", voice, octave, note_step);
        // we need to track accidentals by both voice and octave
        if (!measure_data.current_accidentals[voice])
        {
            //console.log("New array for voice");
            measure_data.current_accidentals[voice] = [];
        }
        
        if (!measure_data.current_accidentals[voice][octave])
        {
            //console.log("New array for octave");
            // since this is an object, we need to clone it
            //console.log("for accidentals: NEW KEY: %s", this.new_key);
            measure_data.current_accidentals[voice][octave] = JSON.parse(JSON.stringify(this.accidentals_in_key[this.new_key]));
            //this.show_object(this.accidentals_in_key[this.new_key], "accidentals_in_key");
            //this.show_object(measure_data.current_accidentals[voice][octave], "measure_data.current_accidentals[voice][octave]");

        }

        if (this.show_output)
            console.log("get_current_accidental:  voice: %s octave: %s note_step: %s current_accidental: %s", 
                voice, octave, note_step, measure_data.current_accidentals[voice][octave][note_step]);
        return (measure_data.current_accidentals[voice][octave][note_step]);
    };

     
// for voice leading inversions
this.get_chord_notes = function(chord, inversion_number) 
{
    console.log("GET_CHORD_NOTES(%s right: %s ninth: %s, %s)", chord.root, chord.rigfht, chord.ninth, inversion_number);

    let inversion_save = inversion_number;
    console.log("GET_CHORD_NOTES inversion_save: '%s' %s ==1: %s ==\"1\": %s", 
        inversion_save, typeof (inversion_save), inversion_save == 1, inversion_save == "1");
        
    // apply inverson
    chord.inversion_notes_array = [];
    for (let ii = 0; ii < chord.notes_array.length; ii++) {
        let new_pos = (chord.notes_array.length + ii + inversion_number) % chord.notes_array.length;
        let new_note = chord.notes_array[new_pos];
        chord.inversion_notes_array[ii] = new_note;
        console.log("inversion_number: %s new_pos: %s new_note: %s", inversion_number, new_pos, new_note);
    }
    console.log("get_chord_notes: chord.inversion_notes_array: %s", chord.inversion_notes_array.join(" "));


    let letters_html = "";
    let match_found = false;
    console.log("chord.inversion_notes_array: %s", chord.inversion_notes_array.join(" "));
    if (inversion_data.last_chord.inversion_notes_array)
        console.log("last_chord.inversion_notes_array: %s", inversion_data.last_chord.inversion_notes_array.join(" "));

    for (let ii = 0; ii < chord.inversion_notes_array.length; ii++) {
         // see it there are carried over notes
        let note_letter = chord.inversion_notes_array[ii];
 
    
        
        let is_duplicate = false;
        if (inversion_data.last_chord.inversion_notes_array)
        {
            for (let inote = 0; inote < inversion_data.last_chord.inversion_notes_array.length; inote++) {
                let snote_last = inversion_data.last_chord.inversion_notes_array[inote];
                let half_steps = Math.abs(this.note_numbers[snote_last] - this.note_numbers[note_letter]);
                //console.log("ii: %s inote: %s snote_last: %s note_letter: %s half_steps: %s", ii, inote, snote_last, note_letter, half_steps);
                if (this.note_numbers[snote_last] == this.note_numbers[note_letter]) {
                    is_duplicate = true;
                    match_found = true;
                    if (ii == inote)
                        letters_html += "<b>" + note_letter + "</b> ";
                    else {
                        //letters_html += "<b style='color:red;'>**" + note_letter + "</b> ";
                        letters_html += note_letter + " ";
                    }
                    //console.log("is_duplicate: %s %s ii: %s inote: %s", note_letter, snote_last, ii, inote);
                    break;
                }
            }
        }
        
        if (is_duplicate) {
        }
        else
            letters_html += note_letter + " ";
            

    }



    letters_html = sprintf("<span style='font-size: %spx;' >%s</span>&nbsp;",
       notes_font_size, letters_html);


    return letters_html;
};


   

this.get_chord_data = function(chord_in) 
{
    let chord = {};
    chord.original = chord_in;
    if (chord.original[1] == 'b' || chord.original[1] == '#') {
        chord.root = chord.original.substr(0, 2);
        chord.right = chord.original.substr(2);
    }
    else 
    {
        chord.root = chord.original.substr(0, 1);
        chord.right = chord.original.substr(1);
    }
    if (!chord.right)
        chord.right = "";
    chord.base_note = "";
    let ipos = chord.right.indexOf("/");
    if (ipos >= 0)
    {
        chord.base_note = chord.right.substr(ipos + 1);
        chord.right = chord.right.substr(0,ipos);
    }

    let schord = sprintf("%s%s", chord.root, chord.right);

    // do chord_substitutions
    let modifier1 = chord.right;
    if (chord.right !== "")
    {
        let modifier2 = this.get_substitution(modifier1);
        
        
        // check for substitute chords
        if (modifier2 !== "") {
            chord.right = modifier2;
            let schord = sprintf("%s%s", chord.root, chord.right);
            console.log("AFTER SUBSTITUTION: %s chord.right: %s", schord, chord.right);
        }
    }

    chord.is_tritone = false;
    chord.is_leading = false;

    console.log("CHORD: %s CHORD.RIGHT: %s", chord.original, chord.right);
    // see if we have the exact chord with chord.right
    let skey = "C" + chord.right;
    let chord_data = this.c_chord_data[skey];

    if (chord_data)
        console.log("USE SKEY 1 %s", skey);

    if (!chord_data)
    {
        // see if we have it with 7th instead of 9th
        let chord_right2 = get_base_modifier(chord.right);        
        let skey = "C" + chord_right2;
        chord_data = this.c_chord_data[skey];
        if (chord_data)
            console.log("USE SKEY 2 %s", skey);
    }
    
    if (!chord_data)
    {
        // find best fit
    
        let keys = Object.keys(this.c_chord_data);
        for (let ii = 0; ii < keys.length; ii++) {
            let skey = keys[ii];
            let modifier = skey.substr(1);

            //console.log("ii: %s modifier: %s substr: %s",
            //    ii, modifier, chord_right2.substr(0, modifier.length)); // key

            if (chord_right2.substr(0, modifier.length) == modifier) {
                chord_data = this.c_chord_data[skey];
                console.log("ii: %s modifier: %s substr: %s",
                    ii, modifier, chord_right2.substr(0, modifier.length)); // key
                if (chord_data)
                    console.log("USE SKEY 3 %s", skey);
                break;
            }
        }
    }

    chord_data0 = chord_data;
    console.log("SKEY: %s make_all_ninths: %s chord_data.ninth_ok: %s chord.original: %s", 
        skey, parameters.make_all_ninths, chord_data.ninth_ok, chord.original);
    if (parameters.make_all_ninths && chord_data.ninth_ok && chord.original.indexOf("9") < 0 )
    {
        skey2 = skey.replace("7", "9");
        //chord.original = chord.original.replace("7", "9");
        chord.right = chord.right.replace("7", "9");
        chord_data = this.c_chord_data[skey2];    // use the ninth chord
        console.log("USE NINTH CHORD: %s --> skeys: %s", skey, skey2);
        skey = skey2;
        if (chord_data)
            console.log("USE SKEY 4 %s", skey);
    }


    if (!chord_data)
    {
        console.error("CHORD NOT FOUND in c_chord_data: %s chord.right: %s", schord, chord.right);
        return;
    }
    

    chord.modifier_key = skey;
    chord.is_tritone = chord_data.tritone;
    chord.is_leading = chord_data.leading;
    chord.kind = chord_data.chord_kind;
    chord.degree = chord_data.degree;
    console.log("%s USE chord_data: skey: %s chord_data.notes %s is_tritone: %s", 

        chord.original, skey, chord_data.notes.join(" "), chord.is_tritone);

    chord.ninth = "";
    if (chord.right.indexOf("add9") >= 0)
    {
        chord.ninth = ""; // leave root and 9th in chord
    }
    else if (chord.right.indexOf("69") >= 0)
    {
        chord.ninth = ""; // leave root and 9th in chord
    }
    else if (chord.right.indexOf("+9") >= 0 || chord.right.indexOf("#9") >= 0)
        chord.ninth = "#9";
    else if (chord.right.indexOf("-9") >= 0 || chord.right.indexOf("b9") >= 0)
        chord.ninth = "b9"; 
    else if (chord.right.indexOf("9") >= 0 || chord.right.indexOf("11") >= 0 || chord.right.indexOf("13") >= 0)
            chord.ninth = "9"; 
    console.log("chord.right: %s chord.ninth: %s", chord.right, chord.ninth);

    // offset for chord
    chord.notes_array = [];
    for (let ii = 0; ii < chord_data.notes.length; ii++) {
        snote = chord_data.notes[ii];



        if (parameters.make_all_ninths && chord.ninth !== "" && snote == "C")
        {
            if (chord.ninth == "#9")
                snote = "D#";
            else if (chord.ninth == "b9")
                snote = "Db";
            else    
                snote = "D";
            console.log("MAKE 9th: chord.ninth: %s snote: %s", chord.ninth, snote);
        }
        // transpose_note(what, old_note, old_octave, old_key, new_key)
        new_note_letter = this.transpose_note("inversions", snote, "C", transpose_key);

        chord.notes_array.push(new_note_letter);
        console.log("ii: %s snote: %s chord.ninth: %s new_note_letter: %s", 
            ii, snote, chord.ninth, new_note_letter);
    }
    console.log("get_chord_data: chord.notes_array: %s", chord.notes_array.join(" "));
    

    
    chord.original_right = chord.right;
    chord.original_root = chord.root;
    chord.original_base_note = chord.base_note;

    //show_chord();
    return(chord);
};

this.get_substitution = function(modifier1)
{
    ssub = "";
    if (modifier1.indexOf("13") >= 0)
    {
        ssub = "15";
    }
    if (modifier1.indexOf("13") >= 0)
    {
        ssub = "13";
    }
    if (modifier1.indexOf("11") >= 0)
    {
        ssub = "11";
    }
    if (ssub !== "")
    {
        modifier1 = modifier1.replace(ssub, "9");
        console.log("SSUB 1: %s", modifier1);
    }
    
    console.log("get_substitution modifier1: %s: chord_substitutions[modifier1]: %s", modifier1, this.chord_substitutions[modifier1]);
    // check for substitute chords
    if (this.chord_substitutions[modifier1]) {
        modifier2 = this.chord_substitutions[modifier1];
        
        console.log("get_substitution: %s --> %s",
             modifier1, modifier2);
        if (ssub !== "")
        {
            modifier2 = modifier2.replace("9", ssub);
            console.log("SSUB 2: %s", modifier2);
        }
        return(modifier2);
    }
    
    return("");
};



    this.get_best_inversion = function(chord) 
    {
        console.log(this.get_self(chord.original));


        if (!inversion_data.last_chord.inversion_notes_array ||
            inversion_data.last_chord.inversion_notes_array.length == 0)
        {
            console.error("NO last_chord.inversion_notes_array");
            return (0);
        }

        new_inversion = -1;
        used_leading = false;

        console.log("notes_array: %s last_chord.inversion_notes_array: %s", chord.notes_array.join(" "), inversion_data.last_chord.inversion_notes_array.join(" "));
        console.log("last_chord.is_leading: %s", inversion_data.last_chord.is_leading);
        // see if we want a leading tone inversion (tritone)
        if (inversion_data.last_chord.is_leading) {
            new_inversion = get_leading_inversion();
            if (new_inversion >= 0)
            {
                inversion_data.last_chord.inversion = new_inversion;
                return(new_inversion);
            }
            
        }
        

        
        best_half_steps = 999;
        for (let inversion_number = 0; inversion_number < chord.notes_array.length; inversion_number++) {
            
            total_half_steps = 0;

            // see it there are carried over notes

            for (let inote = 0; inote < inversion_data.last_chord.inversion_notes_array.length; inote++) {
                snote_last = inversion_data.last_chord.inversion_notes_array[inote];

                inversion_offset = (inote + inversion_number + chord.notes_array.length) % chord.notes_array.length;
                snote_new = chord.notes_array[inversion_offset];
                
                offset1 = (this.note_numbers[snote_new] - this.note_numbers[snote_last] + 12) % 12;
                offset2 = (this.note_numbers[snote_last] - this.note_numbers[snote_new] + 12) % 12;
                half_steps = Math.min(offset1, offset2);
                console.log("inversion_number: %s inversion_offset: %s snote_new: %s snote_last: %s offset1: %s offset2: %s HALF STEPS: %s", 
                    inversion_number, inversion_offset, snote_new, snote_last, offset1, offset2, half_steps);
                total_half_steps += half_steps;

                if (half_steps == 0)
                {
                    // if we find a match, stop
                    total_half_steps = 0;
                    break;
                }
            }

            console.log("inversion_number: %s total_half_steps: %s", inversion_number, total_half_steps);
            if (total_half_steps == 0) {
                console.log("get_best_inversion return: inversion_number from match: %s %s inversion_number: %s inote: %s", inversion_number, snote_last, inversion_number, inote);
                return (inversion_number);
            }
            
            if (total_half_steps < best_half_steps) {
                best_half_steps = total_half_steps;
                new_inversion = inversion_number;
                console.log("new best_half_steps: %s new_inversion: %s", best_half_steps, new_inversion);
            }
                


            
        }

        console.log("best_half_steps: %s ", best_half_steps);


        console.log("get_best_inversion: return new_inversion: %s", new_inversion);

        return (new_inversion);
    };

    this.get_rest = function(duration)
    {
        console.log("get_rest: duration: %s %s", duration, this.get_caller());
        let rest = sprintf(`    <note>
            <rest/>
            <duration>%s</duration>
            <voice>1</voice>
        </note>`, duration);
        return(rest);
    };


    this.sharp_flat_from_alter = function(alter)
    {
        if (alter > 0)
            return("#");
        if (alter < 0)
            return("b");
        return("");
    };

  
  this.lib_Common = "loaded";


}

 