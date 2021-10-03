
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN AMMLIB_Lib_TrimScore.js");

libs_loaded["AMMLIB_Lib_TrimScore"] = "loaded";
//console.log("Object.keys(libs_loaded).length: %s", Object.keys(libs_loaded).length);


// You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
MusicDOM.prototype.do_trim_score_xml = function(parameters, xml_string_in)
{
    let dom_object = this.musicxml_to_dom(xml_string_in);

    this.do_trim_score_musicxml_dom(parameters, dom_object);

    let xml_string_return = this.dom_object_to_return_string(dom_object);
    return(xml_string_return);
}

MusicDOM.prototype.do_trim_score_musicxml_dom = function(parameters, dom_object)
{
    this.parameters = parameters;  // save in prototype
    this.show_output = parameters.show_output;
    let show_output = this.show_output;

    let score_partwise_element = dom_object.firstElementChild; // score-partwise

        let score_partwise_children = score_partwise_element.children;
        console.log("score_partwise_element: %s top children: %s", score_partwise_element.tagName, score_partwise_children.length);



        // get part-list and part from score-partwise
        for (let iscore_partwise = 0; iscore_partwise < score_partwise_children.length; iscore_partwise++)
        {
            score_partwise_child = score_partwise_children[iscore_partwise];
            console.log("  iscore_partwise: %s score_partwise_child: %s", iscore_partwise, score_partwise_child.tagName);

            // looking for 'part-list' and 'part'
            switch (score_partwise_child.tagName) {

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
                    part_element = score_partwise_child;

                    // <part id="P2">
                    let part_id = part_element.getAttribute("id");

                    console.log("part_id: %s", part_id);

                    new_measure_number = parameters.first_trim_measure;



            // read measures and attributes from part element
            let part_element_children = part_element.children;
            console.log("part_element_children: length: %s", part_element_children.length);

            let measures_to_delete = [];    // delete after we process all measures
            let first_measure_element = null;

            for (let im = 0; im < part_element_children.length; im++)
            {
                var measure_element = part_element_children[im];
                let measure_number = measure_element.getAttribute("number");
                console.log("%s part_element_child: '%s': %s", im, measure_element.tagName, measure_number);


                if (measure_number == 1 && parameters.first_trim_measure > 1)
                {
                    // we need to keep attributes from the first measure, but not the notes
                    console.log("SAVE FIRST MEASURE: %s", measure_number);
                    first_measure_element = measure_element
                }

                if (measure_number > 1 && measure_number < parameters.first_trim_measure)
                {
                    console.log("PUSH FOR DELETE: %s", measure_number);
                    measures_to_delete.push(measure_element);
                    continue;
                }

                if (parameters.last_trim_measure > 0 && measure_number >  parameters.last_trim_measure)
                {
                    console.log("PUSH FOR DELETE: %s", measure_number);
                    measures_to_delete.push(measure_element);
                    continue;
                }

                if (measure_number > 1 && measure_number == parameters.first_trim_measure)
                {
                    // copy everything to first_trim_measure
                    console.log("COPY TO FIRST MEASURE: %s", measure_number);

                    //this.show_dom_element(first_trim_measure, "FIRST MEASURE BEFORE CHANGES");

                    // remove notes from first measure

                    let first_measure_element_children = first_measure_element.children;
                    console.log("first_measure_element_children: length: %s", first_measure_element_children.length);

                    // try deleting in reverse order to not mess up children array
                    for (let ic = first_measure_element_children.length - 1; ic >= 0; ic--)
                    {
                        let first_measure_child = first_measure_element_children[ic];
                        if (first_measure_child.tagName == "note" || first_measure_child.tagName == "harmony")
                        {
                            console.log("REMOVE FIRST MEASURE NOTE or HARMONY: %s %s", ic, first_measure_child.tagName);
                            first_measure_child.remove();
                        }
                        else
                        {
                            console.log("KEEP FIRST MEASURE ELEMENT: %s %s", ic, first_measure_child.tagName);
                            console.log("measure element not removed: %s", first_measure_child.tagName);
                        }
                    }

                    //this.show_dom_element(first_trim_measure, "FIRST MEASURE AFTER DELETIONS");

                    // append or change any attrbutes
                    measure_element_children = measure_element.children;
                    console.log("measure_element_children: length: %s", measure_element_children.length);

                    let note_count = 0;
                    let first_rest_duration = 0;
                    let last_rest_duration = 0;

                    for (let ic = 0; ic < measure_element_children.length; ic++)
                    {
                        console.log("IC: %s/%s", ic, measure_element_children.length);
                        let measure_child = measure_element_children[ic];

                        // some children get copied
                        // some get replaced
                        console.log("ic: %s MEASURE CHILD %s", ic, measure_child.tagName);

                        switch (measure_child.tagName)
                        {
                            case "attributes":
                                let attribute_element = measure_child;
                                    if (show_output)
                                        console.log("CASE: %s", measure_child.tagName);

                                    // get the attributes we want to copy
                                    let attribute_children = attribute_element.children;
                                    console.log("ATTRIBUTE CHILDREN: %s", attribute_children.length);
                                    for (let ii = 0; ii < attribute_children.length; ii++)
                                    {
                                        let attribute_child = attribute_children[ii];
                                        console.log("attribute_child %s: %s", ii, attribute_child.tagName);

                                        let first_measure_child = this.get_dom_element(first_measure_element, attribute_child.tagName, this.SKIP_ERROR);
                                        if (first_measure_child)
                                        {
                                            console.log("CHANGE first_measure_element attribute: %s", attribute_child.tagName);
                                            this.change_dom_element_value(first_measure_element, attribute_child.tagName, attribute_child);
                                        }
                                        else
                                        {
                                            console.log("APPEND first_measure_element attribute: %s", attribute_child.tagName);
                                            first_measure_element.attributes.appendChild(this.clone_dom_element(attribute_child));
                                        }

                                    }
                                    break;
                                case "note":
                                    note_element = measure_child;
                                    note_count++;
                                    console.log("NOTE_COUNT: %s first_note: %s duration: %s",
                                        note_count, parameters.first_note, this.get_dom_element_value_numeric(note_element, "duration"));
                                    if (parameters.first_note > 0 && note_count < parameters.first_note)
                                    {
                                        first_rest_duration += this.get_dom_element_value_numeric(note_element, "duration");
                                        console.log("FIRST REST DURATION: %s", first_rest_duration);
                                    }
                                    else if (parameters.first_note > 0 && note_count == parameters.first_note)
                                    {
                                        first_rest_duration += this.get_dom_element_value_numeric(note_element, "duration");
                                        console.log("APPEND REST TO FIRST MEASURE: first_rest_duration: %s", first_rest_duration);
                                        if (first_rest_duration > 0)
                                        {
                                            srest = sprintf(`\n <rest/>
                                                <duration>%s</duration>
                                                <voice>1</voice>\n`, first_rest_duration);
                                            console.log("SREST1: %s", srest);
                                            srest = srest.replace(/   */g, '  ');
                                            console.log("SREST2: %s", srest);
                                            let new_rest_element = document.createElementNS('', "note");
                                            new_rest_element.innerHTML = srest;
                                            first_measure_element.appendChild(new_rest_element);
                                        }
                                    }
                                    else if (parameters.last_note > 0 && note_count > parameters.last_note)
                                    {
                                        last_rest_duration += this.get_dom_element_value_numeric(note_element, "duration");
                                        console.log("LAST REST DURATION: %s", last_rest_duration);
                                    }
                                    else
                                    {
                                        console.log("APPEND NOTE TO FIRST MEASURE");
                                        first_measure_element.appendChild(this.clone_dom_element(note_element));
                                    }
                                    break;

                                case "harmony":
                                    console.log("APPEND HARMONY TO FIRST MEASURE");
                                    first_measure_element.appendChild(this.clone_dom_element(measure_child));
                                    break;

                                default:
                                    console.error("measure element not processed: %s", measure_child.tagName);
                                    break;
                        }
                        //console.log("AFTER SWITCH: ic: %s MEASURE CHILD %s", ic, measure_child.tagName);
                        //console.log("AFTER IC: %s/%s", ic, measure_element_children.length);
                    }

                    // end of children - add last rest if needed
                    if (last_rest_duration > 0)
                    {
                        srest = sprintf(`\n <rest/>
                            <duration>%s</duration>
                            <voice>1</voice>\n`, last_rest_duration);
                        console.log("SREST1: %s", srest);
                        srest = srest.replace(/   */g, '  ');
                        console.log("SREST2: %s", srest);
                        let new_rest_element = document.createElementNS('', "note");
                        new_rest_element.innerHTML = srest;
                        first_measure_element.appendChild(new_rest_element);
                    }
                    this.show_dom_element(first_measure_element, "FIRST MEASURE AFTER CHANGES");
                    new_measure_number++;

                    // mark this measure for deletion

                    console.log("PUSH COPIED MEASURE FOR DELETE: %s", measure_number);
                    measures_to_delete.push(measure_element);

                    //throw("first measure");
                    continue;
                }



                // for other measures - just change the measure number
                console.log("Change measure number: %s --> %s", measure_number, new_measure_number);
                measure_element.setAttribute("number", new_measure_number);

                new_measure_number++;
            } // end of measures loop

            console.log("Deleting Measures: %s", measures_to_delete.length);
            for (let im = 0; im < measures_to_delete.length; im++)
            {
                measures_to_delete[im].remove();
            }


        } // end of part child loop



    } // end of parts loop



    let xml_string_return = this.dom_object_to_return_string(dom_object);

    return(xml_string_return);

} // end of do_trim_score_xml