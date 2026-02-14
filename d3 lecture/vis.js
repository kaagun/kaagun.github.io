import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function makeVis(){
    const width = 800;
    const height = 600;


    const svg = d3.create("svg").attr("width",width).attr("height",height);

    const visContainer = document.querySelector("#visContainer");

    visContainer.append(svg.node());

    const circle = svg.append("circle");

    circle.attr("r",15).attr("cx",25).attr("cy",25).attr("fill","blue");

    // const dataset = [15000,20000,16000,45000,34000,6000,10000];

    const dataset = [
        [22,5],
        [27,12],
        [31, 25],
        [35, 40],
        [38, 55],
        [42, 65],
        [46, 70],
        [50, 80],
        [55, 90],
        [62, 95]
    ]
    ;


    const ageExtent = d3.extent (dataset, (d)=>{return d[0]});
    const baldnessExtenet = d3.extent(dataset, (d)=>{return d[1]});
    

    // let radiusScale = d3.scaleLinear().domain(radiusRange).range([10,50]);
    let xScale = d3.scaleLinear().domain(ageExtent).range([20,width-20]);
    let yScale = d3.scaleLinear().domain(baldnessExtent).range([height-20,20]);


    // dataset.forEach((d,i)=>{
    //    svg.append("circle").attr("r",d)
    //    .attr("cx",i*100 + 20)
    //    .attr("cy", width/2);
    // })

    svg.selectAll('circle')
    .data(dataset)
    .join("circle")
    .attr("r", function(d){
        return radiusScale(d); //Will output a number in the radius range that we want;
    }).attr("cx", (d,i)=>{
        return xScale(d[0]);
    }).attr("cy", yScale(d,i) =>{
        return yScale (d[1])
    });

    svg.append("g")

}

makeVis();

