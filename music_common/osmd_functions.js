

    var xml_score;

    var meaure_number = 0;
    var chord_number = 0;
    var staff_entry2;
    var chords_used;

    var backend_type = "svg";

    /***
 * 
  Kind indicates the type of chord. Degree elements
	can then add, subtract, or alter from these
	starting points. Values include:
	
	Triads:
	    major (major third, perfect fifth)
	    minor (minor third, perfect fifth)
	    augmented (major third, augmented fifth)
	    diminished (minor third, diminished fifth)
	Sevenths:
	    dominant (major triad, minor seventh)
	    major-seventh (major triad, major seventh)
	    minor-seventh (minor triad, minor seventh)
	    diminished-seventh
	        (diminished triad, diminished seventh)
	    augmented-seventh
	        (augmented triad, minor seventh)
	    half-diminished
	        (diminished triad, minor seventh)
	    major-minor
	        (minor triad, major seventh)
	Sixths:
	    major-sixth (major triad, added sixth)
	    minor-sixth (minor triad, added sixth)
	Ninths:
	    dominant-ninth (dominant-seventh, major ninth)
	    major-ninth (major-seventh, major ninth)
	    minor-ninth (minor-seventh, major ninth)
	11ths (usually as the basis for alteration):
	    dominant-11th (dominant-ninth, perfect 11th)
	    major-11th (major-ninth, perfect 11th)
	    minor-11th (minor-ninth, perfect 11th)
	13ths (usually as the basis for alteration):
	    dominant-13th (dominant-11th, major 13th)
	    major-13th (major-11th, major 13th)
	    minor-13th (minor-11th, major 13th)
	Suspended:
	    suspended-second (major second, perfect fifth)
	    suspended-fourth (perfect fourth, perfect fifth)
	Functional sixths:
	    Neapolitan
	    Italian
	    French
	    German
	Other:
	    pedal (pedal-point <root>)
	    power (perfect fifth)
	    Tristan
 * 
 */

    var xml_chord_kinds = ["major", "minor", "augmented", "diminished", "dominant", 
        "major-seventh", "minor-seventh", "diminished-seventh", "augmented-seventh", 
        "half-diminished", "major-minor", "major-sixth", "minor-sixth", 
        "dominant-ninth", "major-ninth", "minor-ninth", 
        "dominant-11th", "major-11th", "minor-11th", "dominant-13th", "minor-13th", 
        "suspended-second", "suspended-fourth", "Neapolitan", "Italian", "French", "German", 
        "pedal", "power", "Tristan", "other", "none"];

  
   
