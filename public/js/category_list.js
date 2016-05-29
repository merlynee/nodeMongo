/**
 * Created by merlynee-liu on 16/5/29.
 */
$(function() {
    $('.del').click(function(e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)

        $.ajax({
            type: 'DELETE',
            url: '/movie/delete?id=' + id
        })
            .done(function(results) {
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove()
                    }
                }
            })
    })
})