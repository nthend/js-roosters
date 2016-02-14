/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function vec2( x , y )
{
	this.x = x;
	this.y = y;
}
;
vec2.prototype.copyIn = function( a )
{
	this.x = a.x;
	this.y = a.y;
};
vec2.prototype.lperp = function()
{
	return new vec2( -this.y , this.x );
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