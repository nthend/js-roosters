/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 var physicSolver = function()
 {
	this.object_list = [ ];
	this.regObject = function( shape , prop , updFunc )
	{
		var out = shape;
		out.updFunc = updFunc;
		out.prop = prop;
		this.object_list[ this.object_list.length ] = out;
		return out;
	};
	this.collide = function( o1 , o2 )
	{
		if( o1.type == "circle" && o2.type == "circle" )
		{
			var d2 = o1.r * o1.r + o2.r * o2.r;
			if( d2 > o1.pos.dist2( o2.pos ) )
			{
				var dr = o2.pos.sub( o1.pos );
				var drn = dr.norm();
				var k = 0.5;
				if( !o1.prop.dynamic || !o2.dynamic )
				{
					k = 1.0;
				}
				var dp = dr.sub( drn.mul( Math.sqrt( d2 ) ) ).mul( k );
				if( o1.prop.dynamic )
					o1.pos = o1.pos.add( dp );
				if( o2.prop.dynamic )
					o2.pos = o2.pos.sub( dp );
			}
			return;
		}
		if( o1.type == "circle" && o2.type == "plane" )
		{
			var to = o1;
			o1 = o2;
			o2 = to;
		}
		if( o1.type == "plane" && o2.type == "circle" )
		{
			var dp = o2.pos.sub( o1.pos );
			var dist = o1.n.dot( dp ) - o2.r;
			if( dist < 0 )
			{
				o2.pos = o2.pos.sub( o1.n.mul( dist ) );
			}
			return;
		}
	};
	this.update = function( dt )
	{
		for( var i = 0; i < this.object_list.length; i++ )
		{
			for( var j = i + 1; j < this.object_list.length; j++ )
			{
				this.collide( this.object_list[ i ] , this.object_list[ j ] );
			}
		}
	}
	return this;
 }();
var scene = function()
{
	this.object_list = [ ];
	this.updateScene = function( dt )
	{
		for( var i = 0; i < this.object_list.length; i++ )
		{
			object_list[ i ].pos = object_list[ i ].pos.add( object_list[ i ].vel.mul( dt ) );
			object_list[ i ].vel = object_list[ i ].vel.add( new vec2( 0 , -dt * 10 ) );
			if( object_list[ i ].pos.y <= 0 )
			{
					object_list[ i ].pos.y = 0;
					object_list[ i ].vel.y = 0;
					object_list[ i ].vel.x *= 0.95;
			}
		}
	};
	this.drawScene = function( dt )
	{
		//physicSolver.update( dt );
		this.updateScene( dt );
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
		out.vel = new vec2( 0 , 0 );
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
	return this.dot( this );
};
vec2.prototype.dot = function( a )
{
	return this.x * a.x + this.y * a.y;
};
vec2.prototype.mod = function()
{
	return Math.sqrt( this.mod2() );
};
vec2.prototype.dist2 = function( a )
{
	return this.sub( a ).mod2();
};
vec2.prototype.norm = function()
{
	return this.mul( 1.0 / this.mod() );
};
var canvas;
var context;
var q;
var log;
var getScreenPos = function( p )
{
	return new vec2( p.x , canvas.height - p.y );
};
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
	circle( "circle" , new vec2( 100 , 100 ) );
	//physicSolver.regObject( { pos: new vec2( 0 , 0 ) , n: new vec2( 0 , 1 ) , type: "plane" } , { dynamic: false } , function(){} );
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
	this.size = 10;
	return scene.newObject( "quad" , id , pos , function()
	{
		var head_size = 4;
		var p = getScreenPos( this.pos );
		context.fillStyle = "#000000";
		context.fillRect( p.x - this.size / 2 , p.y - this.size , this.size , this.size );
		context.fillRect( p.x - this.size / 2 , p.y - this.size - head_size , head_size , head_size );
	}
	);
};
var circle = function( id , pos )
{
	this.r = 10;
	return scene.newObject( "circle" , id , pos , function()
	{
		var p = getScreenPos( this.pos );
		context.fillStyle = "#000000";
		context.beginPath();
		context.arc( p.x , p.y , this.r , 0 , 2 * Math.PI , false );
		context.fill();
		//log.appendText( p.x + " " + p.y + " " + r );
	}
	);
};
var mainLoop = function()
{
	var dr = new vec2( 0 , 0 );
	if( InputHandler.isDown( "W" ) )
	{
		dr.y += 1;
	}
	if( InputHandler.isDown( "S" ) )
	{
		dr.y -= 1;
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
		q.vel = q.vel.add( dr.norm().mul( 2.0 ) );
	}
	context.fillStyle = "#8ED6FF";
	context.fillRect( 0 , 0 , 512 , 512 );
	scene.drawScene( 0.03 );
	setTimeout( mainLoop , 20 );
};
