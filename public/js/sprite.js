/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var scount = 0;
var Image = function( src )
{
	var img_c = document.getElementById( "image_container" );
	img_c.innerHTML += "<img id=\"img" + scount + "\" src=\"" + src + "\" >";
	this.img = document.getElementById( "img" + scount );
	
	var self = this;
	self.img.onload = function() {
		self.width = self.img.clientWidth;
		self.height = self.img.clientHeight;
	};

	scount++;
	this.draw = function( context , area )
	{
		context.drawImage( this.img , area.ofx , area.ofy , area.ofw , area.ofh , area.x , area.y , area.w , area.h );
	};
};
var Sprite = function( src )
{
	this.img = new Image( src );
	this.i = 0;
	this.drawNext = function( context , pos , size , frame )
	{
		var fx = this.img.width / 2 * frame.x;
		var fy = this.img.width / 2 * frame.y;
		this.img.draw( context , { x: pos.x , y: pos.y , w: size.w , h: size.h , ofx: fx , ofy: fy , ofw: this.img.width / 2 , ofh: this.img.height } );
	};
};
