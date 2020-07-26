
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN ABMXML_Lib_View4.js");

MusicDOM.prototype.libs__loaded["ABMXML_Lib_View4"] = "loaded";



MusicDOM.prototype.view_params = {

   
    zoom: 1.0,

    backendType: "canvas",

    is_custom: true,   // are we loading from a string?


    compactMode: false,

    measureRangeStart: 0,

    measureRangeEnd: Number.MAX_SAFE_INTEGER,

    pageFormat: "Endless",
    pageBackgroundColor: undefined,
    singleHorizontalStaffline: false,

    //pageFormat: MusicDOM.prototype.view_params.paramPageFormat ? 
    //    MusicDOM.prototype.view_params.paramPageFormat : "Endless",

    //pageBackgroundColor:  MusicDOM.prototype.view_params.paramPageBackgroundColor ?
    //     "#" +  MusicDOM.prototype.view_params.paramPageBackgroundColor : undefined, // vexflow format, see OSMDOptions. can't use # in parameters.
        
    //singleHorizontalStaffline: (paramSingleHorizontalStaffline === '1'),

};

//if (paramPageHeight && paramPageWidth) 
//{
//    MusicDOM.prototype.view_params.pageFormat = `${paramPageWidth}x${paramPageHeight}`;
//}

// You can use this function to send a MusicXML file, and get back an ASCII Music XML file.
MusicDOM.prototype.view_xml = function(parameters, xml_string_in)
{
    let dom_object = this.musicxml_to_dom(xml_string_in);

    this.view_musicxml_dom(parameters, dom_object);

    let xml_string_return = this.dom_object_to_return_string(dom_object);
    return(xml_string_return);
}




    




