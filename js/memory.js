var matchCount = 0;
var matchWatch = 0;
var correctMatchCount = 0;
var matchArr = new Array;
var size = 200;
var cardStartCount = 2;
var promos;
var speed = 0.5;

function arrangeCards(num, size) {
    var jqxhr = $.getJSON("json/images.json", function() {
            // console.log( "success" );
        })
        .fail(function() {
            console.log("error");
        });

    // Set another completion function for the request above
    jqxhr.complete(function() {
        promos = jqxhr.responseJSON.images;
        arrangeLoadedCards(num, size, promos);
    });
}

function arrangeLoadedCards(num, size, promos) {

    var contWidth = num * size + 60;
    $('#container').width(contWidth);
    var memoryArr = shuffleCards(promos);
    var memoryArr = promos.slice(0, num);
    var memoryArrDupe = memoryArr.concat(memoryArr);
    var memoryArrDupe = shuffleCards(memoryArrDupe);
    $('#container').empty();

    $.each(memoryArrDupe, function(id) {
        var htmlelem = "";
        thiselem = $(this)[0];
        htmlelem += "<div style='height:" + size + "px;width:" + size + "px' id='img" + id + "' class='cardWrapper''>";
        htmlelem += "<div class='card'>";
        htmlelem += "<div class='cardFace front original_image'></div>";
        htmlelem += "<div class='cardFace back flip_image'><img  style='height:" + size + "px;width:" + size + "px' src='" + thiselem.flip_image + "'/></div>";
        htmlelem += "</div>";
        htmlelem += "</div>";
        $(htmlelem).appendTo('#container').each(function(html, elem) {

            var x = $(elem).find('.card');
            TweenLite.to($(x), 0, {
                rotationY: 180,
                ease: Back.easeOut,
                onComplete: spinCards($(x))
            });

            function spinCards(elem) {
                var number = (Math.random() * (2) + 1).toFixed(1);
                TweenLite.to($(elem), 0, {
                    rotationY: number,
                    ease: Expo.easeOut,
                    delay: 0.1,
                    onComplete: setupCards(elem)
                });

                $(elem).on('click', function(elem) {
                    if ($(this).hasClass('flipped')) {
                        console.log('already flipped');
                    } else {
                        TweenLite.to($(this), speed, {
                            rotationY: -180,
                            ease: Back.easeOut
                        });
                        $(this).addClass('flipped');
                        var imgElem = $(this).find('.back img');
                        imgElem.show();
                        matchCount++;
                        matchArr[matchCount] = imgElem;
                        if (matchCount == 2) {
                            noteMatch(matchArr);
                        }
                    };
                })
            };

            function setupCards(z) {
                $(z).find('.front').animate({
                    opacity: 1
                }, 1500);
                loadPhotos();
                $('#container').css({
                    'margin-top': ($(window).height() - $('#container').width()) / 2
                });
                $(window).resize(function() {
                    placeCards();
                });

            };
        })
    });
}

function loadPhotos() {
    // Tweenlite animation for loading and spinning photos
    TweenLite.set(".cardWrapper", {
        perspective: 800
    });
    TweenLite.set(".card", {
        transformStyle: "preserve-3d"
    });
    TweenLite.set(".back", {
        rotationY: -180
    });
    TweenLite.set([".back", ".front"], {
        backfaceVisibility: "hidden"
    });
}

function shuffleCards(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function restartGame() {
    $('#leaderboard .matchcount').html('<span class="matchFade">◕◡◕</span>');
    $('#leaderboard .score').html('0');
    matchCount, matchWatch = 0;
    arrangeCards(cardStartCount, size);
}

function placeCards() {
    $('#container').css({
        'margin-top': ($(window).height() - $('#container').width()) / 2
    });
}

function noteMatch(matchArr) {
    matchWatch++;
    var tally = $('#leaderboard .matchcount');
    if ($(matchArr[1][0]).attr('src') == $(matchArr[2][0]).attr('src')) {
        correctMatchCount++;
        tally.html('<span class="matchFade">＾-＾</span>');
    } else {
        tally.html('<span class="matchFade">˘_˘٥</span>');
        $(matchArr[1]).parents('.card').removeClass('flipped');
        $(matchArr[2]).parents('.card').removeClass('flipped');
        setTimeout(function() {
            TweenLite.to([
                $(matchArr[1]).parents('.card'),
                $(matchArr[2]).parents('.card')
            ], speed, {
                rotationY: -360,
                ease: Back.easeOut,
            });
        }, 1500);
    }

    $('#leaderboard .score').html(matchWatch);
    if (cardStartCount == correctMatchCount) {
        tally.html('<span class="matchFade">^▽^</span>');
        setTimeout(function() {
            $('#leaderboard .matchcount').html('<span class="matchFade">◕◡◕</span>');
            arrangeCards(3, size);
        }, 1500);

    }
    matchCount = 0;
}

$(document).ready(function() {

    arrangeCards(cardStartCount, size);



});