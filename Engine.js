"use strict";
//tree js
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.TreeModel=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var mergeSort,findInsertIndex;mergeSort=require("mergesort");findInsertIndex=require("find-insert-index");module.exports=function(){"use strict";var walkStrategies;walkStrategies={};function TreeModel(config){config=config||{};this.config=config;this.config.childrenPropertyName=config.childrenPropertyName||"children";this.config.modelComparatorFn=config.modelComparatorFn}TreeModel.prototype.parse=function(model){var i,childCount,node;if(!(model instanceof Object)){throw new TypeError("Model must be of type object.")}node=new Node(this.config,model);if(model[this.config.childrenPropertyName]instanceof Array){if(this.config.modelComparatorFn){model[this.config.childrenPropertyName]=mergeSort(this.config.modelComparatorFn,model[this.config.childrenPropertyName])}for(i=0,childCount=model[this.config.childrenPropertyName].length;i<childCount;i++){_addChildToNode(node,this.parse(model[this.config.childrenPropertyName][i]))}}return node};function _addChildToNode(node,child){child.parent=node;node.children.push(child);return child}function Node(config,model){this.config=config;this.model=model;this.children=[]}Node.prototype.isRoot=function(){return this.parent===undefined};Node.prototype.hasChildren=function(){return this.children.length>0};Node.prototype.addChild=function(child){var index;if(!(child instanceof Node)){throw new TypeError("Child must be of type Node.")}child.parent=this;if(!(this.model[this.config.childrenPropertyName]instanceof Array)){this.model[this.config.childrenPropertyName]=[]}if(this.config.modelComparatorFn){index=findInsertIndex(this.config.modelComparatorFn,this.model[this.config.childrenPropertyName],child.model);this.model[this.config.childrenPropertyName].splice(index,0,child.model);this.children.splice(index,0,child)}else{this.model[this.config.childrenPropertyName].push(child.model);this.children.push(child)}return child};Node.prototype.getPath=function(){var path=[];(function addToPath(node){path.unshift(node);if(!node.isRoot()){addToPath(node.parent)}})(this);return path};function parseArgs(){var args={};if(arguments.length===1){args.fn=arguments[0]}else if(arguments.length===2){if(typeof arguments[0]==="function"){args.fn=arguments[0];args.ctx=arguments[1]}else{args.options=arguments[0];args.fn=arguments[1]}}else{args.options=arguments[0];args.fn=arguments[1];args.ctx=arguments[2]}args.options=args.options||{};if(!args.options.strategy){args.options.strategy="pre"}if(!walkStrategies[args.options.strategy]){throw new Error("Unknown tree walk strategy. Valid strategies are 'pre' [default], 'post' and 'breadth'.")}return args}Node.prototype.walk=function(){var args;args=parseArgs.apply(this,arguments);walkStrategies[args.options.strategy].call(this,args.fn,args.ctx)};walkStrategies.pre=function depthFirstPreOrder(callback,context){var i,childCount,keepGoing;keepGoing=callback.call(context,this);for(i=0,childCount=this.children.length;i<childCount;i++){if(keepGoing===false){return false}keepGoing=depthFirstPreOrder.call(this.children[i],callback,context)}return keepGoing};walkStrategies.post=function depthFirstPostOrder(callback,context){var i,childCount,keepGoing;for(i=0,childCount=this.children.length;i<childCount;i++){keepGoing=depthFirstPostOrder.call(this.children[i],callback,context);if(keepGoing===false){return false}}keepGoing=callback.call(context,this);return keepGoing};walkStrategies.breadth=function breadthFirst(callback,context){var queue=[this];(function processQueue(){var i,childCount,node;if(queue.length===0){return}node=queue.shift();for(i=0,childCount=node.children.length;i<childCount;i++){queue.push(node.children[i])}if(callback.call(context,node)!==false){processQueue()}})()};Node.prototype.all=function(){var args,all=[];args=parseArgs.apply(this,arguments);walkStrategies[args.options.strategy].call(this,function(node){if(args.fn.call(args.ctx,node)){all.push(node)}},args.ctx);return all};Node.prototype.first=function(){var args,first;args=parseArgs.apply(this,arguments);walkStrategies[args.options.strategy].call(this,function(node){if(args.fn.call(args.ctx,node)){first=node;return false}},args.ctx);return first};Node.prototype.drop=function(){var indexOfChild;if(!this.isRoot()){indexOfChild=this.parent.children.indexOf(this);this.parent.children.splice(indexOfChild,1);this.parent.model[this.config.childrenPropertyName].splice(indexOfChild,1);this.parent=undefined;delete this.parent}return this};return TreeModel}()},{"find-insert-index":2,mergesort:3}],2:[function(require,module,exports){module.exports=function(){"use strict";function findInsertIndex(comparatorFn,arr,el){var i,len;for(i=0,len=arr.length;i<len;i++){if(comparatorFn(arr[i],el)>0){break}}return i}return findInsertIndex}()},{}],3:[function(require,module,exports){module.exports=function(){"use strict";function mergeSort(comparatorFn,arr){var len=arr.length,firstHalf,secondHalf;if(len>=2){firstHalf=arr.slice(0,len/2);secondHalf=arr.slice(len/2,len);return merge(comparatorFn,mergeSort(comparatorFn,firstHalf),mergeSort(comparatorFn,secondHalf))}else{return arr.slice()}}function merge(comparatorFn,arr1,arr2){var result=[],left1=arr1.length,left2=arr2.length;while(left1>0&&left2>0){if(comparatorFn(arr1[0],arr2[0])<=0){result.push(arr1.shift());left1--}else{result.push(arr2.shift());left2--}}if(left1>0){result.push.apply(result,arr1)}else{result.push.apply(result,arr2)}return result}return mergeSort}()},{}]},{},[1])(1)});
// IMplement own libary? need own libary to grab search internals.

