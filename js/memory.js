var matchCount = 0;
var matchWatch = 0;
var correctMatchCount = 0;
var matchArr = [];
var cardStartCount = 1;
var size = 200;
var cardStartCount = 2;
var speed = 0.5;
var flipSpeed = 1000;

function arrangeCards(num, size) {
    var photos = $.getJSON("json/images2.json", function() {
            // console.log( "success" );
        })
        .fail(function() {
            console.log("error");
        })
        .complete(function() {
            var promos = photos.responseJSON.images;
            arrangeLoadedCards(num, size, promos);
    });
};

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
        htmlelem += "<div class='cardFace front original_image' style='background:url(img/"+cardStartCount+".png)'></div>";
        htmlelem += "<div class='cardFace back flip_image'>";
        htmlelem += "<img  style='height:" + size + "px;width:" + size + "px' src='" + thiselem.flip_image + "'/>";
        htmlelem += "</div></div></div>";
        $(htmlelem).appendTo('#container').each(function(html, elem) {

            var thisCard = $(elem).find('.card');

            TweenLite.to($(thisCard), 0, {
                rotationY: 0,
                onComplete: spinCards($(thisCard))
            });

            function spinCards(elem) {
                TweenLite.to($(elem), 0, {
                    rotationY: 0,
                    delay: 0.01,
                    onComplete: loadPhotos()
                });
                cardClickHandler(elem);
            };
        })
    });
}

function cardClickHandler(elem){
    $(elem).on('click', function(elem) {
        if (!$(this).hasClass('flipped')) {
            TweenLite.to($(this), speed, {
                rotationY: -180,
                ease: Back.easeOut
            });
            $(this).addClass('flipped');
            var imgElem = $(this).find('.back img');
            matchCount++;
            matchArr[matchCount] = imgElem;
            if (matchCount == 2) {
                noteMatch(matchArr);
            }
        };
    })
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
        rotationY: -180,
        onComplete:function(){
            $('.back').css('opacity','1');
        }
    });
    TweenLite.set([".back", ".front"], {
        backfaceVisibility: "hidden"
    });
}

function shuffleCards(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function noteMatch(matchArr) {
    matchWatch++;
    var tally = $('#leaderboard .matchcount');
    if ($(matchArr[1][0]).attr('src') == $(matchArr[2][0]).attr('src')) {
        correctMatchCount++;
    } else {
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
        }, flipSpeed);
    }

    $('#leaderboard .score').html(matchWatch);
    if (cardStartCount == correctMatchCount) {
      allMatched();
    }
    matchCount = 0;
}

function allMatched(){
    setTimeout(function() {
        correctMatchCount = 0;
        $('#leaderboard .roundcount').html(cardStartCount)
        cardStartCount++;
        arrangeCards(cardStartCount, size);
    }, flipSpeed);
}

$(document).ready(function() {

    arrangeCards(cardStartCount, size);

});