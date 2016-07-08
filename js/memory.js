var contWidth, photos, promos, thisCard, backgroundImg;

var matchCount = 0;
var correctMatchCount = 0;
var maxSize = 250;
var cardStartCount = 0;
var speed = 0.4;
var flipSpeed = 500;
var clicksAllowed = true;

var matchArr = [];
var memoryArr = [];
var memoryArrDupe = [];
var cardCountArray = [2, 6, 9, 12, 14];
var cardCountArrayCols = [2, 4, 6, 6, 7];
var cardCountArrayRows = [2, 3, 3, 4, 4];


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
        cardSizeCalc(cardStartCount, true);
    });
}
    
function cardSizeCalc(num, resize = false){

    numOfRows = cardCountArrayRows[num];
    numofColumns = cardCountArrayCols[num];

    cardHeight = Math.floor(($(window).height() - 100) / numOfRows) - 15;
    cardWidth = Math.floor(($(window).width() - 100)  / numofColumns) - 15;
    cardSize = Math.min(cardHeight, cardWidth, maxSize);

    contWidth = numofColumns * cardSize + (numofColumns * 20);
    $('#container').width(contWidth);
    if(resize === true){
       $('.cardWrapper, img').css({'height':cardSize, 'width':cardSize});
    } else {
       return cardSize;
    }
}

function arrangeLoadedCards(num, promos) {
 
    cardSize = cardSizeCalc(num);

    numOfCards = cardCountArray[num];

    // don't grab the same cards every time
    memoryArr = shuffleCards(promos);

    // select the cards necessary
    memoryArr = promos.slice(0, numOfCards);

    // duplicate the array so they can be matched
    memoryArrDupe = memoryArr.concat(memoryArr);

    //shuffle again
    memoryArrDupe = shuffleCards(memoryArrDupe);

    $('#container').empty();

    backgroundImg = Math.floor(Math.random() * 5);

    $.each(memoryArrDupe, function(id) {
        thiselem = $(this)[0];

        var htmlelem = $('#cardShell').clone();

        $(htmlelem).find('.cardWrapper, img').css({'height':cardSize, 'width':cardSize});
        $(htmlelem).find('.front').css({'background':'url(img/'+backgroundImg+'.png)'});
        $(htmlelem).find('img').attr('src',thiselem.flip_image);

        $(htmlelem).appendTo('#container').each(function(html, elem) {

            thisCard = $(elem).find('.card');

            TweenLite.to($(thisCard), 0, {
                rotationY: 0,
                onComplete: spinCards($(thisCard))
            });

            function spinCards(elem) {
                TweenLite.to($(elem), 0, {
                    delay: 0.01,
                    onComplete: loadPhotos()
                });
                cardClickHandler(elem);
            }
        });
    });
}

function cardClickHandler(elem){
    $(elem).on('click', function(elem) {
        elem.preventDefault();
        if (!$(this).hasClass('flipped') && clicksAllowed === true) {
            TweenLite.to($(this), speed, {
                rotationY: -180,
                ease: Back.easeOut,
                onComplete: processCard($(this))
            });
        }
    });
}

function processCard(elem){
    $(elem).addClass('flipped');
    var imgElem = $(elem).find('.back img');
    matchCount++;
    matchArr[matchCount] = imgElem;
    if (matchCount === 2) {
      clicksAllowed = false;
      noteMatch(matchArr);
    }
}

function loadPhotos() {
    TweenLite.set(".back", {
        rotationY: -180,
        onComplete:function(){
            $('.back').css('opacity','1');
        }
    });
}

function shuffleCards(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function noteMatch(matchArr) {
    if ($(matchArr[1][0]).attr('src') === $(matchArr[2][0]).attr('src')) {
        correctMatchCount++;
        clicksAllowed = true;
        console.log(correctMatchCount + " match");
    } else {
        console.log('no match');
        $(matchArr[1]).parents('.card').removeClass('flipped');
        $(matchArr[2]).parents('.card').removeClass('flipped');
        setTimeout(function() {
            TweenLite.to([
                $(matchArr[1]).parents('.card'),
                $(matchArr[2]).parents('.card')
            ], speed, {
                rotationY: -360,
                ease: Back.easeOut,
                onComplete: function(){clicksAllowed = true;}
            });
        }, flipSpeed);
    }

    if (cardCountArray[cardStartCount] === correctMatchCount) {
      allMatched();
    }
    matchCount = 0;
}

function allMatched(){
    setTimeout(function() {
        correctMatchCount = 0;
        cardStartCount++;
        arrangeCards(cardStartCount);
    }, flipSpeed);
}

$(document).ready(function() {
    arrangeCards(cardStartCount);
});