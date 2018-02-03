//default units are cm

var format = d3.format(",.0f")
var scale = function(x){return 3*x} //gonna have to do some real scaling eventually

arc = function(){
  return d3.arc()(
    { 
      innerRadius: this.innerRadius, 
      outerRadius: this.outerRadius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
    })}

csa = function(){} //curved seam/hem allowances (top and bottom)
ssa = function(){} //straight seam allowances (sides)

var types = [
  {
    name: "Half circle", 
    layoutGenerator:function(skirt){
      r = skirt.waistMeasurement/Math.PI
      R = skirt.skirtLength + r
      skirt.r = r
      skirt.R = R
    
      angle = Math.PI
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth){ 
        return [
          {
            innerRadius: scale(r), 
            outerRadius: scale(R),
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            startAngle: Math.PI,
            endAngle:0, 
            x:scale(skirt.seamAllowance),
            y:scale(R+skirt.hemAllowance),
            path: arc,
            csa: csa,
            ssa: ssa
          }
        ]
      } else {
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 0,
            endAngle:Math.PI/2,
            x:scale(skirt.seamAllowance),
            y:scale(skirt.seamAllowance)
          },
          {
            path:arc,
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: Math.PI,
            endAngle: 3*Math.PI/2,
            x:Math.max(scale(skirt.seamAllowance+Math.sqrt(4*(R+skirt.hemAllowance)**2-(skirt.fabricWidth-2*skirt.seamAllowance)**2)),scale(R+skirt.hemAllowance)),
            y: scale(skirt.fabricWidth-skirt.seamAllowance)
          }
        ]
        
      }
    }
  },
  {
    name: "Full circle with centre back seam",	

    layoutGenerator:function(skirt){
      r = skirt.waistMeasurement/(2*Math.PI)
      R = skirt.skirtLength + r
      skirt.r = r
      skirt.R = R
      if (2*R+(skirt.hemAllowance) <= skirt.fabricWidth){ // one piece 
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 0,
            endAngle:4*Math.PI,
            x:scale(R+skirt.hemAllowance),
            y:scale(R+skirt.hemAllowance)
          }
        ]
      } else { //3 pieces
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 0,
            endAngle:Math.PI/2,
            x:scale(skirt.seamAllowance),
            y:scale(skirt.seamAllowance)
          },
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: Math.PI/2,
            endAngle: 3*Math.PI/2,
            x:scale(Math.max(skirt.seamAllowance+Math.sqrt(4*(R+skirt.hemAllowance)**2-(skirt.fabricWidth-2*skirt.seamAllowance)**2),R+skirt.hemAllowance+skirt.seamAllowance)),
            y:scale(skirt.fabricWidth-skirt.seamAllowance)
          },
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 3*Math.PI/2,
            endAngle: 2*Math.PI,
            x:scale(Math.max(skirt.seamAllowance+2*Math.sqrt(4*(R+skirt.hemAllowance)**2-(skirt.fabricWidth-2*skirt.seamAllowance)**2),2*(R+skirt.hemAllowance)+skirt.seamAllowance)),
            y: scale(skirt.seamAllowance)
          }
        ]
        
      }
    } 
    
  },  
  {
  name: "Full circle without centre back seam",	
    layoutGenerator:function(skirt){
      r = skirt.waistMeasurement/(2*Math.PI)
      R = skirt.skirtLength + r
      skirt.r = r
      skirt.R = R
      
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth){ // one piece 
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 0,
            endAngle:4*Math.PI,
            x:scale(R+skirt.hemAllowance),
            y:scale(R+skirt.hemAllowance)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: -1*Math.PI/2,
            endAngle:Math.PI/2,
            x:scale(R+skirt.hemAllowance),
            y:scale(skirt.seamAllowance)
          },
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: Math.PI/2,
            endAngle: 3*Math.PI/2,
            x:scale(R+skirt.hemAllowance+Math.sqrt(4*(R+skirt.hemAllowance)**2-(skirt.fabricWidth-2*skirt.seamAllowance)**2)),
            y:scale(skirt.fabricWidth-skirt.seamAllowance)
          }
        ]
      }
    }
  },
  {
  name: "Three Quarter circle, straight sides together",
    layoutGenerator:function(skirt){
      r = 2*skirt.waistMeasurement/(3*Math.PI)
      R = skirt.skirtLength + r
      
      skirt.r = r
      skirt.R = R
      
      x = 3*(R+skirt.hemAllowance) - skirt.fabricWidth +2*Math.SQRT2*skirt.seamAllowance
      
      f=skirt.fabricWidth-2*skirt.hemAllowance
      
      yOffset = 0
      if ((f - R + r*Math.SQRT1_2)> f/2){x=x-r}
      if ((f - R + r*Math.SQRT1_2)> R){
        x = (R+skirt.hemAllowance)*Math.SQRT1_2
        yOffset = f-2*R+Math.SQRT1_2*(r-2*skirt.seamAllowance)
      } 
      
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth-2*skirt.seamAllowance){ // one piece 
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 3*Math.PI/4,
            endAngle:9*Math.PI/4,
            x:scale(R+skirt.hemAllowance),
            y:scale(R+skirt.hemAllowance)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 3*Math.PI/2,
            endAngle:9*Math.PI/4,
            x:scale(R+skirt.hemAllowance),
            y:scale(skirt.fabricWidth-(R+yOffset+skirt.hemAllowance))
          },
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: Math.PI/2,
            endAngle: 5*Math.PI/4,
            x:scale(x),
            y:scale(R+skirt.hemAllowance)
          }
        ]
      }
    }
  },
  
  {
    name: "Three Quarter circle layout on selvedge, curved sides together",	

    layoutGenerator:function(skirt){

      r = 2*skirt.waistMeasurement/(3*Math.PI)
      R = skirt.skirtLength + r
      
      skirt.r = r
      skirt.R = R
      
      f = skirt.fabricWidth-2*skirt.seamAllowance
      x = 3*(R+skirt.hemAllowance) - skirt.fabricWidth
      
      
      yOffset = 0
      if ((f - R+skirt.hemAllowance + r*Math.SQRT1_2)> f/2){x=x-r}
      if ((f - R+skirt.hemAllowance + r*Math.SQRT1_2)> (R+skirt.hemAllowance)){
        x=R*Math.SQRT1_2
        yOffset = fabricWidth-2*R+Math.SQRT1_2*r
      } 
      
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth-2*skirt.seamAllowance){ // one piece 
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 3*Math.PI/4,
            endAngle:9*Math.PI/4,
            x:scale(R),
            y:scale(R)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 3*Math.PI/2,
            endAngle:9*Math.PI/4,
            x:scale(Math.SQRT1_2*R + Math.sqrt(4*(R+skirt.hemAllowance)**2-(f)**2)),
            y:scale(skirt.seamAllowance)
          },
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: Math.PI/2,
            endAngle: 5*Math.PI/4,
            x:scale(Math.SQRT1_2*(R+skirt.hemAllowance)),
            y:scale(skirt.fabricWidth-skirt.seamAllowance)
            
          }
        ]
      }
    }
  }, 
  {
    name: "Three Quarter circle, layout on cross grain",	

    layoutGenerator:function(skirt){

      r = 2*skirt.waistMeasurement/(3*Math.PI)
      R = skirt.skirtLength + r
      
      skirt.r = r
      skirt.R = R
      
//      s=Math.sin(Math.PI/8) 
      var s=0.3826834323650898
//      c=Math.cos(Math.PI/8) 
      var c=0.9238795325112867
      var f = skirt.fabricWidth-2*skirt.seamAllowance
      
      var x_offset = (2*(R+skirt.hemAllowance) <= f+2*s*r) ? 0 : Math.sqrt(4*(R+skirt.hemAllowance)**2-(f+2*s*r)**2)
           
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth-2*skirt.seamAllowance){ // one piece 
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: Math.PI/2,
            endAngle:2*Math.PI,
            x:scale(R+skirt.hemAllowance),
            y:scale(R+skirt.hemAllowance)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 13*Math.PI/8,
            endAngle:19*Math.PI/8,
            x:scale(c*(R+skirt.hemAllowance)),
            y:scale(-1*r*s + skirt.seamAllowance*c)
          },
          {
            path:arc,
            csa: csa,
            ssa: ssa,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 5*Math.PI/8,
            endAngle: 11*Math.PI/8,
            x:scale(c*(R+skirt.hemAllowance)+ x_offset),
            y:scale(skirt.fabricWidth +s*r - skirt.seamAllowance*c)
            
          }
        ]
      }
    }
  },
]

