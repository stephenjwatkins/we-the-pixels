var csv   = Npm.require('csv');

WTPUserPort = {

  portFromCSV: function(cb) {

    var url = "https://s3.amazonaws.com/wethepixels/users.csv";
    var results = Meteor.http.get(url);

    if (results.statusCode == 200) {
      console.log("got csv file");

      WTPUserPort.parseCSV(results.content, cb);

    } else {
      console.log("Error: Could not get user.csv from s3.");
    }

  },

  parseCSV: function(csvContents, cb) {

    var rows = [];

    csv().from(csvContents)
    .on('record', function(row,index){

      rows.push(row.toString().split(','));

    })
    .on('end', function(count){

      cb(rows);
    })
    .on('error', function(error){
      console.log(error.message);
    });

  }

};