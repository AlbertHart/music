
console.log("Loading html_common.js");

// to save output
function prepare_output_file()
{
    console.log("SAVE OUTPUT FILE");

    output_string = xml_string_out;

    //let output_file_name = get_element_value("output_file_name");
    //if (!output_file_name)
        output_file_name = "new_score.musicxml";

    console.log("prepare_output_file: output_file_name: %s", output_file_name);


    var properties = {type: 'text/plain'}; // Specify the file's mime-type.

    elt = document.getElementById("download_output");
    elt.innerText = output_file_name;

    data = [output_string];
    console.log("string DATA length: %s", data.length);

    try 
    {
        // Specify the filename using the File constructor, but ...
        console.log("SAVE AS FILE");
        // we will want to get output file name
        file = new File(data, output_file_name, properties);
    } 
    catch (e) 
    {
        // ... fall back to the Blob constructor if that isn't supported.
        console.log("SAVE AS BLOB");
        file = new Blob(data, properties);
    }
    console.log("After create FILE");
    var url = URL.createObjectURL(file);

    download_div_elt = document.getElementById('download_div');
    download_div_elt.style.display = "block";

    download_elt = document.getElementById('download_link');
    download_elt.download = output_file_name;
    download_elt.href = url;
    console.log("After set download_link href");
}




function show_transposed_score()
{
    elt = document.getElementById("transposed_score");
    elt.style.display = "block";
    elt.innerText = xml_string_out;
}

function copy_transposed_score()
{
    if (!xml_string_out || xml_string_out == "")
        alert("No Transposed Score available");
    else
    {
        copyToClipboard(xml_string_out);
        alert(xml_string_out.length + " bytes copied to clipboard");
    }
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
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
function get_self(sarg, sarg2, sarg3, sarg4) {
    //console.log("SARG: %s SARG@: %s SARG3: %s", sarg, sarg2, sarg3);
    if (sarg == null)
        sarg = "";
    else if (isNaN(sarg))
        sarg = "'" + sarg + "'";

    if (sarg2 == null)
        sarg2 = "";
    else if (isNaN(sarg2))
        sarg2 = ", '" + sarg2 + "'";
    else
        sarg2 = ", " + sarg2;

    if (sarg3 == null)
        sarg3 = "";
    else if (isNaN(sarg3))
        sarg3 = ", '" + sarg3 + "'";
    else
        sarg3 = ", " + sarg3;

    if (sarg4 == null)
        sarg4 = "";
    else if (isNaN(sarg4))
        sarg4 = ", '" + sarg4 + "'";
    else
        sarg4 = ", " + sarg4;

    error_stack2 = (new Error).stack;

    self_line2 = (new Error).stack.split("\n")[2]
    caller_line2 = (new Error).stack.split("\n")[3]
    //console.log("GET_SELF: %s", caller_line2);

    // Function     at show_game_setup (file:///C:/web/EasyHand/hh/EasyHandReplayer.js?v=2.62) 
    ipos1 = self_line2.indexOf("at ");
    self_name = self_line2.substr(ipos1 + 3);
    ipos2 = self_name.indexOf(" ");
    self_name = self_name.substr(0, ipos2);

    if (caller_line2) {
        ipos1 = caller_line2.indexOf("at");
        sname = caller_line2.substr(ipos1 + 3);
        ipos2 = sname.indexOf(" ");
        sname = sname.substr(0, ipos2);
        //console.log("SNAME: %s", sname);

        ipos3 = caller_line2.lastIndexOf(":");
        ipos4 = caller_line2.lastIndexOf(":", ipos3-1);
        sline = caller_line2.substr(ipos4 + 1, ipos3 - ipos4 - 1)

        self = sprintf("*** %s(%s%s%s%s) *** Called by: %s: %s\n", self_name, sarg, sarg2, sarg3, sarg4, sname, sline);
    }
    else {
        self = sprintf("*** %s(%s%s%s%s) *** No caller\n", self_name, sarg, sarg2, sarg3, sarg4);
    }
    //console.log("GET SELF: %s", self);
    return (self);
}

function get_base_url()
{
    var curr_page = window.location.href,
    base_page = curr_page;

    // If current page has a query string, append action to the end of the query string, else
    // create our query string
    ipos = curr_page.indexOf("?");
    if (ipos >= 0)
        base_page = curr_page.substr(0, ipos);;

    return(base_page);

}

    var url_vars;
function get_url_vars()
{
        console.log(get_self());
        if (url_vars)
            throw("url_vars alreay defined");
        url_vars = [];
    url_string = window.location.href;
    ipos = url_string.indexOf("#");
    if (ipos >= 0)
        url_string = url_string.substr(0, ipos);
    var parts = url_string.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 
    {
            url_vars[key] = unescape(value);
            console.log("KEY: %s url_vars[key]: %s", key, url_vars[key]);
    });
        return url_vars;
    }

    function get_url_var(svar)
    {
        console.log(get_self(svar));
        if (!url_vars)
        {
            console.log("getting url_vars");
            get_url_vars();
        }
        sval = url_vars[svar];
        if (!sval)
            sval = "";
        return(sval);
}
