/**
 * Converts the instructor spreadsheet into JSON
 *
 * The UK spreadsheet is at:
 * https://docs.google.com/spreadsheets/d/19LywcTOWqdv-wdeU4TsvHwJub0tT3kZXWNpNw3KCn00/edit#gid=0
 *
 * The SA spreadsheet is at:
 * https://docs.google.com/spreadsheets/d/1ozUAa4cf-kbVHUs0D4Ut5psXFGcukoxK7FZyhed7V8s/edit?ts=56d98b88#gid=0
*
 * Usage:
 * $ node instructor-export.js
 *
 * This will output JSON which can then be manually imported (using an Admin/Import user's token) using
 * Swagger to POST to /api/instructors
 *
 * Installation:
 * $ npm install google-spreadsheet
 */

var GoogleSpreadsheet = require("google-spreadsheet");
//var request = require('request');

var sanitizeEmailAddresses = true; // Change to true to make all email addresses roger+originalEmail@burningdog.co.za

// spreadsheet key is the long id in the sheets URL
// UK
//var my_sheet = new GoogleSpreadsheet('19LywcTOWqdv-wdeU4TsvHwJub0tT3kZXWNpNw3KCn00');
// SA
var my_sheet = new GoogleSpreadsheet('1ozUAa4cf-kbVHUs0D4Ut5psXFGcukoxK7FZyhed7V8s');
 
// Without auth -- read only 
// IMPORTANT: See note below on how to make a sheet public-readable! 
// # is worksheet id - IDs start at 1 
/*
my_sheet.getRows( 1, function(err, row_data){
  console.log( 'pulled in '+row_data.length + ' rows');
});
*/

// With auth -- read + write 
// see below for authentication instructions 
//var creds = require('./google-generated-creds.json');
// OR, if you cannot save the file locally (like on heroku) 
var creds = {
  client_email: 'roger-laptop@virgin-1222.iam.gserviceaccount.com',
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm+wQ9lTS/AcsJ\n5RJcMXDr9nDGuijcRC85JEAUQj2laIy7tt5ll7MsfNWKPJP6p1YNJkeWnMHEd0sI\nwVIXiB1oKvd0h8YCq7LTtDEMQ4U4T1bFoPAblJB1PGQ/Pu+1ZwrnOMNg1/XArUY0\nT4/RbVERPUw5Bl1RtOdBAA9QmKmwrkj6DBWJZknQnfI2+o7vBRcxgKg6LhUAxIy/\n6JRLMovMA7el+FBzIegLqk8w9dxKETOHGgjE4P+Set8w1auG7Jrnw58Sw+H1ecgx\nSRH/yiMSI/vr1TqHCKSemGs+W6O8QzAiOWrTOpwn9SEyfpCBNc6D2tjGeuxad8aK\nYoJqvY8xAgMBAAECggEAVmVog0iRGwcde8gnYMZADAbdwSUPATDSUjl8Yj8H0G6w\n6msq1NvR3AHXJwhC9JziPDmDLt16sGGc1DHafMxzkrMwh/28KSOXikwgWJ0S79i1\nJ9omgc6zk8UkhUjWFED1dj97b78tq3y751MHMa/jEw1pQ9QUMrNsN8iFJAlpOz2M\nDVKGW62xhgH5sbnpt4DfadoQROyDXPp7YFRcZOhHFSXWZ7mvWw3i1Fine82UBatT\nfHUDIwj2yCDOMyLJ79Bw1crLuCn13OlIDG6D1obVHhWmFPFmUEOLg5wLh04OxAPh\nmJUH16yiqtZnj0RvoDVhQMlDU3d0f2Tj3YRwCV6ghQKBgQDSo+sSzx0JON/ZxBwY\nujUVgW68k8kH3ydQQ4D6JIQ5o+QoL44xPE0dyibiIYUPhWm1jYcLfVEdQw5ISrZP\nQENelwr4Vo0Gwt/AdKC/mcAgETy6++OUksXg3ybEpPdFl3XS3T2dTjZbNn4WFsfJ\nHBFAbYfai8t1p+EIGGeQUIrfSwKBgQDK8D4UP7HvDTQLobejZSnTNPRsWTGorCDS\nzN7Zt4PqMA78HMb5XMQmzg+bzdldCC7XKQExuAU4uPSy9ChGqCtJuMARl8J0viXR\nuqj/0g/Ai3xjNzN+fL5t1u007+I0ScKfySCcjhSBZAepL0R8bCn1AohiFSCxb03A\nlCXFQGLx8wKBgG+Euyr9HilIxDLdweZRh1M4cHFEaNVTDtROuNU2Sg7eNygTbVuh\nyk4wPX/RMUozXvDw2gN6OFyeqMwbSgQRSNmma/dok0d2GtIgrQ5jjzUrCxUP0MBT\nKJJScor/r65XbtjRqxJCW0LVSdHWA7X0tyl+E8Pf6TsEQ35utT3RdoSbAoGBAJrL\nFz8QuqNR2eIJb26Fqpp8qPfALR2wdbT1KgK9dTR7heKN/MOWG9RRlxxLrsHEjR33\nG/8Vk34JrjSWAearPaGU94Qz0tKDe4t3KpM/Yl6GxtFS+MdBVWuo5fRcCZnCrV59\n5o8j3MY5S5KkCEQzqOlHDkpqPS66bH85QXosu4w7AoGAIfOC9rMtCw2bgauR1ijn\nRoMYM1vcvtGomKYJCMOOTZOgtDgOpSp5iSZRk6G6Xv/LjEJh/vTvfc+DCZ4up5YN\ntr19wW/yCsoVgUG6IBxlrSIhcwepggda74Caa0GFOnzjPNdJpmhjsb19YOQCVesT\nJvS0/5uH7A1NxI28G7dbLow=\n-----END PRIVATE KEY-----\n"
}
 
