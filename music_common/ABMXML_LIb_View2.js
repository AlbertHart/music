
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN ABMXML_Lib_View2.js");

libs__loaded["ABMXML_Lib_View2"] = "loaded";
console.log("libs_loaded.length: %s", libs_loaded.length);



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


MusicDOM.prototype.view_musicxml_dom = function(parameters, dom_object)
{
    console.log("view_musicxml_dom");
    this.parameters = parameters;  // save in prototype
    this.show_output = parameters.show_output;
    let show_output = this.show_output;
    let view_params = this.view_params;

     // Create OSMD object and canvas

     let score_container_div = document.getElementById("score_container");
     score_container_div.style.display = "block";

     let osmd_container_div = document.getElementById("osmd_container");

     osmd_container_div.innerHTML = "<h3>Loading Score</h3>";

     //console.log("get osmd_object");
     this.osmd_object = new opensheetmusicdisplay.OpenSheetMusicDisplay(osmd_container_div, {
            autoResize: true,
            backend: this.backendType,
            //backend: "canvas",
            disableCursor: false,
            drawingParameters: this.compactMode ? "compact" : "default", // try compact (instead of default)
            drawPartNames: true, // try false
            // drawTitle: false,
            // drawSubtitle: false,
            drawFingerings: true,
            fingeringPosition: "left", // left is default. try right. experimental: auto, above, below.
            // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
            setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
            // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.
            drawFromMeasureNumber : this.measureRangeStart,
            drawUpToMeasureNumber : this.measureRangeEnd,

            //drawMeasureNumbers: false, // disable drawing measure numbers
            //measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)

            // coloring options
            coloringEnabled: true,
            // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
            // defaultColorStem: "#BB0099",

            autoBeam: false, // try true, OSMD Function Test AutoBeam sample
            autoBeamOptions: {
                beam_rests: false,
                beam_middle_rests_only: false,
                //groups: [[3,4], [1,1]],
                maintain_stem_directions: false
            },

            pageFormat: this.pageFormat,
            pageBackgroundColor: this.pageBackgroundColor,
            renderSingleHorizontalStaffline: this.singleHorizontalStaffline

            // tupletsBracketed: true, // creates brackets for all tuplets except triplets, even when not set by xml
            // tripletsBracketed: true,
            // tupletsRatioed: true, // unconventional; renders ratios for tuplets (3:2 instead of 3 for triplets)
        });

        let osmd_object = this.osmd_object;
        osmd_object.setLogLevel('info'); // set this to 'debug' if you want to see more detailed control flow information in console
       

        osmd_object.load(xml_string_in).then(
            function () {
                // This gives you access to the osmd object in the console. Do not use in productive code
                window.osmd = osmd_object;
                osmd_object.Zoom = view_params.zoom;
                return osmd_object.render();
            },
            function (e) {
                errorLoadingOrRenderingSheet(e, "rendering");
            }
        ).then(
            function () {
                return onLoadingEnd(view_params.is_custom);
            }, function (e) {
                errorLoadingOrRenderingSheet(e, "loading");
                onLoadingEnd(view_params.is_custom);
            }
        );

    function errorLoadingOrRenderingSheet(e, loadingOrRenderingString) {
        var errorString = "Error " + loadingOrRenderingString + " sheet: " + e;
        // if (process.env.DEBUG) { // people may not set a debug environment variable for the demo.
        // Always giving a StackTrace might give us more and better error reports.
        // TODO for a release, StackTrace control could be reenabled
        errorString += "\n" + "StackTrace: \n" + e.stack;
        // }
        console.warn(errorString);
    }

    function onLoadingEnd(is_custom) {
        // Remove option from select
        if (!is_custom && custom.parentElement === selectSample) {
            selectSample.removeChild(custom);
        }

        if (typeof interactive === 'function') {
            interactive()
        }
    }
}

    




