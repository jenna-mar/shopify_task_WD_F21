const omdb_url = "https://www.omdbapi.com/?apikey=b867de79&type=movie&"
//const apikey = "b867de79"
let timer;
let currentResults = [];
let nominatedMovies = [];

window.onload = initialize;

function initialize(){
	const search_input = document.getElementById("search");
	//pre-emptively disable this in case there is a URL query to process
	search_input.disabled = true;
	search_input.addEventListener("keyup", e => {
		clearTimeout(timer);
		timer = setTimeout(requestMovies, 1000);
	});
	//get nominated movies
	fetch("/nominations").then(response => {
		response.json().then(data => {
			nominatedMovies = data;
			populateMovieList(data);
			if (nominatedMovies.length >= 5){
				document.getElementById("finished-nominations-banner").style.visibility = "visible";
			}
			//after nominations are loaded, check if url has a query already
			const params = new URLSearchParams(window.location.search);
			const query = params.get('q');
			search_input.value = query;
			searchOMDB(query);
		})
	});
}

function requestMovies(){
	const search_input = document.getElementById("search");
	const query = search_input.value;
	search_input.disabled = true;
	history.pushState({'q':query}, '', '/?q='+encodeURIComponent(query));
	searchOMDB(query);
}

function searchOMDB(query){
	const search_input = document.getElementById("search");
	if (query && query.length !== 0){
		document.getElementById("results_list").innerHTML = "";
		//we will use the default search behavior from omdb, which searches only for titles containing the query word exactly (not containing).
		fetch(omdb_url+"s="+encodeURIComponent(query)).then(response => {
			response.json().then(function(data) {
				if (data.Search){
					//currentResults = data.Search;
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
						new_movie_button.disabled = nominatedMovies.some(n => n.imdbID === m.imdbID);
					});

					document.getElementById("results_list").appendChild(listElements);
				} else {
					document.getElementById("results_list").innerHTML = "No results found.";
				}
				if (document.getElementById("extra-text").style.visibility !== "visible") document.getElementById("extra-text").style.visibility = "visible";
				document.getElementById("query").innerHTML = query;
				search_input.disabled = false;
			});
		})
		.catch(error => {
			console.error("There was an error fetching from OMDb");
			document.getElementById("results_list").innerHTML = "Error encountered fetching results";
			search_input.disabled = false;
		});
	} else {
		search_input.disabled = false;
	}
}

//adds previously saved movies to nominations list.
function populateMovieList(data){
	let listElements = document.createDocumentFragment();
	
	data.forEach(m => {
		//make the list element
		let new_movie = document.createElement('li');
		let new_movie_button = document.createElement('button');
		
		new_movie.innerHTML = `${m.title} (${m.year})`;
		new_movie.appendChild(new_movie_button);
		listElements.appendChild(new_movie);

		new_movie_button.appendChild(document.createTextNode("Remove"));
		new_movie_button.setAttribute('name', m.imdbID);
		new_movie_button.addEventListener('click', remove);
	});

	document.getElementById("nominations_list").appendChild(listElements);
}

//js logic for adding a movie to the nominations list.
function nominate(title, year, id, e){
	let nomination = {"title": title, "year": year, "imdbID": id};
	saveNomination(nomination);
	
	let new_nomination = document.createElement('li');
	let new_nomination_button = document.createElement('button');
	
	new_nomination.innerHTML = `${title} (${year})`;
	new_nomination.appendChild(new_nomination_button);
	document.getElementById("nominations_list").appendChild(new_nomination);

	new_nomination_button.appendChild(document.createTextNode("Remove"));
	new_nomination_button.setAttribute('name', id);
	new_nomination_button.addEventListener('click', remove);
	
	e.target.disabled = true;
}

//js logic for removing a movie from the nominations list.
function remove(e){
	movie_id = e.target.name;
	e.target.parentElement.remove();
	if (document.getElementsByName(movie_id)[0]) document.getElementsByName(movie_id)[0].disabled = false;
	movie_index = nominatedMovies.findIndex(m => m.imdbID === movie_id);
	removeNomination(nominatedMovies[movie_index].id);
	nominatedMovies.splice(movie_index, 1);
}

//makes a POST request to the nomination controller.
function saveNomination(nomination){
	fetch("/nominations", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(nomination)
	}).then(response => {
		response.json().then(data => {
			nominatedMovies.push(data);
			//check number of nominations
			if (nominatedMovies.length >= 5){
				document.getElementById("finished-nominations-banner").style.visibility = "visible";
			}
		})
	});
}

//makes a DELETE request.
function removeNomination(id){
	fetch("/nominations/"+id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
