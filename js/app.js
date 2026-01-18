/**
 * App entry point
 */

$(function () {
  const MAX_COMPARE = 3;

  let compareList = JSON.parse(localStorage.getItem("compareList")) || [];

  const $grid = $("#productGrid");
  const $compareSection = $("#compareSection");

  function renderProducts(products) {
    $grid.empty();

    products.forEach(p => {
      const checked = compareList.includes(p.id) ? "checked" : "";

      $grid.append(`
        <div class="product-card" tabindex="0">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="brand">${p.brand}</p>
          <p class="price">₹${p.price}</p>
          <ul>
            ${Object.values(p.features)
          .map(f => `<li>${f}</li>`)
          .join("")}
          </ul>
          <label>
            <input type="checkbox" data-id="${p.id}" ${checked}>
            Add to Compare
          </label>
        </div>
      `);
    });
  }

  function renderCompare() {
    if (compareList.length < 2) {
      $compareSection.hide();
      return;
    }
    const selected = PRODUCTS.filter(p => compareList.includes(p.id));
    const featureKeys = Object.keys(selected[0].features);

    /**
     * Build comparison table header with product image, name, and price
     */
    let table = `
      <table>
        <tr>
          <th>Product</th>
          ${selected.map(p => `
            <th>
              <div class="compare-product">
                <img src="${p.image}" alt="${p.name}">
                <div class="compare-name">${p.name}</div>
                <div class="compare-price">₹${p.price}</div>
              </div>
            </th>
          `).join("")}
        </tr>
    `;

    featureKeys.forEach(key => {
      const values = selected.map(p => p.features[key]);
      const isDifferent = new Set(values).size > 1;

      table += `
        <tr class="${isDifferent ? "diff" : ""}">
          <td>${key}</td>
          ${values.map(v => `<td>${v}</td>`).join("")}
        </tr>
      `;
    });

    table += `</table>`;

    $compareSection.html(`
      <h2>Compare Products</h2>
      <button id="clearCompare">Clear All</button>
      <div class="table-wrap">
        ${table}
      </div>
    `).show();
  }

  $grid.on("change", "input[type='checkbox']", function () {
    const id = Number($(this).data("id"));

    if (this.checked) {
      if (compareList.length >= MAX_COMPARE) {
        alert("You can compare up to 3 products only");
        this.checked = false;
        return;
      }
      compareList.push(id);
    } else {
      compareList = compareList.filter(i => i !== id);
    }

    localStorage.setItem("compareList", JSON.stringify(compareList));

    renderCompare();
  });

  $(document).on("click", "#clearCompare", function () {
    compareList = [];
    localStorage.removeItem("compareList");

    $("input[type='checkbox']").prop("checked", false);

    renderCompare();
  });

  $("#search").on("input", function () {
    const val = $(this).val().toLowerCase();

    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(val) ||
      p.brand.toLowerCase().includes(val)
    );

    renderProducts(filtered);
  });

  /**
   * Toggle light/dark theme
   */
  $("#themeToggle").on("click", function () {
    $("body").toggleClass("dark");
  });

  renderProducts(PRODUCTS);
  renderCompare();
});
