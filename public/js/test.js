/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var canvas;
var context;
var log;
var circle;
var scene;
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
	scene = new Scene( context );
	circle = regRooster( scene , new vec2( 200 , 100 ) , 30 );
	//circle.upd_frame = false;
	for( var i = 0; i < 40; i += 10 )
		for( var j = 0; j < 40; j += 10 )
		{
			regRooster( scene , new vec2( i , j ) , 20 );
		}
	scene.newObject( { } , function()
	{
		var p2 = getScreenPos( new vec2( 1000 , 10 ) );
		var p1 = getScreenPos( new vec2( -100 , 0 ) );
		context.fillStyle = "#906070";
		context.fillRect( p1.x , p1.y , p2.x - p1.x , p2.y - p1.y );
	}
	);
	scene.psolver.regObject( { pos: new vec2( 0 , 10 ) , n: new vec2( 0 , 1 ) , type: "plane" } , { dynamic: false } , null );
	scene.psolver.regObject( { pos: new vec2( canvas.width , 0 ) , n: new vec2( -1 , 0 ) , type: "plane" } , { dynamic: false } , null );
	scene.psolver.regObject( { pos: new vec2( 0 , 0 ) , n: new vec2( 1 , 0 ) , type: "plane" } , { dynamic: false } , null );
	scene.psolver.regObject( { pos: new vec2( 0 , canvas.height ) , n: new vec2( 0 , -1 ) , type: "plane" } , { dynamic: false } , null );
	log.appendText( "game loop started" );
	setTimeout( mainLoop , 0 );
};
var img;
var time , ltime;
var tryApplyForce = function( obj , f , dt )
{
	if( f.mod2() > 0 )
	{
		scene.psolver.applyForce( obj , new vec2( f.norm().x * 200 , 0 ) , dt );
		if( obj.collided )
			scene.psolver.applyForce( obj , new vec2( 0 , f.norm().y * 2000 ) , dt );
	}
};
var dt;
var timer = 0.1;
var timer1 = 0.1;
var mainLoop = function()
{
	ltime = time || 0;
	time = new Date().getTime();
	dt = ( time - ltime ) * 0.001;
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
	timer -= dt;
	timer1 -= dt;
	if( timer1 < 0.0 && dt < 0.1 )
	{
		timer1 = 0.01;
		var randobj = scene.object_list[ Math.floor( Math.random() * scene.object_list.length ) ];
		if( randobj.type === "rooster" && randobj !== circle )
			scene.psolver.applyForce( randobj.physic , new vec2( 0 , 3000.0 ) , dt );
	}
	window.addEventListener( 'keyup' , function( event )
	{
		if( timer < 0.0 )
		{
			timer = 0.003;
			if( event.keyCode === 87 )
			{
				scene.psolver.applyForce( circle.physic , new vec2( 0 , 1600.0 ) , dt );
				//circle.frame.x = ( circle.frame.x + 1 ) % 2;

			}
			if( event.keyCode === 32 )
			{
				regCircle( scene , new vec2( circle.pos.x , circle.pos.y - circle.r * 1.1 ) , circle.r * 0.1 );
				circle.r -= 0.1;
				circle.physic.r -= 0.1;
			}
		}
	} , false );
	if( dr.mod2() > 0 )
		scene.psolver.applyForce( circle.physic , new vec2( dr.norm().x * 200 , 0 ) , dt );
	//tryApplyForce( circle.physic , dr , dt );
	context.fillStyle = "#8ED6FF";
	context.fillRect( 0 , 0 , 512 , 512 );
	scene.drawScene( 0.03 );
	setTimeout( mainLoop , 20 );
};