var skirt = {
  name : "skirt",
  type : types[0],
  waistMeasurement : 80,
  skirtLength : 50,
  seamAllowance : 1.5,
  hemAllowance : 1.5,
//  waistBandWidth : 0,
  fabricWidth : 112
}

d3.select('#waistmeasurement')
  .on('change', function(){
    skirt.waistMeasurement=this.value*1
    renderSkirt(skirt)
  })
d3.select('#skirtlength')
  .on('change', function(){
    skirt.skirtLength=this.value*1
    renderSkirt(skirt)
  })
d3.select('#seamallowance')
  .on('change', function(){
    skirt.seamAllowance=this.value*1
    renderSkirt(skirt)
  })
d3.select('#hemallowance')
  .on('change', function(){
    skirt.hemAllowance=this.value*1
    renderSkirt(skirt)
  })
//d3.select('#waistbandwidth')
//  .on('change', function(){skirt.waistBandWidth=this.value*1})
d3.select('#fabricwidth')
  .on('change', function(){
    skirt.fabricWidth=this.value*1
    renderSkirt(skirt)
})

d3.select('#skirtchooser')
  .selectAll('div')
  .data(types)
  .enter()
  .append('div')
  .classed('form-check',true)
  .each(
    function(d,i){
     radio = d3.select(this)
        .append('input')
        .classed("form-check-input",true)
        .attr('type',"radio")
        .attr('name',"skirtTypes")
        .attr('id',"skirtTypes"+i)
        .attr('value',i)
        .on('click',  function(d) {
          skirt.type = d
          renderSkirt(skirt)
        })
      radio.node().checked = i==0
      d3.select(this)
        .append('label')
        .classed("form-check-label",true)
        .attr('for',"skirtTypes"+i)
        .text(d.name)
    })

