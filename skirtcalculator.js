//default units are cm

var format = d3.format(",.0f")
var scale = function(x){return 3*x} //gonna have to do some real scaling eventually

var rotate = function(d){ // rotate the piece on click
  d.pieceRotaton = d.pieceRotaton ? d.pieceRotaton + 45 : 45
  console.log('translate('+d.x+','+(-1*d.y)+') rotate('+d.pieceRotaton+' '+d.centroid()[0]+' '+d.centroid()[1]+')')
  d3.select(this)
    .attr('transform',d => 'translate('+d.x+','+(-1*d.y)+') rotate('+d.pieceRotaton+' '+d.centroid()[0]+' '+d.centroid()[1]+')')
}

var arc = function(){
  return d3.arc()(this)} //'this' already has all of the bits we need 

var centroid = function(){
  return d3.arc().centroid(this)}

var csa = function(){ //curved seam/hem allowances (top and bottom)
  var waist =  d3.arc()(
    { 
      innerRadius: this.innerRadius-this.seamAllowance, 
      outerRadius: this.innerRadius,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
    })
  var hem =  d3.arc()(
    { 
      innerRadius: this.outerRadius, 
      outerRadius: this.outerRadius+this.hemAllowance,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
    })
  
  return [{name:'waist', path:waist},{name:'hem', path:hem}]
} 
var ssa = function(){ //straight seam allowances (sides)
  height= this.seamAllowance+this.hemAllowance+this.outerRadius-this.innerRadius
  width = this.seamAllowance
  
  var x1=(this.innerRadius-this.seamAllowance)*Math.sin(this.startAngle)
  var y1=(this.innerRadius-this.seamAllowance)*-1*Math.cos(this.startAngle)
  
  transform1 =  "translate("+x1+","+y1+") rotate("+(180*(this.startAngle-Math.PI)/Math.PI )+")" 

  var x2=(this.innerRadius-this.seamAllowance)*Math.sin(this.endAngle)+this.seamAllowance*Math.cos(this.endAngle)
  var y2=(this.innerRadius-this.seamAllowance)*-1*Math.cos(this.endAngle)+this.seamAllowance*Math.sin(this.endAngle)
  
  transform2 =  "translate("+x2+","+y2+") rotate("+(180*(this.endAngle-Math.PI)/Math.PI)+")" 
  
  return [
    {name:'start', height:height, width:width, transform:transform1},
    {name:'end',   height:height, width:width, transform:transform2}
  ]
}

