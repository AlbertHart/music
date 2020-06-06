
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