my_sheet.useServiceAccountAuth(creds, function(err){
  // getInfo returns info about the sheet and an array or "worksheet" objects 
  my_sheet.getInfo( function( err, sheet_info ){
    //console.log( sheet_info.title + ' is loaded' );
    // use worksheet object if you want to stop using the # in your calls 
 
    var sheet1 = sheet_info.worksheets[0];
    var instructors = [];

    sheet1.getRows( 1, function(err, row_data){
      //console.log( 'pulled in '+row_data.length + ' rows');
      row_data.forEach(function(val) {
        //console.log(val.firstname + ' ' + val.lastname + ' ' + val.emailaddress + ' ' + val.club);
        if (sanitizeEmailAddresses) {
          val.emailaddress = 'roger+' + val.emailaddress.substring(0, val.emailaddress.indexOf('@')) + '@burningdog.co.za';
        }

        /* Sanitize input data because it's dirty */

        // Separate out the name field into first name and last name
        if (!val.firstname && val.name) {
          var space = val.name.indexOf(' ');
          if (space > 0) {
            val.firstname = val.name.substring(0, space);
            val.lastname = val.name.substring(space + 1);            
          }
          else {
            val.firstname = val.name;
          }
        }

        if (val.lastname) {
          val.lastname = capitalizeFirstLetter(val.lastname);
        }

        if (!val.id) {
          val.id = 'temp_' + uuid();
        }

        instructors.push({
          FirstName: val.firstname,
          LastName: val.lastname,
          Email: val.emailaddress,
          EmployeeNumber: val.id,
          Telephone: val.tel,
          Active: true
        });

        /*
        if (val.employeenumber === '954p2663') {
          console.log(val);
        }
        */
      });

      console.log(instructors);
    });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function uuid() {
      // http://www.ietf.org/rfc/rfc4122.txt
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 31; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      return s.join("");
    }

  });
})