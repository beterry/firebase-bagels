const menuTable = document.querySelector('#menu-table');

let feedback = {
    original: {
        total: 0,
        rating: undefined,
    },
    spicy: {
        total: 0,
        rating: undefined,
    },
    garlic: {
        total: 0,
        rating: undefined,
    },
}

function updateTable(){
    menuTable.innerHTML = ""

    let original = createRow("Benny's Original", feedback.original.total, feedback.original.rating);
    let spicy = createRow("Spicy Avacado", feedback.spicy.total, feedback.spicy.rating);
    let garlic = createRow("Garlic Parmesan", feedback.garlic.total, feedback.garlic.rating);

    menuTable.appendChild(original)
    menuTable.appendChild(spicy)
    menuTable.appendChild(garlic)
}

function createRow(sandwichName, numberSold, avgRating){
    let tr = document.createElement('tr');

    let name = document.createElement('td');
    let number = document.createElement('td');
    let rating = document.createElement('td');

    name.textContent = sandwichName;
    number.textContent = numberSold;
    rating.textContent = avgRating;

    tr.appendChild(name)
    tr.appendChild(number)
    tr.appendChild(rating)

    return tr
}

updateTable()

db.collection("original").get().then((querySnapshot) => {
    let ratingTotal = 0
    let quantity = 0
    querySnapshot.forEach((doc) => {
        ratingTotal += doc.data().rating;
        quantity++;
    });
    feedback.original.rating = ratingTotal / quantity;
    feedback.original.total = quantity;
    updateTable()
});

db.collection("spicy").get().then((querySnapshot) => {
    let ratingTotal = 0
    let quantity = 0
    querySnapshot.forEach((doc) => {
        ratingTotal += doc.data().rating;
        quantity++;
    });
    feedback.spicy.rating = ratingTotal / quantity;
    feedback.spicy.total = quantity;
    updateTable()
});

db.collection("garlic").get().then((querySnapshot) => {
    let ratingTotal = 0
    let quantity = 0
    querySnapshot.forEach((doc) => {
        ratingTotal += doc.data().rating;
        quantity++;
    });
    feedback.garlic.rating = ratingTotal / quantity;
    feedback.garlic.total = quantity;
    updateTable()
});