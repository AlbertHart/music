

/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN AMMLIB_Lib_AddSolo.js");

libs_loaded["AMMLIB_Lib_AddSolo"] = "loaded";
//console.log("Object.keys(libs_loaded).length: %s", Object.keys(libs_loaded).length);


// You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
MusicDOM.prototype.add_solo_to_xml = function(parameters, xml_string_in)
{
    let dom_object_original = this.musicxml_to_dom(xml_string_in);

    this.add_solo_to_musicxml_dom(parameters, dom_object_original);

    let xml_string_return = this.dom_object_to_return_string(dom_object_original);
    return(xml_string_return);
}

var harmony_saved;
var measure_element;



MusicDOM.prototype.add_solo_to_musicxml_dom = function(parameters, dom_object_original)
{
    this.parameters = parameters;  // save in prototype
    this.show_output = parameters.show_output;
    let show_output = this.show_output;



    console.log("IN add_solo_to_musicxml_dom");

    // find last measure

    let first_solo_measure = parameters.first_solo_measure;
    if (first_solo_measure < 1)
        first_solo_measure = 1;
    let last_solo_measure = parameters.last_solo_measure;
    let last_measure_number = 0;
    let solo_keys = parameters.solo_keys;

    this.attributes = {divisions: 0,
        time: {beats: 0, beat_type: 0},
        key: {fifths: 0, mode: null},
        staves: null, clef: []};
    let attributes = this.attributes;   // use from var


    let istaff = 1; // we will be adding everything to staff
    let score_partwise_element_original = dom_object_original.firstElementChild; // score-partwise
    let score_partwise_children_original = score_partwise_element_original.children;
    console.log("score_partwise_element_original: %s top children: %s", score_partwise_element_original.tagName, score_partwise_children_original.length);

    // get and save original part elements
    // get part-list and part from score-partwise
    let original_part_elements = [];
    for (let iscore_partwise = 0; iscore_partwise < score_partwise_children_original.length; iscore_partwise++)
    {
        score_partwise_child = score_partwise_children_original[iscore_partwise];
        console.log("  iscore_partwise: %s score_partwise_child: %s", iscore_partwise, score_partwise_child.tagName);

        // looking for 'part-list' and 'part'

        switch (score_partwise_child.tagName)
        {



            case "part":
                part_element_original = score_partwise_child;
                original_part_elements[iscore_partwise] = part_element_original;

                // <part id="P2">
                let part_id = part_element_original.getAttribute("id");

                console.log("part_id: %s", part_id);
                break;
        }
    }

    let number_keys = 1;
    if (solo_keys = "12 key solo")
    {
        number_keys = 12;
    }
    new_key = "";

    for (ikey = 0; ikey < number_keys; ikey++)
    {
        console.log("PROCESS KEY: %s", ikey);


        // get a new dom obect for each key
        dom_object_temp = MLIB.musicxml_to_dom(xml_string_in);



        let score_partwise_element_temp = dom_object_temp.firstElementChild; // score-partwise
        let score_partwise_children_temp = score_partwise_element_temp.children;




        if (ikey != 0)
        {
            new_key_number = old_key_number + ikey;
            new_key = this.line_of_fifths[new_key_number];
            console.log("ikey: %s new_key: %s new_key_number: %s", ikey, new_key, new_key_number);
        }

        // get part-list and part from score-partwise
        for (let iscore_partwise = 0; iscore_partwise < score_partwise_children_temp.length; iscore_partwise++)
        {
            score_partwise_child = score_partwise_children_temp[iscore_partwise];
            console.log("  iscore_partwise: %s score_partwise_child: %s", iscore_partwise, score_partwise_child.tagName);

            // looking for 'part-list' and 'part'
            switch (score_partwise_child.tagName)
            {

                case "part-list":
                    part_list_element = score_partwise_child;

                    let part_list_children = part_list_element.children;
                    console.log("part_list_element: %s top children: %s", part_list_element.tagName, part_list_children.length);

                    // get 'score-part' from 'part-list'
                    for (let ipart_list = 0; ipart_list < part_list_children.length; ipart_list++) {
                        part_list_child = part_list_children[ipart_list];
                        console.log("    ipart_list: %s part_list_child: %s", ipart_list, part_list_child.tagName);

                        switch (part_list_child.tagName) {
                            case "score-part":

                                // <score-part id="P1">
                                let score_part_element = part_list_child;
                                let score_part_id = score_part_element.getAttribute("id");
                                break;
                        }
                    }
                    break;

                case "part":
                    part_element_temp = score_partwise_child;

                    // <part id="P2">
                    let part_id = part_element_temp.getAttribute("id");

                    console.log("part_id: %s", part_id);





                    // read measures and attributes from part element
                    let part_element_children = part_element_temp.children;

                    let original_part_length = part_element_children.length;
                    console.log("original_part_length: %s", original_part_length);

                    let measures_to_delete = [];    // delete after we process all measures
                    let first_measure_element = null;
                    let solo_out = false;

                    let harmony_duration = 0;

                    for (let im = 0; im < original_part_length; im++)
                    {
                        // CLONE: DOM object with cloneNode(true) (true for recursive)
                        measure_element = part_element_children[im];
                        console.log("measure_element number: %s", Number(measure_element.getAttribute("number")));

                        let measure_number = Number(measure_element.getAttribute("number"));
                        last_measure_number = measure_number;
                        //console.log("Count Measures: %s part_element_child: '%s': %s", im, measure_element.tagName, measure_number);
                    }
                    if (last_measure_number < first_solo_measure)
                    {
                        alert("first measure not in score:");
                        return(false);
                    }
                    if (last_solo_measure < 1 || last_solo_measure > last_measure_number)
                    {
                        last_solo_measure = last_measure_number;
                    }

                    let new_measure_number = last_measure_number + 1;
                    console.log("first_solo_measure: %s last_solo_measure: %s", first_solo_measure, last_solo_measure);
                    for (let im = 0; im < original_part_length; im++)
                    {
                        var measure_element = part_element_children[im];
                        let measure_number = Number(measure_element.getAttribute("number"));

                        console.log("Process Measure im: %s/%s part_element_child: '%s': %s", im, original_part_length,
                            measure_element.tagName, measure_number);



                        if (measure_number > last_solo_measure)
                        {
                            console.log("End at measure: %s/ %s", measure_number, last_solo_measure);
                            break;
                        }
                        console.log("Process measure: %s", measure_number);



                        let measure_element_children = measure_element.children;
                        console.log("measure_element_children: length: %s", measure_element_children.length);



                        // get some attrbutes we need from measure 0
                        if (im == 0)
                        {
                            for (let ic = 0; ic < measure_element_children.length; ic++)
                            {
                                let measure_child = measure_element_children[ic];

                                // some children get copied
                                // some get replaced
                                console.log("MESASURR 0ic: %s measure_childtagName: %s", ic, measure_child.tagName);
                                if (ic > 99)
                                    throw("IC 99");

                                switch (measure_child.tagName)
                                {
                                    case "attributes":

                                        if (show_output)
                                            console.log("CASE: %s", measure_child.tagName);

                                        let attribute_element = measure_child;

                                        // clone to make a new copy
                                        // ADH - decide what attrbiutees we want to pass on.
                                        // lets start with nont
                                        let new_attribute_element = attribute_element.cloneNode(true);
                                        if (show_output)
                                            this.show_dom_element(attribute_element);


                                        // get the attributes we want to remember
                                        let attribute_children = attribute_element.children;
                                        console.log("ATTRIBUTE CHILDREN: %s", attribute_children.length);
                                        for (let ii = 0; ii < attribute_children.length; ii++)
                                        {
                                            let attribute_child = attribute_children[ii];
                                            console.log("attribute_child %s: %s", ii, attribute_child.tagName);

                                            switch (attribute_child.tagName)
                                            {
                                                case "clef":
                                                    let clef_element = attribute_child;
                                                    if (istaff == 1)
                                                    {
                                                        // new treble staff
                                                        this.change_dom_element_value(clef_element, "sign", "G");
                                                        this.change_dom_element_value(clef_element, "line", 2);
                                                    }
                                                    else
                                                    {
                                                        // new bass staff
                                                        // <clef>
                                                        // <sign>F</sign>
                                                        // <line>4</line>
                                                        // </clef>
                                                        this.change_dom_element_value(clef_element, "sign", "F");
                                                        this.change_dom_element_value(clef_element, "line", 4);
                                                    }

                                                    break;

                                                case "divisions":
                                                    attributes.divisions = this.get_element_value_numeric(attribute_child);
                                                    console.log("divisions: %s", attributes.divisions);
                                                    break;

                                                case "instruments":
                                                        break;

                                                case "key": // measure 0
                                                    // ADH - test key change in the middle of a measure
                                                    //if (show_output)
                                                        console.log("CASE: %s", attribute_child.tagName);

                                                    let key_element = attribute_child;

                                                    //this.show_dom_element(key_element);
                                                    attributes.key = {};
                                                    attributes.key.fifths = this.get_dom_element_value_numeric(key_element, "fifths");
                                                    if (show_output)
                                                        console.log("fifths: %s typeof: %s", attributes.key.fifths, typeof(attributes.key.fifths) );
                                                    attributes.key.mode = this.get_dom_element_value_numeric(key_element, "mode", this.SKIP_ERROR);

                                                    // -12 uses Db and Ab
                                                    let line_of_fifths_c = this.line_of_fifths_numbers["C"] - 12;
                                                    old_key_number = attributes.key.fifths + line_of_fifths_c;
                                                    old_key = this.line_of_fifths[old_key_number];
                                                    if (ikey == 0)
                                                    {
                                                        new_key = old_key;
                                                    }
                                                    //if (show_output)
                                                        console.log("attributes.key.fifths: %s old_key_number: %s old_key: %s",
                                                            attributes.key.fifths, old_key_number, this.old_key);


                                                    break;

                                                case "staff-details":
                                                    break;

                                                case "staves":
                                                    attributes.staves = this.get_element_value_numeric(attribute_child);
                                                    break;

                                                case "time":
                                                    //if (show_output)
                                                        console.log("CASE: %s", attribute_child.tagName);
                                                    // beats per measure
                                                    attributes.time = {};
                                                    attributes.time.beats = this.get_dom_element_value_numeric(attribute_child, "beats");
                                                    // 4=quarter notes, 8=eighth notes, etc.
                                                    attributes.time.beat_type = this.get_dom_element_value_numeric(attribute_child, "beat-type");
                                                    console.log("TIME: %s / %s", attributes.time.beats, attributes.time.beat_type);
                                                    break;

                                                default:
                                                    console.error("Attribute Element not processed: %s", attribute_child.tagName);
                                                    break;

                                            }
                                        }


                                    break;
                                }
                            }
                        }  // end of measure 0 stuff


                        if (measure_number < first_solo_measure)
                        {
                            console.log("Skip measure: %s / %s", measure_number, first_solo_measure);
                            continue;
                        }

                        // copy the measure
                        let new_measure_element = document.createElementNS('', "measure");
                        new_measure_element.setAttribute("number", new_measure_number);
                        new_measure_number++;

                        // add new measure to original score
                        original_part_elements[iscore_partwise].appendChild(new_measure_element);

                        let new_measure_html = "";
                        let first_harmony = true;
                        let first_note = true;


                        if (!solo_out)
                        {
                            // add solo text
                            new_measure_html += sprintf(`
        <print new-system="yes">
        </print>
        <direction placement="above">
        <direction-type>
            <words relative-y="53.13" font-size="11.9365">%s Solo</words>
            </direction-type>
        </direction>\n`, new_key);
                        solo_out = true;
                        }


                        for (let ic = 0; ic < measure_element_children.length; ic++)
                        {
                            let measure_child = measure_element_children[ic];

                            // some children get copied
                            // some get replaced
                            console.log("ic: %s measure_child.tagName: %s", ic, measure_child.tagName);
                            if (ic > 99)
                                throw("IC 99");

                            switch (measure_child.tagName)
                            {
                                case "attributes":
                                        if (show_output)
                                            console.log("CASE: %s", measure_child.tagName);

                                        // ADH - we will want to grt attributes changes after measure 0
                                        // or if they do not match the final attributes in the score

                                        let attribute_element = measure_child;

                                        // clone to make a new copy
                                        // ADH - decide what attrbiutees we want to pass on.
                                        // lets start with nont
                                        let new_attribute_element = attribute_element.cloneNode(true);
                                        if (show_output)
                                            this.show_dom_element(attribute_element);


                                        // get the attributes we want to remember
                                        let attribute_children = attribute_element.children;
                                        console.log("ATTRIBUTE CHILDREN: %s", attribute_children.length);
                                        for (let ii = 0; ii < attribute_children.length; ii++)
                                        {
                                            let attribute_child = attribute_children[ii];
                                            console.log("attribute_child %s: %s", ii, attribute_child.tagName);

                                            switch (attribute_child.tagName)
                                            {
                                                case "clef":
                                                    let clef_element = attribute_child;
                                                    if (istaff == 1)
                                                    {
                                                        // new treble staff
                                                        this.change_dom_element_value(clef_element, "sign", "G");
                                                        this.change_dom_element_value(clef_element, "line", 2);
                                                    }
                                                    else
                                                    {
                                                        // new bass staff
                                                        // <clef>
                                                        // <sign>F</sign>
                                                        // <line>4</line>
                                                        // </clef>
                                                        this.change_dom_element_value(clef_element, "sign", "F");
                                                        this.change_dom_element_value(clef_element, "line", 4);
                                                    }

                                                    break;

                                                case "divisions":
                                                    attributes.divisions = this.get_element_value_numeric(attribute_child);
                                                    console.log("divisions: %s", attributes.divisions);
                                                    break;

                                                case "instruments":
                                                        break;

                                                case "key":
                                                    // ADH - we should test key change in the middle of a measure
                                                    //if (show_output)
                                                        console.log("CASE: %s", attribute_child.tagName);

                                                    let key_element = attribute_child;

                                                    //this.show_dom_element(key_element);
                                                    attributes.key = {};
                                                    attributes.key.fifths = this.get_dom_element_value_numeric(key_element, "fifths");
                                                    //if (show_output)
                                                        console.log("ATTRIBUTES KEY: fifths: %s typeof: %s", attributes.key.fifths, typeof(attributes.key.fifths) );
                                                    attributes.key.mode = this.get_dom_element_value_numeric(key_element, "mode", this.SKIP_ERROR);




                                                    break;

                                                case "staff-details":
                                                    break;

                                                case "staves":
                                                    attributes.staves = this.get_element_value_numeric(attribute_child);
                                                    break;

                                                case "time":
                                                    //if (show_output)
                                                        console.log("CASE: %s", attribute_child.tagName);
                                                    // beats per measure
                                                    attributes.time = {};
                                                    attributes.time.beats = this.get_dom_element_value_numeric(attribute_child, "beats");
                                                    // 4=quarter notes, 8=eighth notes, etc.
                                                    attributes.time.beat_type = this.get_dom_element_value_numeric(attribute_child, "beat-type");
                                                    console.log("TIME: %s / %s", attributes.time.beats, attributes.time.beat_type);
                                                    break;

                                                default:
                                                    console.error("Attribute Element not processed: %s", attribute_child.tagName);
                                                    break;

                                            }
                                        }

                                    break;
                                case "note":
                                    let note_element = measure_child;
                                    if (show_output)
                                        console.log("CASE: %s harmony_duration: %s", note_element.tagName, harmony_duration);
                                    //if (!first_note)
                                    //    continue;

                                    //first_note = false;

                                    let duration = this.get_dom_element_value_numeric(note_element, "duration");
                                    harmony_duration += duration;

                                    // put new notes here
                                    console.log("note duration: %s harmony_duration: %s", duration, harmony_duration);

                                    break;

                                case "harmony":
                                    //if (show_output)
                                        console.log("CASE: %s harmony_duration: %s", measure_child.tagName, harmony_duration);
                                    //if (!first_harmony)
                                    //    continue;
                                    //first_harmony = false;

                                    this.show_dom_element(measure_child, "measure_child");



                                    let harmony_element = measure_child;

                                    this.show_dom_element(measure_child, "measure_child");

                                    let harmony_children = harmony_element.children;
                                    console.log("harmony CHILDREN: %s", harmony_children.length);

                                    for (let ii = 0; ii < harmony_children.length; ii++)
                                    {
                                        let harmony_child = harmony_children[ii];
                                        console.log("harmony CHILD %s: tagName: %s", ii, harmony_child.tagName);

                                        switch (harmony_child.tagName)
                                        {
                                            case "root":
                                                console.log("CASE: %s", harmony_child.tagName);
                                                root_element = harmony_child;
                                                this.show_dom_element(root_element, "root_element BEFORE");
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
                                                root_alter = this.get_dom_element_value_numeric(root_element, "root-alter", this.SKIP_ERROR);


                                                // octave is not used for harmony
                                                console.log("root-step: %s root_alter: %s old_key: %s new_key: %s ",
                                                    root_step, root_alter, old_key, new_key);
                                                let transposed_root = this.transpose_pitch("root_step", root_step, root_alter, 3,
                                                    old_key, new_key);
                                                console.log("new_step: %s old_key: %s new_key: %s transposed_root: %s %s",
                                                    transposed_root.new_step, old_key, new_key, transposed_root.new_step, transposed_root.new_alter);

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
                                                //throw("STOP AFTER TRANSPOSE");


                                                break;
                                        }   // end of switch

                                    }

                                    // add rest for previous harmony
                                    if (harmony_duration > 0)
                                    {
                                        new_measure_html += this.get_rests(harmony_duration);
                                        harmony_duration = 0;
                                    }

                                    // output the chord
                                    new_measure_html += "\n    ";
                                    new_measure_html += harmony_element.outerHTML;
                                    break;



                                default:
                                    if (show_output)
                                        console.log("DEFAULT: %s", measure_child.tagName);
                                    if (measure_child.tagName == "print" ||
                                        measure_child.tagName == "direction")
                                    {
                                        console.log("SKIP COPY: %s", measure_child.tagName);
                                        break;
                                    }
                                    // if not processed, clone into new measure
                                    console.log("default COPY: %s\n%s",  measure_child.tagName, measure_child.outerHTML);
                                    new_measure_html += "\n    ";
                                    new_measure_html += measure_child.outerHTML;
                                    break;
                            }
                        }

                        // add rest for previous harmony
                        if (harmony_duration > 0)
                        {
                            new_measure_html += this.get_rests(harmony_duration);
                            harmony_duration = 0;
                        }

                        console.log("new_measure_html:\n%s", new_measure_html);

                        new_measure_element.innerHTML = new_measure_html + "\n";
                        console.log("new_measure_element.outerHTML:\n%s", new_measure_element.outerHTML);
                        // if no barline found
                        new_measure_element.innerHMTL += ` <barline location="right">
                            <bar-style>light-heavy</bar-style>
                            </barline>`

                    } // end of measures




                    break;
            }

        }
    }



}

