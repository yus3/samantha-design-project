(this["webpackJsonpsamantha-design"]=this["webpackJsonpsamantha-design"]||[]).push([[0],{33:function(t,e,n){t.exports=n(34)},34:function(t,e,n){"use strict";n.r(e);var a=n(31),i=n(29),s=n(11),h=n(32),r=n(17),c=n(18),o=n(6),l=n.n(o),u=n(30),g=n.n(u),d=(n(39),n(16)),f=n.n(d),m=n(7),y=300,C=20,p=100,w=50,k=500,v=function(){function t(e,n,a,i){var s=this;Object(r.a)(this,t),this.toString=function(){return"x: "+s.x+", y: "+s.y+", width: "+s.width+", height: "+s.height},this.x=e,this.y=n,this.width=a,this.height=i}return Object(c.a)(t,[{key:"isOffCanvas",value:function(){return this.x<0||this.y<0||this.y+this.height>y||this.x+this.width>y}},{key:"hasIntersection",value:function(t){return(t.x!==this.x||t.y!==this.y||t.width!==this.width||t.height!==this.height)&&!(t.x>this.x+this.width||t.x+t.width<this.x||t.y>this.y+this.height||t.y+t.height<this.y)}}]),t}(),R=function(t){function e(t){var n;return Object(r.a)(this,e),(n=Object(a.a)(this,Object(i.a)(e).call(this,t))).rectCalculateBoundingRectangle=function(t,e,n){var a=n*Math.PI/180,i=Math.sin(a),s=Math.cos(a);return n<=90?new v(t-i*p,e,i*p+s*C,s*p+i*C):new v(t-i*p+s*C,e+s*p,i*p-s*C,-s*p+i*C)},n.semiCircleCalculateBoundingRectangle=function(t,e,n){var a=n*Math.PI/180,i=Math.sin(a),s=Math.cos(a);return n<=90?new v(t-w,e-i*w,w+s*w,w+i*w):n<=180?new v(t-w,e-w,w-s*w,w+i*w):n<=270?new v(t+s*w,e-w,w-s*w,w-i*w):new v(t-s*w,e+i*w,w+s*w,w-i*w)},n.checkCollision=function(t){for(var e=0;e<n.state.boundingRectangles.length;e++)if(t.hasIntersection(n.state.boundingRectangles[e]))return!0;return!1},n.handleClick=function(){n.setState((function(t){var e,a,i=!1,s=t.shapes,h=t.boundingRectangles;if(t.shapes.length%8===0){for(var r=0;r<k;r++)if(e=[Math.random()*(y-C),Math.random()*(y-p),180*Math.random(),n.getRandomColor()],!(a=n.rectCalculateBoundingRectangle(e[0],e[1],e[2])).isOffCanvas()&&!n.checkCollision(a)){i=!0;break}}else for(var c=0;c<k;c++)if(e=[w+Math.random()*(y-w),w+Math.random()*(y-2*w),360*Math.random(),n.getRandomColor()],!(a=n.semiCircleCalculateBoundingRectangle(e[0],e[1],e[2])).isOffCanvas()&&!n.checkCollision(a)){i=!0;break}return i?(s=t.shapes.concat(e),h=t.boundingRectangles.concat(a)):(window.alert("Canvas Full"),window.location.reload()),{shapes:s,boundingRectangles:h}}))},n.state={shapes:[],boundingRectangles:[]},n.handleClick=n.handleClick.bind(Object(s.a)(n)),n}return Object(h.a)(e,t),Object(c.a)(e,[{key:"componentWillMount",value:function(){document.title="Art or Not"}},{key:"getRandomColor",value:function(){return f.a.Util.getRandomColor()}},{key:"getRectangle",value:function(t,e,n,a){return l.a.createElement(m.Rect,{x:t,y:e,width:C,height:p,fill:a,rotation:n})}},{key:"getSemiCircle",value:function(t,e,n,a){return l.a.createElement(m.Arc,{x:t,y:e,outerRadius:w,fill:a,angle:180,rotation:n})}},{key:"getBoundingRectangles",value:function(t,e,n,a){return l.a.createElement(m.Rect,{x:t,y:e,width:n,height:a,stroke:"green"})}},{key:"render",value:function(){for(var t=[],e=0;e<this.state.shapes.length;e+=4)e%8===0?t.push(this.getRectangle(this.state.shapes[e+0],this.state.shapes[e+1],this.state.shapes[e+2],this.state.shapes[e+3])):t.push(this.getSemiCircle(this.state.shapes[e+0],this.state.shapes[e+1],this.state.shapes[e+2],this.state.shapes[e+3]));return l.a.createElement("div",{className:"centered"},l.a.createElement(m.Stage,{width:y,height:y,onClick:this.handleClick},l.a.createElement(m.Layer,null,l.a.createElement(m.Rect,{x:0,y:0,width:y,height:y,stroke:"black"}),t)))}}]),e}(l.a.Component);g.a.render(l.a.createElement(R,null),document.getElementById("root"))},39:function(t,e,n){}},[[33,1,2]]]);
//# sourceMappingURL=main.a4ea253d.chunk.js.map