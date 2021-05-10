const omdb_url = "http://www.omdbapi.com/?apikey=b867de79&type=movie&"
//const apikey = "b867de79"
let timer;
let currentResults = [];
let nominatedMovies = [];

window.onload = initialize;

function initialize(){
	const search_input = document.getElementById("search");
	search_input.addEventListener("keyup", e => {
		clearTimeout(timer);
		timer = setTimeout(searchOMDB, 1000);
	});
}

function searchOMDB(){
	const search_input = document.getElementById("search");
	const query = search_input.value;
	document.getElementById("results_list").innerHTML = "";
	
	if (query.length !== 0){
		search_input.disabled = true;
		//?? we will use a wildcard search to emulate results seen in the example image.
		fetch(omdb_url+"s="+encodeURIComponent(query)).then(response => {
			response.json().then(function(data) {
				if (data.Search){
					currentResults = data.Search;
					let listElements = document.createDocumentFragment();
					data.Search.forEach(m => {
						//make the list element
						let new_movie = document.createElement('li');
						let new_movie_button = document.createElement('button');
						
						new_movie.innerHTML = `${m.Title} (${m.Year})`;
						new_movie.appendChild(new_movie_button);
						listElements.appendChild(new_movie);

						
						new_movie_button.appendChild(document.createTextNode("Nominate"));
						new_movie_button.setAttribute('name', m.imdbID);
						new_movie_button.addEventListener('click', nominate.bind(event, m.Title, m.Year, m.imdbID));
						//check if movie has already been nominated, disable button
						new_movie_button.disabled = nominatedMovies.some(n => n.id === m.imdbID);
					});

					document.getElementById("results_list").appendChild(listElements);
				} else {
					document.getElementById("results_list").innerHTML += "No results found.";
				}
				document.getElementById("query").innerHTML = query;
				search_input.disabled = false;
			});
		})
		.catch(error => {
			console.error("There was an error fetching from OMDb");
			search_input.disabled = false;
		});
	}
}

function nominate(title, year, id, e){
	nominatedMovies.push({"title": title, "year": year, "id": id});
	
	let new_nomination = document.createElement('li');
	let new_nomination_button = document.createElement('button');
	
	new_nomination.innerHTML = `${title} (${year})`;
	new_nomination.appendChild(new_nomination_button);
	document.getElementById("nominations_list").appendChild(new_nomination);

	new_nomination_button.appendChild(document.createTextNode("Remove"));
	new_nomination_button.setAttribute('name', id);
	new_nomination_button.addEventListener('click', remove);
	
	e.target.disabled = true;

	//check number of nominations
	if (nominatedMovies.length >= 5){
		document.getElementById("finished-nominations-banner").style.visibility = "visible";
	}
}

function remove(e){
	movie_id = e.target.name;
	e.target.parentElement.remove();
	if (document.getElementsByName(movie_id)[0]) document.getElementsByName(movie_id)[0].disabled = false;
	nominatedMovies = nominatedMovies.filter(m => (m.id !== movie_id));
}
