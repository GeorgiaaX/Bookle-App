//create click event for buttons
document.getElementById("search").addEventListener("click", getBook)
document.getElementById("feelingLucky").addEventListener("click", getRandomWord)

//get book api
function getBook(){

    document.getElementById("mainDiv").innerHTML = ""; // Clear previous content

    let searchTerm = document.querySelector("input").value.split(" ").join("+")
    const url = `https://openlibrary.org/search.json?q=${searchTerm}`
    document.querySelector("input").value = ""
    fetch(url)
    .then(res => res.json())
    .then(data => {
        for(i = 0; i < data.docs.length; i++){
            if(data.docs[i].has_fulltext && data.docs[i].title && data.docs[i].author_name && data.docs[i].oclc){
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card"); // Add card class

                let coverImageKey = data.docs[i].cover_edition_key;
                getCoverEdition(coverImageKey, cardDiv);

                const title = document.createElement("h2");
                title.textContent = data.docs[i].title;
                cardDiv.appendChild(title);

                const author = document.createElement("h3");
                author.textContent = data.docs[i].author_name[0];
                cardDiv.appendChild(author);

                const getBookDescription = data.docs[i].oclc[0];
                if (getBookDescription) {
                    getDescription(getBookDescription, cardDiv);
                }

                const rating = document.createElement("h4");
                rating.textContent = data.docs[i].ratings_average ? "Rating: " + data.docs[i].ratings_average : "";
                cardDiv.appendChild(rating);

                document.getElementById("mainDiv").appendChild(cardDiv);
            }
        }
    })
    .catch(err => {
        console.log(err);
    });
}


//create get randomword api
function getRandomWord() {

   fetch(`https://random-word-api.vercel.app/api?words=1`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        getRandomBook(data)
    })
    
}


function getRandomBook(data) {
    document.getElementById("mainDiv").innerText = ""
    let searchTerm = data
    fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.docs[0].cover_edition_key){
            const cardDiv = document.createElement("div")
                cardDiv.classList.add("card")
                let coverImageKey = data.docs[0].cover_edition_key
                getCoverEdition(coverImageKey, cardDiv)
                const title = document.createElement("h2")
                title.textContent = data.docs[0].title
                const author = document.createElement("h3")
                author.textContent =  data.docs[0].author_name[0]
                const rating = document.createElement("h4")
                if(!data.docs[0].ratings_average) {
                    rating.textContent = ""
                } else {
                    rating.textContent = "Rating: " + data.docs[0].ratings_average
                }


                const getBookDescription = data.docs[0].oclc[0];
                if (getBookDescription) {
                    getDescription(getBookDescription, cardDiv);
                }

                cardDiv.appendChild(title)
                cardDiv.appendChild(author)
                cardDiv.appendChild(rating)
                document.getElementById("mainDiv").appendChild(cardDiv);
        } else {
            getRandomWord()
        }

    })
    .catch(err => {
        console.log(err)
    })
}



function getCoverEdition(key, cardDiv) {
    const searchKey = key
    const imageUrl = `https://covers.openlibrary.org/b/olid/${searchKey}-L.jpg`;
    const image = document.createElement("img");
    image.src = imageUrl;
    cardDiv.appendChild(image);
}


function getDescription(OCLC, cardDiv) {
    let OCLCKey = OCLC
    let OCLCIdentifier = `OCLC:${OCLCKey}`
    fetch(`https://openlibrary.org/api/books?bibkeys=OCLC:${OCLCKey}&jscmd=details&format=json`)
    .then(res => res.json())
    .then(data => {

        console.log(data)
        
        let bookDescription = "No description found";

        if (data[OCLCIdentifier]?.details?.description?.value) {
            bookDescription = data[OCLCIdentifier].details.description.value;
        } else if (data[OCLCIdentifier]?.details?.description) {
            bookDescription = data[OCLCIdentifier].details.description;
        } else {
            console.log("No description available for " + OCLCIdentifier);
        }

        if (bookDescription) {
            const descriptionParagraph = document.createElement("p");
            descriptionParagraph.textContent = bookDescription;
            cardDiv.appendChild(descriptionParagraph);
        }
    })
    .catch(err => {
        console.log(err)
        
    })
    
}
