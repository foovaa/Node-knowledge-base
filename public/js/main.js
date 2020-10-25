$(document).ready(function() {
    // $("delete-post").click(function(event) {
    $('.delete-post').on('click', function(event) {
        $target  = $(event.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/posts/'+id+'/delete',
            success: function(response) {
                alert('Post deleting');
                window.location.href = '/';
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});