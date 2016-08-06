var contWidth, photos, promos, thisCard, backgroundImg;

var matchCount = 0;
var correctCount = 0;
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

function setUpConnection() {

    var host = window.document.domain;
    var socket = io.connect(host + ':8080', {
        path: "/memory/socket.io"
    });

    console.log(socket);

    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('connection', function()

        socket.on('chat message', function(msg) {
            $('#messages').append($('<li>').text(msg));
        });

        arrangeCards(cardStartCount);

    }

    function arrangeCards(numCards) {
        photos = $.getJSON("json/images.json")
            .fail(function() {
                console.log("error");
            })
            .complete(function() {
                promos = photos.responseJSON.images;
                arrangeLoadedCards(numCards, promos);
            });

        $(window).resize(function() {
            cardSizeCalc(cardStartCount, true);
        });
    }

    // make sure cards fit page in an even block
    function cardSizeCalc(numCards, resize) {

        numOfRows = cardCountArrayRows[numCards];
        numofColumns = cardCountArrayCols[numCards];

        cardHeight = Math.floor(($(window).height() - 100) / numOfRows) - 15;
        cardWidth = Math.floor(($(window).width() - 100) / numofColumns) - 15;
        cardSize = Math.min(cardHeight, cardWidth, maxSize);

        contWidth = numofColumns * cardSize + (numofColumns * 20);
        $('#container').width(contWidth);
        if (resize === true) {
            $('#container .cardWrapper, #container img').css({ 'height': cardSize, 'width': cardSize });
        } else {
            return cardSize;
        }
    }

    // shuffle cards and display
    function arrangeLoadedCards(numCards, promos) {

        cardSize = cardSizeCalc(numCards);

        numOfCards = cardCountArray[numCards];

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

            var htmlelem = $('#cardShell').children().clone();

            $(htmlelem).css({ 'height': cardSize, 'width': cardSize });
            $(htmlelem).find('.front').css({ 'background': 'url(img/' + backgroundImg + '.png)' });
            $(htmlelem).find('img').attr('src', thiselem.flip_image);

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

    function loadPhotos() {
        TweenLite.set(".back", {
            rotationY: -180,
            onComplete: function() {
                $('.back').css('opacity', '1');
            }
        });
    }

    // on click, rotate and process
    function cardClickHandler(elem) {
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

    // note card identity and match if second click
    function processCard(elem) {
        $(elem).addClass('flipped');
        var imgElem = $(elem).find('.back img');
        matchCount++;
        matchArr[matchCount] = imgElem;
        if (matchCount === 2) {
            clicksAllowed = false;
            noteMatch(matchArr);
        }
    }

    // shamelessly stolen from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript/6274381#6274381
    function shuffleCards(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    // compare cards one and two and act appropriately
    function noteMatch(matchArr) {
        if ($(matchArr[1][0]).attr('src') === $(matchArr[2][0]).attr('src')) {
            correctCount++;
            clicksAllowed = true;
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
                    onComplete: function() { clicksAllowed = true; }
                });
            }, flipSpeed);
        }
        if (cardCountArray[cardStartCount] === correctCount) {
            allMatched();
        }
        matchCount = 0;
    }

    // restart the game at a higher level
    function allMatched() {
        setTimeout(function() {
            correctCount = 0;
            cardStartCount++;
            arrangeCards(cardStartCount);
        }, flipSpeed);
    }

    $(document).ready(function() {
        setUpConnection();
    });