MusicDOM.prototype.get_rests = function(harmony_duration)
{
    let html = "";
    // use half notes for longer durations
    if (this.attributes.divisions <= 0)
    {
        console.error("divisions not set");
        return;
    }

    let half_note_duration = 2 * this.attributes.divisions;
    // ADH - remove false to use hald note rests
    while (false && harmony_duration >= half_note_duration)
    {
        html += this.get_rest(half_note_duration);
        harmony_duration -= half_note_duration;
    }
    if (harmony_duration > 0)
        html += this.get_rest(harmony_duration);

    return(html);
}


/*
<measure number="55" width="109.98">
      <print new-system="yes"> <- Start New System -->
        <system-layout>
          <system-margins>
            <left-margin>0.00</left-margin>
            <right-margin>-0.00</right-margin>
            </system-margins>
          <system-distance>146.08</system-distance>
          </system-layout>
        </print>
      <harmony print-frame="no">
        <root>
          <root-step>F</root-step>
          </root>
        <kind>major</kind>
        </harmony>

      <!-- Label as Solo -->
      <direction placement="above">
        <direction-type>
          <words relative-x="-23.73" relative-y="52.63">Solo</words>
          </direction-type>
        </direction>

        <!-- Match duration to chord length -->
      <note>
        <rest/>
        <duration>16</duration>
        <voice>1</voice>
        <type>whole</type>
        </note>
      </measure>
*/