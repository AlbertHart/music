
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */

var MLIB;
var parameters;
var xml_string_loaded;
var xml_string_in;
var xml_string_out;
var scores;

    function show_sidebar()
    {

        // javascript to create sidebar menu
        let elt = document.getElementById('sidebar');
        elt.innerHTML = `
        <!--sidebar start-->
        <aside>
        <div id="sidebar"  class="nav-collapse ">
            <!-- sidebar menu start-->
            <ul class="sidebar-menu" id="nav-accordion">
                <li>
                    <a href ="index.htm">
                        <i class="fa fa-home"></i>
                        <span>Home</span>
                    </a>
                </li>


        

                <li class="sub-menu always-open" >
                    <a href="javascript:;" >
                    <i class="fa fa-angle-double-right"></i>
                        <span>Processing Functions...</span>
                        </a>
                    <ul class="sub always-open" >


                    <li>
                        <a href="javascript:show_process('view_play');">
                            <i class="fa fa-music"></i>
                            <span>View and Play</a></li>
                    <li>
                        <a href="javascript:show_process('transpose');">
                            <i class="fa fa-arrows-v"></i>
                            <span>Transpose</a></li>
                    <li>
                        <a href="javascript:show_process('add_bass');">
                            <i class="fa fa-level-down"></i>
                            <span>Add Bass</a></li>
                    <li>
                        <a href="javascript:show_process('trim_score');">
                            <i class="fa fa-scissors"></i>
                            <span>Trim</a></li>
                    <li>
                        <a href="javascript:show_process('voice_leading');">
                            <i class="fa fa-arrow-right"></i>
                            <span>Voice Leading</a></li>
                    <li>
                        <a href="javascript:show_process('melody_chords');">
                            <i class="fa fa-level-up"></i>
                            <span>Melody Chords</a></li>

                    </ul>
                </li>

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
    function show_process(content_name)
    {
        if (use_show_process == "load")
        {
            // load musicxml_process.htm;
            let surl = "musicxml_process.htm?content=" + content_name;
            window.location.href = surl;
            return;
        }
        console.log(MLIB.get_self(content_name));

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
            first_measure: "2",
            first_note: "2",
            last_measure: "4",
            last_note: "1",
            process_content: "view_play",
            seventh_position: "treble",
            show_output: "0",
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
            save_parameter_changes();
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

    // to save output
    function prepare_output_file(output_string, output_file_name)
    {

        if (!output_file_name || output_file_name == "")
            output_file_name = "new_score.musicxml";

        //console.log("prepare_output_file: output_file_name: %s", output_file_name);


        let properties = {type: 'text/plain'}; // Specify the file's mime-type.

        let elt = document.getElementById("download_output");
        elt.innerText = output_file_name;

        let data = [output_string];
        //console.log("string DATA length: %s", data.length);

        let file;
        try 
        {
            // Specify the filename using the File constructor, but ...
            //console.log("SAVE AS FILE");
            // we will want to get output file name
            file = new File(data, output_file_name, properties);
        } 
        catch (e) 
        {
            // ... fall back to the Blob constructor if that isn't supported.
            //console.log("SAVE AS BLOB");
            file = new Blob(data, properties);
        }
        //console.log("After create FILE");
        let url = URL.createObjectURL(file);

        let download_div_elt = document.getElementById('download_div');
        download_div_elt.style.display = "block";

        let download_elt = document.getElementById('download_link');
        download_elt.download = output_file_name;
        download_elt.href = url;
        //console.log("After set download_link href");
    }


    function get_parameter_change(element, dont_save)
    {
        //console.log(MLIB.get_self(element.id, element.name));
 
        let name;
        let value;
        let type = element.type;
        if (element.tagName == "SELECT")
        {
            type = "SELECT";
            name = element.id;
            let index = element.selectedIndex;
            //console.log("NAME: %s index: %s", name, index);
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
            save_parameter_changes();
    }

    function get_parameters_from_elts()
    {
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
        save_parameter_changes();
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

   
        
    function process_xml(xml_string_in)
    {
        get_parameters_from_elts();


       let output_file_name = parameters.content + ".musicxml";

        if (!xml_string_in || xml_string_in == "")
        {
            let score_no = parameters.demonstration_score;
            let score = scores[score_no];
            parameters.song_name = score.name;
            //console.log("score_no: %s song_name: %s", score_no, parameters.song_name);
            xml_string_in = score.xml;
        }

        if (!xml_string_in || xml_string_in == "")
        {
            console.error("NO XML STRING");
            alert("XML Not Loaded");
            return;
        }

        MLIB.xml_string_out = "";

        switch (parameters.content)
        {
            case 'transpose':
                MLIB.xml_string_out = MLIB.transpose_xml(parameters, xml_string_in);
                break;
            case 'add_bass':
                MLIB.xml_string_out = MLIB.add_bass_to_xml(parameters, xml_string_in);
                break;
            case 'trim_score':
                MLIB.xml_string_out = MLIB.do_trim_score(parameters, xml_string_in);
                break;
            case 'voice_leading':
                MLIB.xml_string_out = MLIB.do_voice_leading(parameters, xml_string_in);
                break;
            case 'melody_chords':
                MLIB.xml_string_out = MLIB.do_melody_chords(parameters, xml_string_in);
                break;
        }

        if (MLIB.xml_string_out && MLIB.xml_string_out != "")
        {
            let elt = document.getElementById("transposed_score");
            elt.innerText = MLIB.xml_string_out;
        }

        // build output file name
        if (song_name)
        {
            let output_file_name = song_name;
            let ipos3 = output_file_name.lastIndexOf(".");
            if (ipos3 >= 0)
                output_file_name = output_file_name.substr(0, ipos3) + "-" + parameters.transpose_key + output_file_name.substr(ipos3);
            set_element_value("output_file_name", output_file_name);
        }


        // create the output file ready for download
        prepare_output_file(MLIB.xml_string_out, output_file_name);


    }

     // to save output
    function prepare_output_file(output_string, output_file_name)
    {

        if (!output_file_name || output_file_name == "")
            output_file_name = "new_score.musicxml";

        //console.log("prepare_output_file: output_file_name: %s", output_file_name);


        let properties = {type: 'text/plain'}; // Specify the file's mime-type.

        let elt = document.getElementById("download_output");
        elt.innerText = output_file_name;

        let data = [output_string];
        //console.log("string DATA length: %s", data.length);
        let file;
        try 
        {
            // Specify the filename using the File constructor, but ...
            //console.log("SAVE AS FILE");
            // we will want to get output file name
            file = new File(data, output_file_name, properties);
        } 
        catch (e) 
        {
            // ... fall back to the Blob constructor if that isn't supported.
            //console.log("SAVE AS BLOB");
            file = new Blob(data, properties);
        }
        //console.log("After create FILE");
        let url = URL.createObjectURL(file);

        let download_div_elt = document.getElementById('download_div');
        download_div_elt.style.display = "block";

        let download_elt = document.getElementById('download_link');
        download_elt.download = output_file_name;
        download_elt.href = url;
        //console.log("After set download_link href");
    }

 
     // save parameters after every change
     function save_parameter_changes()
    {
        //console.log(MLIB.get_self());
        let json_string = JSON.stringify(parameters);
        //console.log("json_string: %s", json_string);

        let storage_key = "musicxml_process";
        //console.log("setItem for storage_key: %s\n%s", storage_key, json_string);
        localStorage.setItem(storage_key, json_string);

    }

    function load_parameters()
    {   
        //console.log(MLIB.get_self());
        let storage_key = "musicxml_process";
        let json_string = localStorage.getItem(storage_key);
        //console.log("load_parameters: %s\n%s", storage_key, json_string);
        let parameters_parsed = JSON.parse(json_string);

        //console.log("parameters_parsed: %s", parameters_parsed);

        for (let key in parameters_parsed)
        {
            let value = parameters_parsed[key];
            //console.log("load_parameters: key: %s value:  %s", key, value);
            parameters[key] = value;
            set_element_value(key, value);
        }
        

    }

    // these are not in the library functions (yet) because they are only used in this one .htm file
    function set_element_value(sid, value)
    {
        //console.log(MLIB.get_self(sid, value));

        if (sid == "process_content")
        {
            // not setting sidebar tab yet
            show_process(value);
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
        
        if (elt.tagName == "SELECT")
        {
            for(let ii=0; ii < elt.options.length; ii++)
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
            console.error(sid + " - SELECT value not found: " + value, sid, value);
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

    function do_trim_score_text(sid,  add_link)
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
          console.log("menu display: %s", elt.style.display);
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