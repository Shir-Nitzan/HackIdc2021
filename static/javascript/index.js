$(document).ready(function () {
    console.log("ready!!");
    driverOneImageInputListener(1);
    driverOneImageInputListener(2);
    driverOneImageInputListener(3);
    driverOneImageInputListener(4);
    driverOneImageInputListener(5);


});

function _checkImageType(file) {
    fileTypes = ['jpg', 'jpeg', 'png'];
    extension = file.name.split('.').pop().toLowerCase()
    return fileTypes.indexOf(extension) > -1;
}


function changeValuesOfForm(jsonCredentials) {
credentials = jsonCredentials.response
    for (const [key, value] of Object.entries(credentials)) {
    if(credentials.driver == 1) {
 if ( document.getElementById("licenseDriver1").getElementsByClassName(key)[0]) {
 document.getElementById("licenseDriver1").getElementsByClassName(key)[0].value = value;
//    let example = '<div class="form-group"><label for="firstName-1">First Name</label><input type="email" class="form-control" data-tx="firstName" id="firstName-1"placeholder=""></div>'
//    $("#licenseDriver1").append(example)
//    $(`#licenseDriver1 input[class=${key}]`).val(value);
//      console.log(key, value);
       }

     }
          else if(credentials.driver == 3) {
 if ( document.getElementById("carInsurance").getElementsByClassName(key)[0]) {
 document.getElementById("carInsurance").getElementsByClassName(key)[0].value = value;
//    let example = '<div class="form-group"><label for="firstName-1">First Name</label><input type="email" class="form-control" data-tx="firstName" id="firstName-1"placeholder=""></div>'
//    $("#licenseDriver1").append(example)
//    $(`#licenseDriver1 input[class=${key}]`).val(value);
//      console.log(key, value);
       }

     }

     else if(credentials.driver == 4) {
 if ( document.getElementById("licenseDriver2").getElementsByClassName(key)[0]) {
 document.getElementById("licenseDriver2").getElementsByClassName(key)[0].value = value;
//    let example = '<div class="form-group"><label for="firstName-1">First Name</label><input type="email" class="form-control" data-tx="firstName" id="firstName-1"placeholder=""></div>'
//    $("#licenseDriver1").append(example)
//    $(`#licenseDriver1 input[class=${key}]`).val(value);
//      console.log(key, value);
       }

     }
          else if(credentials.driver == 2) {
 if ( document.getElementById("carLicense").getElementsByClassName(key)[0]) {
 document.getElementById("carLicense").getElementsByClassName(key)[0].value = value;
//    let example = '<div class="form-group"><label for="firstName-1">First Name</label><input type="email" class="form-control" data-tx="firstName" id="firstName-1"placeholder=""></div>'
//    $("#licenseDriver1").append(example)
//    $(`#licenseDriver1 input[class=${key}]`).val(value);
//      console.log(key, value);
       }

     }

    }



//  $("#licenseDriver1").append('<input type="email" class="form-control" data-tx="firstName" id="firstName-1" placeholder="">')





}
function driverOneImageInputListener(cardNum) {
$(`#img-input${cardNum}`).change(function () {

//    loading(true);
    var preview = document.getElementById(`img${cardNum}`);

    $(`#img-results${cardNum}`).html('')
    $(`#img-loader${cardNum}`).removeClass('gone')

    var file = document.getElementById(`img-input${cardNum}`).files[0];
    var isSuccess = _checkImageType(file);
    var reader = new FileReader();

    if (isSuccess) {
        reader.addEventListener("load", function () {
            preview.src = reader.result;
            preview.style.display = 'inline'

            var form = new FormData($(`#form${cardNum}`)[0]);

            $.ajax({
                url: `/local-api/image/driver${cardNum}`,
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
//                        document.getElementById(`card${cardNum}`).style.display= 'none' ;


                        changeValuesOfForm(response)



                }
//                loading(false);

            });


        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

    } else {
        alert('incorrect file type, please upload a JPG, JPEG, or PNG image.')
    }

});
}