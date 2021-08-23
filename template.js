const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

let rawdata = fs.readFileSync('template_input.json');   // <-----------------------config file is read in here ------------
let config = JSON.parse(rawdata);

// check config for all stuff todo

var insights_headers = {
    headers: {
        'Content-Type': 'application/json',
        'X-Query-Key': config.querykey
    }
}


var starttime = moment(config.querystart,'YYYY-MM-DD');
var endtime = moment(config.queryend,'YYYY-MM-DD');

var currentstartpoint = starttime.clone();
var querystart = "'"+currentstartpoint.format('YYYY-MM-DD HH:mm:ss')+ " PST'";
var queryend = "'"+currentstartpoint.clone().add(config.slicesizeminutes, "minutes").format('YYYY-MM-DD HH:mm:ss') + " PST'";

var basequery = config.basequery;


function constructCustomQuery(print)
{
    
    var enctestpart1 = encodeURI(basequery);
    var enctestpart2 = encodeURIComponent(" SINCE " + querystart + " UNTIL " + queryend + " " + config.querysuffix);
    var final =  enctestpart1 + enctestpart2;
    var final2 = final.replace(/'/g, "%27");
    if(print)
    {
        console.log(final2)
    }
   
    return final2;
}

var results = [];

function getData(encodedstring) {


    var url = 'https://insights-api.newrelic.com/v1/accounts/' + config.accountid + '/query?nrql='+encodedstring;
    // Make the call to nrdb insights.   using the query string above...
    axios.get(url, insights_headers)
        .then((response) => {

            try {
                // ****************************************************************************************************
                // *************************************** CUSTOM RETURN DATA PARSER START **********************************************
                // console.log("result count returned " + response.data.results[0].events.length);
                for(var i = 0; i < response.data.timeSeries.length; i++)
                {
                    var ele = response.data.timeSeries[i];
                    var bt = ele.beginTimeSeconds;
                    var et = ele.endTimeSeconds;
                    var btm = moment(bt*1000);
                    var etm = moment(et*1000);
                    var sumvalue = ele.results[0].count;
                    fs.appendFileSync('exportresults.log', btm.toISOString() + ", "+ sumvalue +  '\n');  //  write the output log with email address found
                }

              

                // ***************************************** END DATA PARSER ***********************************************
                // ****************************************************************************************************
            } catch (ex1) {
                console.log("exception during call to insights: " + ex1.message);
            }

            // if our current time point in search is still before out end time,  make recursive call
            if(currentstartpoint.isBefore(endtime)) {
                currentstartpoint = currentstartpoint.add(config.slicesizeminutes, "minutes");  // move forward 1 hour.
                 querystart = "'"+currentstartpoint.format('YYYY-MM-DD HH:mm:ss')+ " PST'";
                 queryend = "'"+currentstartpoint.clone().add(config.slicesizeminutes, "minutes").format('YYYY-MM-DD HH:mm:ss') + " PST'";
                console.log("Query Time Window: "  + querystart + " ---> " +  queryend);



                var encoded = constructCustomQuery(false);
                getData(encoded)
            }
            else
            {
                console.log("processing completed")
                console.log("FINAL results length = " + results.length)
            }

        }).catch(error=>{

        console.log("***** exception: " + error.response.data.error  + "   *******************");



    });
}


// init call into recursive call to getDAta.func
var encoded = constructCustomQuery();
getData(encoded);
