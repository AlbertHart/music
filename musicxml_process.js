
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */

var MLIB;
var parameters;
var xml_string_loaded;
var xml_string_in;
var xml_string_out;
var demonstration_scores_array;

    function show_sidebar()
    {

        // javascript to create sidebar menu
        let elt = document.getElementById('sidebar');
        elt.innerHTML = `
        <!--sidebar start-->
        <aside>
        <div id="sidebar"  class="nav-collapse " >
            <!-- sidebar menu start-->
            <ul class="faq-menu" id="nav-accordion">
                <li>
                    <a href ="index.htm">
                        <i class="fa fa-home"></i>
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a href="javascript:;">
                        <span style="color: #eee; font-weight: 800;">Processing Functions</span>
                    </a></li>


                


                    <li>
                        <a href="javascript:set_content_name('view_play');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-music  "></i>
                            <span >View and Play</span></a></li>
                    <li>
                        <a href="javascript:set_content_name('transpose');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-arrows-v"></i>
                            <span>Transpose</span></a></li>
                    <li>
                        <a href="javascript:set_content_name('add_bass');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-level-down"></i>
                            <span>Add Bass</span></a></li>
                    <li>
                        <a href="javascript:set_content_name('add_solo');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-level-down"></i>
                            <span>Add Solo Section</span></a></li>
                    <li>
                        <a href="javascript:set_content_name('trim_score');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-scissors"></i>
                            <span>Trim</span></a></li>
                    <li>
                        <a href="javascript:set_content_name('voice_leading');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-arrow-right"></i>
                            <span>Voice Leading</span></a></li>
                    <li>
                        <a href="javascript:set_content_name('melody_chords');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-level-up"></i>
                            <span>Melody Chords</span></a></li>

                    <li>
                        <a href="javascript:set_content_name('add_rhythm');">
                        <span style="width: 15px;">&nbsp;</span>
                            <i class="fa fa-level-down"></i>
                            <span>Add Rhythm Text</span></a></li>

            <p style="color: #eee; margin-left: 20px;">--------------------------</p>   
           


            









                <li>
                    <a href ="musicxml_faq.htm">
                        <i class="fa  fa-question"></i>
                        <span>Frequent Questions</span>
                    </a>
                </li>
                <li>
                    <a href ="musicxml_about.htm">
                        <i class="fa fa-user"></i>
                        <span>About Us</span>
                    </a>
                </li>

                <li>
                    <a href ="musicxml_contact.htm">
                        <i class="fa fa-phone"></i>
                        <span>Contact Us</span>
                    </a>
                </li>

                  </ul>
      <!-- sidebar menu end-->
    `;
    }

    var use_show_process;
    // in musicxml_process.htm this shows the parameters for the process
    // onther files, like index and faz can override it.
    function set_content_name(content_name)
    {
        //console.log(get_self(content_name));
        if (use_show_process == "load")
        {
            // load musicxml_process.htm;
            let surl = "musicxml_process.htm?content=" + content_name;
            window.location.href = surl;
            return;
        }

        parameters.process_content = content_name;
        //console.log("parameters.process_content: %s", parameters.process_content);
        save_parameters_to_local_storage();

        // see if this is a process to open
        let content_id = content_name + "_content";
    
        let process_found = false;

        let content_text = document.getElementsByClassName("content_text");
        for (let ii = 0; ii < content_text.length; ii++) 
        {
            let content_elt = content_text[ii];
            //console.log("II: %s  content_text ID: %s (%s)", ii, content_elt.id, content_id);
            if (content_elt.id == content_id)
            {
                //console.log("SET DISPLAY BLOCK: %s", content_elt.id);
                content_elt.style.display = "block";
                process_found = true;
            }
            else
            {
                content_elt.style.display = "none";
            }
        }
        if (!process_found)
        {
            console.error("process to show not found: %s", content_name);
        }

    }

    

    function set_default_parameters(do_save)
    {
        parameters = {
            max_number_of_notes_leading: "4",
            max_number_of_notes_melody: "4",
            bass_format: "radio_chords",
            demonstration_score: "amazing_grace",
            first_trim_measure: "2",
            first_note: "2",
            last_trim_measure: "4",
            last_note: "1",
            process_content: "view_play",
            seventh_position: "treble",
            show_output: false,
            show_output_select: "0",
            staff_type: "bass-clef",
            starting_inversion: "root",
            transpose_direction: "closest",
            transpose_key: "None",
            };
        
        for (let key in parameters)
        {
            let value = parameters[key];
            set_element_value(key, value);
        }

        // if user clicked set_default_paramaters
        if (do_save)
        {
            save_parameters_to_local_storage();
        }
    }

    function clear_score()
    {
        xml_string_loaded = "";
        xml_string_in = "";
        xml_string_out = "";
        let download_div_elt = document.getElementById('download_div');
        download_div_elt.style.display = "none";

    }

    function change_file_name(elt)
    {
        let output_file_name = elt.value;
        console.log(get_self(output_file_name));

        prepare_output_file(xml_string_out, output_file_name);
    }

    // to save output
    function prepare_output_file(output_string, output_file_name)
    {

        if (!output_file_name || output_file_name == "")
        {
            output_file_name = "new_score" + parameters.output_file_extension;
            let elt = document.getElementById("output_file_name");
            elt.innerText = output_file_name;
        }

        //console.log("prepare_output_file: output_file_name: %s", output_file_name);


        let properties = {type: 'text/plain'}; // Specify the file's mime-type.

        

        let output_file_data = [output_string];
        //console.log("string DATA length: %s", output_file_data.length);

        let file;
        try 
        {
            // Specify the filename using the File constructor, but ...
            //console.log("SAVE AS FILE");
            // we will want to get output file name
            file = new File(output_file_data, output_file_name, properties);
        } 
        catch (e) 
        {
            // ... fall back to the Blob constructor if that isn't supported.
            //console.log("SAVE AS BLOB");
            file = new Blob(output_file_data, properties);
        }
        //console.log("After create FILE");
        let url = URL.createObjectURL(file);

        let download_div_elt = document.getElementById('download_div');
        download_div_elt.style.display = "block";

        let download_elt = document.getElementById('download_link');
        download_elt.download = output_file_name;
        download_elt.href = url;
        //console.log("After set download_link href");

        let label_elt = document.getElementById("output_file_label");
        label_elt.scrollIntoViewIfNeeded();

    }


    function get_parameter_change(element, dont_save)
    {
        //console.log(get_self());
        //console.log("element.id: %s element.name: %s type: %s tagName: %s dont_save: %s", 
        //    element.id, element.name, element.type, element.tagName dont_save);
 
        let name;
        let value;
        let type = element.type;
        if (element.tagName == "SELECT")
        {
            type = "SELECT";
            name = element.id;
            let index = element.selectedIndex;
            console.log("NAME: %s index: %s", name, index);
            value = element.options[index].value;
        }
        else if (element.type == "radio")
        {
            name = element.name;
            value = element.id;
        }
        else if (element.type == "number" || element.type == "text")
        {
            name = element.id;
            value = element.value;
        }
        parameters[name] = value;
        //console.log("get_parameter_change: type: %s name: %s value: %s", type, name, value);

        
        if (!dont_save)
            save_parameters_to_local_storage();
    }

    function get_parameters_from_elts()
    {
        //console.log(get_self());
        let parameter_elts = document.getElementsByClassName("parameters");
        let DONT_SAVE = true;
        for (let iparm = 0; iparm < parameter_elts.length; iparm++)
        {
            let elt = parameter_elts[iparm];
            //console.log("type: %s id: %s name: %s tagName: %s value: %s", elt.type, elt.id, elt.name, elt.tagName, elt.value);
            if (elt.type == "number" || elt.type == "text")
            {
                get_parameter_change(elt, DONT_SAVE);
            }
            else if (elt.tagName == "SELECT")
            {
                get_parameter_change(elt, DONT_SAVE);
            }
            else if (elt.type == "radio")
            {
                //console.log("RADIO: checked: %s", elt.checked);
                if (elt.checked)
                    get_parameter_change(elt, DONT_SAVE);
            }
            else
            {
                //console.log("Unknown Element type: %s", elt.type);
            }
        }

        // ADH - we will better T/F logic for parameters
        if (parameters.show_output_select == "1")
            parameters.show_output = true;
        else   
            parameters.show_output = false;

        save_parameters_to_local_storage();
    }

    
    function get_demonstration_score(element, dont_save)
    {
        console.log(get_self());

        get_parameter_change(element, dont_save);

        let value;
        name = element.id;
        let index = element.selectedIndex;
        console.log("NAME: %s index: %s", name, index);
        value = element.options[index].value;
 
    }
       
    
        
    // these read the latest parameters
    function add_to_parameters(svar)
    {
        let value = get_element_value(svar);
        //console.log("add_to_parameters: svar: %s: value: %s", svar, value);
        parameters[svar] = value;

    }

    function add_to_parameters_number(svar)
    {
        let value = get_element_value(svar);
        //console.log("add_to_parameters: svar: %s: value: %s", svar, value);
        parameters[svar] = Number(value);

    }

    // process xml_string_loaded, or
    // get new text from demotration score
    function process_loaded_xml()
    {   
        console.log(get_self());
       if (!xml_string_loaded || xml_string_loaded == "")
        {
            console.log("parameters.demonstration_score: %s", parameters.demonstration_score);
            let score_name = parameters.demonstration_score;
            let score_data = demonstration_scores_array[score_name];
            MLIB.show_object(demonstration_scores_array, "demonstration_scores_array");
            MLIB.show_object(score_data, "score_data");
            parameters.song_name = score_data.name;


            set_element_value("song_name", song_name);
            parameters.song_name = song_name;
            console.log("score_name: %s song_name: %s", score_name, parameters.song_name);
            load_url_text(score_data.url, "process");
        }
        else
        {
            console.log("xml_string_loaded.length: %s", xml_string_loaded.length);
        
            process_xml(xml_string_loaded);
        }
    }
   
        
    function process_xml(xml_string_loaded)
    {
        console.log(get_self(parameters.process_content));

        get_parameters_from_elts();

        //console.log("show_output: %s", parameters.show_output);

        // save in var for debug
        xml_string_in = xml_string_loaded;

        //console.log("xml_string_in length: %s\n    %s", xml_string_in.length, xml_string_in.substr(0,100));


        if (!xml_string_in || xml_string_in == "")
        {
            console.error("NO XML STRING");
            alert("XML Not Loaded");
            return;
        }

        xml_string_out = "";

        var song_name;

        let dom_object = MLIB.musicxml_to_dom(xml_string_in);

        switch (parameters.process_content)
        {
            case 'view_play':
                // will display below
                short_content = ""; // not used for file name
                break;
            case 'transpose':
                short_content = parameters.transpose_key;
                MLIB.transpose_musicxml_dom(parameters, dom_object);
                break;
            case 'add_bass':
                short_content = "bass";
                MLIB.add_bass_to_musicxml_dom(parameters, dom_object);
                break;
            case 'add_solo':
                short_content = "solo";
                MLIB.add_solo_to_musicxml_dom(parameters, dom_object);
                break;
            case 'trim_score':
                short_content = "trimmed";
                MLIB.do_trim_score_musicxml_dom(parameters, dom_object);
                break;
            case 'voice_leading':
                short_content = "leading";
                MLIB.do_voice_leading_musicxml_dom(parameters, dom_object);
                break;
            case 'melody_chords':
                short_content = "melody";
                MLIB.do_melody_chords_musicxml_dom(parameters, dom_object);
                break;
            case 'add_rhythm':
                short_content = "rhythm";
                MLIB.add_rhythm_to_musicxml_dom(parameters, dom_object);
                break;
            default:
                console.error("UNKNOWN process_content: %s", parameters.process_content);
                break;
        }

       

        // display processed score
        MLIB.view_musicxml_dom(parameters, dom_object);

        song_name = MLIB.osmd_object.sheet.title.text;

        let output_file_name = sprintf("%s_%s%s", song_name, short_content, parameters.output_file_extension);

        //console.log("TITLE: %s output_file_name: %s", song_name, output_file_name);

        set_element_value("song_name", song_name);
        parameters.song_name = song_name;

        set_element_value("output_file_name", output_file_name);

        if (parameters.process_content != "view_play")
        {
            xml_string_out = MLIB.dom_object_to_return_string(dom_object);
            // create the output file ready for download
            prepare_output_file(xml_string_out, output_file_name);
        }


    }

    function zoomin()
    {
        //window.setTimeout(function () 
        //{
            MLIB.view_params.zoom *= 1.25;
            set_element_value("zoom", MLIB.view_params.zoom);
            MLIB.osmd_object.Zoom = MLIB.view_params.zoom;
            MLIB.osmd_object.render();
        //}, 0);
    }

    function zoomout()
    {
        //window.setTimeout(function () 
        //{
            MLIB.view_params.zoom /= 1.25;
            set_element_value("zoom", MLIB.view_params.zoom);
            MLIB.osmd_object.Zoom = MLIB.view_params.zoom;
            MLIB.osmd_object.render();
        //}, 0);
    }

    function zoom100()
    {
        //window.setTimeout(function () 
        //{
            MLIB.view_params.zoom = 1.00;
            MLIB.osmd_object.Zoom = MLIB.view_params.zoom;
            set_element_value("zoom", MLIB.view_params.zoom);
            MLIB.osmd_object.render();
        //}, 0);
    }

     

  
    


    function show_transposed_score()
    {
        if (xml_string_out === "")
        {
            alert("No Transposed Score available");
        }
        else
        {
            let elt = document.getElementById("transposed_score");
            elt.style.display = "block";
            elt.innerText = xml_string_out;
        }
    }

    function copy_transposed_score()
    {
        if (xml_string_out === "")
        {
            alert("No Transposed Score available");
        }
        else
        {
            copyToClipboard(xml_string_out);
            alert(xml_string_out.length + " bytes copied to clipboard");
        }
    }

    function copyToClipboard(text) {
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
    }

    var url_vars;
    function get_url_vars()
    {
        //console.log(get_self());
        if (url_vars)
            console.error("url_vars already defined");

        let url_string = window.location.href;
        let ipos = url_string.indexOf("#");
        if (ipos >= 0)
        {
            url_string = url_string.substr(0, ipos);
        }
        url_vars = [];
        url_string.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key,value) 
        {
                url_vars[key] = unescape(value);
        });


        return url_vars;
    }

    function get_url_var(svar)
    {
        //console.log(get_self(svar));
        if (!url_vars)
        {
            //console.log("getting url_vars");
            get_url_vars();
        }
        let sval = url_vars[svar];
        if (!sval)
            sval = "";
        return(sval);
}

 
     // save parameters after every change
     function save_parameters_to_local_storage()
    {
        //console.log(get_self());
        let json_string = JSON.stringify(parameters);
        //console.log("json_string: %s", json_string);

        let storage_key = "musicxml_process";
        //console.log("setItem for storage_key: %s\n%s", storage_key, json_string);
        localStorage.setItem(storage_key, json_string);

    }

    function load_parameters_from_local_storage()
    {   
        //console.log(get_self());
        let storage_key = "musicxml_process";
        let json_string = localStorage.getItem(storage_key);
        //console.log("load_parameters_from_local_storage: %s\n%s", storage_key, json_string);
        let parameters_parsed = JSON.parse(json_string);

        //console.log("parameters_parsed: %s", parameters_parsed);

        for (let key in parameters_parsed)
        {
            if (key == "show_output")
                continue;
            let value = parameters_parsed[key];
            //console.log("load_parameters_from_local_storage: key: %s value:  %s", key, value);
            parameters[key] = value;
            set_element_value(key, value);
        }
        

    }

    // these are not in the library functions (yet) because they are only used in this one .htm file
    function set_element_value(sid, value)
    {
        //console.log(get_self(sid, value));

        if (sid == "process_content")
        {
            // not setting sidebar tab yet

            content_name = value;
            //console.log("CALL set_content_name('%s'))", content_name);
            set_content_name(content_name);
            return;
        }

      
       
        let elt = document.getElementById(sid);
        if (!elt)
        {
            // see if this is a radio group - by class of elements
            let elts = document.getElementsByName(sid);
            for (let ii = 0; ii < elts.length; ii++)
            {
                elt = elts[ii];
                //console.log("elt id: %s name: %s value: %s", elt.id, elt.name, value);
                if (elt.id == value)
                {
                    //console.log("ii: %s set check: %s", ii, elt.id);
                    elt.checked = true;
                    return;
                }
            }

            
            console.error("set_element_value: ITEM TO CHECK NOT FOUND: %s", sid);

            return;


        }
        if (!elt)
        {
            console.error("set_element_value: ELT NOT FOUND: %s", sid);
            return;
        }

        


        //console.log("elt.id: %s elt.name: %s type: %s tagName: %s", elt.id, elt.name, elt.type, elt.tagName);
        
        if (elt.tagName == "SELECT")
        {
            //console.log("elt.options.length: %s", elt.options.length);
            for (let ii=0; ii < elt.options.length; ii++)
            {
                let elt_value = elt.options[ii].value;
                //console.log("ii: %s sid: %s value: %s (value == elt_value): %s", 
                //    ii, sid, elt_value, (value == elt_value) ? "T" : "F" );
                if (elt_value == value)
                {
                    elt.selectedIndex = ii;
                    
                    //console.log("set_element_value: SELECT: %s value: %s index: %s", sid, ii, value);
                    return;
                }
            }

            if (sid == "demonstration_score")
            {
                return; // we will set this on page load later
                // we will select this later
            }


            console.error(sid + " - SELECT value not found: " + value, sid, value);
        }
        else if (elt.tagName == "DIV" || elt.tagName == "SPAN")
        {
            elt.innerText = value;
        }
        else
        {
            elt.value = value;
            //console.log("set_element_value: sid: %s value: %s elt.value: %s", sid, value, elt.value);
        }
    }

    function get_element_value(sid)
    {
        let elt = document.getElementById(sid); 
        if (!elt)
            console.error("elt not found: " + sid);
        let value;
        if (elt.tagName == "SELECT")
        {
            value = elt.options[elt.selectedIndex].value;
        }
        else
            value = elt.value;
        return(value);
    
    }

    function get_element_number(sid)
    {
        let value = get_element_value(sid);
        value = Number(value);
        return(value);
    }

    function do_load_process(stab, sfunction)
    {
        let shtml = sprintf(`<p></p><a href='musicxml_process.htm?content=%s'>
            <button>%s MusicXML File</button>
            </a><br>
            `, stab, sfunction);

        return(shtml);
    }

    function do_view_text(sid,  add_link)
    {

        let shtml = `<div class=info>
            <h3>View and Play</h3>
            <img src="images/view.png" >
            View you score and play it in your browser.\n`;

            if (add_link)
                shtml += do_load_process("view_play", "View and Play");

        shtml +=`<br clear=all>
        </div><p></p>
        `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;


    }


    function do_transpose_text(sid,  add_link)
    {

        let shtml = `<div class=info>
            <h3>Transpose Score</h3>
            <img src="images/transpose.png" >
            Transpose your MusicXML score, chords and key signatures to any key.\n`;

            if (add_link)
                shtml += do_load_process("transpose", "Transpose");

        shtml +=`<br clear=all>
        </div><p></p>
        `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;


    }


    function do_add_bass_text(sid,  add_link)
    {

        let shtml = `<div class=info>
                <h3>Add Bass Accompaniment</h3>
                <img src="images/add-bass.png" >
                Add a simple Accompaniment to your MusicXML score.
                <p>
                For instance, a piano accompaniment for a choral score.
                </p>\n`;

        if (add_link)
        shtml += do_load_process("add_bass", "Add Base Notes");


        shtml +=`<br clear=all>
                </div><p></p>
                `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;

    }

    function do_add_solo_text(sid,  add_link)
    {

        let shtml = `<div class=info>
                <h3>Add Solo Section</h3>
                <img src="images/add-solo.png" >
                Add a simple Accompaniment to your MusicXML score.
                <p>
                For instance, a piano accompaniment for a choral score.
                </p>\n`;

        if (add_link)
        shtml += do_load_process("add_solo", "Add Base Notes");


        shtml +=`<br clear=all>
                </div><p></p>
                `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;

    }

    function do_trim_score_xml_text(sid,  add_link)
    {
    
        let shtml = `<div class=info>
        <h3>Trim Score</h3>
        <img src="images/trim-score.png" >
        Select a portion of a MusicXML score you want to keep with just the desired measures and notes.
        <p></p>
        Create and save a new MusicXML file with just the desired part of the original score.
        \n`;

        if (add_link)
            shtml += do_load_process("trim_score", "Trim Score");


            shtml +=`<br clear=all>
            </div><p></p>
            `;


            let element = document.getElementById(sid);
    element.innerHTML += shtml;
    }



    function do_voice_leading_text(sid,  add_link)
    {
                
        let shtml = `<div class=info>
            <h3>Voice Leading Chords is not complete yet.</h3>
            <img src="images/accompaniment.png" >

            Voice Leading Chords will read a melody from the first part in your MusicXML score, 
            and add bass and chords notes to accompany the melody.
            <p></p>
            This is designed to be played when aocompianing a singer or soloist.
            <p></p>
            One chord is provided for each chord in the leadsheet - using voice leading and inversions to minimize hand movement 
            while providing accompaniment.
            \n`;

        if (add_link)
        shtml += do_load_process("voice_leading", "Add Voice Leasing Chords");


            shtml +=`<br clear=all>
            </div><p></p>
            `;

      
        let element = document.getElementById(sid);
        element.innerHTML += shtml;

    }


    function do_melody_chords_text(sid,  add_link)
    {
    
        let shtml = `<div class=info>
        <h3>Melody Chords is not complete yet.</h3>
        <img src="images/piano-jazz.png" >
        Melody Chords will read a melody from the first part in your MusicXML score, and add bass and chords notes to accompany the melody.
        \n`;

    if (add_link)
        shtml += do_load_process("melody_chords", "Add Melody Chords");


        shtml +=`<br clear=all>
        </div><p></p>
        `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;


     }

     function do_add_rhythm_text(sid,  add_link)
    {

        let shtml = `<div class=info>
                <h3>Add Rhythm Notation</h3>
                <img src="images/add-rhythm.png" >
                <br clear=all>
                Equally spaces out notes based on duration,
                <br> and optionally
                Adds  "1 & 2 & 3 & ..." as lyrics to your MusicXML score.
                <p>
                This may help with parsing out syncopated rhythms when learning a new melody.
                </p>\n`;

        if (add_link)
        shtml += do_load_process("add_rhythm", "Add Base Notes");


        shtml +=`<br clear=all>
                </div><p></p>
                `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;

    }

    // Stuff for drop and load files
    function setup_drop_and_paste()
    {
        // where files are dropped + file selector is opened
        let dropRegion = document.getElementById("drop-region");

        

        // open file selector when clicked on the drop region
        let file_input_element = document.createElement("input");
        file_input_element.type = "file";
        file_input_element.accept = ".xml,.musicxml,.mxl";
        file_input_element.multiple = true;
        dropRegion.addEventListener('click', function() {
            file_input_element.click();
        });

        file_input_element.addEventListener("change", function() {
            let files = file_input_element.files;
            handle_drop_files(files);
        });

        dropRegion.addEventListener('dragenter', prevent_event_default, false);
        dropRegion.addEventListener('dragleave', prevent_event_default, false);
        dropRegion.addEventListener('dragover', prevent_event_default, false);
        dropRegion.addEventListener('drop', prevent_event_default, false);;

        // is there a timing reaon why we do the previous line?
        dropRegion.addEventListener('drop', handle_drop_event, false);
    }


    function prevent_event_default(e) {
        e.preventDefault();
        e.stopPropagation();
    }

   

    function handle_drop_event(e) {

        let dt = e.dataTransfer,
            files = dt.files;

        handle_drop_files(files)		
    }

    

    function get_file_extension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        }


    function handle_drop_files(files) {
        console.log("handle_drop_files: %s", files.length);
        for (let i = 0, len = files.length; i < len; i++) 
        {
            file = files[i];
            console.log("file.name: %s type: %s", file.name, files[0].type);

            let extension = get_file_extension(file.name)
            if (extension == "mxl")
            {
                load_zip_file(file);
            }
            else
            {
                load_dropped_file(file);
            }
            break;  // we only process one file
        }
    }


    function load_dropped_file(dropped_file) 
    {
        console.log("load_dropped_file");

        // read the dropped_file...
        let reader = new FileReader();
        reader.onload = function(e) {
            result = e.target.result;
            console.log("FileReader: reader.onload: result length: %s\n%s", result.length, result.substr(0,32));

            let ipos = result.indexOf("base64,")
            if (ipos)
            {
                let header = result.substr(0, ipos);
                let base64_string = result.substr(ipos + 7);
                console.log("header: %s base64_string: %s", header, base64_string.substr(0,64));

                if (base64_string.substr(0,8) == "UEsDBBQA")
                {
                    console.log("ZIP FILE");
                    
                    return(false);
                }
                else
                {
                    xml_string_loaded = atob(base64_string);
                    console.log("xml_string_loaded length: %s\n    %s", 
                        xml_string_loaded.length, xml_string_loaded.substr(0,100));


                    // store xml and name for reload
                    localStorage.setItem('song_data', xml_string_loaded);

                    let song_name = dropped_file.name;
                    console.log("localStorage.setItem('song_name',%s);", song_name);

                    set_element_value("song_name", song_name);
                    parameters.song_name = song_name;
                    localStorage.setItem('song_name', song_name);

                    process_xml(xml_string_loaded);
                
                    return(true);
                }
            }
        }
        reader.readAsDataURL(dropped_file);
    }


     // Closure to capture the file information.
     function load_zip_file(zip_file) 
     {
        
        console.log("load_zip_file: %s", zip_file.name);
        
        //let result_div = document.getElementById("result");
        //result_div.innerHTML = "<h4>ZIP File: " + zip_file.name + "</h4>";


        JSZip.loadAsync(zip_file)                                   // 1) read the Blob
        .then(function(zip) {

            zip_object = zip;
            let first_entry = true;



            zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                    //zip_entries.push(zipEntry); // for debug

                    console.log("ZIP ENTRY: %s _data.uncompressedSize: %s", zipEntry.name, zipEntry._data ? zipEntry._data.uncompressedSize : -1);


                if (zipEntry.name.substr(0,8) != "META-INF" && first_entry)
                    {

                        // Read the contents of the 'Hello.txt' file
                        zipEntry.async("string").then(function (zip_file_data) {
                        // zip_file_data is "Hello World!"
                        xml_string_loaded = zip_file_data;
                        //console.log("xml_string_loaded length: %s\n    %s", 
                        //    xml_string_loaded.length, xml_string_loaded.substr(0,100));

                        // store xml and name for reload
                        localStorage.setItem('song_data', xml_string_loaded);

                        let song_name = zipEntry.name;
                        console.log("localStorage.setItem('song_name',%s);", song_name);
                        localStorage.setItem('song_name', song_name);


                        set_element_value("song_name", song_name);
                        parameters.song_name = song_name;

                        process_xml(xml_string_loaded);
                    
                        
                    
                    
                    });
                    first_entry = false;    // only process one file
                }



            });
        }, function (e) {
            alert("Error reading compressed file" + zip_file.name + ": " + e.message);
        });
    }



     function do_top_menu(sid)
     {
         let shtml = "";
         shtml += `<img src=images/hamburger.png onclick="toggle_sidebar();" style="width: 50px; height: 50px; float: left">\n`;
         shtml += `
            <button   onclick="do_home()">Home</button>
            <button onclick="do_process(this)">Process MusicXML</button>
            <button onclick="do_faq(this)">FAQ</button>
            <button onclick="do_contact(this)">Contact</button>
            `;

            let element = document.getElementById(sid);
            element.innerHTML += shtml;
     }

     function toggle_sidebar()
      {
          let elt = document.getElementById("sidebar_menu");
          console.log("toggle_sidebar sidebar_menu display: %s", elt.style.display);
          if (elt.style.display != "none")
          {
              elt.style.display = "none";
          }
          else
          {
              elt.style.display = "block";
          }
      }

    
    function do_home()
    {
        window.location.href = "index.htm";
    }

    function do_process()
    {
        window.location.href = "musicxml_process.htm";
    }

    function do_contact()
    {
        window.location.href = "musicxml_contact.htm";
    }

    function do_faq()
    {
        window.location.href = "musicxml_faq.htm";
    }

     function do_footer(sid)
     {
         let shtml = `<p>&nbsp;</p>
         <hr>
         <p>&nbsp;</p>
         <h2>About Process MusicXML Files</h2>
         <img src="images/GitHub-Mark-120px-plus.png" style="width: 120px;">

         <p>You can use the <strong>Process MusicXML Files</strong> Library Routines to create stand-alone MusicXML modification applications. 
        Reading a musicxml file, transposing or modifying it, and re-writing the file for use in OSMD or other tools which can read MUsicXML file.</p>




        <p>If you would like to make suggestions, participate in development, etc. make a post on our GitHUB issues tab:</p>
        <p><a href="https://github.com/AlbertHart/ahlbapps/issues">https://github.com/AlbertHart/ahlbapps/issues</a></p>


         <b>Process MusicXML Files</b> is free software and any developer can contribute to the project. 
         Everything you need is in the 
         <a href=https://github.com/AlbertHart/music>GitHub repository</a>. 
         <p></p>
         Please make sure to read and follow the development process described 
         in the README, as well as to provide good quality code and respect all guidelines.
         <p></p>
         Development discussion takes place on GitHub in the Issues tab.
         <p></p>
         Let us know about any ideas you have for new functions or improvements.
         <p></p>
         And let us know if you would like to help with the development efforts.

         <br clear=all>`;

         let element = document.getElementById(sid);
         element.innerHTML += shtml;
     }