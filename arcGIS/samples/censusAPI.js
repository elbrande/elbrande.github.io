// Define the base URL and parameters
const baseUrl = "http://api.census.gov/data/2019/acs/acs5";
const params = new URLSearchParams({
  get: "NAME,B01001_001E",
  for: "state:06",
  key: "dbddbbd1f79360acdef480ac844b6bba9715d1c8"
});

// Construct the full URL
const url = `${baseUrl}?${params.toString()}`;

// Make the request
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Data received:", data);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });