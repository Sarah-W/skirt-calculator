//default units are cm
var skirt = {
  name : "skirt",
  type : null,
  waistMeasurement : 80,
  skirtLength : 20,
  seamAllowance : 0,
  hemAllowance : 0,
  waistBandWidth : 0,
  fabricWidth : 112
}

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
    }
  },
  {
  name: "Full circle with centre back seam",	
    R: function(skirtLength,waistMeasurement){
    return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement){}
  },
  
  {
  name: "Full circle without centre back seam",	
    R: function(skirtLength,waistMeasurement){
    return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement){}
  },
  
  {
  name: "Three Quarter circle, straight sides together",
    R: function(skirtLength,waistMeasurement){
    return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement){}
  },
  
  {
  name: "Three Quarter circle layout on selvedge, straight sides together",
    R: function(skirtLength,waistMeasurement){
    return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement){}
  },
  
  {
    name: "Three Quarter circle layout on selvedge, curved sides together",	
    R: function(skirtLength,waistMeasurement){
    return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement){}
  },
  
  {
    name: "Smallest three quarter circle",
    R: function(skirtLength,waistMeasurement){
      return(R)
      },
    layoutGenerator:function(skirtLength,waistMeasurement){}
  }
]

d3.select('#waistmeasuremt')
  .on('change', function(){skirt.waistMeasurement=this.value})
d3.select('#skirtlength')
  .on('change', function(){skirt.skirtLength=this.value})
d3.select('#seamallowance')
  .on('change', function(){skirt.seamAllowance=this.value})
d3.select('#hemallowance')
  .on('change', function(){skirt.hemAllowance=this.value})
d3.select('#waistbandwidth')
  .on('change', function(){skirt.waistBandWidth=this.value})
d3.select('#fabricwidth')
  .on('change', function(){skirt.fabricWidth=this.value})

d3.select('#skirtchooser')
  .selectAll('div')
  .data(types)
  .enter()
  .append('div')
  .classed('form-check',true)
  .each(
    function(d,i){
      d3.select(this)
        .append('input')
        .classed("form-check-input",true)
        .attr('type',"radio")
        .attr('name',"skirtTypes")
        .attr('id',"skirtTypes"+i)
        .attr('value',i)
        .on('click',  d => skirt.type = d) 
      d3.select(this)
        .append('label')
        .classed("form-check-label",true)
        .attr('for',"skirtTypes"+i)
        .text(d.name)
    })

function renderSkirt(skirt){
  var fabric = d3.select('#layout')
    .append('rect')
    .attr('width',1000)
    .attr('height',scale(skirt.fabricWidth))
    .attr('fill','#bbb')
  
  var layout =d3.select('#layout').append('g')
    .attr('id','pieces')
    .attr('transform','translate(0,'+scale(skirt.fabricWidth)+')')
  
  var pieces = layout.selectAll('path')
    .data(skirt.type.layoutGenerator(skirt.skirtLength,skirt.waistMeasurement,skirt.fabricWidth))
  
  pieces
    .attr('d', function(d) {console.log(d);return d.path})
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
  
  pieces.enter()
    .append('path')
    .attr('d', function(d) {console.log(d);return d.path})
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    .merge(pieces)
  
  pieces.exit().remove()
  }