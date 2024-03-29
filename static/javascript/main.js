
// run on ducument read
$('document').ready(function () {

});
let isResponse = [false, false];
// Text input and GET request
function loading(ennable) {
    if (ennable) {
        $('#loader').removeClass('gone');
        $("input[type=button]").attr("disabled", "disabled");
    } else {
        $('#loader').addClass('gone');
        $("input[type=button]").removeAttr("disabled");
    }
}

////////////////
// Load Samples
////////////////

$("#csv-input").change(function () {

    loading(true)

    var file = document.getElementById('csv-input').files[0];
    var reader = new FileReader();
    var isSuccess = checkCSVFileType(file);

    if (isSuccess) {
        reader.onload = function (event) {
            var csvData = event.target.result;
            process(csvData);
        };
        if (file) {
            reader.readAsText(file);
        }
    } else {
        alert('incorrect file type, please upload a CSV file with headings.')
    }

});

$('document').ready(function () {

    $('#csv-sample').click(function () {
        loading(true)

        $.ajax({
            url: 'static/sample.csv',
            dataType: 'text',
        }).done(process);

    });

    $('#csv-download').click(function () {

        $.ajax({
            url: 'static/sample.csv',
            dataType: 'text',
        }).done(download);

    });

});

function download() {
    document.getElementById('download').click();
}

function process(csvData) {

    data = $.csv.toObjects(csvData);
    if (data && data.length > 0) {
        fillTable($('#table-results'), data);
        sendPostRequest(data);
    } else {
        alert('File is empty!');
    }

}

function sendPostRequest(request) {

    $('#error').html("");
    console.log(request);
    request = JSON.stringify(request);

    $.ajax({
        method: "POST",
        url: "./local-api/post",
        data: { "request": request }
    }).done(function (response) {

        if (response.hasOwnProperty('error')) {
            $('#error').html(response['error']);
            console.log(response['error']);
        }
        else {
            console.log(response);
        }
        loading(false);
    });
}

function checkCSVFileType(file) {
    fileTypes = ['csv'];
    extension = file.name.split('.').pop().toLowerCase();
    return fileTypes.indexOf(extension) > -1;
};

function fillTable(table, data, samples = -1) {

    console.log(table)
    h = data[0]
    keys = Object.keys(h)

    if (samples == -1) {
        samples = data.length
    }

    html = '<table class="table table-sm" id="table">'
    for (i = 0; i < keys.length; i++) {
        if (i % 2 == 1) {
            html += '<col class="bg-light">'
        }
        else {
            html += '<col>'
        }
    }
    html += '<thead>'
    html += '<tr>'

    for (i = 0; i < keys.length; i++) {
        k = keys[i]
        html += '<th>' + k + '</th>'
    }

    html += '</tr>'
    html += '</thead>'
    html += '<tbody>'

    for (i = 0; i < samples && i < data.length; i++) {
        html += '<tr>'

        for (j = 0; j < keys.length; j++) {
            k = keys[j]
            d = data[i][k]

            html += '<td>' + d + '</td>'
        }

        html += '<tr>'
    }

    html += '</tbody>'
    table.append(html);

}

//////////////
// Input Field
//////////////

$('#text-input').keydown(function (e) {
    var data = $('#text-input').val();
    if (e.which == 13 && data.length > 0) {
        sendGetRequest(data);
    }
});

$('#text-submit').click(function (e) {
    var data = $('#text-input').val();
    if (data.length > 0) {
        sendGetRequest(data);
    };
});

function sendGetRequest(request) {

    loading(true);
    $('#error').html('')
    console.log(request);

    $('#error').html("");
    $('#text-input').val('');

    $.ajax({
        method: "GET",
        url: "./local-api/get",
        data: { "request": request }
    }).done(function (response) {

        if (response.hasOwnProperty('error')) {
            $('#error').html(response['error']);
            console.log(response['error']);
        }
        else {
            console.log(response);
        }
        loading(false);
    });
}

//////////////
// Image input
//////////////

//Driver 1
$("#img-input1").change(function () {

    loading(true);
    var preview = document.getElementById('img1');

    $('#img-results1').html('')
    $('#img-loader1').removeClass('gone')

    var file = document.getElementById('img-input1').files[0];
    var isSuccess = checkImageType(file);
    var reader = new FileReader();

    if (isSuccess) {
        reader.addEventListener("load", function () {
            preview.src = reader.result;
            preview.style.display = 'inline'
            preview.style.height = '100%';

            var form = new FormData($('#form1')[0]);

            $.ajax({
                url: '/local-api/image/driver1',
                type: 'POST',
                data: form,
                cache: false,
                processData: false,
                contentType: false,
            }).done(function (response) {
                $('#error').html('')

                if (response.hasOwnProperty('error')) {
                    $('#error').html(response['error'])
                    console.log(response['error']);
                }
                else {

                    console.log(response);

                        //alert("cheked the button - worked");
//                        document.getElementById('registerForm').style.display= 'block' ;
//                        document.getElementById('card1').style.display= 'none' ;

//                        changeValuesOfForm(response);

                           $("#licenseDriver1 input[data-tx='firstName']").val('hello');



                }
                loading(false);

            });


        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

    } else {
        alert('incorrect file type, please upload a JPG, JPEG, or PNG image.')
    }

});


//Driver 2
$("#img-input2").change(function () {

    loading(true);
    var preview = document.getElementById('img2');

    $('#img-results2').html('')
    $('#img-loader2').removeClass('gone')

    var file = document.getElementById('img-input2').files[0];
    var isSuccess = checkImageType(file);
    var reader = new FileReader();

    if (isSuccess) {
        reader.addEventListener("load", function () {
            preview.src = reader.result;
            preview.style.display = 'inline'
            preview.style.height = '100%';

            var form = new FormData($('#form2')[0]);

            $.ajax({
                url: '/local-api/image/driver2',
                type: 'POST',
                data: form,
                cache: false,
                processData: false,
                contentType: false,
            }).done(function (response) {
                $('#error').html('')

                if (response.hasOwnProperty('error')) {
                    $('#error').html(response['error'])
                    console.log(response['error']);
                }
                else {
                    console.log(response);

                        //alert("cheked the button - worked");
                        document.getElementById('registerForm').style.display= 'block' ;
                        document.getElementById('card2').style.display= 'none' ;

                        changeValuesOfForm(response);



                }
                loading(false);

            });


        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

    } else {
        alert('incorrect file type, please upload a JPG, JPEG, or PNG image.')
    }

});

$("#img-input3").change(function () {

    loading(true);
    var preview = document.getElementById('img3');

    $('#img-results3').html('')
    $('#img-loader3').removeClass('gone')

    var file = document.getElementById('img-input3').files[0];
    var isSuccess = checkImageType(file);
    var reader = new FileReader();

    if (isSuccess) {
        reader.addEventListener("load", function () {
            preview.src = reader.result;
            preview.style.display = 'inline'
            preview.style.height = '100%';

            var form = new FormData($('#form3')[0]);

            $.ajax({
                url: '/local-api/image/carLicense',
                type: 'POST',
                data: form,
                cache: false,
                processData: false,
                contentType: false,
            }).done(function (response) {
                $('#error').html('')

                if (response.hasOwnProperty('error')) {
                    $('#error').html(response['error'])
                    console.log(response['error']);
                }
                else {
                    console.log(response);

                        //alert("cheked the button - worked");
                        document.getElementById('registerForm').style.display= 'block' ;
                        document.getElementById('card3').style.display= 'none' ;

                        changeValuesOfForm(response);



                }
                loading(false);

            });


        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

    } else {
        alert('incorrect file type, please upload a JPG, JPEG, or PNG image.')
    }

});


function changeValuesOfForm(jsonCredentials) {

   credentials = jsonCredentials.response

   for (const [key, value] of Object.entries(credentials)) {
    if(credentials.driver == 1) {
 if ( document.getElementById("licenseDriver1").getElementsByClassName(key)[0]) {
    if(document.getElementById("licenseDriver1").getElementsByClassName(key)[0].type == "checkbox") {
         document.getElementById("licenseDriver1").getElementsByClassName(key)[0].checked = true
         }
   else {
             document.getElementById("licenseDriver1").getElementsByClassName(key)[0].value = value
        }


      console.log(key, value);
   }
   }
    else if(credentials.driver == 2) {
 if ( document.getElementById("licenseDriver2").getElementsByClassName(key)[0]) {

    if(document.getElementById("licenseDriver2").getElementsByClassName(key)[0].type == "checkbox") {

         document.getElementById("licenseDriver2").getElementsByClassName(key)[0].checked = true
        }
        else {
               document.getElementById("licenseDriver2").getElementsByClassName(key)[0].value = value
        }
      console.log(key, value);
     }
   }
}
//  console.log(credentials.firstName, 'jsonCredentials')
//  document.getElementById("firstName").value = "Johnny Bravo";
//  document.getElementById("lastName").value = credentials.lastName;
}

function checkImageType(file) {
    fileTypes = ['jpg', 'jpeg', 'png'];
    extension = file.name.split('.').pop().toLowerCase()
    return fileTypes.indexOf(extension) > -1;
}