window.onload = init;
var canvas,
 	canvas2d,
 	tile_height,
	tile_width,
	info_area, // NEED TO MAKE AREA FOR information
	white_turn,
	root;
var tree = new TreeModel();

function init () {
	canvas = document.getElementById("myCanvas");
	canvas2d = canvas.getContext("2d");
	white_turn = true;	

    buildboard();
    root = tree.parse({data: new delta_array(true,0,[0,0],-10000000)});
	//canvas2d.clearRect ( 0 , 0 , canvas.width, canvas.height );
	window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
	canvas.addEventListener('click', interaction, false);
	resizeCanvas(); //draws all
}

//AI ////////
/**
 * @constructor
 */
function piece(type,x,y){
	this.type = type;
	this.position = [x,y]; // 0 to 7 
}

function delta_array(side,index,position,movescore){
	this.side = side;
	this.index = index;
	this.position = position;
	this.movescore = movescore;
}
// make base board root
// 0,0 is bottom left corner
var BaseBoard = {
	// now im doing delta changes, make the board a local var?
	//for legal move detection ?only updated when board is synced to pieces
	whitepieces : [],
	blackpieces : []				 //better for iteration
};


//put in turn function
function sync_board(whitearray,blackarray){ // 0 nothing 1- white 2-black
	var i,boardarray = new Array(64);
	for(i =0; i <64;i++) //zero board
	boardarray[i] =0;
	for(i = 0 ; i<whitearray.length;++i){ //set white
		boardarray[whitearray[i].position[0] + whitearray[i].position[1] * 8] = 1;
	}
	for(i = 0 ; i<blackarray.length;++i){ //set black 
		boardarray[blackarray[i].position[0] + blackarray[i].position[1] * 8] = 2;
	}
	return boardarray;
}

function buildboard(){
	var i;
	for(i = 0; i < 8; i++)
	{
		BaseBoard.whitepieces.push( new piece('Pawn',i,1)); 	// setup white pawns
		BaseBoard.blackpieces.push( new piece('Pawn',i,6));	// setup black pawns
	}

	BaseBoard.whitepieces.push( new piece('Rook',0,0), new piece('Rook',7,0)); 			// setup white Rook
	BaseBoard.blackpieces.push(	new piece('Rook',0,7), new piece('Rook',7,7));		// setup black rook
	BaseBoard.whitepieces.push( new piece('Bishop',2,0), new piece('Bishop',5,0)); 		// setup white Bishop
	BaseBoard.blackpieces.push(	new piece('Bishop',2,7), new piece('Bishop',5,7));	// setup black Bishop
	BaseBoard.whitepieces.push( new piece('Knight',1,0), new piece('Knight',6,0));		// setup  Knights
	BaseBoard.blackpieces.push(	new piece('Knight',1,7), new piece('Knight',6,7));
	BaseBoard.whitepieces.push( new piece('Queen',3,0));											// setup Queens
	BaseBoard.blackpieces.push(	new piece('Queen',3,7));
	BaseBoard.whitepieces.push( new piece('King',4,0));											// setup Kings
	BaseBoard.blackpieces.push(	new piece('King',4,7));
}


