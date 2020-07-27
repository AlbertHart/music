
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN AMMLIB_Lib_AddRhythm.js");

libs_loaded["AMMLIB_Lib_AddRhythm"] = "loaded";
console.log("Object.keys(libs_loaded).length: %s", Object.keys(libs_loaded).length);


// You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
MusicDOM.prototype.add_rhythm_to_xml = function(parameters, xml_string_in)
{
    let dom_object = this.musicxml_to_dom(xml_string_in);

    this.add_rhythm_to_musicxml_dom(parameters, dom_object);

    let xml_string_return = this.dom_object_to_return_string(dom_object);
    return(xml_string_return);
}

MusicDOM.prototype.add_rhythm_to_musicxml_dom = function(parameters, dom_object)
{
    this.parameters = parameters;  // save in prototype
    this.show_output = parameters.show_output;
    let show_output = this.show_output;
    
    bass_format = parameters.bass_format;
    if (bass_format.substr(0, 6) == "radio_")
    {
        // from SELECT elt
        bass_format = bass_format.substr(6);    // rempve radio_
    }

   this.attributes = {divisions: 0, 
       time: {beats: 0, beat_type: 0}, 
       key: {fifths: 0, mode: null},
       staves: null, clef: []};
   attributes = this.attributes;   // use from var

   let score_partwise_element = dom_object.firstElementChild; // score-partwise

   let score_partwise_children = score_partwise_element.children;
   console.log("score_partwise_element: %s top children: %s", score_partwise_element.tagName, score_partwise_children.length);

   /*
   - backup the whole measure
   - add new note in voice 2

   <backup>
    <duration>1024</duration>
   </backup>
   <note print-object="no" color="#000000" default-x="346" default-y="-77">
    <pitch>
     <step>D</step>
     <octave>4</octave>
    </pitch>
    <duration>128</duration>
    <instrument id="P1-I1" />
    <voice>2</voice>
    <type>eighth</type>
    <stem>down</stem>
    <staff>1</staff>
    <beam number="1">continue</beam>
    <lyric default-y="-125" number="part1verse2" color="#000000">
     <syllabic>single</syllabic>
     <text>2</text>
    </lyric>
   </note>

    */

  
    // we want to add to first part and first staff
    let part_found = false;
    let part_element1;



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

                           break;
                   }
               }
               break;

           case "part":
               part_element1 = score_partwise_child;

               part_found = true;
    
               break;
       }
       if (part_found)
        break;
   }

   this.show_dom_element(part_element1, "part_element1");

// read from part element 1

let part_element1_children = part_element1.children;
console.log("part_element1_children: length: %s", part_element1_children.length);


for (let im = 0; im < part_element1_children.length; im++)
{
    let measure_element = part_element1_children[im];
    let measure_number = measure_element.getAttribute("number");
    console.log("%s part_element_child: '%s': %s", im, measure_element.tagName, measure_number);


    if (measure_element.tagName != "measure")
    {
        console.error("measure element not processed: %s", measure_element.tagName);
        continue;
    }


    let end_of_notes = false;

    measure_element_children = measure_element.children;
    console.log("measure_element_children: length: %s", measure_element_children.length);

    let measure_duration = 0;

        for (let ic = 0; ic < measure_element_children.length; ic++)
        {
            measure_child = measure_element_children[ic];

            // some children get copied 
            // some get replaced
            console.log("ic: %s %s", ic, measure_child.tagName);

            switch (measure_child.tagName)
            {
                case "attributes":
                    let attribute_element = measure_child;

                    let attribute_children = attribute_element.children;
                    //console.log("CHILDREN: %s", attribute_children.length);
                    for (let ii = 0; ii < attribute_children.length; ii++)
                    {
                        let attribute_child = attribute_children[ii];
                        console.log("attribute_child %s: %s", ii, attribute_child.tagName);

                        switch (attribute_child.tagName) 
                        {
                            case "divisions":
                                attributes.divisions = this.get_element_value_numeric(attribute_child);
                                break;
                        }
                    }
                    break;
                        

                case "note":
                    if (show_output)
                        console.log("CASE: %s", measure_child.tagName);

                    note_element = measure_child;

                        let note_children = note_element.children;
                    console.log("NOTE CHILDREN: %s", note_children.length);

                    note = {voice: null, duration: 0};
                    
                    for (let ii = 0; ii < note_children.length; ii++)
                    {
                        let note_child = note_children[ii];
                        //console.log("note CHILD %s: %s", ii, note_child.tagName);

                        switch (note_child.tagName) 
                        {
                            case "duration":
                                note.duration = this.get_element_value_numeric(note_child);
                                break;
                            case "voice":
                                note.voice = this.get_element_value_numeric(note_child);
                                break;
                        }
                    }
                    if (note.voice == 1)
                    {
                        measure_duration += note.duration;
                    }


                    break;

                case "harmony":
                    
                    break;
        
                // check for backup
                case "backup":
                    //end_of_notes = true;
                    break;

                default:
                    console.error("Measure element not processed: %s", measure_child.tagName);
                    if (show_output)
                        console.log("DEFAULT: %s", measure_child.tagName);
                    
                    break;
            }
            if (end_of_notes)
            {
                break;   
            }
        }
        console.log("measure_duration: %s", measure_duration)

        // add backup and new notes

       

        let eighth_note_duration = this.attributes.divisions / 2;
        let new_notes = measure_duration / eighth_note_duration;

        console.log("eighth_note_duration: %s new_notes: %s", eighth_note_duration, new_notes);

        let sbackup = sprintf(`<backup>
            <duration>%s</duration>
            </backup>`, measure_duration);

        measure_element.innerHTML += sbackup + "\n";
   

        for (let inote = 0; inote < new_notes; inote++)
        {
            if ((inote % 2 ) == 0)
                lyric = sprintf("%s", inote/2 + 1);
            else
                lyric = "&amp;";

            snote =  sprintf(`<note print-object="no" color="#000000" default-x="346" default-y="-77">
                <pitch>
                <step>D</step>
                <octave>4</octave>
                </pitch>
                <duration>%s</duration>
                <instrument id="P1-I1" />
                <voice>2</voice>
                <type>eighth</type>
                <stem>down</stem>
                <staff>1</staff>
                <beam number="1">continue</beam>
                <lyric default-y="-125" number="part1verse2" color="#000000">
                <syllabic>single</syllabic>
                <text>%s</text>
                </lyric>
                </note>\n`, eighth_note_duration, lyric);

                
                measure_element.innerHTML += snote + "\n";
                
            
        }

        if (measure_number == 1)
            console.log("measure_element.innerHTML: \n%s", measure_element.innerHTML);

        

    } // end of measures


    let xml_string_return = this.dom_object_to_return_string(dom_object);
    return(xml_string_return);

}   // end of add_rhythm_to_xml
// You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
