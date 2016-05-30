/**
 * Created by Administrator on 2016/5/30.
 */
$(function() {
    $('#douban').blur(function () {
        var douban = $(this)
        var id = douban.val()

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback',
                success: function (data) {
                    $('#inputTitle').val(data.title)
                    $('#inputCountry').val(data.countries[0])
                    // $('inputLanguage').val()
                    $('#inputYear').val(data.year)
                    $('#inputSummary').val(data.title)
                    $('#inputDoctor').val(data.directors[0].name)
                    $('#inputFlash').val()
                    $('#inputPoster').val(data.images.large)
                    $('#inputCategory').val(data.genres[0])

                }
            })
        }
    })
})