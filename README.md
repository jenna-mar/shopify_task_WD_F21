# Shopify - Web Developer Internship Challenge - F2021

### Description

Solution fulfils all listed requirements of the [Shopify - Fall 2021 - Web Developer Internship Challenge](https://docs.google.com/document/d/1SdR9rQpocsH5rPTOcxr9noqHRld5NJlylKO9Hf94U8U/edit#). Thus, it should be possible to search for movies using the Open Movie Database, and nominate selections from the results.

A deployed instance is available to view and test [here](--).

##### Bonus

  * Nominations are saved in case the user leaves the page
  * The search query is saved in the URL and can be shared for others' reference

### Assumptions

Here, we require an exact match for the input search parameter. Thus, to match a given movie, the input search value must be a substring of the object's "keywords" field value. 

Note that, by design, this is in contrast to behaviour implicit on the given [example mockup](https://docs.google.com/document/d/1SdR9rQpocsH5rPTOcxr9noqHRld5NJlylKO9Hf94U8U/edit#heading=h.c7xqfkhsqnd4) but strictly matches [listed requirements](https://docs.google.com/document/d/1SdR9rQpocsH5rPTOcxr9noqHRld5NJlylKO9Hf94U8U/edit#). 

To illustrate this subtle difference, note that, per the provided [design](https://docs.google.com/document/d/1SdR9rQpocsH5rPTOcxr9noqHRld5NJlylKO9Hf94U8U/edit#heading=h.c7xqfkhsqnd4), the movie titled "Rambo (1999)" is displayed as a result for the search query "ram". However, when one uses the search query "ram" in OMDB, this item **would not** be selected since the search query "ram" matches with movies containing only the word "ram" exactly. By design, since we prefer not to lemmatize word variants in order to resolve white space, we abide by the results provided by an OMDB search query for the given keyword.

### Prerequisites

Programatically, the command-line environment for installation requires:

  * [Ruby (>= v2.3.1)](https://www.ruby-lang.org/en/documentation/installation/)

### Setup

From the project directory:

* Install required gems via `bundle install`
* Run the database migration via `rails db:migrate`
* Instantiate a local server instance of the application via `rails server`

### Usage

Our web app should now be available at [http://localhost:3000](http://localhost:3000).

From this web interface, it should be possible to search for movies using the Open Movie Database, and nominate movies.