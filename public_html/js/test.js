/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var scene = function()
{
	this.object_list = [ ];
	this.drawScene = function()
	{
		for( var i = 0; i < this.object_list.length; i++ )
		{
			object_list[ i ].drawFunc();
		}
	};
	this.newObject = function( type , id , pos , drawFunc )
	{
		var out = { };
		out.type = type;
		out.id = id;
		out.pos = pos;
		out.drawFunc = drawFunc;
		scene.object_list[ scene.object_list.length ] = out;
		return out;
	};
	return this;
}();
function vec2( x , y )
{
	this.x = x;
	this.y = y;
};
vec2.prototype.add = function( a )
{
	return new vec2( this.x + a.x , this.y + a.y );
};
vec2.prototype.sub = function( a )
{
	return new vec2( this.x - a.x , this.y - a.y );
};
vec2.prototype.mul = function( a )
{
	return new vec2( this.x * a , this.y * a );
};
vec2.prototype.mod2 = function()
{
	return this.x * this.x + this.y * this.y;
};
vec2.prototype.mod = function()
{
	return Math.sqrt( this.mod2() );
};
vec2.prototype.norm = function()
{
	return this.mul( 1.0 / this.mod() );
};
var canvas;
var context;
var q;
var log;
window.onload = function()
{
	log = {
		elem: document.getElementById( "game_log" ) ,
		appendText: function( msg )
		{
			this.elem.innerHTML += "<div class='text'>" + msg + "</div>";
		}
	};
	canvas = document.getElementById( "main_canvas" );
	context = canvas.getContext( "2d" );
	q = quad( "quad" , new vec2( 10 , 10 ) );
	quad( "quad" , new vec2( 100 , 100 ) );
	log.appendText( "game loop started" );
	setTimeout( mainLoop , 0 );
};
var InputHandler = function()
{
	this._pressed = [ ];
	this.isDown = function( key_char )
	{
		return this._pressed[ key_char ];
	};
	this.onKeydown = function( event )
	{
		this._pressed[ String.fromCharCode( event.keyCode ) ] = true;
	};
	this.onKeyup = function( event )
	{
		delete this._pressed[ String.fromCharCode( event.keyCode ) ];
	};
	return this;
}();
window.addEventListener( 'keyup' , function( event )
{
	InputHandler.onKeyup( event );
} , false );
window.addEventListener( 'keydown' , function( event )
{
	InputHandler.onKeydown( event );
} , false );
var quad = function( id , pos )
{
	return scene.newObject( "quad" , id , pos , function()
	{
		var body_size = 10;
		var head_size = 4;
		context.fillStyle = "#000000";
		context.fillRect( this.pos.x - body_size / 2 , this.pos.y - body_size / 2 , body_size , body_size );
		context.fillRect( this.pos.x - head_size / 2 , this.pos.y - body_size / 2 - head_size , head_size , head_size );
	}
	);
};
var mainLoop = function()
{
	var dr = new vec2( 0 , 0 );
	if( InputHandler.isDown( "W" ) )
	{
		dr.y -= 1;
	}
	if( InputHandler.isDown( "S" ) )
	{
		dr.y += 1;
	}
	if( InputHandler.isDown( "A" ) )
	{
		dr.x -= 1;
	}
	if( InputHandler.isDown( "D" ) )
	{
		dr.x += 1;
	}
	if( dr.mod2() > 0 )
	{
		q.pos = q.pos.add( dr.norm().mul( 2.0 ) );
	}
	context.fillStyle = "#8ED6FF";
	context.fillRect( 0 , 0 , 512 , 512 );
	scene.drawScene();
	setTimeout( mainLoop , 20 );
};
