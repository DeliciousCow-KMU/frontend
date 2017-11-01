$(document).ready(function() {
    function remove_keyword() {
        console.log($(this).attr("value"));
        $(this).parent().remove();
    }

    $(".add_keyword").click(function() {
        var keyword = $("#keyword_input").val();
        if (keyword.length > 0) {
            var delete_button = $('<button>').attr({
                value: -1,
                type: "button",
                class: "close remove_keyword"
            }).append($("<i>").attr("aria-hidden", "true").addClass("fa fa-trash-o")).click(remove_keyword);

            $(".keyword_list").append($("<li>").addClass('list-group-item d-flex justify-content-between align-items-center').text(keyword.trim()).append(delete_button));
            $("#keyword_input").val("");
        }
    });

    $("#keyword_input").keydown(function(e) {
        if (e.keyCode == 13)
            $(".add_keyword").click();
    });

    $(".remove_keyword").click(remove_keyword);
});