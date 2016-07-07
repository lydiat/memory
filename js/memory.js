var matchCount = 0;
var matchWatch = 0;
var correctMatchCount = 0;
var matchArr = [];
var memoryArr = [];
var memoryArrDupe = [];
var maxSize = 250;
var cardStartCount = 0;
var speed = 0.5;
var flipSpeed = 1000;
var cardCountArray = [2, 6, 9, 12, 14];
var cardCountArrayCols = [2, 4, 6, 6, 7];
var cardCountArrayRows = [2, 3, 3, 4, 4];
var contWidth, photos, promos, thisCard, backgroundImg;


function arrangeCards(num) {
    photos = $.getJSON("json/images2.json")
        .fail(function() {
            console.log("error");
        })
        .complete(function() {
            promos = photos.responseJSON.images;
            arrangeLoadedCards(num, promos);
    });

    $( window ).resize(function() {
        cardSizeCalc(cardStartCount, true)
    });
}
    
function cardSizeCalc(num, resize = false){

    numOfRows = cardCountArrayRows[num];
    numofColumns = cardCountArrayCols[num];

    cardHeight = Math.floor(($(window).height() - 100) / numOfRows) - 15;
    cardWidth = Math.floor(($(window).width() - 100)  / numofColumns) - 15;

    cardSize = Math.min(cardHeight, cardWidth, maxSize);

    if(resize === true){
        $('.cardWrapper, img').css({'height':cardSize, 'width':cardSize})
    }

    contWidth = numofColumns * cardSize + (numofColumns * 20);
    $('#container').width(contWidth);
    return cardSize;
}

function arrangeLoadedCards(num, promos) {
 
    cardSize = cardSizeCalc(num);

    numOfCards = cardCountArray[num];

    memoryArr = shuffleCards(promos);
    memoryArr = promos.slice(0, numOfCards);
    memoryArrDupe = memoryArr.concat(memoryArr);
    memoryArrDupe = shuffleCards(memoryArrDupe);
    $('#container').empty();

    backgroundImg = Math.floor(Math.random() * 5);

    $.each(memoryArrDupe, function(id) {
        var htmlelem = "";
        thiselem = $(this)[0];
        htmlelem += "<div style='height:" + cardSize + "px;width:" + cardSize + "px' id='img" + id + "' class='cardWrapper''>";
        htmlelem += "<div class='card'>";
        htmlelem += "<div class='cardFace front original_image' style='background:url(img/"+backgroundImg+".png)'></div>";
        htmlelem += "<div class='cardFace back flip_image'>";
        htmlelem += "<img  style='height:" + cardSize + "px;width:" + cardSize + "px' src='" + thiselem.flip_image + "'/>";
        htmlelem += "</div></div></div>";
        $(htmlelem).appendTo('#container').each(function(html, elem) {

            thisCard = $(elem).find('.card');

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
            $('.front').fadeIn(1000);
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
    if (cardCountArray[cardStartCount] == correctMatchCount) {
      allMatched();
    }
    matchCount = 0;
}

function allMatched(){
    setTimeout(function() {
        correctMatchCount = 0;
        $('#leaderboard .roundcount').html(cardStartCount);
        cardStartCount++;
        arrangeCards(cardStartCount);
    }, flipSpeed);
}

$(document).ready(function() {
    arrangeCards(cardStartCount);
});