function is_legal_move(board,piece,side,indexcord){
	var array = legal_moves(piece,board,side);
	for(var i = 0; i < array.length;++i)
		if(indexcord[0] == array[i][0] && indexcord[1] == array[i][1] )
			return true;
	return false;
}
//  0 nothing 1- white 2-black
//side true = white
// could condense with loop inside loop
function legal_moves(piece,board,side){ //recursive for ray pieces?
	var enemy = side ? 2 : 1;
	var i,tile;
	var move_array = [];
	switch(piece.type){
		case "Pawn":
				var direction = side ? -1: 1; 
				if(board[indexcord2index(piece.position[0],piece.position[1]-direction)] === 0 )
					move_array.push([piece.position[0],piece.position[1]-direction]);
				if(board[indexcord2index(piece.position[0]-direction,piece.position[1]-direction)] === enemy)
					move_array.push([piece.position[0]-direction,piece.position[1]-direction]);
				if(board[indexcord2index(piece.position[0]+direction,piece.position[1]-direction)] === enemy)
					move_array.push([piece.position[0]+direction,piece.position[1]-direction]);
				if( side ? piece.position[1] == 1 : piece.position[1] ==  6) //home row so two moves
					if(board[indexcord2index(piece.position[0],piece.position[1]  - direction - direction)] === 0  )
						move_array.push([piece.position[0],piece.position[1]  - direction - direction]);
				break;

		case "Knight":

				tile = board[indexcord2index(piece.position[0] + 1,piece.position[1]+2)]; // L
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] +1 ,piece.position[1] +2]);

				tile = board[indexcord2index(piece.position[0] - 1,piece.position[1]+2)]; // backwards L
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] - 1 ,piece.position[1] +2]);

				tile = board[indexcord2index(piece.position[0] - 1,piece.position[1]-2)]; // upside-down backwards L
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] - 1 ,piece.position[1] -2]);

				tile = board[indexcord2index(piece.position[0] + 1,piece.position[1]-2)]; // upside-down L
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] + 1 ,piece.position[1] -2]);

				tile = board[indexcord2index(piece.position[0] + 2,piece.position[1]+1)]; 
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] +2 ,piece.position[1] +1]);

				tile = board[indexcord2index(piece.position[0] - 2,piece.position[1]+1)]; 
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] - 2 ,piece.position[1] +1]);

				tile = board[indexcord2index(piece.position[0] - 2,piece.position[1]-1)]; 
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] - 2 ,piece.position[1] -1]);

				tile = board[indexcord2index(piece.position[0] + 2,piece.position[1]-1)]; 
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] + 2 ,piece.position[1] -1]);
				break;
				
			case "Queen": // use rook and Bishop code
			case "Rook": //NOTE DO BOUND CHECKS IN FOR LOOP only x needs bounds check
				for(i =1; board[indexcord2index(piece.position[0] + i,piece.position[1])] === 0; ++i) //down check will stop on out of bounds
					move_array.push([piece.position[0] + i,piece.position[1]]);
				if(board[indexcord2index(piece.position[0] + i,piece.position[1])] === enemy) // once you hit something check if enemy piece
					move_array.push([piece.position[0] + i,piece.position[1]]);

				for(i =1; board[indexcord2index(piece.position[0] - i,piece.position[1])] === 0; ++i) //up
					move_array.push([piece.position[0] - i,piece.position[1]]);
				if(board[indexcord2index(piece.position[0] - i,piece.position[1])] === enemy)
					move_array.push([piece.position[0] - i,piece.position[1]]);

				for(i = 1; board[indexcord2index(piece.position[0] ,piece.position[1] + i)] === 0; ++i) //right
					move_array.push([piece.position[0] ,piece.position[1] + i]);
				if(board[indexcord2index(piece.position[0],piece.position[1] + i)] === enemy)
					move_array.push([piece.position[0],piece.position[1] + i]);

				for(i = 1; board[indexcord2index(piece.position[0] ,piece.position[1]- i)] === 0; ++i) //left
					move_array.push([piece.position[0] ,piece.position[1]- i]);
				if(board[indexcord2index(piece.position[0] ,piece.position[1] - i)] === enemy)
					move_array.push([piece.position[0] ,piece.position[1] - i]);
				
				if(piece.type == "Rook")
					break;
				//fall through to bishop code if it is a queen

		case "Bishop":
				for(i =1; board[indexcord2index(piece.position[0] + i,piece.position[1]+i)] === 0; ++i) //down right check will stop on out of bounds
					move_array.push([piece.position[0] + i,piece.position[1]+i]);
				if(board[indexcord2index(piece.position[0] + i,piece.position[1] + i)] === enemy) // once you hit something check if enemy piece
					move_array.push([piece.position[0] + i,piece.position[1] +i]);

				for(i =1; board[indexcord2index(piece.position[0] - i,piece.position[1] -i)] === 0; ++i) //up left
					move_array.push([piece.position[0] - i,piece.position[1]-i]);
				if(board[indexcord2index(piece.position[0] - i,piece.position[1]-i)] === enemy)
					move_array.push([piece.position[0] - i,piece.position[1]-i]);

				for(i = 1; board[indexcord2index(piece.position[0] - i ,piece.position[1] + i)] === 0; ++i) // down left
					move_array.push([piece.position[0] - i ,piece.position[1] + i]);
				if(board[indexcord2index(piece.position[0] - i,piece.position[1] + i)] === enemy)
					move_array.push([piece.position[0] - i,piece.position[1] + i]);

				for(i = 1; board[indexcord2index(piece.position[0] + i ,piece.position[1]- i)] === 0; ++i) // up right
					move_array.push([piece.position[0] + i ,piece.position[1]- i]);
				if(board[indexcord2index(piece.position[0] + i ,piece.position[1] - i)] === enemy)
					move_array.push([piece.position[0] + i ,piece.position[1] - i]); 
				break;
	

		case "King":
				tile = board[indexcord2index(piece.position[0],piece.position[1]+1)]; // down
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] ,piece.position[1] +1]);

				tile = board[indexcord2index(piece.position[0]+1,piece.position[1]+1)]; // down right
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] +1 ,piece.position[1] +1]);

				tile = board[indexcord2index(piece.position[0] +1,piece.position[1])]; // right
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] +1 ,piece.position[1]]);

				tile = board[indexcord2index(piece.position[0]+1,piece.position[1]-1)]; // up right
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] +1,piece.position[1] -1]);

				tile = board[indexcord2index(piece.position[0],piece.position[1]-1)]; // up
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0] ,piece.position[1]-1 ]);

				tile = board[indexcord2index(piece.position[0]-1,piece.position[1]-1)]; // up left
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0]-1 ,piece.position[1] -1]);

				tile = board[indexcord2index(piece.position[0]-1,piece.position[1])]; // left
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0]-1 ,piece.position[1]]);

				tile = board[indexcord2index(piece.position[0]-1,piece.position[1]+1)]; // down left
				if(tile === 0 || tile === enemy )
					move_array.push([piece.position[0]-1 ,piece.position[1] +1]);
				break;
	}
	return move_array;
}
//Basic 1 ply for now to test
// only white for now
function ai_move(){

	//root = tree.parse({data: new delta_array(true,0,[0,0],-10000000)});
	var board = sync_board(BaseBoard.whitepieces,BaseBoard.blackpieces);
		for(var j = 0 ; j < BaseBoard.blackpieces.length;++j) // for each piece
		{
			
			var piece_moves = legal_moves(BaseBoard.blackpieces[j],board,false); //for each move
			for(var k = 0 ; k < piece_moves.length;++k){
				var temp = JSON.parse(JSON.stringify(BaseBoard)); //HACKITY HACK HACKER
				do_move(temp,temp.blackpieces[j],piece_moves[k]);
				var tempscore = move_score(temp.whitepieces,temp.blackpieces)
				//delta tree
				var tempnode = tree.parse({data: new delta_array(false,j,piece_moves[k],tempscore)});
				root.addChild(tempnode);	
				
			}
		}
	// find highest node
	var chosen_node;
	root.walk(function(node){
				if(chosen_node === undefined){
					// will fail later if is root take out later
					if(! node.isRoot()){
						chosen_node = node;
					}
				}
				else if(node.model.data.movescore > chosen_node.model.data.movescore){
					chosen_node = node;
				} 
							});
// sanity check
	console.assert(!(chosen_node === undefined),"Something went wrong with node selection during ai move")
	
	root = chosen_node.drop();
	merge_node_to_base(root);
	


}

