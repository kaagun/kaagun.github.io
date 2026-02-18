// Load data from datasets/videogames_wide.csv using d3.csv and then make visualizations
async function fetchData() {
  // autoType converts year/global_sales/sales_amount to numbers
  return await d3.csv("./dataset/videogames_long.csv", d3.autoType);
}

fetchData().then(async (data) => {
  // ---- helpers: top platforms/genres by total global sales ----
  const platformTotals = d3
    .rollups(
      data,
      (v) => d3.sum(v, (d) => d.global_sales),
      (d) => d.platform
    )
    .sort((a, b) => d3.descending(a[1], b[1]));

  const top10Platforms = new Set(platformTotals.slice(0, 10).map((d) => d[0]));
  const top5Platforms = new Set(platformTotals.slice(0, 5).map((d) => d[0]));

  const genreTotals = d3
    .rollups(
      data,
      (v) => d3.sum(v, (d) => d.global_sales),
      (d) => d.genre
    )
    .sort((a, b) => d3.descending(a[1], b[1]));

  const top10Genres = new Set(genreTotals.slice(0, 10).map((d) => d[0]));

  // Convenience filtered datasets
  const dataTop10Platforms = data.filter((d) => top10Platforms.has(d.platform));
  const dataTop10Heatmap = data.filter(
    (d) => top10Platforms.has(d.platform) && top10Genres.has(d.genre)
  );
  const dataTop5Platforms = data.filter((d) => top5Platforms.has(d.platform));

  // -----------------------------
  // 1A: Which platforms have the highest total global sales?
  // -----------------------------
  const spec1a = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "1A — Total Global Sales by Platform (Top 10)",
    data: { values: dataTop10Platforms },
    mark: "bar",
    encoding: {
      y: {
        field: "platform",
        type: "nominal",
        sort: "-x",
        title: "Platform",
      },
      x: {
        aggregate: "sum",
        field: "global_sales",
        type: "quantitative",
        title: "Total Global Sales (millions)",
      },
      tooltip: [
        { field: "platform", type: "nominal", title: "Platform" },
        {
          aggregate: "sum",
          field: "global_sales",
          type: "quantitative",
          title: "Total Global Sales",
        },
      ],
    },
    width: "container",
    height: 350,
  };

  // -----------------------------
  // 1B: For top platforms, which genres drive global sales?
  // Heatmap
  // -----------------------------
  const spec1b = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "1B — Global Sales by Platform and Genre (Top 10 × Top 10)",
    data: { values: dataTop10Heatmap },
    mark: "rect",
    encoding: {
      x: { field: "platform", type: "nominal", title: "Platform" },
      y: { field: "genre", type: "nominal", title: "Genre" },
      color: {
        aggregate: "sum",
        field: "global_sales",
        type: "quantitative",
        title: "Total Global Sales (millions)",
      },
      tooltip: [
        { field: "platform", type: "nominal" },
        { field: "genre", type: "nominal" },
        {
          aggregate: "sum",
          field: "global_sales",
          type: "quantitative",
          title: "Total Global Sales",
        },
      ],
    },
    width: "container",
    height: 350,
  };

  // -----------------------------
  // 2A: How do total global sales change over time overall?
  // -----------------------------
  const spec2a = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "2A — Total Global Sales Over Time",
    data: { values: data },
    mark: "line",
    encoding: {
      x: { field: "year", type: "quantitative", title: "Year" },
      y: {
        aggregate: "sum",
        field: "global_sales",
        type: "quantitative",
        title: "Total Global Sales (millions)",
      },
      tooltip: [
        { field: "year", type: "quantitative", title: "Year" },
        {
          aggregate: "sum",
          field: "global_sales",
          type: "quantitative",
          title: "Total Global Sales",
        },
      ],
    },
    width: "container",
    height: 350,
  };

  // -----------------------------
  // 2B: How do sales over time differ by platform (top 5)?
  // -----------------------------
  const spec2b = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "2B — Global Sales Over Time by Platform (Top 5)",
    data: { values: dataTop5Platforms },
    mark: "line",
    encoding: {
      x: { field: "year", type: "quantitative", title: "Year" },
      y: {
        aggregate: "sum",
        field: "global_sales",
        type: "quantitative",
        title: "Total Global Sales (millions)",
      },
      color: { field: "platform", type: "nominal", title: "Platform" },
      tooltip: [
        { field: "platform", type: "nominal" },
        { field: "year", type: "quantitative", title: "Year" },
        {
          aggregate: "sum",
          field: "global_sales",
          type: "quantitative",
          title: "Total Global Sales",
        },
      ],
    },
    width: "container",
    height: 350,
  };

  // -----------------------------
  // 3A: How do regional sales compare across platforms? (stacked)
  // Use sales_amount + sales_region
  // -----------------------------
  const spec3a = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "3A — Regional Sales by Platform (Top 10 Platforms)",
    data: { values: dataTop10Platforms },
    mark: "bar",
    encoding: {
      x: { field: "platform", type: "nominal", sort: "-y", title: "Platform" },
      y: {
        aggregate: "sum",
        field: "sales_amount",
        type: "quantitative",
        title: "Total Regional Sales (millions)",
      },
      color: { field: "sales_region", type: "nominal", title: "Region" },
      tooltip: [
        { field: "platform", type: "nominal" },
        { field: "sales_region", type: "nominal", title: "Region" },
        {
          aggregate: "sum",
          field: "sales_amount",
          type: "quantitative",
          title: "Total Sales",
        },
      ],
    },
    width: "container",
    height: 350,
  };

  // -----------------------------
  // 3B: NA vs JP — which platforms are most popular?
  // Facet by region (na_sales vs jp_sales)
  // -----------------------------
  const spec3b = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "3B — Platform Popularity: North America vs Japan (Top 10 Platforms)",
    data: {
      values: dataTop10Platforms.filter(
        (d) => d.sales_region === "na_sales" || d.sales_region === "jp_sales"
      ),
    },
    mark: "bar",
    encoding: {
      y: { field: "platform", type: "nominal", sort: "-x", title: "Platform" },
      x: {
        aggregate: "sum",
        field: "sales_amount",
        type: "quantitative",
        title: "Total Sales (millions)",
      },
      column: { field: "sales_region", type: "nominal", title: "Region" },
      tooltip: [
        { field: "sales_region", type: "nominal", title: "Region" },
        { field: "platform", type: "nominal" },
        {
          aggregate: "sum",
          field: "sales_amount",
          type: "quantitative",
          title: "Total Sales",
        },
      ],
    },
    width: 360,
    height: 350,
  };

  // -----------------------------
  // 4A: Story — Genre preferences: NA vs JP
  // -----------------------------
  const spec4a = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "4A — Visual Story: Genre Sales in North America vs Japan",
    data: {
      values: data.filter(
        (d) => d.sales_region === "na_sales" || d.sales_region === "jp_sales"
      ),
    },
    mark: "bar",
    encoding: {
      y: { field: "genre", type: "nominal", sort: "-x", title: "Genre" },
      x: {
        aggregate: "sum",
        field: "sales_amount",
        type: "quantitative",
        title: "Total Sales (millions)",
      },
      column: { field: "sales_region", type: "nominal", title: "Region" },
      tooltip: [
        { field: "sales_region", type: "nominal", title: "Region" },
        { field: "genre", type: "nominal" },
        {
          aggregate: "sum",
          field: "sales_amount",
          type: "quantitative",
          title: "Total Sales",
        },
      ],
    },
    width: 360,
    height: 350,
  };

  // -----------------------------
  // 4B: Story — Compare genre strength JP vs NA (scatter by genre)
  // Build aggregated table: one row per genre with NA_sum and JP_sum
  // -----------------------------
  const genreAgg = d3.rollups(
    data.filter((d) => d.sales_region === "na_sales" || d.sales_region === "jp_sales"),
    (v) => ({
      na: d3.sum(v.filter((d) => d.sales_region === "na_sales"), (d) => d.sales_amount),
      jp: d3.sum(v.filter((d) => d.sales_region === "jp_sales"), (d) => d.sales_amount),
    }),
    (d) => d.genre
  );

  const genreCompare = genreAgg.map(([genre, vals]) => ({
    genre,
    na_sales_total: vals.na,
    jp_sales_total: vals.jp,
  }));

  const spec4b = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "4B — Visual Story: Genres (NA vs JP) as a Scatterplot",
    data: { values: genreCompare },
    mark: { type: "point", filled: true, size: 80 },
    encoding: {
      x: {
        field: "na_sales_total",
        type: "quantitative",
        title: "Total NA Sales (millions)",
      },
      y: {
        field: "jp_sales_total",
        type: "quantitative",
        title: "Total JP Sales (millions)",
      },
      tooltip: [
        { field: "genre", type: "nominal", title: "Genre" },
        { field: "na_sales_total", type: "quantitative", title: "NA Total" },
        { field: "jp_sales_total", type: "quantitative", title: "JP Total" },
      ],
    },
    width: "container",
    height: 350,
  };

  // Render all 8
  await render("#view1a", spec1a);
  await render("#view1b", spec1b);
  await render("#view2a", spec2a);
  await render("#view2b", spec2b);
  await render("#view3a", spec3a);
  await render("#view3b", spec3b);
  await render("#view4a", spec4a);
  await render("#view4b", spec4b);
});

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec, { actions: false });
  result.view.run();
}