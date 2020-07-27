
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN AMMLIB_Lib_AddBase.js");

libs_loaded["AMMLIB_Lib_AddBase"] = "loaded";
console.log("Object.keys(libs_loaded).length: %s", Object.keys(libs_loaded).length);
get_last_script_name();






   // <score-partwise version="3.1">
//     <part-list>
//         <score-part id="P1">
//              <part-name print-object="no">MusicXML Part</part-name>
//         </score-part>
//     </part-list>
//     <part id="P1">
//         <measure number="1" width="208.51">
//     </part>
// </score-partwise>

MusicDOM.prototype.part_elements = [];

MusicDOM.prototype.score_part_elements = [];

// You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
MusicDOM.prototype.add_bass_to_xml = function(parameters, xml_string_in)
{
    let dom_object = this.musicxml_to_dom(xml_string_in);

    this.add_bass_to_musicxml_dom(parameters, dom_object);

    let xml_string_return = this.dom_object_to_return_string(dom_object);
    return(xml_string_return);
}


MusicDOM.prototype.add_bass_to_musicxml_dom = function(parameters, dom_object)
{
    this.parameters = parameters;  // save in prototype
    this.show_output = parameters.show_output;
    let show_output = this.show_output;
    
    let bass_format = parameters.bass_format;
    if (bass_format.substr(0, 6) == "radio_")
    {
        // from SELECT elt
        bass_format = bass_format.substr(6);    // rempve radio_
    }

   this.attributes = {divisions: 0, 
       time: {beats: 0, beat_type: 0}, 
       key: {fifths: 0, mode: null},
       staves: null, clef: []};
   let attributes = this.attributes;   // use from var

   let score_partwise_element = dom_object.firstElementChild; // score-partwise

   let score_partwise_children = score_partwise_element.children;
   console.log("score_partwise_element: %s top children: %s", score_partwise_element.tagName, score_partwise_children.length);

   let part_list_element;

   // get part-list and part from score-partwise
   for (let iscore_partwise = 0; iscore_partwise < score_partwise_children.length; iscore_partwise++) 
   {
       let score_partwise_child = score_partwise_children[iscore_partwise];
       console.log("  iscore_partwise: %s score_partwise_child: %s", iscore_partwise, score_partwise_child.tagName);

       
       

       // looking for 'part-list' and 'part'
       switch (score_partwise_child.tagName) {

           case "part-list":
              part_list_element = score_partwise_child;

               let part_list_children = part_list_element.children;
               console.log("part_list_element: %s top children: %s", part_list_element.tagName, part_list_children.length);

               // get 'score-part' from 'part-list'
               for (let ipart_list = 0; ipart_list < part_list_children.length; ipart_list++) {
                   let part_list_child = part_list_children[ipart_list];
                   console.log("    ipart_list: %s part_list_child: %s", ipart_list, part_list_child.tagName);

                   switch (part_list_child.tagName) {
                       case "score-part":

                           // <score-part id="P1">
                           let score_part_element = part_list_child;
                           let score_part_id = score_part_element.getAttribute("id");

                           console.log("score_part_id: %s", score_part_id);
                           this.score_part_elements.push(score_part_element);
                           break;
                   }
               }
               break;

           case "part":
               let part_element = score_partwise_child;

               // <part id="P2">
               let part_id = part_element.getAttribute("id");

               console.log("part_id: %s", part_id);
               this.part_elements.push(part_element);
               break;
       }
   }

   let starting_staff;
   if (parameters.staff_type == "bass-clef")
       starting_staff = 2;
   else
       starting_staff = 1; // make two staffs - grand-staff

   let new_part_index = this.score_part_elements.length;

   for (let istaff = starting_staff; istaff <= 2; istaff++)
   {

       // add a new score_part_element

       new_part_index++;
       
       console.log("\n *****Add score_part to part_list element");
       let score_part_element = document.createElementNS('', "score-part");
       score_part_element.setAttribute("id", "P" + new_part_index);

       score_part_element.innerHTML = sprintf(`<part-name>Piano</part-name>
<part-abbreviation>Pno.</part-abbreviation>
<score-instrument id="P%s-I1">
   <instrument-name>Piano</instrument-name>
   </score-instrument>
<midi-device id="P%s-I1" port="1" />
<midi-instrument id="P%s-I1">
   <midi-channel>2</midi-channel>
   <midi-program>1</midi-program>
   <volume>78.7402</volume>
   <pan>0</pan>
   </midi-instrument>\n`, new_part_index, new_part_index, new_part_index);

       part_list_element.appendChild(score_part_element);
       this.show_dom_element(part_list_element);



       console.log("\n***** Add part%s to score_partwise", new_part_index);
       // <part id="P1">
       let new_part_element = document.createElementNS('', "part");
       new_part_element.setAttribute("id", "P" + new_part_index);
       score_partwise_element.appendChild(new_part_element);
       console.log("create new_part_element in score_partwise");

       // read from part element 1
       let part_element1 = this.part_elements[0];
       let part_element1_children = part_element1.children;
       console.log("part_element1_children: length: %s", part_element1_children.length);

       for (let im = 0; im < part_element1_children.length; im++)
       {
           let measure_element = part_element1_children[im];
           let measure_number = measure_element.getAttribute("number");
           console.log("%s part_element_child: '%s': %s", im, measure_element.tagName, measure_number);



           //if (measure_element.tagName != "measure_element");
           //    continue;

           
           
           

           let new_measure_element = document.createElementNS('', "measure");
           new_measure_element.setAttribute("number", measure_number);
           new_part_element.appendChild(new_measure_element);

           let new_measure_html = "";
           let new_notes_html = "";
           let first_harmony = true;
           let first_note = true;

           let measure_element_children = measure_element.children;
           console.log("measure_element_children: length: %s", measure_element_children.length);

           

               for (let ic = 0; ic < measure_element_children.length; ic++)
               {
                   let measure_child = measure_element_children[ic];

                   // some children get copied 
                   // some get replaced
                   console.log("ic: %s %s", ic, measure_child.tagName);

                   switch (measure_child.tagName)
                   {
                       case "attributes":
                               if (show_output)
                                   console.log("CASE: %s", measure_child.tagName);

                           

                               // clone to make a new copy
                               let new_attribute_element = measure_child.cloneNode(true);
                               if (show_output)
                                   this.show_dom_element(new_attribute_element);

                               

                               //let attributes = this.attributes;   // access in this scope

                               // get the attributes we want to remember
                               let attribute_children = new_attribute_element.children;
                               //console.log("CHILDREN: %s", attribute_children.length);
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
                                           break;

                                       case "instruments":
                                               break;
                                       
                                       case "key":
                                           // ADH - test key change in the middle of a measure
                                           if (show_output)
                                               console.log("CASE: %s", attribute_child.tagName);

                                           let key_element = attribute_child;

                                           //this.show_dom_element(key_element);
                                           attributes.key.fifths = this.get_dom_element_value_numeric(key_element, "fifths");
                                           if (show_output)
                                               console.log("fifths: %s typeof: %s", attributes.key.fifths, typeof(attributes.key.fifths) );
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
                               //console.log("new_attribute_element.outerHTML: %s", new_attribute_element.outerHTML);
                               new_measure_html += new_attribute_element.outerHTML;

                           break;
                       case "note":
                           if (show_output)
                               console.log("CASE: %s first_note: %s", measure_child.tagName, first_note);
                           if (!first_note)
                               continue;

                           first_note = false;

                           // put new notes here
                           console.log("new_notes_html: %s", new_notes_html);
                           new_measure_html += new_notes_html;
                           break;

                       case "harmony":
                           if (show_output)
                               console.log("CASE: %s first_harmony: %s", measure_child.tagName, first_harmony);
                           if (!first_harmony)
                               continue;
                           first_harmony = false;

                           

                           let harmony_element = measure_child;

                           let root_step = this.get_dom_element_value(harmony_element, "root-step", this.SKIP_ERROR);
                           let //console.log("root-step: %s", root_step);
                           root_alter = this.get_dom_element_value(harmony_element, "root-alter", this.SKIP_ERROR);
                           //console.log("root-alter: %s", root_alter);
                           let bass_step = this.get_dom_element_value(harmony_element, "bass-step", this.SKIP_ERROR);
                           //console.log("bass-step: %s", bass_step);
                           let bass_alter = this.get_dom_element_value(harmony_element, "bass-alter", this.SKIP_ERROR);
                           //console.log("bass-alter: %s", bass_alter);
                           let kind = this.get_dom_element_value(harmony_element, "kind", this.SKIP_ERROR);
                           let kinds = this.music_xml_kinds[kind];
                           if (!kinds)
                           {
                               console.error("music_xml_kinds not found; %s", kind);
                               this.show_dom_element(harmony_element, "harmony_element");
                           }
                           let kind_short = kinds.short;
                           //console.log("kind: %s", kind);

                           let sroot = root_step + this.sharp_flat_from_alter(root_alter);
                           let  sbass = "";
                           if (bass_step != "")
                               sbass = "/" + bass_step + this.sharp_flat_from_alter(bass_alter);
                           else   
                               sbass = "";
                           console.log("CHORD: %s%s%s kind: %s staff_type: %s", 
                            sroot, kind_short, sbass, kind, parameters.staff_type);



                           // repeat chords in new staffs
                           if ((parameters.staff_type == "grand-staff" && istaff == 1) ||
                               (parameters.staff_type != "grand-staff" && istaff == 2))
                           {
                               console.log("harmomy COPY format: %s istaff: %s\n%s", 
                                   parameters.staff_type, istaff, harmony_element.outerHTML);
                               new_measure_html += "\n    ";
                               new_measure_html += harmony_element.outerHTML;
                           }
                       
                           let  first_step;
                           let  first_alter;

                           if (bass_step)
                           {
                               first_step = bass_step;
                               first_alter = bass_alter;
                           }
                           else
                           {
                               first_step = root_step;
                               first_alter = root_alter;

                           }
                       
                           let octave;

                           // give octave of bass note
                           if (root_step >= "C" && root_step <= "F")
                               octave = 3;
                           else    
                               octave = 2;


                           // get notes of chord
                          let  schord = root_step;
                           if (root_alter > 0)
                               schord += "#";
                           if (root_alter < 0)
                               schord += "b";

                           if (bass_step)
                           {
                               // get notes of chord
                               sbass = bass_step;
                               if (bass_alter > 0)
                                   schord += "#";
                               if (bass_alter < 0)
                                   schord += "b";
                           }
                           schord += this.music_xml_kinds[kind].short;


                           if (istaff == 1)
                               octave = octave + 1;


                           new_notes_html += "\n";

                           let one_beat_duration = (attributes.divisions * 4)  / attributes.time.beat_type;
                           let chord_data = {schord: schord, sbass: sbass, octave: octave, one_note: false, start_at: 1, duration: one_beat_duration};
                           
                           let beats_remaining = attributes.time.beats;
                           
                           console.log("staff_type: %s bass_format: %s ", parameters.staff_type, bass_format);
                           if (parameters.staff_type == "grand-staff")
                           {
                               if (bass_format == "longshort")
                               {
                                   if (istaff == 1)
                                   {
                                       // treble clef  - output one rest
                                       new_notes_html += this.get_rest(one_beat_duration * 2);
                                       beats_remaining--;  // one beat already out
                                       beats_remaining--;  // second beat already out
                                       chord_data.start_at = 2;
                                   }
                                   else
                                   {
                                       // bass clef
                                       // play just one note in bass clef
                                       chord_data.start_at = 1;
                                       chord_data.one_note = true;
                                       chord_data.duration = 2 * one_beat_duration;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       new_notes_html += this.get_rest((attributes.time.beats - 2) * attributes.divisions);
                                       break;  // only one note and rest in staff 1
                                   }
                               }
                               else
                               {
                                   if (istaff == 1)
                                   {
                                       // treble clef  - output one rest
                                       new_notes_html += this.get_rest(chord_data.duration);
                                       beats_remaining--;  // one beat already out
                                       chord_data.start_at = 2;
                                   }
                                   else
                                   {
                                       // bass clef
                                       // play just one note in bass clef
                                       chord_data.start_at = 1;
                                       chord_data.one_note = true;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       new_notes_html += this.get_rest((attributes.time.beats - 1) * attributes.divisions);
                                       break;  // only one note and rest in staff 1
                                   }
                               }

                               
                           }

                           // one beat
                           chord_data.duration = one_beat_duration;

                           console.log("bass_format: %s", bass_format);
                           switch (bass_format)
                           {
                               case "chords":
                                   new_notes_html += this.add_chord_notes(chord_data);
                                   beats_remaining--;  // one beat already out
                                   if (beats_remaining > 0)
                                   {
                                       new_notes_html += this.get_rest(one_beat_duration * beats_remaining);
                                   }
                                   break;
                               case "longshort":
                                   if (parameters.staff_type != "grand-staff")
                                   {
                                       chord_data.duration = 2 * one_beat_duration;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                       beats_remaining--;  // one beat already out
                                   }
                                   if (beats_remaining > 0)
                                   {
                                       // short chord
                                       chord_data.duration = 1 * one_beat_duration;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                   }
                                   if (beats_remaining > 0)
                                   {
                                       new_notes_html += this.get_rest(one_beat_duration * beats_remaining);
                                   }
                                   break;

                               case "oompah":
                                   if (parameters.staff_type != "grand-staff")
                                   {
                                       // play the first note if not grand staff
                                       chord_data.one_note = true;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                   }

                                   chord_data.start_at = 2;
                                   chord_data.one_note = false;
                                   new_notes_html += this.add_chord_notes(chord_data);
                                   beats_remaining--;  // one beat already out
                                   if (beats_remaining > 0)
                                   {
                                       new_notes_html += this.get_rest(one_beat_duration * beats_remaining);
                                   }
                                   break;
                               case "oompapah":
                                   if (parameters.staff_type != "grand-staff")
                                   {
                                       // play the first note if not grand staff
                                       chord_data.one_note = true;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                   }

                                   
                                   chord_data.start_at = 2;
                                   chord_data.one_note = false;
                                   new_notes_html += this.add_chord_notes(chord_data);
                                   beats_remaining--;  // one beat already out

                                   if (beats_remaining > 0)
                                   {
                                       chord_data.start_at = 2;
                                       chord_data.one_note = false;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                   }

                                   if (beats_remaining > 0)
                                   {
                                       new_notes_html += this.get_rest(one_beat_duration * beats_remaining);
                                   }

                                   break;

                               

                               case "arpeggio":
                                   console.log("beats remaining: A: %s", beats_remaining);
                                   if (parameters.staff_type != "grand-staff")
                                   {
                                       // play the first note if not grand staff
                                       chord_data.one_note = true;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                   }
                                   console.log("beats remaining: B: %s", beats_remaining);
                                   chord_data.start_at = 2;
                                   if (beats_remaining > 1)
                                   {                                         
                                       chord_data.one_note = true;
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                       chord_data.start_at++;
                                   }
                                   // play final notes
                                   console.log("beats remaining: C: %s", beats_remaining);
                                   if (beats_remaining > 0)
                                   {                                       
                                       chord_data.one_note = false; // play all reamining notes
                                       new_notes_html += this.add_chord_notes(chord_data);
                                       beats_remaining--;  // one beat already out
                                   }
                                   console.log("beats remaining: D: %s", beats_remaining);
                                   if (beats_remaining > 0)
                                   {          
                                       new_notes_html += this.get_rest(one_beat_duration * beats_remaining);
                                   }

                                   break;
                           }
                           
                           
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
               new_measure_element.innerHTML = new_measure_html + "\n";
               console.log("new_measure_element.outerHTML:\n%s", new_measure_element.outerHTML);
           } // end of measures


       
       } // end of staffs

    return(dom_object);


};  // end of add_bass_to_xml_dom
