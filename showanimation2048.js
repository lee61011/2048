function showNumberWithAnimation(i,j,randNumber){

    var numberCell = $("#number-cell-"+i+"-"+j);

    numberCell.css("background-color",getNumberBackgroundColor(randNumber));
    numberCell.css("color",getNumberColor(randNumber));
    numberCell.text(randNumber);

    // 控制动画效果
    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i,j),
        left: getPosLeft(i,j),
    },50);
};


function showMoveAnimation( fromx,fromy,tox,toy ){
    var numberCell = $("#number-cell-"+ fromx + "-" + fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
};


/*
*   updateScore() 函数为累加分数后通知页面显示分数
* */
function updateScore(score){
    $("#score").text(score);
};