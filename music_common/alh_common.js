var error_stack2;
var self_line2;
var caller_line2;

console.log("Loading alh_common.js");

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

// replace some c++ routines
function strncmp(str, phrase, chars)
{
    sub = str.substr(0, chars);
    if (sub = phrase)
        return(true);
    return(false);
}



function atoi(str)
{
    return(Number(str));
}

String.prototype.
    Find = function ( 
        str2 
    ){

        //:Get primitive copy of string:
        var str = this.valueOf();

        //:Append Characters To End:
        ipos = str.indexOf(str2);

        //:Return modified copy:
        return( ipos );
    };

String.prototype.
    Mid = function ( 
        pos, chars 
    ){

        //:Get primitive copy of string:
        var str = this.valueOf();

        if (chars == 0)
            return(str, substr(pos));
        return str.substr(pos, chars);
    };

    String.prototype.start_with = function (str2) {

        if (this.substr(0, str2.length) == str2)
        {
            return(true);
        }
        return(false);
    };
    
    // skip #box, etc.
    String.prototype.skip_start = function () {
    
        str2 = this;
        ipos = str2.indexOf(" ");
        if (ipos > 0)
        {
            str2 = str2.substr(ipos);
            str2.trim();
        }
        return(str2);
    };
