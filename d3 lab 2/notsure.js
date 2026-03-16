import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let dataset;
let svg;

async function prepareVis() {
    dataset = await d3.csv ("./gapminder_full.csv",d3.autoType);
    
    console.log(dataset)

    svg = d3.select()
}

async function runApp (){
    await prepareVis();
}

runApp();