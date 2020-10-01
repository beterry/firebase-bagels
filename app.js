const menuTable = document.querySelector('#menu-table');
const form = document.querySelector('#rating-form');

//local data
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

//rounds rating to two decimal places
function roundRating(rating){
    if (rating > 0){
        let roundedRating = parseFloat(rating).toFixed(2);
        return roundedRating
    } else {
        return 'loading...'
    }
}

//clears and then renders the table rows
function updateTable(){
    menuTable.innerHTML = ""

    let original = createRow("Benny's Original", feedback.original.total, roundRating(feedback.original.rating / feedback.original.total));
    let spicy = createRow("Spicy Avocado", feedback.spicy.total, roundRating(feedback.spicy.rating / feedback.spicy.total));
    let garlic = createRow("Garlic Parmesan", feedback.garlic.total, roundRating(feedback.garlic.rating / feedback.garlic.total));

    menuTable.appendChild(original)
    menuTable.appendChild(spicy)
    menuTable.appendChild(garlic)
}

//creates and returns a table row to append to the tbody
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
function getFeedback(){
    db.collection('feedback').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            feedback[doc.data().sandwich].rating += doc.data().rating
            feedback[doc.data().sandwich].total += 1
        });
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
    feedback[sandwich].rating += rating;
    updateTable();

    //clear fields after submit
    form.sandwich.value = '';
    form.comment.value = '';
    form.rating.value = '';
})

//init table
updateTable();

//read database
getFeedback();