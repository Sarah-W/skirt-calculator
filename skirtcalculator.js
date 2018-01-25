//default units are cm

var format = d3.format(",.0f")
var scale = function(x){return 3*x} //gonna have to do some real scaling eventually
//var scale = function(x){return x} //gonna have to do some real scaling eventually
arc =d3.arc()

var types = [
  {
    name: "Half circle", 
    R: function(skirtLength,waistMeasurement){
        r = skirt.waistMeasurement/Math.PI
        R = skirt.skirtLength + r
        return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement,fabricWidth){
      r = waistMeasurement/Math.PI
      R = skirtLength + r
      angle = Math.PI
      if (2*R <= fabricWidth){ 
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: Math.PI,
                endAngle:0,
              }),
            x:0,
            y:scale(R)
          }
        ]
      } else {
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 0,
                endAngle:Math.PI/2,
              }),
            x:0,
            y:0
          },
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: Math.PI,
                endAngle: 3*Math.PI/2,
              }),
            x:Math.max(scale(Math.sqrt(4*R**2-fabricWidth**2)),scale(R)),
            y: scale(fabricWidth)
          }
        ]
        
      }
    }
  },
  {
    name: "Full circle with centre back seam",	
    R: function(skirtLength,waistMeasurement){
          r = skirt.waistMeasurement/Math.PI
          R = skirt.skirtLength + r
          return(R)
        },
    layoutGenerator:function(skirtLength,waistMeasurement,fabricWidth){
      r = waistMeasurement/(2*Math.PI)
      R = skirtLength + r
      if (2*R <= fabricWidth){ // one piece 
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 0,
                endAngle:4*Math.PI,
              }),
            x:scale(R),
            y:scale(R)
          }
        ]
      } else { //3 pieces
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 0,
                endAngle:Math.PI/2,
              }),
            x:0,
            y:0
          },
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: Math.PI/2,
                endAngle: 3*Math.PI/2,
              }),
            x:scale(Math.max(Math.sqrt(4*R**2-fabricWidth**2),R)),
            y:scale(fabricWidth)
          },
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 3*Math.PI/2,
                endAngle: 2*Math.PI
              }),
            x:2*scale(Math.max(Math.sqrt(4*R**2-fabricWidth**2),R)),
            y: 0
          }
        ]
        
      }
    } 
    
  },  
  {
  name: "Full circle without centre back seam",	
     R: function(skirtLength,waistMeasurement){
          r = skirt.waistMeasurement/Math.PI
          R = skirt.skirtLength + r
          return(R)
        },
    layoutGenerator:function(skirtLength,waistMeasurement,fabricWidth){
      r = waistMeasurement/(2*Math.PI)
      R = skirtLength + r
      if (2*R <= fabricWidth){ // one piece 
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 0,
                endAngle:4*Math.PI,
              }),
            x:scale(R),
            y:scale(R)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
//                startAngle: 3*Math.PI/2,
                startAngle: -1*Math.PI/2,
                endAngle:Math.PI/2,
              }),
            x:scale(R),
            y:0
          },
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: Math.PI/2,
                endAngle: 3*Math.PI/2,
              }),
            x:scale(R+Math.sqrt(4*R**2-fabricWidth**2)),
            y:scale(fabricWidth)
          }
        ]
      }
    }
  },
  {
  name: "Three Quarter circle, straight sides together",
     R: function(skirtLength,waistMeasurement){
          r = skirt.waistMeasurement/Math.PI
          R = skirt.skirtLength + r*2/3
          return(R)
        },
    layoutGenerator:function(skirtLength,waistMeasurement,fabricWidth){
      r = waistMeasurement/(2*Math.PI)
      R = skirtLength + r
      
      x = 3*R - fabricWidth
      yOffset = 0
      if ((fabricWidth - R + r*Math.SQRT1_2)> fabricWidth/2){x=x-r}
      if ((fabricWidth - R + r*Math.SQRT1_2)> R){
        x=R*Math.SQRT1_2
        yOffset = fabricWidth-2*R+Math.SQRT1_2*r
      } 
      
      if (2*R <= fabricWidth){ // one piece 
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 3*Math.PI/4,
                endAngle:9*Math.PI/4,
              }),
            x:scale(R),
            y:scale(R)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 3*Math.PI/2,
                endAngle:9*Math.PI/4,
              }),
            x:scale(R),
            y:scale(fabricWidth-(R+yOffset))
          },
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: Math.PI/2,
                endAngle: 5*Math.PI/4,
              }),
            x:scale(x),
            y:scale(R)
          }
        ]
      }
    }
  },
  
  {
    name: "Three Quarter circle layout on selvedge, curved sides together",	
    R: function(skirtLength,waistMeasurement){
          r = skirt.waistMeasurement/Math.PI
          R = skirt.skirtLength + r*2/3
          return(R)
        },
    layoutGenerator:function(skirtLength,waistMeasurement,fabricWidth){
      r = waistMeasurement/(2*Math.PI)
      R = skirtLength + r
      
      x = 3*R - fabricWidth
      yOffset = 0
      if ((fabricWidth - R + r*Math.SQRT1_2)> fabricWidth/2){x=x-r}
      if ((fabricWidth - R + r*Math.SQRT1_2)> R){
        x=R*Math.SQRT1_2
        yOffset = fabricWidth-2*R+Math.SQRT1_2*r
      } 
      
      if (2*R <= fabricWidth){ // one piece 
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 3*Math.PI/4,
                endAngle:9*Math.PI/4,
              }),
            x:scale(R),
            y:scale(R)
          }
        ]
      } else { //2 pieces
        return [
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: 3*Math.PI/2,
                endAngle:9*Math.PI/4,
              }),
            x:scale(Math.SQRT1_2*R + Math.sqrt(4*R**2-fabricWidth**2)),
            y:scale(0)
          },
          {
            path:arc(  
              {
                innerRadius: scale(r), 
                outerRadius: scale(R),
                startAngle: Math.PI/2,
                endAngle: 5*Math.PI/4,
              }),
            x:scale(Math.SQRT1_2*R),
            y:scale(fabricWidth)
            
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
//  seamAllowance : 0,
//  hemAllowance : 0,
//  waistBandWidth : 0,
  fabricWidth : 112 
}

d3.select('#waistmeasurement')
  .on('change', function(){
    console.log('here')
    skirt.waistMeasurement=this.value*1
    renderSkirt(skirt)
  })
d3.select('#skirtlength')
  .on('change', function(){
    skirt.skirtLength=this.value*1
    renderSkirt(skirt)
  })
//d3.select('#seamallowance')
//  .on('change', function(){skirt.seamAllowance=this.value*1})
//d3.select('#hemallowance')
//  .on('change', function(){skirt.hemAllowance=this.value*1})
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
    .data(skirt.type.layoutGenerator(skirt.skirtLength,skirt.waistMeasurement,skirt.fabricWidth))
  
  pieces
    .attr('d', function(d) {return d.path})
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    
  
  pieces.enter()
    .append('path')
    .attr('d', function(d) {return d.path})
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    .attr('fill','lightpink')
    .attr('stroke','black')
    .merge(pieces)
  
  pieces.exit().remove()
  
  
  result = d3.select('#pieces').node().getBoundingClientRect().width*(1/scale(1))
  d3.select('#result').text(format(result))
  
  }

renderSkirt(skirt)