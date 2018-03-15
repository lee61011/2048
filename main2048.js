var board = new Array();
var score = 0;
var hasConflicted = new Array();    // 解决一个格子内重复累加的BUG

$(document).ready(function(){
   newgame();
});


function newgame(){
    // 初始化棋盘格
    init();
    // 在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
};

function init(){
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){

            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }

    for (var i=0; i<4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j=0; j<4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;    // 表示在初始情况下没有进行过碰撞
        };
    };

    updataBoardView();

    // 初始化分数
    score = 0;
};

function updataBoardView(){

    $(".number-cell").remove();
    for(var i =0; i<4; i++){
        for(var j=0; j<4; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $("#number-cell-"+i+"-"+j);

            if(board[i][j] == 0){
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                theNumberCell.css("top",getPosTop(i,j)+50);
                theNumberCell.css("left",getPosLeft(i,j)+50);
            } else {
                theNumberCell.css("width","100px");
                theNumberCell.css("height","100px");
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));  // 背景色
                theNumberCell.css("color",getNumberColor(board[i][j]));     //前景色
                theNumberCell.text(board[i][j]);
            };

            hasConflicted[i][j] = false;
        };
    };
};

/*随机生成数字函数*/
function generateOneNumber(){
    // 判断界面中还有没有空格子
    if( nospace(board) ){
        return false;
    };

    // 产生一个随机位置
    var randx = parseInt(Math.floor(Math.random() * 4));    // 一个随机的X坐标
    var randy = parseInt(Math.floor(Math.random() * 4));    // 一个随机的Y坐标
        // 判断这个随机位置是否可用
    var times = 0;          // 优化随机数生成算法
    while (times < 50) {
        if (board[randx][randy] == 0){      // 没有数字，说明位置可用
            break
        };
        // 重新生成位置
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times ++;
    };
    if (times == 50) {      /*如果50次之内没有生成可用的随机位置,那么人工生成随机位置*/
        for (var i=0; i<4; i++){
            for (var j=0; j<4; j++){
                if(board[i][j] == 0){       // 说明这是个空位置,那么让randx=i;randy=j
                    randx = i;
                    randy = j;
                };
            };
        };
    };

    // 产生一个随机数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);


    return true;
};

// 游戏循环
$(document).keydown(function(event){
    switch (event.keyCode){
        case 37:    // left
            if ( moveLeft() ){
                setTimeout("generateOneNumber()",210);  // 使用延时定时器优化动画效果
                setTimeout("isgameover()",300);
            };
            break;
        case 38:    // up
            if ( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };
            break;
        case 39:    // right
            if ( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };
            break;
        case 40:    // down
            if ( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            };
            break;
        default:    // default
            break;
    };
});

function isgameover(){
    if(nospace(board) && nomove(board)) {
        gameover();
    };
};

function gameover(){
    /* 优化 Game Over 显示效果 */
    var sure = document.getElementById('sure');
    var modal = document.getElementById('modal');

    modal.style.display = "block";
    sure.addEventListener('click', function(){
        modal.style.display = "none";
    });
};

function moveLeft (){
    // 先判断是否可以移动
    if( !canMoveLeft(board) ){

        return false;
    };

    // moveleft
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            if(board[i][j] != 0){

                /*
                * board[i][k] 为该元素左侧的元素
                * noBlockHorizontal(i,j,k,board) 函数为判断该元素与左侧的 board[i][k] 元素之间有没有障碍物
                * */
                for(var k=0; k<j; k++){
                    if( board[i][k] == 0 && noBlockHorizontal(i,j,k,board) ){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if( board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k] ){
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k] += board[i][j];     // 两个相同的元素合并后会增加分数
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    };
                }
            };
        };
    };

    setTimeout("updataBoardView()",200);
    return true;
};
function moveRight (){
    // 先判断是否可以移动
    if( !canMoveRight(board) ){

        return false;
    };

    // moveRight
    for(var i=0; i<4; i++){
        for(var j=2; j>=0; j--){
            if(board[i][j] != 0){

                /*
                * board[i][k] 为该元素左侧的元素
                * noBlockHorizontal(i,j,k,board) 函数为判断该元素与左侧的 board[i][k] 元素之间有没有障碍物
                * */
                for(var k=3; k>j; k--){
                    if( board[i][k] == 0 && noBlockHorizontal(i,j,k,board) ){
                        // move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if( board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k] ){
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    };
                }
            };
        };
    };

    setTimeout("updataBoardView()",200);
    return true;
};

function moveUp (){
    // 先判断是否可以移动
    if( !canMoveUp(board) ){

        return false;
    };

    // moveUp
    for(var j=0; j<4; j++){
        for(var i=1; i<4; i++){
            if(board[i][j] != 0){

                /*
                * board[i][k] 为该元素左侧的元素
                * noBlockHorizontal(i,j,k,board) 函数为判断该元素与左侧的 board[i][k] 元素之间有没有障碍物
                * */
                for(var k=0; k<i; k++){
                    if( board[k][j] == 0 && noBlockVertical(j,k,i,board) ){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if( board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j] ){
                        // move
                        showMoveAnimation(i,j,k,j);
                        // add
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        // add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    };
                }
            };
        };
    };

    setTimeout("updataBoardView()",200);
    return true;
};
function moveDown(){
    if( !canMoveDown(board) ){
        return false;
    };
    // moveDown
    for (var j=0; j<4; j++){
        for (var i=2; i>=0; i--){
            if(board[i][j] != 0){
                for (var k=3; k>i; k--){
                    if( board[k][j] == 0 && noBlockVertical(j,i,k,board) ){
                        // move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    } else if( board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j] ){
                        // move
                        showMoveAnimation(i,j,k,j);
                        // add
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        // add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    };
                };
            };
        };
    };
    setTimeout("updataBoardView()",200);
    return true;
};