function renderSkirt(skirt){
  var s = [skirt.fabricWidth]
  var fabric = d3.select('#layout').selectAll('rect').data(s)
  fabric.attr('width',1000)
    .attr('height', d=>scale(d))

  fabric.enter().append('rect')
    .classed('fabric',true)  
    .attr('width',1000)
    .attr('height', d=>scale(d))
    .attr('fill','#7b7b7b')
    .merge(fabric)
  
  var layout =d3.select('#layout').selectAll('g#pieces').data([1])
  
  layout = layout.enter().append('g')
    .attr('id','pieces')
    .merge(layout)
    .attr('transform','translate(0,'+scale(skirt.fabricWidth)+')')
  
  var pieces = layout.selectAll('path')
    .data(skirt.type.layoutGenerator(skirt))
  
  pieces
    .attr('d', function(d) {return d.path()})
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    
  
  pieces.enter()
    .append('path')
    .attr('d', function(d) {return d.path()})
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    .attr('fill','lightpink')
    .attr('stroke','black')
    .merge(pieces)
  
  pieces.exit().remove()
  
  result = d3.select('#pieces').node().getBoundingClientRect().width*(1/scale(1))
  d3.select('#result').text(format(result))
  d3.select('#inner_radius').text(format(skirt.r))
  d3.select('#outer_radius').text(format(skirt.R))
  
  }

renderSkirt(skirt)