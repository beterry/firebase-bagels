const menuTable = document.querySelector('#menu-table');
const form = document.querySelector('#rating-form');

//local data
let feedback = {
    original: {
        total: "loading...",
        rating: "loading...",
    },
    spicy: {
        total: "loading...",
        rating: "loading...",
    },
    garlic: {
        total: "loading...",
        rating: "loading...",
    },
}

function roundRating(rating){
    let roundedRating = parseFloat(rating).toFixed(2);
    return roundedRating
}

function updateTable(){
    menuTable.innerHTML = ""

    let original = createRow("Benny's Original", feedback.original.total, roundRating(feedback.original.rating));
    let spicy = createRow("Spicy Avocado", feedback.spicy.total, roundRating(feedback.spicy.rating));
    let garlic = createRow("Garlic Parmesan", feedback.garlic.total, roundRating(feedback.garlic.rating));

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
function getFeedback(sandwich){
    db.collection('feedback').where('sandwich', '==', sandwich).get().then((querySnapshot) => {
        let ratingTotal = 0;
        let quantity = 0;
        querySnapshot.forEach((doc) => {
            ratingTotal += doc.data().rating;
            quantity++;
        });
        feedback[sandwich].rating = ratingTotal / quantity;
        feedback[sandwich].total = quantity;
        updateTable();
    });
}

//save data on form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const sandwich = form.sandwich.value;
    const rating = parseInt(form.rating.value);

    db.collection('feedback').add({
        sandwich,
        comment: form.comment.value,
        rating,
    })
    .then(() => {
        console.log(`Saved to firebase...`); 
    });
    
    //update local data
    feedback[sandwich].total += 1;
    feedback[sandwich].rating = ((feedback[sandwich].rating * (feedback[sandwich].total - 1)) + rating) / feedback[sandwich].total;
    updateTable();

    //clear fields after submit
    form.sandwich.value = '';
    form.comment.value = '';
    form.rating.value = '';
})

//init table
updateTable();

//read database
getFeedback('original');
getFeedback('spicy');
getFeedback('garlic');