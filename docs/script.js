const queryParams = new URLSearchParams(window.location.search);
var page = queryParams.get('page'); 
if (page === null) {
   page = "index.md";
else
   page = page + ".md";
}
