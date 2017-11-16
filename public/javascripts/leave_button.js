$(document).ready(function() {
    $("#leave").click(function() {
        axios.delete('/leave').then(function (response) {
            console.log(response);
            $(location).attr('href', '/logout');
        }).catch(function (error) {
            console.log(error);
        });
    });
});