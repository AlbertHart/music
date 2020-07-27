
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN ABMXML_Lib_Transpose.js");

libs_loaded["ABMXML_Lib_Transpose"] = "loaded";
console.log("libs_loaded.length: %s", libs_loaded.length);


    // all measures
    MusicDOM.prototype.part_array = {};

    MusicDOM.prototype.test2 = function(value)
    {
        console.log("test2: %s", value);
        this.test(value);
    }

    // You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
    MusicDOM.prototype.transpose_xml = function(parameters, xml_string_in)
    {
        let dom_object = this.musicxml_to_dom(xml_string_in);

        this.transpose_musicxml_dom(parameters, dom_object);

        let xml_string_return = this.dom_object_to_return_string(dom_object);
        return(xml_string_return);
    }

    MusicDOM.prototype.transpose_musicxml_dom = function(parameters, dom_object)
    {
        console.log("transpose_dom_object");
        this.parameters = parameters;  // save in prototype
        this.show_output = parameters.show_output;
        let show_output = this.show_output;

        //console.log("show_output: %s (%s)", show_output, show_output? "T" : "F");

        // 'var' is for debugging, we will but it into a different type later
        this.attributes = {
            divisions: 0,
            time: {
                beats: 0,
                beat_type: 0
            },
            key: {
                fifths: 0,
                mode: null
            },
            staves: null,
            clef: []
        };
        this.str_out = "";

        // what type of element are we in?
        let in_type = {
            measure: false,
            clef: false,
            note: false,
            rest: false,
            pitch: false,
            root: false,
            bass: false,
            notations: false,
            lyric: false
        };
        let clef_number = null;

        let clef = {};

        let measure_number = 0; // measure count 

        let show_debugs = false;    // to display output for only certain measures
        let measure_data = {};

        measure_number = 0; // measure count

        let count = 0;  // only process a few lines for testing


        let score_partwise_element = dom_object.firstElementChild; // score-partwise
        
        let top_children = score_partwise_element.children;
        //console.log("score_partwise_element: %s top children: %s", score_partwise_element.tagName, top_children.length);
        for (itop = 0; itop < top_children.length; itop++)
        {
        score_element = top_children[itop];
        //console.log("itop: %s score_element: %s", itop, score_element.tagName);

        switch(score_element.tagName)
        {
        case "part":
            part_element = score_element;

            // <part id="P2">
            let part_id = part_element.getAttribute("id");
            this.part_array[part_id] = {measure_data_array: []};
            let measure_data_array = this.part_array[part_id].measure_data_array;
            

            part_children = part_element.children;
            //console.log("PART children: %s", part_children.length);
            for (ipart = 0; ipart < part_children.length; ipart++)
            {
                part_child = part_children[ipart];
                //console.log("part_child: %s", part_child.tagName);

                switch(part_child.tagName)
                {

                case "measure": 

                    // only parse measures for now
                    if (show_output)
                        console.log("CASE: %s", part_child.tagName);
                    let measure_element = part_child;
                    measure_number = measure_element.getAttribute("number");
                    if (show_output)
                    {
                        this.show_dom_element(measure_element, "MEASURE: " + measure_number);
                    }

                    measure_data = measure_data_array[measure_number];

                    if (!measure_data)
                    {
                        
                        measure_data = {measure_number: measure_number, 
                            note_data_array: [], chord_data_array: [], beam_data_array: [], staff_data_array: [],
                            current_accidentals: []};
                        //console.log("measure_data_array SET measure_number: %s measure_data_array set: %s", 
                        //   measure_number, measure_data_array[measure_number].measure_number);
                        measure_data_array[measure_number] = measure_data;

                    }

                    // restart in each measure
                    let note_index = 0;
                    let chord_index = 0;
                    let beam_index = 0;

                    let measure_children = measure_element.children;
                    //console.log("CHILDREN: %s", measure_children.length);

                    // let's mark chords
                    // a note is in a chord if the second note element, and subsequent are marker chord
                    for (let ii = 0; ii < measure_children.length; ii++)
                    {
                        let measure_child = measure_children[ii];
                        //console.log("measure CHILD %s: %s", ii, measure_child.tagName);

                        switch (measure_child.tagName) 
                        {
                            // attrbiute changes are added to or changes in attributes - but do not clear other attributes
                            case "attributes":
                                if (show_output)
                                    console.log("CASE: %s", measure_child.tagName);
                                let attribute_element = measure_child;
                                if (show_output)
                                    this.show_dom_element(attribute_element);

                                let attributes = this.attributes;   // access in this scope

                                // get the attributes we want to remember
                                let attribute_children = attribute_element.children;
                                //console.log("CHILDREN: %s", attribute_children.length);
                                for (let ii = 0; ii < attribute_children.length; ii++)
                                {
                                    let attribute_child = attribute_children[ii];
                                    //console.log("note CHILD %s: %s", ii, attribute_child.tagName);

                                    switch (attribute_child.tagName) 
                                    {
                                        case "clef":
                                            break;

                                        case "divisions":
                                            attributes.divisions = this.get_element_value_numeric(attribute_child);
                                            break;

                                        case "instruments":
                                                break;
                                        
                                        case "key":
                                            // ADH - test key change in the middle of a measure
                                            if (show_output)
                                                console.log("CASE: %s", attribute_child.tagName);

                                            let key_element = attribute_child

                                            //this.show_dom_element(key_element);
                                            attributes.key.fifths = this.get_dom_element_value_numeric(key_element, "fifths");
                                            if (show_output)
                                                console.log("fifths: %s typeof: %s", attributes.key.fifths, typeof(attributes.key.fifths) );
                                            attributes.key.mode = this.get_dom_element_value_numeric(key_element, "mode", this.SKIP_ERROR);

                                            let line_of_fifths_c = this.line_of_fifths_numbers["C"];
                                            let old_key_number = attributes.key.fifths + line_of_fifths_c;
                                            this.old_key = this.line_of_fifths[old_key_number];
                                            if (show_output)
                                                console.log("attributes.key.fifths: %s old_key_number: %s old_key: %s", 
                                                    attributes.key.fifths, old_key_number, this.old_key);
                
                                            this.new_key = parameters.transpose_key;
                                            let new_line_of_fifths_number = this.line_of_fifths_numbers[this.new_key] - line_of_fifths_c;
                                            if (show_output)
                                                console.log("<fifths>%s</fifths> old_key: %s new_key: %s \n", 
                                                    new_line_of_fifths_number, this.old_key, this.new_key);
                                                
                                            this.change_dom_element_value(key_element, "fifths", new_line_of_fifths_number);
                                            break;

                                        case "staff-details":
                                            break;

                                        case "staves":
                                            attributes.staves = this.get_element_value_numeric(attribute_child);
                                            break;
                                        
                                        case "time":
                                            if (show_output)
                                                console.log("CASE: %s", attribute_child.tagName);
                                            attributes.time.beats = this.get_element_value_numeric(attribute_child);
                                            attributes.time.beat_type = this.get_element_value_numeric(attribute_child);
                                            break;

                                        default:
                                            console.error("Attribute Element not processed: %s", attribute_child.tagName);
                                            break;
        
                                    }
                                }
                                // ADH- see if clef is parsed above
                                // clef can be an array of elements
                                let clef_elements = attribute_element.querySelectorAll('clef');
                                if (show_output)
                                    console.log("clef_elements length: %s", clef_elements.length);
                                for (let ic = 0; ic < clef_elements.length; ic++)
                                {
                                    if (show_output)
                                        this.show_dom_element(clef_elements[ic]);
                                    if (!attributes.clef[ic])
                                        attributes.clef[ic] = {sign: null, line: null};
                                    let clef = attributes.clef[ic]
                                    clef.sign = this.get_dom_element_value(clef_elements[ic], "sign");
                                    clef.line = this.get_dom_element_value_numeric(clef_elements[ic], "line");

                                    // we want the octave and note step number of the middle line.
                                    // step_mumbers:
                                    //  C D E F G A B
                                    //  0 1 2 3 4 5 6
                                    clef_position = this.clef_positions[clef.sign][clef.line];
                                    if (clef_position)
                                    {
                                        clef.middle_letter = clef_position.middle_letter;
                                        clef.middle_number = clef_position.middle_number;
                                        clef.middle_octave = clef_position.middle_octave;
                                        if (clef.octave_change)
                                        {
                                            clef.middle_octave += clef.octave_change;
                                            if (show_output)
                                                console.log("OCTAVE CHANGE: %s new middle_octave: %s", clef.octave_change, clef.middle_octave);
                                        }
                                        if (show_output)
                                            console.log("</CLEF: %s SIGN: %s LINE: %s middle: %s %s octave: %s",
                                                clef.number, clef.sign, clef.line, clef.middle_number, clef.middle_letter, clef.middle_octave)
                                    }

                                }
                                break;

                            case "backup":
                                break;

                            case "barline":
                                    break;

                            case "direction":
                                break;

                            case "forward":
                                break;
                                
                            case "harmony":
                                if (show_output)
                                    console.log("CASE: %s", measure_child.tagName);
                                let harmony_element = measure_child;

                                this.show_dom_element(harmony_element, "harmony_element");

                                let harmony_children = harmony_element.children;
                                console.log("harmony CHILDREN: %s", harmony_children.length);
                                
                                for (let ii = 0; ii < harmony_children.length; ii++)
                                {
                                    let harmony_child = harmony_children[ii];
                                    //console.log("harmony CHILD %s: %s", ii, harmony_child.tagName);

                                    switch (harmony_child.tagName) 
                                    {
                                        case "root":
                                            console.log("CASE: %s", harmony_child.tagName);
                                            root_element = harmony_child;
                                            this.show_dom_element(root_element, "root_element");
                                            /***
                                                 <harmony print-frame="no">
                                                    <root>
                                                    <root-step>B</root-step>
                                                    <root-alter>-1</root-alter>
                                                    </root>
                                                    <bass>
                                                    <bass-step>G</bass-step>              
                                                    <root-alter>-1</root-alter>
                                                    </bass>
                                                    <kind text="ma7">major-seventh</kind>
                                                </harmony>
                                            ***/

                                            this.show_dom_element(root_element, "root_element");
                                            root_step = this.get_dom_element_value(root_element, "root-step");
                                            root_alter = this.get_dom_element_value(root_element, "root-alter", this.SKIP_ERROR);

                                            // octave is not used for harmony
                                            let transposed_root = this.transpose_pitch("root_step", root_step, root_alter, 3,
                                                this.old_key, this.new_key);

                                            this.change_dom_element_value(root_element, "root-step", transposed_root.new_step);
                                            if (transposed_root.new_alter == 0)
                                            {
                                                if (root_alter)
                                                {
                                                    this.remove_dom_element_by_name(root_element, "root-alter");
                                                }
                                            }
                                            else if (root_alter)
                                            {
                                                this.change_dom_element_value(root_element, "root-alter", transposed_root.new_alter);
                                            }
                                            else
                                            {
                                                // insert_dom_value_after(parent_element, existing_name, new_element_ame, value)
                                                this.insert_dom_value_after(root_element, "root-step", "root-alter", transposed_root.new_alter);    
                                            }
                                            this.show_dom_element(root_element, "root_element AFTER CHANGES");

                                            break;

                                        case "bass":
                                            console.log("CASE: %s", harmony_child.tagName);
                                            bass_element = harmony_child;
                                            this.show_dom_element(bass_element);
                                            /***
                                                 <harmony print-frame="no">
                                                    <bass>
                                                    <bass-step>B</bass-step>
                                                    <bass-alter>-1</bass-alter>
                                                    </bass>
                                                    <bass>
                                                    <bass-step>G</bass-step>              
                                                    <bass-alter>-1</bass-alter>
                                                    </bass>
                                                    <kind text="ma7">major-seventh</kind>
                                                </harmony>
                                            ***/

                                            bass_step = this.get_dom_element_value(bass_element, "bass-step");
                                            bass_alter = this.get_dom_element_value(bass_element, "bass-alter", this.SKIP_ERROR);

                                            // octave is not used for harmony
                                            let transposed_bass = this.transpose_pitch("bass_step", bass_step, bass_alter, 3,
                                                this.old_key, this.new_key);
                                            this.show_object(transposed_bass, "transposed_bass");

                                            this.change_dom_element_value(bass_element, "bass-step", transposed_bass.new_step);
                                            if (transposed_bass.new_alter == 0)
                                            {
                                                if (bass_alter)
                                                {
                                                    this.remove_dom_element_by_name(bass_element, "bass-alter");
                                                }
                                            }
                                            else if (bass_alter)
                                            {
                                                this.change_dom_element_value(bass_element, "bass-alter", transposed_bass.new_alter);
                                            }
                                            else
                                            {
                                                // insert_dom_value_after(parent_element, existing_name, new_element_ame, value)
                                                this.insert_dom_value_after(bass_element, "bass-step", "bass-alter", transposed_bass.new_alter);    
                                            }
                                            break; // end of bass
                                    }
                                }

                                this.show_dom_element(harmony_element, "harmony_element AFTER CHANGES");
                                this.show_object(harmony_element, "harmony_element AFTER CHANGES");

                                break;

                            case "note":
                                if (show_output)
                                    console.log("CASE: %s", measure_child.tagName);
                                let note_element = measure_child;
                                //this.show_dom_element(note_element);

                                if (show_output)
                                    console.log("NOTE: note_index: %s", note_index);
                                if (show_output)
                                    this.show_dom_element(note_element);

                                    note = {
                                                index: note_index,
                                                rest: null,
                                                chord: null,
                                                chord_index: null,
                                                first_chord_note: false,
                                                pitch: null,
                                                duration: null,
                                                instrument: null,
                                                voice: 0,
                                                type: null,
                                                dot: null,
                                                accidental: null,
                                                stem: null,
                                                staff: 0,
                                                notations: null,
                                                lyric: null,
                                                beam_index: null,
                                                beam_status: null,
                                                note_element: note_element,
                                                pitch_element: null
                                            };

                                

                                measure_data.note_data_array[note_index] = note;

                                let note_children = note_element.children;
                                //console.log("NOTE CHILDREN: %s", note_children.length);
                                
                                for (let ii = 0; ii < note_children.length; ii++)
                                {
                                    let note_child = note_children[ii];
                                    //console.log("note CHILD %s: %s", ii, note_child.tagName);

                                    switch (note_child.tagName) 
                                    {
                                        case "accidental":
                                            // if not found, this is left as null
                                            note.accidental = this.get_element_value(note_child);
                                            break;
                                        
                                        case "beam":
                                            let beam_element = note_child;
                                            // <beam number="1">end</beam>
                                            beam_number = beam_element.getAttribute("number");
                                            beam_status = this.get_element_value(beam_element);
                                            
                                            note.beam_status = beam_status;

                                            if (beam_status == "begin")
                                            {
                                                beam_index++;

                                                measure_data.beam_data_array[beam_index] = {
                                                                first_note: note.index,
                                                                last_note: note.index,
                                                                above_count: 0,
                                                                below_count: 0,
                                                                beam_stem_direction: null
                                                            };
                                                if (show_output)
                                                    console.log("BEGIN beam_index: %s", beam_index);

                                            }
                                            // chord notes may be added to beam_array later
                                            measure_data.beam_data_array[beam_index].last_note = note_index;
                                            note.beam_index = beam_index;

                                            if (show_output)
                                                console.log("NOTE: %s BEAM beam_status: %s beam_index: %s", 
                                                    note.index, beam_status, beam_index);
                                            break;
                                                
                                        case "chord":

                                            let chord_element = note_child;

                                            //this.show_dom_element(chord_element);
                                            if (show_output)
                                                console.log("CHORD: note_index: %s -1: %s", note_index, note_index-1);
                                            if (!measure_data.note_data_array[note_index - 1].chord)
                                            {
                                                
                                                chord_index++; 
                                                chord_data = {
                                                                index: chord_index,
                                                                first_note: note_index - 1,
                                                                last_note: note_index,
                                                                notes: 0,
                                                                max_offset: null,
                                                                min_offset: null,
                                                                chord_stem_direction: null
                                                            };
                                                measure_data.chord_data_array[chord_index] = chord_data;
                                                measure_data.note_data_array[note_index - 1].chord = true;
                                                measure_data.note_data_array[note_index - 1].chord_index = chord_index;
                                            }
                                            note.chord = true;
                                            note.chord_index = chord_index;
                                            chord_data = measure_data.chord_data_array[chord_index];
                                            chord_data.last_note = note_index;

                                            break;

                                        case "dot":
                                            note.dot = this.get_element_value(note_child);
                                            break;

                                        case "duration":
                                            note.duration = this.get_element_value_numeric(note_child);
                                            break;

                                        case "instrument":
                                            break;
                                                    
                                        case "lyric":
                                            break;

                                        case "notations":
                                            break;  

                                        case "notehead":
                                            break;

                                        case "pitch":
                                            note.pitch_element = note_child;
                                    
                                            if (show_output)
                                                console.log("PITCH");

                                            note.pitch = {};

                                            note.pitch.step = this.get_dom_element_value(note.pitch_element, "step");
                                            note.pitch.alter = this.get_dom_element_value_numeric(note.pitch_element, "alter", this.SKIP_ERROR); // returns 0 if not found
                                            note.pitch.octave = this.get_dom_element_value_numeric(note.pitch_element, "octave");
                                            // current accidental is store in note

                                            note.transposed = this.transpose_pitch("note.pitch.step", note.pitch.step, note.pitch.alter, 
                                                note.pitch.octave, this.old_key, this.new_key);

                                            if (show_output)
                                                console.log("note.accidental: %s", note.accidental);

                                            break;

                                        case "rest":
                                            note.rest_element = note_child;
                                            if (show_output)
                                                console.log("REST: note_index: %s ", note_index)
                                            let rest_element = note_child;
                                            // see if these is a position for the rest
                                                        note.rest = {
                                                            set: true,
                                                            display_step: null,
                                                            display_step: null,
                                                            transposed: null
                                                        };
                                                        
                                            note.rest.display_step = this.get_dom_element_value(rest_element, "display-step", this.SKIP_ERROR);
                                            if (note.rest.display_step)
                                            {
                                                note.rest.display_octave = this.get_dom_element_value(rest_element, "display-octave", this.SKIP_ERROR);
                                                note.rest.transposed = this.transpose_pitch("note.rest.display_step", note.rest.display_step, 0, 
                                                    note.rest.display_octave, this.old_key, this.new_key);
                                                console.log("REST: display_step: %s octave: %s transposed_step: %s octave: %s",  
                                                    note.rest.display_step, note.rest.display_octave,
                                                    note.rest.transposed.new_step, note.rest.transposed.new_octave);
                                            }
                                            
                                            break;
                                            
                                        case "time-modification":
                                            break;

                                        case "staff":
                                            note.staff = this.get_element_value_numeric(note_child);
                                            break;

                                        case "stem":
                                            note.stem = this.get_element_value(note_child);
                                            break;

                                        case "tie":
                                            break;

                                        case "grace":
                                            break;

                                        case "type":
                                            note.type = this.get_element_value(note_child);
                                            break;
                                        
                                        case "voice":                                                
                                            break;
                                            
                                        default:
                                            console.error("Note Element not processed: %s", note_child.tagName);
                                            break;
                                    }
                                } // end of note children

                                // see if in beam as part of a chord
                                if (note_index > 0 && note.chord)
                                {
                                    old_note = measure_data.note_data_array[note_index - 1];
                                    if (old_note.beam_index)
                                    {
                                        note.beam_status = "chord in beam";
                                        note.beam_index = old_note.beam_index;
                                    // console.log("NOTE: %s CHORD IN BEAM: beam_index: %s", note.index, note.beam_index);
                                    }
                                }


                                // we need to track accidentals by both voice and octave
                                // voice_data_array has the last_note for each voice
                                if (!measure_data.staff_data_array[note.staff])
                                {
                                    measure_data.staff_data_array[note.staff] = {staff: note.staff, min_voice: null, max_voice: null, voice_data_array: []};
                                }
                                staff_data = measure_data.staff_data_array[note.staff];

                                if (note.voice > 0)
                                {
                                    if (!staff_data.min_voice)
                                        staff_data.min_voice = note.voice;
                                    else 
                                        staff_data.min_voice = Math.min(staff_data.min_voice, note.voice);
                                    if (!staff_data.max_voice)
                                        staff_data.max_voice = note.voice;
                                    else 
                                        staff_data.max_voice = Math.max(staff_data.max_voice, note.voice);
                                }
                                if (show_output)
                                    console.log("STAFF: %s VOICE: %s min_voice: %s max_voice: %s", 
                                        note.staff, note.voice, staff_data.min_voice, staff_data.max_voice);

                                
                                note_index++;
                                break;

                            case "print":
                                break;

                            case "sound":
                                break;

                            default:
                                console.error("Measure Element not processed: %s", measure_child.tagName);
                                break;

                        } // end switch measure children
                    } // end loop measure children

                    // get stem direction for beams

                    // beam data
                    for (let inote = 0; inote < measure_data.note_data_array.length; inote++)
                    {
                        note =  measure_data.note_data_array[inote];
                        if (note.rest)
                        {
                            //if (show_output)
                                console.log("REST: inote: %s display_step: %s", inote, note.rest.display_step);
                            if (note.rest.display_step)
                            {
                                console.log("Update display-step: %s display-octave: %s --> %s %s", 
                                    note.rest.display_step, note.rest.display_octave,
                                    note.rest.transposed.new_step, note.rest.transposed.new_octave);
                                this.change_dom_element_value(note.rest_element, "display-octave", note.rest.transposed.new_octave);
                                this.change_dom_element_value(note.rest_element, "display-step", note.rest.transposed.new_step);
                            }
                            continue;   // processed
                        }

                        if (note.beam_index)
                        {
    
                            beam_data = measure_data.beam_data_array[note.beam_index];
                        
                            beam_data.last_note = note.index;

                            // ADH - currently this gets only the first note of a chord
                            note_offset = this.get_note_offset(note);
                            if (note_offset > 0)
                                beam_data.above_count++;
                            else
                                beam_data.below_count++;
                            if (show_output)
                                console.log("NOTE: %s beam_index: %s beam_status: %s COUNT BEAM above: %s below: %s", 
                                    note.index, beam_index, beam_status, beam_data.above_count, beam_data.below_count);
                        }
                    }


                    // get stem direction for beams from number of notes above or below the center
                    for (let ibeam = 1; ibeam < measure_data.beam_data_array.length; ibeam++)
                    {
                        let  beam_data = measure_data.beam_data_array[ibeam];
                        if (beam_data.above_count > beam_data.below_count)
                        {
                            beam_data.beam_stem_direction = "down"; 
                        }
                        else if (beam_data.above_count < beam_data.below_count)
                        {
                            beam_data.beam_stem_direction = "up"; 
                        }
                        else
                        {
                            beam_data.beam_stem_direction = "equal";  // use previous note 
                        }
                        if (show_output)
                            console.log("ibeam: %s USE BEAM above: %s below: %s beam_data.beam_stem_direction: %s", 
                                ibeam, beam_data.above_count, beam_data.below_count, beam_data.beam_stem_direction);
                    }

                    // lets get the notes for the chords
                    for (let ichord = 1; ichord < measure_data.chord_data_array.length; ichord++)
                    {
                        let  chord_data = measure_data.chord_data_array[ichord];
                        chord_data.notes = chord_data.last_note - chord_data.first_note + 1;
                        
                        if (show_output)
                                console.log("ichord: %s note_index: %s", ichord, note_index);
                        for (let note_index =  chord_data.first_note; note_index <= chord_data.last_note; note_index++)
                        {
                            note = measure_data.note_data_array[note_index];
                            if (show_output)
                                console.log("note_index: %s note.chord_index: %s", note_index, note.chord_index);
                            if (!note.chord || note.chord_index != ichord)
                                break;
                    
                            note_offset = this.get_note_offset(note);
                            if (chord_data.min_offset === null)
                            {
                                chord_data.min_offset = note_offset;
                            }
                            else
                            {
                                chord_data.min_offset = Math.min(chord_data.min_offset, note_offset);
                            }
                            if (chord_data.max_offset === null)
                            {
                                chord_data.max_offset = note_offset;
                            }
                            else
                            {
                                chord_data.max_offset = Math.max(chord_data.max_offset, note_offset);
                            }
                            if (show_output)
                                console.log("CHORD RANGE: note; %s chord_index: %s note_offset: %s min_offset: %s max_offset: %s",
                                    note.index, note.chord_index, note_offset, chord_data.min_offset, chord_data.max_offset);
                        }

                        // get stem direction
                        if (Math.abs(chord_data.max_offset) > Math.abs(chord_data.min_offset))
                        {
                            chord_data.chord_stem_direction = "down"; // most notes are above the center - point down
                        }
                        else
                        {
                            // we could handle "equal" differently
                            chord_data.chord_stem_direction = "up"; 
                        }
                        if (show_output)
                            console.log("CHORD index: %s max: %s min: %s chord_stem_direction: %s", 
                                note.chord_index, chord_data.max_offset, chord_data.min_offset, chord_data.chord_stem_direction);
                    }

                    // we need to get note_element again, pr store it in a new 'note_element_array' for each measure
                    
                    // loop through notes and get stem direction
                    if (show_output)
                        console.log("\n*** loop through notes and get stem direction ***");
                    for (let inote = 0; inote < measure_data.note_data_array.length; inote++)
                    {
                        note =  measure_data.note_data_array[inote];
                        if (note.rest)
                        {
                            if (show_output)
                                console.log("SKIP REST: inote: %s", inote);
                            continue;   // skip rests
                        }
                        note_element = note.note_element;   // saved with note

                        staff_data = measure_data.staff_data_array[note.staff];

                        if (!staff_data.voice_data_array[note.voice])
                        {
                            staff_data.voice_data_array[note.voice] = {last_direction: null};
                        }
                        voice_data = staff_data.voice_data_array[note.voice];

                        if (show_output)
                            console.log("NOTE: %s staff: %s voice: %s last_direction: %s", note.index, note.staff, note.voice, voice_data.last_direction);

                        // 1, If multiple voices - put one voice up and all others
                        // 2. if in a beam, put all notes in the beam in the ame direction
                        // 3. if ia a chord, count notes above or below the center line
                        // 4. look at individual note.

                        if (staff_data.min_voice && staff_data.min_voice < staff_data.max_voice)
                        {
                            if (show_output)
                                console.log("Multiple Voices");
                            // if there is more than one voice in measure and staff, point stems by voice
                            if (note.voice >  staff_data.min_voice)
                            {
                                // this is only for staffs with multiple voices - which we need to locate
                                new_stem_direction = "down";    // other voices tend to go down
                                if (show_output)
                                    console.log("USE VOICE: %s STEM DOWN", note.voice);
                            }
                            else
                            { 
                                new_stem_direction = "up";    // other voices tend to go down
                                if (show_output)
                                    console.log("USE VOICE: %s STEM UP", note.voice);
                            }
                        }
                        else if (note.beam_index)
                        {
                            // lets only combine notes in first beam for now
                            
                            beam_data = measure_data.beam_data_array[note.beam_index];
                            //this.show_object(beam_data, "beam_data");
                            if (show_output)
                                console.log("NOTE: %s IN BEAM: beam_index: %s beam_data.beam_stem_direction: %s", note.index, beam_index, beam_data.beam_stem_direction);
                        
                            if (beam_data.beam_stem_direction == "equal")
                            {
                                // set to last not direction
                                // use stem directiomn from above

                            }     
                            else
                            {  
                                new_stem_direction =  beam_data.beam_stem_direction;
                            }
                            if (show_output)
                                console.log("NOTE: %s beam_index: s: beam_stem_direction: %s new_stem_direction: %s", 
                                    note.index, note.beam_index, beam_data.beam_stem_direction, new_stem_direction);
                            
                        }
                        else if (note.chord_index !== null)
                        {
                            // chord - get highest and lowest position of notes in chord
                            if (show_output)
                                console.log("IN CHORD: NOTE: %s chord_data_array[note.chord_index = %s]  first_chord_note: %s", 
                                    note.index, note.chord_index, note.first_chord_note);
                            let chord_data = measure_data.chord_data_array[note.chord_index];

                            if (note.first_chord_note)
                            {
                                this.set_chord_range(note);
                            }

                            if (Math.abs(chord_data.max_offset) > Math.abs(chord_data.min_offset))
                            {
                                new_stem_direction = "down"; 
                            }
                            else
                            {
                                // we could handle "equal" differently
                                new_stem_direction = "up"; 
                            }
                            if (show_output)
                                console.log("CHORD index: %s max: %s min: %s new_stem_direction: %s", 
                                    note.chord_index, chord_data.max_offset, chord_data.min_offset, new_stem_direction);

                        }
                        else
                        {
                            // are we above or below the center staff line

                            note_offset = this.get_note_offset(note);
                    
                            if (note_offset > 0)
                            {
                                note_position = "above";
                                new_stem_direction = "down";        
                            }
                            else if (note_offset < 0)
                            {
                                note_position = "below";
                                new_stem_direction = "up";
                            }
                            else 
                            {
                                note_position = "middle";
                                // ADH should last_direction carry over from previous measure???
                                if (voice_data.last_direction)
                                    new_stem_direction = voice_data.last_direction;
                                else
                                    new_stem_direction = "down";    
                            }
                            if (show_output)
                                console.log("note_offset: %s note_position: %s new_stem_direction: %s", note_offset, note_position, new_stem_direction);
                        }

                    
                        

                        if (show_output)
                            console.log("NOTE: %s USE new_stem_direction: %s", note.index, new_stem_direction);
                        note.new_stem_direction = new_stem_direction;    
    
                        voice_data.last_direction = note.new_stem_direction;

                        // set note items into DOM elements
                        if (show_output)
                            this.show_dom_element(note_element, "NOTE ELEMENT BEFORE");

                        // update pitch
                        if (note.transposed)
                        {
                            this.change_dom_element_value(note.pitch_element, "octave", note.transposed.new_octave);
                            this.change_dom_element_value(note.pitch_element, "step", note.transposed.new_step);
                            if (show_output)
                                console.log("note.pitch.alter: %s note.transposed.new_alter: %s", note.pitch.alter, note.transposed.new_alter);
                            if (note.transposed.new_alter != 0)
                            {
                                // this will create an element if not there yet
                                if (note.pitch.alter == 0)
                                {
                                    // there was no existing alter element, so add the new one after 'step'
                                    // insert_dom_value_after(parent_element, existing_name, new_element_ame, value)
                                    this.insert_dom_value_after(note.pitch_element, "step", "alter", note.transposed.new_alter);
                                }
                                else
                                {
                                    this.change_dom_element_value(note.pitch_element, "alter", note.transposed.new_alter);
                                }
    
                            }
                            else if (note.pitch.alter != 0)
                            {
                                // remove element if it exists already
                                this.remove_dom_element_by_name(note.pitch_element, "alter");   

                            }

                            if (note.stem && note.stem != note.new_stem_direction)
                            {
                                // note.new_stem_direction
                                this.change_dom_element_value(note_element, "stem", note.new_stem_direction);
                            }

                            let new_accidental = note.transposed.new_accidental;
                            if (show_output)
                                console.log("\n*** PROCESS ACCIDENTALS *** NEW: %s", new_accidental);
                            //if (new_accidental != "")
                            //{
                            // see if it is needed (in curent key, or from previous accidentals)
                            let current_accidental = this.get_current_accidental(measure_data, note.voice, note.transposed.new_octave, note.transposed.new_step);
                            
                            measure_data.current_accidentals[note.voice][note.transposed.new_octave][note.transposed.new_step] = new_accidental;
                            
                            if (show_output)
                                console.log("note.accidental: %s new_accidental: %s current_accidental: %s", 
                                    note.accidental, new_accidental, current_accidental);

                            // what accidental to we want to put out
                            if (current_accidental == new_accidental)
                            {
                                accidental_to_use = "";     // no change from key or last note
                            }
                            else if (new_accidental == "")
                            {
                                accidental_to_use = "natural";               
                            }
                            else 
                            {
                                accidental_to_use = new_accidental;
                            }

                            if (show_output)
                                console.log("note.accidental: %s accidental_to_use: '%s'", note.accidental, accidental_to_use);
                            // will create an element if not there yet
                            // 'accidental' is stored on note, niot in note.pitch
                            if (!note.accidental && accidental_to_use != "")
                            {
                                // there was no existing accidental element, so add the new one at end
                                console.log("*** INSERT ACCIDENTAL ***: %s ***", accidental_to_use);
                                //this.show_dom_element(note_element, "NOTE before accidental insert");
                                console.log("note.dot: %s", note.dot);
                                if (note.dot)
                                {   
                                    // insert_dom_value_after(parent_element, existing_name, new_element_ame, value)
                                    this.insert_dom_value_after(note_element, "dot", "accidental", accidental_to_use);
                                }
                                else
                                {
                                    // insert_dom_value_after(parent_element, existing_name, new_element_ame, value)
                                    this.insert_dom_value_after(note_element, "type", "accidental", accidental_to_use);
                                }
                                
                                //this.show_dom_element(note_element, "NOTE after accidental insert");
                                //throw("INSERT ACCIDENTAL");
                            }
                            else if (note.accidental && accidental_to_use != "")
                            {
                                // there was an accidental - change it
                                //console.log("*** CHANGE ACCIDENTAL: %s ***", accidental_to_use);
                                this.change_dom_element_value(note_element, "accidental", accidental_to_use);
                                //this.show_dom_element(note_element, "NOTE ELEMENT AFTER");
                                //throw("CHANGE ACCIDENTAL");
                            }
                            else if (note.accidental && accidental_to_use == "")
                            {
                                // remove element if it exists already
                                //console.log("*** REMOVE ACCIDENTAL ***");
                                //this.show_dom_element(note_element);
                                this.remove_dom_element_by_name(note_element, "accidental");   
                                //this.show_dom_element(note_element, "NOTE ELEMENT AFTER");
                            //throw("REMOVE ACCIDENTAL");
                            }

                            if (show_output)
                                this.show_dom_element(note_element, "NOTE ELEMENT AFTER");
                        }
                    
                    }

                    //throw("end of measure");
                    
                    // end of measure

                    break;

                    

                default: 
                    console.log("part_child element note in switch: %s", part_child.tagName)

                }   // end of switch(part_child.tagName)

            } // end of ipart loop

            break;

            // other level 1 keywords
            case "work":
                break;
            case "identification":
                break;
            case "defaults":
                break;
            case "credit":
                break;
            case "part-list":
                break;
            default:
                console.error("Part Element not processed: %s", score_element.tagName);
                break;

        } // end of switch(score_element.tagName)

      } // end of for (itop

      return(dom_object);

    }

    



  