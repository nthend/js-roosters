/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var PhysicSolver = function()
{
	this.shape_list = [ ];
	this.regObject = function( shape , prop , update )
	{
		var out = shape;
		out.pos = out.pos || new vec2( 0 , 0 );
		out.vel = out.vel || new vec2( 0 , 0 );
		out.update = update;
		out.prop = prop;
		out.collided = false;
		out.id = this.shape_list.length;
		this.shape_list[ this.shape_list.length ] = out;
		return out;
	};
	this.applyForce = function( obj , f , dt )
	{
		obj.vel = obj.vel.add( f.mul( dt ) );
	};
	this.collide = function( o1 , o2 )
	{
		if( o1.type === "circle" && o2.type === "circle" )
		{
			var d2 = Math.pow( o1.r + o2.r , 2 );
			var dr = o2.pos.sub( o1.pos );
			var drm2 = dr.mod2();
			if( d2 > drm2 )
			{
				var drn = dr.norm();
				var k = 0.5;
				if( !o1.prop.dynamic || !o2.dynamic )
				{
					k = 1.0;
				}
				var dp = dr.sub( drn.mul( Math.sqrt( d2 ) ) ).mul( k );
				var dv1 = drn.mul( drn.dot( o1.vel ) );
				var dv2 = drn.mul( drn.dot( o2.vel ) );
				if( o1.prop.dynamic )
				{
					o1.pos = o1.pos.add( dp );
					o1.vel = o1.vel.sub( dv1 ).add( dv2 );
				}
				if( o2.prop.dynamic )
				{
					o2.pos = o2.pos.sub( dp );
					o2.vel = o2.vel.sub( dv2 ).add( dv1 );
				}
				o2.collided = true;
				o1.collided = true;
			}
			return;
		}
		if( o1.type === "circle" && o2.type === "plane" )
		{
			var to = o1;
			o1 = o2;
			o2 = to;
		}
		if( o1.type === "plane" && o2.type === "circle" )
		{
			var dp = o2.pos.sub( o1.pos );
			var dist = o1.n.dot( dp ) - o2.r;
			if( dist < 0 )
			{
				o2.pos = o2.pos.sub( o1.n.mul( dist ) );
				o2.vel = o2.vel.sub( o1.n.mul( o1.n.dot( o2.vel ) * 1.4 ) );
				var lp = o1.n.lperp();
				o2.vel = o2.vel.sub( lp.mul( lp.dot( o2.vel ) * 0.05 ) );
				o2.collided = true;
				o1.collided = true;
			}
			return;
		}
	};
	this.update = function( dt )
	{
		for( var i = 0; i < this.shape_list.length; i++ )
		{
			this.shape_list[ i ].collided = false;
			if( this.shape_list[ i ].prop.dynamic )
			{
				this.shape_list[ i ].vel = this.shape_list[ i ].vel.add( new vec2( 0 , -90 * dt ) );
				this.shape_list[ i ].pos = this.shape_list[ i ].pos.add( this.shape_list[ i ].vel.mul( dt ) );
			}
			for( var j = i + 1; j < this.shape_list.length; j++ )
			{
				this.collide( this.shape_list[ i ] , this.shape_list[ j ] );
			}
			if( this.shape_list[ i ].update )
				this.shape_list[ i ].update( dt );
		}
	};
	return this;
};
var Scene = function( context )
{
	this.context = context;
	this.object_list = [ ];
	this.psolver = new PhysicSolver();
	this.drawScene = function( dt )
	{
		this.psolver.update( dt );
		for( var i = 0; i < this.object_list.length; i++ )
		{
			this.object_list[ i ].drawFunc( this.context );
		}
	};
	this.newObject = function( template , drawFunc )
	{
		var out = template;
		out.id = this.object_list.length;
		out.drawFunc = drawFunc;
		this.object_list[ this.object_list.length ] = out;
		return out;
	};
	return this;
};
var InputHandler = ( function()
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
} )();
window.addEventListener( 'keyup' , function( event )
{
	InputHandler.onKeyup( event );
} , false );
window.addEventListener( 'keydown' , function( event )
{
	InputHandler.onKeydown( event );
} , false );
var regQuad = function( scene , position , s )
{
	var out = scene.newObject( { size: s , pos: position } , function( context )
	{
		var head_size = 4;
		var p = getScreenPos( this.pos );
		context.fillStyle = "#000000";
		context.fillRect( p.x - this.size / 2 , p.y - this.size , this.size , this.size );
		context.fillRect( p.x - head_size / 2 , p.y - this.size - head_size , head_size , head_size );
	}
	);
	return out;
};
var img;
var regRooster = function( scene , position , radius )
{
	if( !img )
	{
		img = new Sprite( "res/test.png" );
	}
	var out = scene.newObject( { type: "rooster" , r: radius , pos: position , frame: { x: 0 , y: 0 } , upd_frame: true } , function( context )
	{
		var p = getScreenPos( this.pos );
		img.drawNext( context , { x: p.x - this.r , y: p.y - this.r } , { w: this.r * 2 , h: this.r * 2 } , this.frame );
	}
	);
	out.physic = scene.psolver.regObject( { pos: out.pos , r: out.r , type: "circle" } , { dynamic: true } , function( dt )
	{
		if( !this.timer )
			this.timer = 0.04;
		this.timer -= dt;
		out.pos.copyIn( this.pos );
		if( out.upd_frame && this.timer < 0 )
		{
			if( Math.abs( this.vel.y ) > 5.5 )
			{
				out.frame.x = ( out.frame.x + 1 ) % 2;
			}
			this.timer = 0.04;
		}
	} );
	return out;
};
var regCircle = function( scene , position , radius )
{
	var out = scene.newObject( { type: "circle" , r: radius , pos: position } , function( context )
	{
		var p = getScreenPos( this.pos );
		context.fillStyle = "#000000";
		 context.beginPath();
		 context.arc( p.x , p.y , this.r , 0 , 2 * Math.PI , false );
		 context.fill();
	}
	);
	out.physic = scene.psolver.regObject( { pos: out.pos , r: out.r , type: "circle" } , { dynamic: true } , function( dt )
	{
		out.pos.copyIn( this.pos );
	} );
	return out;
};