function make_xml_score_for_chords(is_test)
{
    console.log(get_self(is_test));
    measure_number = 0;
    xml_score = "";

    start_measure();

    if (is_test)
    {   
        add_chord("Cm11", 4);
        add_chord("Gm11", 4);
    }
    else
    {
        get_chords_used_in_score();
        chords = Object.keys(chords_used).sort();
        console.log("chords_used: %s", chords.length);
        for (ic = 0; ic < chords.length; ic++)
        {
            if (ic > 0 && (ic % 2) == 0)
            {
                end_measure();
                start_measure();
            }
            octave = 4;
            if (chords[ic].substr(0,1) == "B")
                octave = 3;
            add_chord(chords[ic], octave);

        }
    }

    end_measure();
    xml_score += `</part>
        </score-partwise>\n`;
    return;
   


    xml_score += `</part>
        </score-partwise>\n`;

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
 
 
    
    // sbase = Bb, D, F#
    function add_note(sbase, octave, half_steps)
    {
        //console.log(get_self(sbase, octave, half_steps));
        base_number = note_numbers[sbase];

        sharp_flat = sharp_flat_from_note[sbase];
        //console.log("sbase: %s base_number: %s sharp_flat: %s", sbase, base_number, sharp_flat);
        new_number = base_number + half_steps;
        new_octave = octave;
        while (new_number > 12)
        {
            new_number -= 12;
            new_octave++;
        }
        if (sharp_flat == "#")
            new_note = note_letters_sharp[new_number];
        else 
            new_note = note_letters_flat[new_number];

        new_note_step = new_note.substr(0,1);
        new_note_alter = get_alter(new_note);
        new_note_accidental = get_accidental(new_note);
        //console.log("add_note: half_steps: %s new_number: %s new_note: %s new_note_step: %s new_note_alter: %s accidental: %s", 
        //    half_steps, new_number, new_note, new_note_step, new_note_alter, new_note_accidental);
        
        
        xml_score += `<note default-x="26">\n`;
        if (half_steps != 0)
        {
            xml_score += `<chord />\n`;
        }
        xml_score += sprintf(`<pitch>
            <step>%s</step>
            <alter>%s</alter>
            <octave>%s</octave>
            </pitch>
            <duration>128</duration>
            <instrument id="P1-I1" />
            <type>quarter</type>\n`, new_note_step, new_note_alter, new_octave);
            
        //xml_score += `<lyric default-y="-80" number="part1verse1" >
        //    <syllabic>single</syllabic>
        //    <text>. . . .</text>
        //</lyric>\n`;
        if (new_note_accidental != "")
            xml_score += sprintf(`<accidental>%s</accidental>\n`, new_note_accidental)
      
        xml_score += `</note>\n`;

       

    }

function add_rest(duration, type)
{
    xml_score += sprintf(`<note default-x="142">
        <rest />
        <duration>%s</duration>
       <instrument id="P1-I1" />
       <type>%s</type>
    </note>\n`, duration, type);
}
   


function add_chord(schord, octave)
{
    //console.log(get_self(schord, octave));
    // chord
    chord_step = schord.substr(0,1);  // Letter for chord
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
    
    //console.log("schord: %s chord_step: %s sroot: %s chord_alter: %s accidental: %s ssub: %s",
    //    schord, chord_step, sroot, chord_alter, accidental, ssub);

    c_chord = "C" + ssub;
    chord_data = c_chord_data[c_chord];
    if (!chord_data)
    {
        console.log("CHORD NOT FOUND: %s", c_chord);

        return("");s
    }
    chord_kind = chord_data.chord_kind;
    notes_array = chord_data.notes;
    

    xml_score += sprintf(`<harmony color="#000000" default-y="25">
        <root>
        <root-step>%s</root-step>
        <root-alter>%s</root-alter>
        </root>
        <kind>%s</kind>
    </harmony>\n`, chord_step, chord_alter, chord_kind); 

    add_note(sroot, octave, 0);


    snote_last = "C";
    half_steps_array = [];
    last_note_number = 1;

    half_steps = 0;

    for (ii = 1; ii < notes_array.length; ii++) {
        // see it there are carried over notes
        note_letter = notes_array[ii];
        note_number = note_numbers[note_letter];
        //console.log("ii: %s note_letter: %s note_number: %s last_note_number: %s", 
        //    ii, note_letter, note_number, last_note_number);
        // from C for now
        half_steps_offset = note_number - last_note_number;
        last_note_number = note_number;

        if (half_steps_offset < 0)
            half_steps_offset += 12;
        half_steps = half_steps + half_steps_offset;

        //console.log("ii: %s note_letter: %s half_steps: %s new last_note_number: %s half_steps: %s", 
        //    ii, note_letter, half_steps, last_note_number, half_steps);

        // ii: 1 note_letter: E half_steps: 4
        add_note(sroot, octave, half_steps);
        last_note_number = note_number;

    }

    add_rest(128, "quarter");


}

function start_measure()
{
    //console.log(get_self());
    // start a emasure
    measure_number++;
    //console.log("measure_number: %s", measure_number);
    if (measure_number == 1)
    {
        xml_score = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <!DOCTYPE score-partwise PUBLIC
            "-//Recordare//DTD MusicXML 3.0 Partwise//EN"
            "http://www.musicxml.org/dtds/partwise.dtd">
            <score-partwise version="3.0">
            <part-list>
            <score-part id="P1">
            <part-name>Music</part-name>
            </score-part>
            </part-list>
            <part id="P1">\n`;
    }

    xml_score += sprintf(`<!--============== Part: P1, Measure: %s ==============-->
        <measure number="%s" width="340">\n`, measure_number, measure_number);

    if (measure_number == 1)
    {
        xml_score += `<attributes>
            <divisions>256</divisions>
            <key color="#000000">
                <fifths>0</fifths>
                <mode>major</mode>
            </key>
            <time color="#000000">
                <beats>4</beats>
                <beat-type>4</beat-type>
            </time>
            <staves>1</staves>
            <clef number="1" color="#000000">
                <sign>G</sign>
                <line>2</line>
            </clef>
            </attributes>\n`;

    }
}

function end_measure()
{
    xml_score += "</measure>\n";
}

function remove_lyrics()
{
    console.log("REMOVE LYRICS");
     measures = osmd.graphic.measureList;
     for (im = 0; im < measures.length; im++)
     {
         measure = measures[im][0];
         staff_entries = measure.staffEntries;
         for (ise = 0; ise < staff_entries.length; ise++)
         {
             staff_entry = staff_entries[ise];
             graphicalLabel = staff_entry.graphicalLabel;
             //console.log("IM: %s ise: %s staff_entry: %s graphicalLabel: %s",
             //    im, ise, staff_entry, graphicalLabel );
             staff_entry = measures[im][0].staffEntries[ise];

             // measure.staffEntries[3].lyricsEntries[0].LyricsEntry.graphicalLabel.label.text
             // measures[0][0].staffEntries[3].lyricsEntries[0].graphicalLabel.label.text
             lyricsEntries = staff_entry.lyricsEntries;
             for (ile = 0; ile < lyricsEntries.length; ile++)
             {
                 LyricsEntry = lyricsEntries[ile];
                 //console.log("IM: %s ise: %s staff_entry: %s LyricsEntry: %s",
                 //    im, ise, staff_entry, LyricsEntry );
                 if (!LyricsEntry)  
                     continue;                  
                 //console.log("IM: %s ise: %s staff_entry: %s graphicalLabel: %s LyricsEntry.graphicalLabel.label.text: %s",
                 //    im, ise, staff_entry, LyricsEntry, LyricsEntry.graphicalLabel.label.text);
                 
                 measures[im][0].staffEntries[ise].lyricsEntries[ile].graphicalLabel.label.text = ""; // sprintf("%s.%s.%s", im, ise, ile);


             }
         }
     }
}

function get_chords_used_in_score(show_output)
{
    // B♭m7/R 	E♭7/2 
    // that's why I
    //  Bb Db F Ab  	Bb Db Eb G  

    // measure.staffEntries[0].sourceStaffEntry.chordSymbolContainer.chordKind

    // chord:
    // measure[0].boundingBox.dataObject.staffEntries[0].sourceStaffEntry.chordSymbolContainer.chordKind

    // lyric
   // measure[0].boundingBox.dataObject.staffEntries[0].lyricsEntries[0].lyricsEntry.text
   // boundingBox.dataObject.staffEntries[0].lyricsEntries[0].lyricsEntry.text



    chords_used = {};

    measures = osmd.graphic.measureList;
    console.log(" measures_in_score: %s", measures.length)
    for (im = 0; im < measures.length; im++)
    {
        // only process imelt = 0;
        imelt = 0;

        //for (imelt = 0; imelt < measures[im].length; imelt++)
        {
            measure = measures[im][imelt];
            measure_number = measure.MeasureNumber;

                
            staffEntries = measure.staffEntries;
            if (show_output)
                console.log("IM: %s IMELT: %s  measure_number: %s staffEntries: %s", 
                    im,  imelt, measure_number, staffEntries.length);
            

            schord = "";
            // lyrics are in staff vnumber 0
            //for (staff_number = 0; staff_number < staffEntries.length; staff_number++)
            for (staff_number = 0; staff_number < 1; staff_number++)
            {
                staff_entry = staffEntries[staff_number];
                staff_entry2 = staff_entry;
                if (show_output)
                    console.log("IM: %s IMELT: %s  staff_number: %s", im,  imelt, staff_number);

                graphicalChordContainer = staff_entry.graphicalChordContainers[0];
                if (graphicalChordContainer)
                {
                    //console.log("graphicalChordContainer: %s", graphicalChordContainer);
                    chordSymbolContainer = graphicalChordContainer.chordSymbolContainer;
                    if (show_output)
                        console.log("chordSymbolContainer: %s", chordSymbolContainer);
                    if (chordSymbolContainer)
                    {   
                        chord_kind = chordSymbolContainer.chordKind;
                        salt = getTextFromChordKindEnum(chord_kind);

                        root_pitch = chordSymbolContainer.RootPitch;
                        accidental = root_pitch.Accidental; 
                        half_tones = root_pitch.AccidentalHalfTones; 
                        fundamental_note = root_pitch.FundamentalNote; 
                        
                        schord = get_note_from_enum(fundamental_note, accidental) + salt;

                        if (schord != "")
                        {
                            if (show_output)
                                console.log("schord: %s", schode)
                            chords_used[schord] = 1;
                        }   
                    }


                }
                //throw("STAFF ENTRY");
            }
            
        }
           
    } // end of measure
    

}

function get_note_from_enum(note_enum, accidental)
{
    sbase_note = notes_from_enum[note_enum];
    accidental = getTextForAccidental(accidental);
    snote = sbase_note + accidental;
    return(snote);
}

function getTextForAccidental(alteration) {
    text = "";
    switch (alteration) {
        case DOUBLEFLAT:
            text += "bb";
            break;
        case FLAT:
            text += "b";
            break;
        case SHARP:
            text += "#";
            break;
        case DOUBLESHARP:
            text += "x";
            break;
        default:
    }
    return text;
}

function getTextFromChordKindEnum(kind) {
    text = "";
    switch (kind) {
        case chord_symbol_enum.major:
            break;
        case chord_symbol_enum.minor:
            text += "m";
            break;
        case chord_symbol_enum.augmented:
            text += "aug";
            break;
        case chord_symbol_enum.diminished:
            text += "dim";
            break;
        case chord_symbol_enum.dominant:
            text += "7";
            break;
        case chord_symbol_enum.majorseventh:
            text += "maj7";
            break;
        case chord_symbol_enum.minorseventh:
            text += "m7";
            break;
        case chord_symbol_enum.diminishedseventh:
            text += "dim7";
            break;
        case chord_symbol_enum.augmentedseventh:
            text += "aug7";
            break;
        case chord_symbol_enum.halfdiminished:
            text += "m7b5";
            break;
        case chord_symbol_enum.majorminor:
            text += "";
            break;
        case chord_symbol_enum.majorsixth:
            text += "maj6";
            break;
        case chord_symbol_enum.minorsixth:
            text += "m6";
            break;
        case chord_symbol_enum.dominantninth:
            text += "9";
            break;
        case chord_symbol_enum.majorninth:
            text += "maj9";
            break;
        case chord_symbol_enum.minorninth:
            text += "m9";
            break;
        case chord_symbol_enum.dominant11th:
            text += "11";
            break;
        case chord_symbol_enum.major11th:
            text += "maj11";
            break;
        case chord_symbol_enum.minor11th:
            text += "m11";
            break;
        case chord_symbol_enum.dominant13th:
            text += "13";
            break;
        case chord_symbol_enum.major13th:
            text += "maj13";
            break;
        case chord_symbol_enum.minor13th:
            text += "m13";
            break;
        case chord_symbol_enum.suspendedsecond:
            text += "sus2";
            break;
        case chord_symbol_enum.suspendedfourth:
            text += "sus4";
            break;
        case chord_symbol_enum.Neapolitan:
        case chord_symbol_enum.Italian:
        case chord_symbol_enum.French:
        case chord_symbol_enum.German:
        case chord_symbol_enum.pedal:
        case chord_symbol_enum.power:
        case chord_symbol_enum.Tristan:
            break;
        default:
            break;
    }
    return text;
}

// SET OPTIONS
function set_options(start_measure, end_measure, make_transparent, hide_rests, drawing_color)
{
    console.log(get_self(start_measure, end_measure, make_transparent, hide_rests, drawing_color));
    
    defaultColorNotehead = drawing_color;
    if (!defaultColorNotehead)
        defaultColorNotehead = "#0000ff";
    coloringEnabled = 0;
    if (!start_measure)
        start_measure = 1;
    if (!end_measure || end_measure < 0)
        end_measure = measures_in_score;
   
        defaultColorRest = defaultColorNotehead;
    if (hide_rests)
            defaultColorRest = "#00000000";
    
    if (make_transparent)
    {
        defaultColorNotehead = "#00000000";
        defaultColorRest = "#00000000";
        if (get_element_value("transparent_color") == "red")
        {
            defaultColorNotehead = "#ff0000"; // uncomment to see notes
            defaultColorRest = "#ff0000";
        }
        coloringEnabled = 1;
    }
    

    console.log(`function set_options(
        defaultColorNotehead: %s,
        defaultColorRest: %s
        coloringEnabled: %s
        start_measure: %s
        end_measure: %s`,
        defaultColorNotehead,
        defaultColorRest,
        coloringEnabled,
        start_measure,
        end_measure);

    console.log(`osmd.setOptions({
        defaultColorNotehead: %s,
        defaultColorRest: %s,
        
        coloringEnabled: %s,
        colorStemsLikeNoteheads: 1,
        defaultFontFamily: "Ariel Bold",

        drawFromMeasureNumber: %s,
        drawUpToMeasureNumber: %s,

    });`, defaultColorNotehead, defaultColorRest, 
        coloringEnabled,  
        start_measure, end_measure + 1);


    osmd.setOptions({
        
        defaultColorNotehead: defaultColorNotehead,
        defaultColorRest: defaultColorRest,
        
        coloringEnabled: coloringEnabled,
        colorStemsLikeNoteheads: 1,
        defaultFontFamily: "Ariel Bold",

        drawFromMeasureNumber: start_measure,
        drawUpToMeasureNumber: end_measure + 1,

    });

    console.log(`AFTER osmd.setOptions:
                defaultColorNotehead: %s,          
                coloringEnabled: %s,
                colorStemsLikeNoteheads: %s`,
                
                osmd.EngravingRules.defaultColorNotehead, 
                osmd.EngravingRules.coloringEnabled,  
                osmd.EngravingRules.colorStemsLikeNoteheads);
    

    //osmd.EngravingRules.ColoringMode = 1;

}

var str_in;
var str_out;
var xml_string_in;
var xml_string_out;
var lyric_string = "";
var lyric_strings = ["", "", "", ""];
var divisions_for_chords;
var duration_for_harmony;


function add_note_for_chords()
{
    lyric_string = lyric_strings[1];    // ADH - do we want multiple lines?

    console.log("add_note_for_chords:   lyric_string: %s", lyric_string);
    if (lyric_string == "")
        lyric_string = "- - - -";
    note_color = "#ffffff"; // white rather than transparent to position lyrics properly
    note_color = "#000000000";   // transparent
    if (get_element_value("transparent_color") == "red")
        note_color = "#ff0000";

    if (duration_for_harmony == 0)
        duration_for_harmony = divisions_for_chords;

    // try leaving color off of the note
    str_out += sprintf(`<note>
            <pitch>
             <step>F</step>
             <octave>4</octave>
            </pitch>
            <duration>%s</duration>
            <instrument id="P1-I1" />
            <voice>1</voice>
            <type>half</type>
            <stem>down</stem>
            <staff>1</staff>
            <lyric number="1" color="%s">
            <syllabic>single</syllabic>
             <text>%s</text>
            </lyric>
           </note>\n`, duration_for_harmony, note_color, lyric_string);

   lyric_strings = ["", "", "", ""];
   duration_for_harmony = 0;
    console.log("AFTER CLEAR: lyric_strings[1]: %s", lyric_strings[1]);
}

// scan from <step>D</step>
function get_xml_value(sline)
{
    ipos = sline.indexOf("<");
    if (ipos < 0)
        return("");
    
    stext = sline.substr(ipos);
    // skip first <>
    ipos2 = stext.indexOf(">");
    stext = stext.substr(ipos2+1);
    ipos3 = stext.indexOf("<");
    stext = stext.substr(0, ipos3);
    return(stext);
}

function get_xml_number(sline)
{
    value = get_xml_value(sline);
    return (Number(value));
}

// scan from: <lyric number="1" default-x="6.58" default-y="-48.46" relative-y="-30.00">
function get_xml_internal_value(sline, sname)
{
    search = sname + "=";
    ipos = sline.indexOf(search);
    if (ipos < 0)
        return("");
    svalue = sline.substr(ipos);
    ipos2 = svalue.indexOf("\"");
    if (ipos2 < 0)
        throw("get_xml_internal_value: No QUOTE FOUND: " + svalue);
    svalue = svalue.substr(ipos2 + 1);
    
    ipos3 = svalue.indexOf("\"");
    if (ipos3 < 0)
        throw("get_xml_internal_value: Second QUOTE NOT FOUND: " + svalue);
    svalue = svalue.substr(0, ipos3);
    return(svalue);
}

function reformat_chords_and_lyrics(show_output)
{  
    //show_output = 1;
    // one quarter not per chord
    xml_string_in = xml_string;
    str_out = "";
    in_note = false;
    in_measure = false;
    in_backup = false;  // skip any backuos when maing chords
    console.log("xml_string length: %s", xml_string.length);
    str_in = xml_string.split("\n");
    console.log("reformat_chords_and_lyrics lines: %s", str_in.length);

    hcount = 0; // harmpny count
    measure_count = 0; // measure count
    harmony_in_measure = false;
    divisions_for_chords = 0;
    
    lyric_strings = ["", "", "", ""]; // room for 4 lines
    lyric_string = "";
    for (ii = 0; ii < str_in.length; ii++)
    {
        sline = str_in[ii];
        if (show_output)
            console.log("ii: %s sline: %s", ii, sline);

        if (sline.indexOf("<divisions>") >= 0)
        {
            divisions_for_chords = get_xml_number(sline);
            console.log("divisions_for_chords: %s", divisions_for_chords);
        }

        if (sline.indexOf("<measure") >= 0)
        {
            measure_count++;
            in_measure = true;
        }

        // and final note before barline or end of measure
        if (sline.indexOf("<barline>") >= 0 ||
            sline.indexOf("</measure") >= 0)
        {
            // add note for measure with no harmony
            add_note_for_chords();
        }
        if (sline.indexOf("</measure") >= 0)
        {
             harmony_in_measure = false;
            in_measure = false;
        }

        if (sline.indexOf("<backup") >= 0)
        {
            in_backup = true;
            continue;
        }
        if (sline.indexOf("</backup") >= 0)
        {
            in_backup = false;
            continue;
        }
        if (in_backup)  
            continue;   // slip any backup

        if (sline.indexOf("<harmony") >= 0)
        {
            hcount++
            if (harmony_in_measure)
            {
                // add note for measure with no harmony
                add_note_for_chords();
            }
            harmony_in_measure = true;
            duration_for_harmony = 0;
        }

        //if (show_output)
        //   console.log("indexOf(<note): %s", sline.indexOf("<note"));
        if (sline.indexOf("<note ") >= 0 || sline.indexOf("<note>") >= 0)
        {
            in_note = true;
            syllabic = "";
            lyrics_in_note = [false, false, false, false];  // only process one lyric oer note (Sibelius bug?)
            duration_for_harmony = 0;
            if (show_output)
                console.log("SKIP <note");
 
        }

        //if (show_output)
        //    console.log("indexOf(</notes): %s", sline.indexOf("</note"));
        if (in_note)
        {
            if (sline.indexOf("</note>") >= 0)
            {
                    in_note = false;
                    if (show_output)
                        console.log("END SKIP");
            }

            if (sline.indexOf("<duration>") >= 0)
            {
                duration = get_xml_number(sline);
                duration_for_harmony += duration;
                //console.log("duration: %s", duration);
            }

            // look for lyrics
            // <lyric default-y="-94" number="part1verse1" color="#000000">
            if (sline.indexOf("lyric ") >= 0)
            {
                lyric_number = get_xml_internal_value(sline, "number");
                console.log("LYRIC NUMBER: %s", lyric_number);
                lyric_number = Number(lyric_number);
            }
            

            if (sline.indexOf("syllabic") >= 0)
            {
                //single  //begin  //end  //middle 	
                syllabic = get_xml_value(sline);
            }
            // <text>a</text>
            if (sline.indexOf("<text") >= 0)
            {
                text = get_xml_value(sline);
                if (lyrics_in_note[lyric_number])
                {
                    console.log("Duplicate lyrics in note: %s", text);

                }
                else
                {
                    lyric_string = lyric_strings[lyric_number];
                    if (syllabic == "begin" || syllabic == "single")
                    {
                        if (lyric_string != "")
                            lyric_string += " " + text;
                        else
                            lyric_string = text;
                    }
                    else
                    {
                        lyric_string += " " + text; // problem with dash?
                    }
                    lyric_strings[lyric_number] = lyric_string;
                    lyrics_in_note[lyric_number] = true;
                    //console.log("IN_NOTE: AFTER set: lyric_strings[%s]: %s", lyric_number, lyric_strings[lyric_number]);
                    //console.log("TEXT: %s SYLLABIC: %s lyric_number:%s  lyric_string: %s", text, syllabic, lyric_number, lyric_string);
                }
            }
    
            continue;
        }

        if (sline.indexOf("<tie") >= 0)
        {
            continue;
        }

        str_out += sline + "\n";

        //if (show_output)
        //    console.log("indexOf(</harmony): %s", sline.indexOf("</harmony"));
        
        
    }
    xml_string = str_out;
    xml_string_out = xml_string;
    console.log("NEW xml_string length: %s", xml_string.length);
}

    // this has to mave room for offsets of -12 to 12
    var line_of_fifths = [
        // 0
            "Db", "Ab", "Eb", "Bb", "F", "C", "G",
            "D", "A", "E", "B", "Gb", "Db", "Ab",      
            "Eb", "Bb", "F", "C", "G", "D", "A",

            "E", "B",
        // 23 start here
            "Gb", "Db", "Ab", "Eb", "Bb",
            "F", "C", "G", "D", "A", "E", "B",
            "F#", "C#", "G#", "D#", "A#",
        // 40
            "F", "C",
            "G", "D", "A", "E", "B", "F#", "C#",
            "G#", "D#", "A#", "F", "C", "G", "D", 
    ];

    
    // generate letters for each new line_)of_fifths number
    line_of_fifths_numbers = {
        "Gb": 23,
        "Db": 24,
        "Ab": 25,
        "Eb": 26, 
        "Bb": 27,
        "F": 28, "E#": 28,
        "C": 29, "B#": 29,
        "G": 30,
        "D": 31,
        "A": 32,
        "E": 33, "Fb": 33,
        "B": 34, "Cb": 34,
        "F#": 35,
        "C#": 36,
        "G#": 37,
        "D#": 38,
        "A#": 39,
    };

    // ## and bb do not work yet
    var accidentals_in_key = {
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
        "G#": {"C": "sharp", "D": "", "E": "sharp", "F": "##", "G": "sharp", "A": "sharp", "B": "sharp"},
        "D#": {"C": "##", "D": "sharp", "E": "sharp", "F": "##", "G": "sharp", "A": "sharp", "B": "sharp"},
   
    };
    //sline = "";

    //for (ii = 22; ii < 40; ii++)
    //{
    //    line_of_fifths_numbers[line_of_fifths[ii]] = ii;
    //    sline += sprintf(`"%s": %s,\n`, line_of_fifths[ii], ii);
   // }
    //console.log(sline);
                            
    var old_key;
    var new_key;
    var key_offset;

    function transpose(old_step, old_alter, old_octave) {
        //console.log(get_self(old_step, old_alter, old_octave));

        old_note = old_step;
        if (old_alter == 1)
            old_note += "#";
        else if (old_alter == -1)
            old_note += "b";
        
        //console.log("old_key: %s new_key: %s old_note: %s", old_key, new_key, old_note);

        old_key_number = note_numbers[old_key];
        new_key_number = note_numbers[new_key];
        key_offset = new_key_number - old_key_number;
        if (parameters.transpose_direction == "up")
            key_offset = (key_offset + 12) % 12; // move up
        else if (parameters.transpose_direction == "down")
            key_offset = (key_offset - 12) % 12; // move down
        else
            key_offset = (key_offset + 6) % 12 - 6; // get closest offset
        
        new_fifths = line_of_fifths_numbers[new_key] - line_of_fifths_numbers["C"];
        //console.log("old_key: %s new_key: %s key_offset: %s new_fifths: %s", old_key, new_key, key_offset, new_fifths);

        kpos1 = line_of_fifths_numbers[old_key];
        kpos2 = line_of_fifths_numbers[new_key];
        fifths_offset = kpos2 - kpos1;
        npos1 = line_of_fifths_numbers[old_note]; 
        npos2 = npos1 + fifths_offset;
        new_note = line_of_fifths[npos2];
        //console.log("npos1: %s npos2: %s fifths_offset: %s new_note: %s",
        //    npos1, npos2, fifths_offset, new_note);
        new_step = new_note.substr(0,1);
        new_alter = "";
        if (new_note.substr(1,1) == '#')
            new_alter = "1";
        else if (new_note.substr(1,1) == 'b')
            new_alter = "-1";

        // offset octave
        old_note_number = note_numbers[old_note];
        new_note_number = note_numbers[new_note];

        new_octave = Number(old_octave);    // ADH - calculate change of octave
        if (key_offset > 0 && new_note_number < old_note_number)
            new_octave += 1;
        else if (key_offset < 0 && new_note_number > old_note_number)
            new_octave -= 1;
        
        console.log("transpose: NEW new_note: %s new_step: %s new_alter: %s new_octave: %s", new_note, new_step, new_alter, new_octave);
        transposed_note = {
            "note": new_note,
            "step": new_step,
            "alter": new_alter,
            "octave": new_octave,
        };
        return (transposed_note);
    }


function transpose_xml()
{
    console.log("parameters.transpose_key: %s", parameters.transpose_key);
    if (parameters.transpose_key == "None")
        return;

    //show_output = 1;

    xml_string_in = xml_string;
    str_out = "";
    in_note = false;
    in_measure = false;
    console.log("xml_string length: %s", xml_string.length);
    str_in = xml_string.split("\n");
    console.log("transpose_xml lines: %s", str_in.length);

    in_pitch = false;
    in_root = false;
    in_bass = false;

    duration = 0;
    last_note_duration = 0;
    last_stem_direction = "";
    current_accidentals = {};

    measure_count = 0; // measure count
    divisions = 0;
    show_debugs = true;


    for (ii = 0; ii < str_in.length; ii++)
    {
        sline = str_in[ii];
        if (show_output)
            console.log("ii: %s sline: %s", ii, sline);

        //  divisions element indicates how many divisions per quarter note are used to indicate a note's duration
        //  <divisions>256</divisions>
        if (sline.indexOf("<divisions>") >= 0)
        {
            divisions = get_xml_number(sline);
            console.log("divisions: %s", divisions);
        }

        if (sline.indexOf("<measure") >= 0)
        {
            // break grouped notes at measure
            measure_count++;
            console.log("MEASURE: %s: %s", measure_count, sline);
            if (measure_count < 15)
                show_debugs = true;
            if (measure_count > 16)
                show_debugs = false;
            last_note_duration = 0;
            last_stem_direction = "";
           if (new_key)
            {
                // since this is an object, we need to clone it
                current_accidentals = JSON.parse(JSON.stringify(accidentals_in_key[new_key]));
                console.log("new_key: %s current_accidentals[F]: %s", new_key, current_accidentals["F"]);
            }
        }


        if (sline.indexOf("</measure") >= 0)
        {
        }

        // <fifths>-4</fifths>
        if (sline.indexOf("</fifths") >= 0)
        {
            fifths = get_xml_number(sline);
            console.log("SLINE: %s fifths: %s", sline, fifths);
            line_of_fifths_c = line_of_fifths_numbers["C"];
            old_key_number = fifths + line_of_fifths_c;
            old_key = line_of_fifths[old_key_number];
            console.log("fifths: %s old_key_number: %s old_key: %s", fifths, old_key_number, old_key);

            new_key = parameters.transpose_key;
            new_line_of_fifths_number = line_of_fifths_numbers[new_key] - line_of_fifths_c;
            console.log("<fifths>%s</fifths> old_key: %s new_key: %s \n", new_line_of_fifths_number, old_key, new_key);
            str_out += sprintf("<fifths>%s</fifths>\n", new_line_of_fifths_number);



            
            // since this is an object, we need to clone it
            current_accidentals = JSON.parse(JSON.stringify(accidentals_in_key[new_key]));
            console.log("new_key: %s current_accidentals[F]: %s", new_key, current_accidentals["F"]);
            continue;
        }

        if (sline.indexOf("<note") >= 0)
        {
            in_note = true;


        } 
        if (sline.indexOf("</note") >= 0)
        {
            in_note = false;


        }

        if (in_note)
        {
            if (sline.indexOf("<duration>") >= 0)
            {
                duration = get_xml_number(sline);
                //console.log("duration: %s", duration);
            }
        }

        // <pitch>
        //     <step>E</step>
        //     <alter>-1</alter>
        //     <octave>4</octave>
        //     </pitch>
        if (sline.indexOf("<pitch") >= 0)
        {
            in_pitch = true;
            
            pitch_alter = "";
            pitch_step = "";
            pitch_octave = "";
            new_accidental = "";
            continue;
        }
        if (sline.indexOf("</pitch") >= 0)
        {
            transposed_note = transpose(pitch_step, pitch_alter, pitch_octave);
  
            pitch_xml = sprintf(`<pitch>
                <step>%s</step>\n`, transposed_note.step);
            snew_note = transposed_note.step;
            new_accidental = "";
            if (transposed_note.alter == 1)
            {
                new_accidental = "sharp";
                snew_note = snew_note + "#";
                pitch_xml += sprintf(`     <alter>%s</alter>\n`, transposed_note.alter);
            }
            else if (transposed_note.alter == -1)
            {
                new_accidental = "flat";
                snew_note = snew_note + "b";
                pitch_xml += sprintf(`     <alter>%s</alter>\n`, transposed_note.alter);
            }
            console.log("snew_note: %s current_accidentals[%s]: %s", snew_note, snew_note, current_accidentals[snew_note]);
            current_accidental = current_accidentals[snew_note];
           console.log("snew_note: %s transposed_note.alter: %s current_accidental: %s new_accidental: %s",
                    snew_note, transposed_note.alter, current_accidental,  new_accidental);

           
            if (current_accidental == new_accidental)
            {
                accidental_out = "";     // no change from key or last note
            }
            else if (new_accidental == "")
            {
                accidental_out = "natural";               
            }
            else 
            {
                accidental_out = new_accidental;
            }
            if (show_debugs)
                console.log("snew_note: %s transposed_note.alter: %s new_accidental: %s snew_note: %s accidental_out: %s",
                    snew_note, transposed_note.alter, new_accidental, snew_note, accidental_out);

            current_accidentals[snew_note] = new_accidental;


            pitch_xml += sprintf(`     <octave>%s</octave>
                </pitch>\n`, transposed_note.octave);

            console.log("PITCH_XML: %s", pitch_xml);
      
            str_out += pitch_xml;
            in_pitch = false;
            continue;
        }
            
        
        if (in_pitch)
        {
            if (sline.indexOf("<step") >= 0)
            {
                pitch_step = get_xml_value(sline);
                continue;
            }
            if (sline.indexOf("<alter") >= 0)
            {
                pitch_alter = get_xml_number(sline);
                continue;
            }
            if (sline.indexOf("<octave") >= 0)
            {
                pitch_octave = get_xml_number(sline);
                continue;
            }
        }

        // <accidental>sharp</accidental>
        // ADH - do we ever force 'natural'?
        // YES: We need to check against last accidental in this measure,
        // and the accidentals in this key
        if (sline.indexOf("<accidental>") >= 0)
        {
            if (accidental_out != "")
            {
                if (show_debugs)
                    console.log("<accidental>%s</accidental>\n", accidental_out);
                str_out += sprintf("<accidental>%s</accidental>\n", accidental_out);
            }
            continue;
            
        }

        // <stem>down</stem>
        if (sline.indexOf("<stem>") >= 0)
        {
            // if in eighth or smaller group - keep same stem
            if (duration < divisions && last_note_duration > 0 && last_note_duration < divisions)
            {
                console.log("USE LAST STEM DIRECTION: %s", last_stem_direction);
                stem_direction = last_stem_direction;
            }
           else if (pitch_octave > 4)
                stem_direction = "down";
            else if (pitch_octave < 4)
                stem_direction = "up";
            else if (pitch_step == "B")
                stem_direction = "down";
            else
                stem_direction = "up";

            

            console.log("duration: %s last_note_duration: %s last_stem_direction: %s pitch_octave: %s pitch_step: %s new stem_direction: %s",
                duration, last_note_duration, last_stem_direction, pitch_octave, pitch_step, stem_direction );


            last_stem_direction = stem_direction;
            last_note_duration = duration;
            str_out += sprintf("<stem>%s</stem>\n", stem_direction);
            continue;
        }

      
            
        
        // transpose root
        // <root>
        // <root-step>A</root-step>
        // <root-alter>-1</root-alter>
        // </root>

        if (sline.indexOf("<root>") >= 0)
        {
            //console.log("START %s", sline);
            in_root = true;
            root_alter = "";
            root_step = "";
            continue;
        }
            
        
        if (sline.indexOf("</root>") >= 0)
        {
            //console.log("END %s root_step: %s ", sline, root_step);

            transposed_note = transpose(root_step, root_alter, 0);
    
    
            root_xml = sprintf(`<root>
                <root-step>%s</root-step>\n`,transposed_note.step);
            if (transposed_note.alter != 0)
                root_xml += sprintf(`     <root-alter>%s</root-alter>\n`, transposed_note.alter);

            
            root_xml += `</root>\n`;
            //console.log("root_XML: %s", root_xml);
            str_out += root_xml;
            in_root = false;
            continue;
        }
            
        if (in_root)
        {
            console.log("IN ROOT: %s", sline);
            if (sline.indexOf("<root-step") >= 0)
            {
                root_step = get_xml_value(sline);
                console.log("ROOT_STEP; %s", root_step);
                continue;
            }
            else if (sline.indexOf("<root-alter") >= 0)
            {
                root_alter = get_xml_number(sline);
                console.log("root_alter; %s", root_alter);
                continue;
            }
            else
                throw("Unknown ROOT line: " + sline);
        }

        

        // transpose bass
         // <bass>
        // <bass-step>A</bass-step>
        // <bass-alter>-1</bass-alter>
        // </bass>

        if (sline.indexOf("<bass>") >= 0)
        {
            console.log("START BASS %s", sline);
            in_bass = true;
            bass_alter = "";
            bass_step = "";
            continue;
        }
            
        
        if (sline.indexOf("</bass>") >= 0)
        {
            console.log("END %s bass_step: %s ", sline, bass_step);

            transposed_note = transpose(bass_step, bass_alter, 0);
    
    
            bass_xml = sprintf(`<bass>
                <bass-step>%s</bass-step>\n`,transposed_note.step);
            if (transposed_note.alter != 0)
                bass_xml += sprintf(`     <bass-alter>%s</bass-alter>\n`, transposed_note.alter);

            
            bass_xml += `</bass>\n`;
            console.log("bass_XML: %s", bass_xml);
            str_out += bass_xml;
            in_bass = false;
            continue;
        }
            
        if (in_bass)
        {
            console.log("IN bass: %s", sline);
            if (sline.indexOf("<bass-step") >= 0)
            {
                bass_step = get_xml_value(sline);
                console.log("bass_STEP; %s", bass_step);
                continue;
            }
            else if (sline.indexOf("<bass-alter") >= 0)
            {
                bass_alter = get_xml_number(sline);
                console.log("bass_alter; %s", bass_alter);
                continue;
            }
            else
                throw("Unknown bass line: " + sline);
        }

        
        

        str_out += sline + "\n";

        //if (show_output)
        //    console.log("indexOf(</pitch): %s", sline.indexOf("</pitch"));
        
        
    }
    xml_string = str_out;
    xml_string_out = xml_string;
    console.log("NEW xml_string length: %s", xml_string.length);
}



function get_last_measure(show_output)
{
    // measures[2][0].staffEntries[0].sourceStaffEntry.voiceEntries[0].notes[0].pitch

    measures = osmd.graphic.measureList;
    if (show_output)
        console.log("measures.length: %s", measures.length)
    for (im = measures.length - 1; im >= 0; im--)
    {
        // are [0] and [1] the same? (NO)
        for (imelt = 0; imelt < measures[im].length; imelt++)
        {
            measure = measures[im][imelt];
            measure_number = measure.MeasureNumber;
            if (show_output)
                console.log("IM: %s IMELT: %s  measure_number: %s", im,  imelt, measure_number );

            staffEntries = measure.staffEntries;
            if (show_output)
                    console.log("staffEntries length: %s", staffEntries.length);
            for (staff_number = 0; staff_number < staffEntries.length; staff_number++)
            {
                staff_entry = staffEntries[staff_number];
                sourceStaffEntry = staff_entry.sourceStaffEntry;
                voiceEntries = sourceStaffEntry.voiceEntries;
                if (show_output)
                    console.log("staff_number: %s voiceEntries.length: %s", staff_number, voiceEntries.length);
                for (voice_number = 0; voice_number < voiceEntries.length; voice_number++)
                {
                    voice_entry = voiceEntries[voice_number];
                    notes = voice_entry.notes;
                    note_count = 0;
                    if (show_output)
                        console.log("NOTES: %s", notes.length);
                    if (notes && notes.length > 0)
                    {
                        for (inote = 0; inote < notes.length; inote++)
                        {
                            note = notes[inote];
                            pitch = note.pitch;
                            sourceNote = note.sourceNote;
                            if (show_output)
                                console.log("IM: %s IMELT: %s staff_number: %s voice_number: %s inote: %s pitch: %s",
                                    im, imelt, staff_number, voice_number, inote, pitch);

                            // if note found - lets use the measure
                            measures_used_in_score = im;
                            console.log("MEASURE FOUND WITH notes: %s measure_number: %s", im, measure_number);
                            return(im);

                            if (pitch && typeof(pitch) != "undefined")
                            {
                                measures_used_in_score = im;
                                console.log("MEASURE FOUND WITH PITCH: %s", im);
                                return(im);
                            }
                            else if (sourceNote && typeof(pitch) != "sourceNote")
                            {
                                // measures[25][0].staffEntries[0].graphicalVoiceEntries[0].notes[0].sourceNote.Pitch PROP Pitch
                                measures_used_in_score = im;
                                console.log("MEASURE FOUND WITH sourceNote: %s", im);
                                return(im);
                            }
                        }
                    }
                    
                }
            }
        }

}
        //throw("No Notes found")
        return(0);

}

var search_term;
var seaerch_term2;
var max_levels = 3;
var max_lines = 100;
var lines_out = 0;
 
var value2;
function check_search(path, value)
{
    //console.log("check_search: path: %s value: %s search terms: %s %s\nCALLER: %s", 
    //    path, value, search_term, search_term2, get_caller());
    if (lines_out > max_lines)
        throw("Max Lines exceeded: " + max_lines);
    value2 = value;
    bret = false;

    if (!search_term || search_term == "")
    {
        bret = true;
    }

    if (path)
    {
        spath = path.toUpperCase();
        if (spath.indexOf(search_term) >= 0)
            bret = true;
        if (search_term2 && spath.indexOf(search_term2) >= 0)
            bret = true;
    }


    if (value)
    {
        svalue = String(value).toUpperCase();
        if (svalue.indexOf(search_term) >= 0)
            bret = true;
        else if (search_term2 && svalue.indexOf(search_term2) >= 0)
            bret = true;
    }

    if (!bret)
    {
        return(false);
        //throw("SEARCH FALSE");
    }

    //console.log("Search found: path: '%s' value: '%s'", path, value);
    max_lines++;
    //throw("SEARCH TRUE");
    return(true);
}

function search_object(path, search_term_in, search_term2_in)
{
    search_term = "";
    search_term2 = "";
    if (search_term_in)
    {
        search_term = search_term_in.toUpperCase();
    }
    if (search_term2_in)
    {
        search_term2 = search_term2_in.toUpperCase();
    }

    obj = eval(path);
    show_object(obj, path, 0);
}

// since this is recursive, all variables need to be var
function show_object(obj, path, level)
{   
    if (!level)
        level = 0;
    if (!max_levels)
        max_levels = 3;
    if (!max_lines)
        max_lines = 100;
    if (lines_out > max_lines)
        throw("Max Lines exceeded: " + max_lines);

    var sindent = level + ": " + "                    ".substr(0, level * 2);
    if (!path)
        path = "";
    if (check_search(path))
    {
        console.log("****");
        console.log("SHOW_OBJECT: PATH: %s LEVEL: %s ", path, level);
    }

    if (level > 3)
    {
        if (check_search())
            console.log("SKIP LEVEL: %s RETURN", level);
        return;
    }

    if (path.indexOf("parent") >= 0 || path.indexOf("Parent") >= 0)
    {
        if (check_search())
            console.log("%s SKIP PARENT: %s RETURN", spre, path);
    return;
    }
    if (path.indexOf("childElements") >= 0)
    {
        if (check_search())
            console.log("%s SKIP childElements: %s RETURN", spre, path);
        return;
    }
    if (path.indexOf("context") >= 0)
    {
        if (check_search())
            console.log("%s SKIP CONTEXT: %s RETURN", spre, path);
        return;
    }

    var show_all_keys = false;
    if (show_all_keys)
    {
        // display all keys
        console.log("-----");
        console.log("%s%s: ALL KEYS", sindent, path);
        for (var key in obj) 
        {
            var spre = sindent + path + "." + key;
            var obj2 = obj[key];
            console.log("%s PATH: %s KEY: %s obj2: obj[%s]: %s typeof: %s", 
                sindent, path, key, key, obj2, typeof(obj2));
        }
        console.log("-----");
    }
    
    for (var key in obj) 
    {
        var spath = sprintf("%s.%s", path, key);
        if (!isNaN(key))
            spath = sprintf("%s[%s]", path, key);
        var spre = sprintf("%s%s", sindent, spath);
        
        if (spre.indexOf(".0") >= 0)
        {
            //console.log("PATH: %s KEY: %s SPATH: %s SPRE: %s", path, key, spath, spre);
            //throw("BAD PATH 1");
        }
        //console.log("SPRE: %s PATH: %s KEY: %s", spre, path, key);
        
        if (key.indexOf("parent") >= 0 || key.indexOf("Parent") >= 0)
        {
            if (check_search())
                console.log("%s SKIP PARENT KEY: %s", spre, key);
            continue;
        }
        
        if (key.indexOf("context") >= 0)
        {
            if (check_search())
            console.log("%s SKIP CONTEXT KEY: %s", spre, key);
            continue;
        }
        if (key.indexOf("boundingBox") >= 0)
        {
            if (check_search())
            console.log("%s SKIP boundingBox KEY: %s", spre, key);
            continue;
        }
        //console.log("SPRE: '%s' PATH: %s KEY: %s ", spre, path, key);
        
        // skip loop if the property is from prototype
        if (!obj.hasOwnProperty(key)) {
            if (check_search())
            console.log("%s SKIP 1: PATH: %s KEY: %s ", spre, path, key);
            continue;
        }

        var obj2 = obj[key];
        //console.log("%s KEY: %s obj2: obj[%s]: %s typeof(obj2): %s", spre, key, key, obj2, typeof(obj2));
        
        if (typeof(obj2) == "function")
        {
            if (check_search())
                console.log("%s SKIP FUNCTION KEY: %s", spre, key);
            continue;
        }
        if (typeof(obj2) == "string")
        {
            if (check_search(spre, obj2))
                console.log("%s: '%s'", spre, obj2);
            continue;
        }
        if (typeof(obj2) == "number")
        {
            if (check_search(spre, obj2))
                console.log("%s: %s", spre, obj2);
            continue;
        }
        if (typeof(obj2) == "boolean")
        {
            if (check_search(spre, obj2))
                console.log("%s: %s", spre, obj2? "TRUE" : "FALSE");
            continue;
        }
        if (typeof(obj2) == "undefined")
        {
            if (check_search(spre, obj2))
                console.log("%s: undefined", spre);
            continue;
        }
        if (typeof(obj2) != "object")
        {
            console.log("OBJ2: SPRE: %s typeof:  %s", spre, typeof(obj2));
            throw("unknown object");
        }
        if (check_search(spre, obj2))
        {
            console.log("SPRE: %s PATH: %s GET PROPS typeof:  %s", spre, path, typeof(obj2));
        }
        for (prop in obj2) {

            var spath2 = sprintf("%s.%s", spre, prop);
            if (!isNaN(prop))
                spath2 = sprintf("%s[%s]", spre, prop);
            var spre2 = spath2;
            if (spre2.indexOf(".0") >= 0)
            {
                //console.log("SPATH: %s PROP: %s typeof: %s SPATH2: %s SPRE2: %s", spath, prop, typeof(prop), spath2, spre2);
                //throw("BAD PATH 2");
                //continue;
            }
            
    
            
            if (prop.indexOf("parent") >= 0 || prop.indexOf("Parent") >= 0)
            {
                if (check_search())
                    console.log("%s SKIP PROP  PARENT: PROP: %s", spre2, prop);
                continue;
            }
            if (prop.indexOf("context") >= 0)
            {
                if (check_search())
                    console.log("%s SKIP PROP CONTEXT: PROP: %s", spre2, prop);
                continue;
            }
            if (prop.indexOf("context") >= 0)
            {
                if (check_search())
                    console.log("%s SKIP PROP CONTEXT: PROP: %s", spre, prop);
                continue;
            }
            if (prop.indexOf("element") >= 0)
            {
                if (check_search())
                    console.log("%s SKIP PROP ELEMENT: PROP: %s", spre, prop);
                continue;
            }
            if (typeof(obj2[prop]) == "function")
            {
                if (check_search())
                    console.log("%s SKIP PROP function: PROP: %s", spre, prop);
                continue;
            }


            if (check_search(spre2, prop))
                console.log("%s PROP %s VALUE: %s: typeof: %s",
                    spre2, prop, obj2[prop], typeof(obj2[prop])); 


            //console.log("SPRE2: %s SPRE: %s PROP: %s", spre2, spre, prop);

            // skip loop if the property is from prototype
            if (!obj2.hasOwnProperty(prop)) {
                //console.log("%s SKIP 2: obj2: %s prop: %s",spre2,  obj2, prop);
                continue;}

            

            var prop_value = obj2[prop];

            if (typeof(prop_value) == "function")
            {
                if (check_search())
                    console.log("%s SKIP PROP FUNCTION: PROP: %s", spre, prop);
                continue;
            }
            
            //console.log("%s: typeof: %s prop_value: %s", 
            //    spre2,  typeof(prop_value),  prop_value);

            //console.log("IS ARRAY: %s %s: %s", 
            //    spre2, prop_value, Array.isArray(prop_value)? "T" : "F");

            var is_array = Array.isArray(prop_value);
            //console.log("is_array: %s", is_array ? "T": "F");
            //console.log("IS OBJECT: %s typeof: %s is object: %s", 
            //    spre2, prop_value, typeof(prop_value) == "object");
            
            //console.log("%s RAW VALUE: %s typeof: %s value: %s", 
            //    spre2, typeof(prop_value),  prop_value);


            if (prop_value == null)
            {
                if (check_search(spre2))
                    console.log("%s: NULL", spre2);
                continue;
            }
            if (typeof(prop_value) == "string")
            {
                if (check_search(spre2, prop_value))
                    console.log("%s: '%s'", spre2, prop_value);

                continue;
            }
            if (typeof(prop_value) == "number")
            {
                if (check_search(spre2))
                    console.log("%s: %s", spre2, prop_value);

                continue;
            }
            if (typeof(prop_value) == "boolean")
            {
                if (check_search(spre2))
                    console.log("%s: %s", spre2, prop_value? "TRUE" : "FALSE");
                continue;
            }

            //console.log("is_array: %s", is_array ? "T": "F");
            if (is_array )
            {
                //console.log("%s ARRAY[%s]", spre2, prop_value.length);
                for (var ii = 0; ii < prop_value.length && ii < 5; ii++)
                {
                    //console.log("%s SHOW ARRAY ELT: %s: %s",  spre2, ii, prop_value[ii]);
                    var sarray = sprintf("%s[%s]", spath2, ii);
                    show_object(prop_value[ii], sarray, level + 1);
                }
                continue;
            }
            if (typeof(prop_value) == "object")
            {
                //console.log("SHOW OBJECT: %s: prop_value: %s", spre2, prop_value);
                show_object(prop_value, spath2, level + 1);
                //console.log("%s RETURN AFTER OBJ", spre2);
                continue;
            }

            // your code
            console.log("%s TYPE NOT FOUND: typeof: %s value: %s", 
                spre2,  typeof(prop_value),  prop_value);
        }

    }
    //console.log("%s RETURN level: %s", path, level);
    //console.log("#####");
    return;
}

    function show_div(sid)
    {
        elt = document.getElementById(sid);
        if (!elt)
        {
            throw("ELT NOT FOUND: " + sid);
        }
        elt.style.display = "block";
    }
    function show_div(sid)
    {
        elt = document.getElementById(sid);
        if (!elt)
        {
            throw("ELT NOT FOUND: " + sid);
        }
        elt.style.display = "none";
    }

    function show_time(who)
    {
        var today = new Date();
        var time = sprintf("%02d:%02d:%02d %03dms",
            today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds());
        console.log("TIME: %s %s", who, time);
    }

var error_stack2;
var caller_line2;
var caller_stack_array;

function get_caller(show_output) {
    error_stack2 = (new Error).stack;
    caller_stack_array = error_stack2.split("\n")
    //console.log("GET_CALLER: %s", error_stack2);
    scaller = error_stack2;
    if (caller_stack_array.length > 2)
    {
        caller_line2 = caller_stack_array[3]



    
        ipos1 = caller_line2.indexOf("at");     
        sname = caller_line2.substr(ipos1 + 3);
        ipos2 = sname.indexOf(" ");
        sname = sname.substr(0, ipos2);
        //console.log("SNAME: %s", sname);
        ipos3 = caller_line2.lastIndexOf(":");
        ipos4 = caller_line2.substr(0, ipos3).lastIndexOf(":");
        sline = caller_line2.substr(ipos4+1, ipos3-ipos4 - 1)
        scaller = sprintf("***Called by: %s: %s", sname, sline);
    }
    if (show_output)
        console.log("SCALLER: %s", scaller);
    return (scaller);

}
    