$(document).ready(function() {
    function remove_keyword() {
        const elem = $(this);
        var id = elem.find("i.fa").first().attr('id');
        console.log(id);
        $("#keyword_error").text('').css("display","none");
        axios.delete('/api/keyword/delete', {data : {
            id: id
        }}).then(function (response) {
            elem.parent().remove();
            console.log(response);
        }).catch(function (error) {
            console.log(error);
            $("#keyword_error").text('키워드 삭제 오류').css("display","block");
        });
    }

    $(".add_keyword").click(function() {
        $("#keyword_error").text('').css("display","none");
        var keyword = $("#keyword_input").val().trim();
        if (keyword.length > 0) {
            axios.post('/api/keyword/add', {
                keyword: keyword
            }).then(function (response) {
                var delete_button = $('<button>').attr({
                    id: response.data.data.insertId,
                    type: "button",
                    class: "close remove_keyword"
                }).append($("<i>").attr("aria-hidden", "true").addClass("fa fa-trash-o")).click(remove_keyword);
                $(".keyword_list").append($("<li>").addClass('list-group-item d-flex justify-content-between align-items-center').text(keyword).append(delete_button));
                $("#keyword_input").val("");
            }).catch(function (error) {
                console.log(error);
                $("#keyword_error").text('키워드 추가 오류').css("display","block");
            });
        }
    });

    $("#keyword_input").keydown(function(e) {
        if (e.keyCode == 13)
            $(".add_keyword").click();
    });

    $(".remove_keyword").click(remove_keyword);
});