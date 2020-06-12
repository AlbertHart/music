
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */

    function do_load_tab(stab, sfunction)
    {
        let shtml = sprintf(`<p></p><a href='process_musicxml.htm?tab=%s'>
            <button>%s MusicXML File</button>
            </a><br>
            `, stab, sfunction);

        return(shtml);
    }

    function do_transpose_header(sid,  add_link)
    {
        
        

        let shtml = `<div class=info>
            <h3>Transpose Score</h3>
            <img src="images/transpose.png" >
            Transpose your score, chords and key signatures to any key.\n`;

            if (add_link)
                shtml += do_load_tab("transpose", "Transpose");

        
        
        shtml +=`<br clear=all>
        </div><p></p>
        `;

        let element = document.getElementById(sid);
        element.innerHTML += shtml;


    }


    function do_add_bass_header(sid,  add_link)
    {

        let shtml = `<div class=info>
                <h3>Add Bass Accompaniment</h3>
                <img src="images/add-bass.png" >
                Add a simple Accompaniment to your score.
                <p>
                For instance, a piano accompaniment for a choral score.
                </p>\n`;

        if (add_link)
        shtml += do_load_tab("add_bass", "Add Base Notes");


        shtml +=`<br clear=all>
                </div><p></p>
                `;

                let element = document.getElementById(sid);
                element.innerHTML += shtml;

    }

    function do_trim_score_header(sid,  add_link)
        {
        
            let shtml = `<div class=info>
            <h3>Trim Score</h3>
            <img src="images/trim-score.png" >
            Select a portion of the score you want to keep with just the desired measures and notes.
            <p></p>
            Create and save a new MusicXML file with just the desired part of the original score.
            \n`;

            if (add_link)
            shtml += do_load_tab("trim_score", "Trim Score");


                shtml +=`<br clear=all>
                </div><p></p>
                `;

 
                let element = document.getElementById(sid);
        element.innerHTML += shtml;
        }



    function do_voice_leading_header(sid,  add_link)
    {
                
        let shtml = `<div class=info>
            <h3>Voice Leading Chords is not complete yet.</h3>
            <img src="images/accompaniment.png" >

            Voice Leading Chords will read a melody from the first part in your score, 
            and add bass and chords notes to accompany the melody.
            <p></p>
            This is designed to be played when aocompianing a singer or soloist.
            <p></p>
            One chord is provided for each chord in the leadsheet - using voice leading and inversions to minimize hand movement 
            while providing accompaniment.
            \n`;

        if (add_link)
        shtml += do_load_tab("voice_leading", "Add Voice Leasing Chords");


            shtml +=`<br clear=all>
            </div><p></p>
            `;

      
            let element = document.getElementById(sid);
        element.innerHTML += shtml;

                }


        function do_melody_chords_header(sid,  add_link)
        {
        
            let shtml = `<div class=info>
            <h3>Melody Chords is not complete yet.</h3>
            <img src="images/piano-jazz.png" >
            Melody Chords will read a melody from the first part in your score, and add bass and chords notes to accompany the melody.
            \n`;

        if (add_link)
            shtml += do_load_tab("melody_chords", "Add Melody Chords");


            shtml +=`<br clear=all>
            </div><p></p>
            `;

            let element = document.getElementById(sid);
        element.innerHTML += shtml;


     }

     function do_menu(sid)
     {
        let shtml = `<button class="tablinks" name='home_tab' onclick="do_home()">Home</button>
            <button class="tablinks" name='transpose_tab' onclick="open_tab(this)">Transpose XML</button>
            <button class="tablinks" name='add_bass_tab' onclick="open_tab(this)">Add Bass Notes</button>
            <button class="tablinks" name='trim_score_tab' onclick="open_tab(this)">Trim Score</button>
            <button class="tablinks" name='voice_leading_tab' onclick="open_tab(this)">Voice Leading</button>
            <button class="tablinks" name='melody_chords_tab' onclick="open_tab(this)">Melody Chords</button>
            <button class="tablinks" name='contact_tab' onclick="do_contact(this)">Contact</button>
            `;

            let element = document.getElementById(sid);
            element.innerHTML += shtml;
     }

     function do_home()
    {
        window.location.href = "index.htm";
    }

    function do_contact()
    {
        window.location.href = "musicxml_contact.htm";
    }

     function do_footer(sid)
     {
         let shtml = `<p>&nbsp;</p>
         <hr>
         <p>&nbsp;</p>
         <h2>About Process MusicXML Files</h2>
         <img src="images/GitHub-Mark-120px-plus.png" style="width: 120px;">
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