function ai_move_recersive(parent_board,parent_node,current_node,depth){
	// latter remeber a 
	if(depth == 5)
	{
		return;
	}
	var board = sync_board(parent_board.whitepieces,parent_board.blackpieces);
	


}

//rough add function for now
function move_score(whitearray,blackarray){
//template
// multiple threat extra score + would be same as one deeper search?
// should it take in a board value, or a list of pieces?

var whitescore = 0 ,blackscore = 0;
for(var i = 0; i < whitearray.length; ++i)
	whitescore += piece_score(whitearray[i]);
for( i = 0; i < blackarray.length; ++i)
	blackscore += piece_score(blackarray[i]);
return blackscore - whitescore; 
}

function piece_score(piece){
// piece value p =1, n = 3, b = 3 , r = 5 q = 9 k = 100
	switch(piece.type){
		case "Pawn":
			return 100;
		case "Rook":;
			return 500;
		case "Knight":
			return 300;
		case "Queen":
			return 900;
		case "Bishop":
			return 300;
		case "King":
			return 10000;
	}
}


// remake a "full" array again
function merge_node_to_base(delta_node){
	//grab base board
	if(delta_node.model.data.side)
		do_move(BaseBoard,BaseBoard.whitepieces[delta_node.model.data.index],delta_node.model.data.position);
	else
		do_move(BaseBoard,BaseBoard.blackpieces[delta_node.model.data.index],delta_node.model.data.position);

}

