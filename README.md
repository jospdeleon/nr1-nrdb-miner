[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# nr1-nrdb-miner

>nodejs cli application which uses newrelic insights query api to data mine nrdb by issuing the same query over a series of date ranges.   

## Installation

> From root directory, npm install to install node modules.  

## Getting Started
> Setup your config file -- in the root directory edit the json file template_input.json.  

| Element          | Description                                         |
| ---------------- | --------------------------------------------------- |
| accountid        | NewRelic rpm account id                             |
| querykey         | NewRelic insights query key                         |
| basequery        | Base query to issue                                 |
| querystart       | start date of query in format "YYYY-MM-DD"           |
| queryend         | end date of query in format "YYYY-MM-DD"             | 
| slicesizeminutes | the number of minutes to make each iteration        | 
| querysuffix      | what to append to query, (e.g. timeseries)          |



## Usage
> To run, executre nodejs against the main file template.js.  (e.g. ```node template.js```). 

> The program will read in the template_input.json file and begin by issueing the `basequery`
with a **SINCE = querystart** and a **UNTIL = querystart+slicesizeminutes**.  After the results return,  the program will issue the query again, but with a **SINCE = querystart+slicesizeminutes** 
and a **UNTIL = querystart+(2*slicesizeminutes)**.   The program will continue to issue queries, incrementing the SINCE/UNTIL times until the SINCE time is past the `queryend` time your specififed in the config file. 
The `querysuffix` is appended on each iteration as well.   
The intention of this application is for the user to customize what they do with the return data.  Options include,  output to csv, insert result back to NewRelic, place data into data store (S3)...etc. 
You can adjust `slicesizeminutes` based on how many records get returned on the iterations.   Remember,  the api has a max return of 2000 records, so use the console.log output to 
help determine if you are hitting that limit and adjust the `slicesizeminutes` accordingly.   There is a commented console log line for this on approximatly line 54


## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:


## Contributing
We encourage your contributions to improve [nr1-nrdb-miner]! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company,  please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License
[nr1-nrdb-miner] is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
>[If applicable: The [nr1-nrdb-miner] also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.]
