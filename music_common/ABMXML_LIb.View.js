
/* jslint esversion: 6,  maxerr: 100 */
/* jshint eqeqeq: false */
console.log("IN ABMXML_Lib_View.js");

MusicDOM.prototype.libs__loaded["ABMXML_Lib_View"] = "loaded";

MusicDOM.prototype.view_object = undefined;
MusicDOM.prototype.view_container = undefined;


MusicDOM.prototype.lib_view = {

   

    backendType: "canvas",

    isCustom: true,   // are we loading from a string?

    paramPageFormat: undefined,
    paramPageBackgroundColor: undefined,
    paramPageHeight: undefined,
    paramPageWidth: undefined,
    paramPageBackgroundColor: undefined,
    paramSingleHorizontalStaffline: undefined,

    compactMode: false,

    measureRangeStart: 0,

    measureRangeEnd: Number.MAX_SAFE_INTEGER,

    pageFormat: paramPageFormat ? paramPageFormat : "Endless",





    pageBackgroundColor: paramPageBackgroundColor ? "#" + paramPageBackgroundColor : undefined, // vexflow format, see OSMDOptions. can't use # in parameters.
        
    singleHorizontalStaffline: (paramSingleHorizontalStaffline === '1'),

};

if (paramPageHeight && paramPageWidth) {
    pageFormat: `${paramPageWidth}x${paramPageHeight}`,
}

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
    this.parameters = parameters;  // save in prototype
    this.show_output = parameters.show_output;
    let show_output = this.show_output;

     // Create OSMD object and canvas

     this.view_container: document.getElementById("view_container"),

     thus.view_object = new opensheetmusicdisplay.OpenSheetMusicDisplay(this.view_container, {
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
        view_object.setLogLevel('info'); // set this to 'debug' if you want to see more detailed control flow information in console
       

    view_object.load(xml_string_in).then(
            function () {
                // This gives you access to the osmd object in the console. Do not use in productive code
                window.osmd = view_object;
                view_object.zoom = zoom;
                return view_object.render();
            },
            function (e) {
                errorLoadingOrRenderingSheet(e, "rendering");
            }
        ).then(
            function () {
                return onLoadingEnd(isCustom);
            }, function (e) {
                errorLoadingOrRenderingSheet(e, "loading");
                onLoadingEnd(isCustom);
            }
        );
}
