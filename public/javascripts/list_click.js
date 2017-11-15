$(document).ready(function() {
    $("ul.list-group").not(".keyword_list").each(function() {
        $(this).find("li").click(function() {
            console.log($(this).attr("href").trim());
            location.href = $(this).attr("href").trim();
        });
    });
});