function delta_path_taken(){
	// prune search array of the moves we didnt take

}


function alpha_beta_prune(){
	
}
function do_move(boardobjct,piece,indexcord){
	var temp = get_piece(indexcord);
	if( temp != -1)
		delete_piece(boardobjct,temp[1],temp[2]);
	move_piece(piece,indexcord);
	
}

function move_piece(piece,cord){
	piece.position[0] = cord[0];
	piece.position[1] = cord[1];
	
}
// true = white
function delete_piece(boardobjct,side,index){ // need to change
	if(side){
		boardobjct.whitepieces[index] = boardobjct.whitepieces[boardobjct.whitepieces.length-1];
		boardobjct.whitepieces.pop();
	}
	else{
		boardobjct.blackpieces[index] = boardobjct.blackpieces[boardobjct.blackpieces.length-1];
		boardobjct.blackpieces.pop();
	}
}

//Interaction/////////

function interaction(event){
	var cursor = [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
	
	draw_all();
	player_move_piece(graphicalcord2indexcord(cursor));
	
	
}

//call twice 1st selection 2nd move whole over arching function
function player_move_piece(indexcord){
	var temp;
	var board = sync_board(BaseBoard.whitepieces,BaseBoard.blackpieces); // syncing too often but really doesnt matter
	if(player_move_piece.selected){
		if(is_legal_move(board,player_move_piece.selected[0],player_move_piece.selected[1],indexcord) && player_move_piece.selected[1] == true){
			do_move(BaseBoard,player_move_piece.selected[0],indexcord);			
			ai_move();
			draw_all();
		}
		else
			draw_select([indexcord[0] *tile_width, indexcord[1] * tile_height],"rgba(255, 102, 0, .5)");
			player_move_piece.selected = null;
	}
	else{
		draw_select([indexcord[0] *tile_width, indexcord[1] * tile_height],"rgba(0, 0, 255, .5)");
		temp = get_piece(indexcord);
		if(temp[0] == -1) //empty box
			return;
		draw_legal_moves_piece(board,indexcord);
		player_move_piece.selected = temp;
	}

}

//returns index and side (true = white) fail returns -1
function get_piece(indexcord){
	var i;
	for(i =0;i<BaseBoard.blackpieces.length;i++)
		if((BaseBoard.blackpieces[i].position[0] == indexcord[0]) && (BaseBoard.blackpieces[i].position[1] == indexcord[1]))
				return [BaseBoard.blackpieces[i],false,i];	

	for(i =0;i<BaseBoard.whitepieces.length;i++)
		if((BaseBoard.whitepieces[i].position[0] == indexcord[0]) && (BaseBoard.whitepieces[i].position[1] == indexcord[1]))
				return [ BaseBoard.whitepieces[i],true,i];
							
	return [-1];

}
//GRAPHICS///////
//needs sync
function draw_legal_moves_piece(board,indexcord){
	
	var piece = get_piece(indexcord) ;
	
	if(piece[0] === -1)
		return;

	draw_green_select( legal_moves(piece[0],board,piece[1]));
	
}

function draw_green_select(array){
	for( var j = 0; j < array.length; j++)
		draw_select([array[j][0] *tile_width, array[j][1] * tile_height] ,"rgba(0, 255, 0, .5)");

}

function resizeCanvas(){
	var fill = document.getElementById("fill");
	if(fill.checked)
		{	
			//small buffer
			canvas.width = window.innerWidth - 5;
    		canvas.height = window.innerHeight -5;
			tile_width = canvas.width/8;
			tile_height = canvas.height/8;
			
		}
		else{
			canvas.height = canvas.width = Math.min(window.innerWidth,window.innerHeight);
			tile_width = canvas.width/8;
			tile_height = canvas.height/8;
		}
	draw_all();
}

function draw_all(){
	canvas2d.clearRect ( 0 , 0 , canvas.width, canvas.height );
	draw_board();
	draw_pieces();
	canvas2d.fillText("score: " + move_score(BaseBoard.whitepieces,BaseBoard.blackpieces),tile_width * 2,tile_height * 3);


}


function draw_select(graphicalcord,colour){
	

	var grad = canvas2d.createRadialGradient(graphicalcord[0] + tile_width/2, 
											 graphicalcord[1] + tile_height/2,
											 7* (tile_height/24),
											 graphicalcord[0] + tile_width/2,
											 graphicalcord[1] + tile_height/2,
											 tile_height/2);
	grad.addColorStop(0,colour);
	grad.addColorStop(1,"rgba(0, 0, 0, 0)");
	canvas2d.fillStyle= grad;
	canvas2d.fillRect(graphicalcord[0],graphicalcord[1],tile_width,tile_height);
}

function draw_pieces(){
	var i,img,temp;
	for(i = 0; i < BaseBoard.whitepieces.length; i++){
		img = document.getElementById("w" + BaseBoard.whitepieces[i].type);
		 temp = [BaseBoard.whitepieces[i].position[0] * tile_width, BaseBoard.whitepieces[i].position[1] * tile_height];
		canvas2d.drawImage(img,temp[0],temp[1],tile_width,tile_height);
	}
	for(i = 0; i < BaseBoard.blackpieces.length; i++){
		img = document.getElementById("b" + BaseBoard.blackpieces[i].type);
		temp = [BaseBoard.blackpieces[i].position[0] * tile_width,BaseBoard.blackpieces[i].position[1] * tile_height];
		canvas2d.drawImage(img,temp[0],temp[1],tile_width,tile_height);
	}

}


function draw_board(){
	 canvas2d.fillStyle = "grey";  
	 var i,j;
	 for(j = 0; j < 8 ; j++){
	 	for(i =0;i < 4; i++){
	 		if(j % 2)
				canvas2d.fillRect(tile_width*i*2,tile_height*j,tile_width,tile_height);
			else
				canvas2d.fillRect(tile_width*i*2 +tile_width ,tile_height*j,tile_width,tile_height);
		}
	 }	
}

function change_orientation(){
	canvas2d.rotate(Math.PI);
}


	
//CORDINATE TRANSFORMS//////

function graphicalcord2index(graphicalcord){
	/*
	var tile_height = canvas.height/8;
	var tile_width = canvas.width/8;
	var index_x = Math.floor(x / tile_width);
	var index_y = Math.floor(y / tile_height);
	var index = index_y * 8 + index_x;
	alert("Cord: " +  x + "," + y + " is tilex: " + index_x +" is tiley: " + index_y +" is tile: " + index);
	*/
	return Math.floor(graphicalcord[0] / (tile_width)) + Math.floor(graphicalcord[1] / (tile_height)) *8;

}

function index2graphicalcord(index){
	return [(index %8 * tile_width),( Math.floor(index /8)  * tile_height)];

}

function graphicalcord2tilecord(position){
	return [tile_width* (Math.floor(position[0] / tile_width)),tile_height* (Math.floor(position[1] / tile_height))];
}

function graphicalcord2indexcord(position){
	return [ Math.floor(position[0] / tile_width), Math.floor(position[1] / tile_height)];
}

function indexcord2index(x,y){
	if(x < 0 || x > 7) //out of bounds
		return -1;
	return x + y *8;

}

//old code 
/*
dont care about speed till later idiot!!
function legal_moves_black(piece,board){ //recersive for ray pieces?

	var move_array = [];
	if(piece.type == "Pawn"){
			if(board[indexcord2index(piece.position[0],piece.position[1]-1)] == 0 ) //assume the piece is transformed so dont worry about extra end of board check
				move_array.push([piece.position[0],piece.position[1]-1]);
			if(board[indexcord2index(piece.position[0]-1,piece.position[1]-1)] == 1)
				move_array.push([piece.position[0]-1,piece.position[1]-1]);
			if(board[indexcord2index(piece.position[0]+1,piece.position[1]-1)] == 1)
				move_array.push([piece.position[0]+1,piece.position[1]-1]);	
	}
	else if(piece.type == "Rook"){ //NOTE DO BOUND CHECKS IN FOR LOOP
			var i;
			for(i =1; board[indexcord2index(piece.position[0] + i,piece.position[1])] == 0; ++i) //up
				move_array.push([piece.position[0] + i,piece.position[1]]);
			if(board[indexcord2index(piece.position[0] + i,piece.position[1])] == 1)
				move_array.push([piece.position[0] + i,piece.position[1]]);

			for(i =1; board[indexcord2index(piece.position[0] - i,piece.position[1])] == 0; ++i) //down
				move_array.push([piece.position[0] - i,piece.position[1]]);
			if(board[indexcord2index(piece.position[0] - i,piece.position[1])] == 1)
				move_array.push([piece.position[0] - i,piece.position[1]]);

			for(i = 1; board[indexcord2index(piece.position[0] ,piece.position[1] + i)] == 0; ++i) //left
				move_array.push([piece.position[0] ,piece.position[1] + i]);
			if(board[indexcord2index(piece.position[0],piece.position[1] + i)] == 1)
				move_array.push([piece.position[0],piece.position[1] + i]);

			for(i = 1; board[indexcord2index(piece.position[0] ,piece.position[1]- i)] == 0; ++i) //right
				move_array.push([piece.position[0] ,piece.position[1]- i]);
			if(board[indexcord2index(piece.position[0] ,piece.position[1] - i)] == 1)
				move_array.push([piece.position[0] ,piece.position[1] - i]);
	}
	else if(piece.type == "Knight"){
			
	}
	else if(piece.type == "Bishop"){
			
	}
	else if(piece.type == "Queen"){
			
	}
	else if(piece.type == "King"){
			
	}
	else{

		return false;
	}

	return move_array;
}



function move_piece(event){
	var cursor;
	if(move_piece.index)
	{	
		cursor = [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
		cursor= graphicalcord2indexcord(cursor);
		BaseBoard.pieces[move_piece.index].position[0] = cursor[0]/tile_width;
		BaseBoard.pieces[move_piece.index].position[1] = cursor[1]/tile_height;
		draw_all(); //draw move piece
		draw_select(cursor,"rgba(255, 0, 0, .5)");
		move_piece.index = null;
		
	}
	else{
		//either iterate accross squares or peieces
		cursor = [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
		draw_select(cursor,"rgba(255, 0, 0, .5)");
		cursor = graphicalcord2indexcord(cursor); //done this twice, optimise out
		var i;
		for(i =0;i<BaseBoard.whitepieces.length;i++)
			if((BaseBoard.pieces[i].position[0] == (cursor[0]/tile_width)) && (BaseBoard.pieces[i].position[1] == (cursor[1]/tile_height)))
			{   //lazy and may have rounding errors FIX
				move_piece.index = i;
				return;
			}
		move_piece.index = null;
	}
}


function merge_node_to_base(base, delta_path){
	//grab base board
	var temp = JSON.parse(JSON.stringify(base));
	for(var i = 0; i < delta_path.length; i++){
		if(delta_path[i].model.data.side)
		do_move(temp,temp.whitepieces[delta_path[i].model.data.index],delta_path[i].model.data.position);
		else
		do_move(temp,temp.blackpieces[delta_path[i].model.data.index],delta_path[i].model.data.position);

	}
	return temp;
}
*/ 