const menuTable = document.querySelector('#menu-table');
const form = document.querySelector('#rating-form');

let feedback = {
    original: {
        total: 0,
        rating: 0,
    },
    spicy: {
        total: 0,
        rating: 0,
    },
    garlic: {
        total: 0,
        rating: 0,
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

//read data from firebase
function readCollection(sandwich){
    db.collection(sandwich).get().then((querySnapshot) => {
        let ratingTotal = 0
        let quantity = 0
        querySnapshot.forEach((doc) => {
            ratingTotal += doc.data().rating;
            quantity++;
        });
        feedback[sandwich].rating = ratingTotal / quantity;
        feedback[sandwich].total = quantity;
        updateTable()
    });
}

//init table
updateTable()

readCollection('original')
readCollection('spicy')
readCollection('garlic')

//save data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection(form.sandwich.value).add({
        comment: form.comment.value,
        rating: parseInt(form.rating.value)
    });
    console.log(`Saved to '${form.sandwich.value}' collection...`);

    //clear fields after submit
    form.sandwich.value = '';
    form.comment.value = '';
    form.rating.value = '';
})