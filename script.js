let allData = [];
let cart = [];

document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("glazba.csv", {
        download: true,
        header: true,
        complete: function(results) {
            allData = results.data;
            renderTable(allData);
        }
    });

    // event listeneri za filtere
    document.getElementById("filter-genre").addEventListener("change", applyFilters);
    document.getElementById("filter-year").addEventListener("input", applyFilters);
    document.getElementById("filter-mood").addEventListener("change", applyFilters);
});


function applyFilters() {
    const genre = document.getElementById("filter-genre").value.toLowerCase();
    const year = document.getElementById("filter-year").value;
    const mood = document.getElementById("filter-mood").value.toLowerCase();

    const filtered = allData.filter(row => {
        if (!row.Naslov) return false;

        return (
            (!genre || row["Žanr"].toLowerCase().includes(genre)) &&
            (!year || row.Godina == year) &&
            (!mood || row.Raspoloženje === mood)
        );
    });

    renderTable(filtered);
}


function renderTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach(row => {
        if (!row.Naslov) return;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row["Izvođač"]}</td>
            <td>${row.Naslov}</td>
            <td>${row.Godina}</td>
            <td>${row["Žanr"]}</td>
            <td>${row.Raspoloženje}</td>
            <td>
                <button class="add-btn" id="btn-${row.ID}" onclick='addToCart(${JSON.stringify(row)})'>
                    Dodaj
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function addToCart(item) {

    const exists = cart.some(el => el.ID === item.ID);

    if (exists) return;

    cart.push(item);

    const btn = document.getElementById(`btn-${item.ID}`);
    if (btn) {
        btn.style.display = "none";
    }

    renderCart();
}

function renderCart() {
    const cartBody = document.getElementById("cart-body");
    cartBody.innerHTML = "";

    cart.forEach((item, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item["Izvođač"]}</td>
            <td>${item.Naslov}</td>
            <td>${item.Godina}</td>
            <td>${item["Žanr"]}</td>
            <td>
                <button onclick="removeFromCart(${index})">Ukloni</button>
            </td>
        `;

        cartBody.appendChild(tr);
    });
}

function removeFromCart(index) {
    const item = cart[index];

    cart.splice(index, 1);
    renderCart();
    
    const btn = document.getElementById(`btn-${item.ID}`);
    if (btn) {
        btn.style.display = "block";
    }
}

document.getElementById("confirm-btn").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Košarica je prazna!");
        return;
    }

    alert("Uspješno ste odabrali " + cart.length + " pjesama!");

    cart = [];
    renderCart();
});