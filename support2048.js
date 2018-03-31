documentWidth = window.screen.availWidth;   //  获取当前设备屏幕中可以使用的宽度
gridContainerWidth = 0.92 * documentWidth;  //  左右边距宽度各为 4%
cellSideLength = 0.18 * documentWidth;      //  小格子宽度为 屏幕宽度的 18%
cellSpace = 0.04 * documentWidth;           //  小格子之间的间距为 4%


/*计算每个格子距离顶端的距离*/
function getPosTop(i,j){
    return cellSpace + i*(cellSpace + cellSideLength);
};

/*计算每个格子距离左边的距离*/
function getPosLeft(i,j){
    return cellSpace + j*(cellSpace + cellSideLength);
};

function getNumberBackgroundColor(number){
    switch (number) {
        case 2: return "#eee4da";break;
        case 4: return "#ede0c8";break;
        case 8: return "#f2b179";break;
        case 16: return "#f59563";break;
        case 32: return "#f67c5f";break;
        case 64: return "#f65e3b";break;
        case 128: return "#edcf72";break;
        case 256: return "#edcc61";break;
        case 512: return "#9c0";break;
        case 1024: return "#33b5e5";break;
        case 2048: return "#09c";break;
        case 4096: return "#a6c";break;
        case 8192: return "#93c";break;
    }

    return  "black";
};

function getNumberColor(number){
    if(number <= 4 ){
        return  "#776e65";
    }

    return "white";
};


/*判断界面中还有没有剩余空间*/
function nospace (board){
    for (var i=0; i<4; i++){
        for (var j=0; j<4; j++){
            if(board[i][j] == 0){
                // 说明还有剩余空间
                return false;
            };
        };
    };
    return true;
};


/*
* 判断canMoveLeft()
* 1.左边是否没有数字
* 2.左边数字是否和自己相等
* */
function canMoveLeft(board){
    for (var i=0; i<4; i++){
        for (var j=1; j<4; j++){
            if( board[i][j] != 0){
                if( board[i][j-1] == 0 || board[i][j-1] == board[i][j] ){   //左侧没有数字或者数字相等
                    return true;
                }
            };
        };
    };
    return false;
};
function canMoveRight(board){
    for (var i=0; i<4; i++){
        for (var j=2; j>=0; j--){
            if( board[i][j] != 0){
                if( board[i][j+1] == 0 || board[i][j+1] == board[i][j] ){   //右侧没有数字或者数字相等
                    return true;
                }
            };
        };
    };
    return false;
};

function canMoveUp(board){
    for (var j=0; j<4; j++){
        for (var i=1; i<4; i++){
            if( board[i][j] != 0){
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] ){   //左侧没有数字或者数字相等
                    return true;
                }
            };
        };
    };
    return false;
};
function canMoveDown(board){
    for (var j=0; j<4; j++){
        for (var i=2; i>=0; i--){
            if( board[i][j] != 0){
                if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] ){   //左侧没有数字或者数字相等
                    return true;
                }
            };
        };
    };
    return false;
};


/*
* noBlockHorizontal(i,j,k,board) 函数为判断该元素与左侧的 board[i][k] 元素之间有没有障碍物
* 判断左右移动
* */
function noBlockHorizontal (row,col1,col2,board){
    for(var i=col1 + 1; i<col2; i++ ){
        if( board[row][i] != 0 ){
            return false;
        };
    };
    return true;
};
/*
* 判断上下移动
* */
function noBlockVertical(col,row1,row2,board){
    for(var i=row1 + 1; i<row2; i++){
        if(board[i][col] != 0){
            return false;
        }
    };
    return true;
};

/*
* nomove(board) 表示上下左右操作时没有合并项
* */
function nomove(board) {
    if(canMoveLeft(board) ||
       canMoveRight(board) ||
       canMoveUp(board) ||
       canMoveDown(board)){
        return false;
    };
    return true;
};