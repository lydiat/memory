var promos = {
  collection: [{
    flip_image: "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/11925768_181250018872634_124898465_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/11906086_1768861066674344_74652591_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-15/e15/11349296_881353111918538_118108599_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/s640x640/sh0.08/e35/c134.0.812.812/11910295_1013275262026345_1955334604_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/s640x640/sh0.08/e35/11820427_1634309096845157_117121373_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/11849131_1482465218744545_1226012745_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/11856825_1131354533544838_1493634655_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/c135.0.810.810/11849154_875756009183372_293486518_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11820563_522694227880344_981841763_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/1516849_1891380101087405_1147761746_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/11258087_1495960110716461_1435019243_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/sh0.08/e35/c135.0.810.810/11917829_1026548507397739_2115256904_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/11934712_985143428173358_823540373_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-15/s640x640/sh0.08/e35/c135.0.810.810/11370986_1621461564789301_141518153_n.jpg"
  }, {
    flip_image: "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/11881696_400341353509326_1492137201_n.jpg"
  }, {
    flip_image: "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/c0.135.1080.1080/11809938_1622894047975379_388227131_n.jpg"
  }]
};

var matchCount = 0;
var matchWatch = 0;
var correctMatchCount = 0;
var matchArr = new Array;
var size = 200;
var cardStartCount = 2;

function arrangeCards(num, size) {
  var contWidth = num * size + 60;
  $('#container').width(contWidth);
  var memoryArr = shuffleCards(promos.collection);
  var memoryArr = promos.collection.slice(0, num);
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
          if($(this).hasClass('flipped')){
            console.log('already flipped');
          } else {
             TweenLite.to($(this), 1.0, {
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
        }
      )};

      function setupCards(z) {
        $(z).find('.front').animate({
          opacity: 1
        }, 1500)
      };
    })
  });
}

function loadPhotos(){
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

function placeCards(){
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
      ], 1.0, {
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
  loadPhotos();

  /*$('.restart').click(function() {
    restartGame();
  });*/


  $('#container').css({
    'margin-top': ($(window).height() - $('#container').width()) / 2
  });

    $(window).resize(function() {
    placeCards();
});



});