var basePiece = {
  path: arc,
  centroid:centroid,
  csa: csa,
  ssa: ssa,
 
}

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
            ...basePiece,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),      
            endAngle: Math.PI,
            startAngle:0, 
            x:scale(skirt.seamAllowance),
            y:scale(R+skirt.hemAllowance),  
          }
        ]
      } else {
        return [
          {
            ...basePiece,
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
            ...basePiece,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
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
            ...basePiece,
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
            ...basePiece,
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
            ...basePiece,
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
            ...basePiece,
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
            ...basePiece,
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
            ...basePiece,
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
            ...basePiece,
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
      
      if ((f - R+(r-skirt.seamAllowance)*Math.SQRT1_2) > f/2){
        console.log('option 1');
        x=x-(r-skirt.seamAllowance*Math.SQRT1_2)
      }
      
      if ((f - R+(r-skirt.seamAllowance)*Math.SQRT1_2) > R+skirt.hemAllowance){
        console.log('option 2')
        x = (R+skirt.hemAllowance+skirt.seamAllowance)*Math.SQRT1_2
        yOffset = f-2*R+Math.SQRT1_2*(r-2*skirt.seamAllowance)-skirt.seamAllowance
      } 
      
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth-2*skirt.seamAllowance){ // one piece 
        return [
          {
            ...basePiece,
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
           ...basePiece,
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
            ...basePiece,
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
      x = 3*(R+skirt.hemAllowance) - f
      
      
      yOffset = 0
      if ((f - R+skirt.hemAllowance + r*Math.SQRT1_2)> f/2){x=x-r}
      if ((f - R+skirt.hemAllowance + r*Math.SQRT1_2)> (R+skirt.hemAllowance)){
        x=R*Math.SQRT1_2
        yOffset = skirt.fabricWidth-2*R+Math.SQRT1_2*r
      } 
      
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth-2*skirt.seamAllowance){ // one piece 
        return [
          {
            ...basePiece,
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
            ...basePiece,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 3*Math.PI/2,
            endAngle:9*Math.PI/4,
            x:scale(Math.SQRT1_2*(R+skirt.hemAllowance) + Math.sqrt(4*(R+skirt.hemAllowance)**2-(f)**2)),
            y:scale(skirt.seamAllowance)
          },
          {
            ...basePiece,
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
      var f = skirt.fabricWidth-2*(skirt.seamAllowance*c)+2*(r-skirt.seamAllowance)*s //effective fabric width
      
      var x_offset = (2*(R+skirt.hemAllowance) <= f) ? 0 : Math.sqrt(4*(R+skirt.hemAllowance)**2-(f)**2)
           
      if (2*(R+skirt.hemAllowance) <= skirt.fabricWidth-2*skirt.seamAllowance){ // one piece 
        return [
          {
            ...basePiece,
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
           ...basePiece,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 13*Math.PI/8,
            endAngle:19*Math.PI/8,
            x:scale(c*(R+skirt.hemAllowance)+s*skirt.seamAllowance),
            y:scale(-1*(r-skirt.seamAllowance)*s + skirt.seamAllowance*c)
          },
          {
            ...basePiece,
            seamAllowance: scale(skirt.seamAllowance),
            hemAllowance:scale(skirt.hemAllowance),
            innerRadius: scale(r), 
            outerRadius: scale(R),
            startAngle: 5*Math.PI/8,
            endAngle: 11*Math.PI/8,
//            x:scale(c*(R+skirt.hemAllowance)+ x_offset),
            x:scale(c*(R+skirt.hemAllowance)+s*skirt.seamAllowance+x_offset),
            y:scale(skirt.fabricWidth + (r-skirt.seamAllowance)*s - skirt.seamAllowance*c)
            
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

function renderPiece(p){
  var piece = d3.select(this)
  var main = piece.selectAll('path.main').data([p.path()])
  main.attr('d', d=>d)
  main.enter()
    .append('path')
    .attr('d', d=>d)
    .classed('main',true)
    .merge(main)
  main.exit().remove()
  
  var csa = piece.selectAll('path.csa').data(p.csa())
  csa.attr('d', d=>d.path)
  csa.enter()
    .append('path')
    .attr('d', d=>d.path)
    .classed('csa',true)
    .merge(csa)
  csa.exit().remove()
  
  var ssa = piece.selectAll('rect.ssa').data(p.ssa())
  ssa
    .attr('height', d=>d.height)
    .attr('width', d=>d.width)
    .attr('transform', d=>d.transform)
  ssa.enter()
    .append('rect')
    .attr('height', d=>d.height)
    .attr('width', d=>d.width)
    .attr('transform', d => d.transform)
    .classed('ssa',true)
    .merge(ssa)
  ssa.exit().remove()
      
}

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
  
  var pieces = layout.selectAll('g')
    .data(skirt.type.layoutGenerator(skirt))
  
  pieces
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    .each(renderPiece)
    
  
  pieces.enter()
    .append('g')
    .attr('transform',d=> 'translate('+d.x+','+(-1*d.y)+')')
    .on('click', rotate)
//    .on('drag', function(){console.log('dragged')})
    .each(renderPiece)
    .merge(pieces)
  
  pieces.exit().remove()
 
  result = d3.select('#pieces').node().getBoundingClientRect().width*(1/scale(1))
  d3.select('#result').text(format(result))
  d3.select('#inner_radius').text(format(skirt.r-skirt.seamAllowance))
  d3.select('#outer_radius').text(format(skirt.R+skirt.hemAllowance))
  
  }



renderSkirt(skirt)