/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const recipeList = document.getElementById("recipe-list");

    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitInput = document.getElementById("add-recipe-submit-input");

    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitInput = document.getElementById("update-recipe-submit-input");

    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const deleteRecipeSubmitInput = document.getElementById("delete-recipe-submit-input");
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")){
        logoutButton.hidden = false;
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true"){
        adminLink.hidden = false;
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    searchButton.addEventListener("click", searchRecipes);
    addRecipeSubmitInput.addEventListener("click", addRecipe);
    updateRecipeSubmitInput.addEventListener("click", updateRecipe);
    deleteRecipeSubmitInput.addEventListener("click", deleteRecipe);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();
    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        try {
            const reponse = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(searchTerm)}`, {
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth-token")}
            });
            if (!response.ok){
                throw new Error("Failed to fetch recipes");
            }
            recipes = await response.json();
            refreshRecipeList();
        }
        catch(error){
            console.error(error);
            alert("Error loading recipes");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        try {
            const name = addRecipeNameInput.value.trim();
            const instructions = addRecipeInstructionsInput.value;
    
            if(!name.trim() || !instructions.trim()){
                alert("Please fill out all fields.");
                return;
            }
    
            const requestBody = { name, instructions};
    
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("auth-token")},
                body: JSON.stringify(requestBody)
            });

            if (response.ok){
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value = "";
                await getRecipes();
            }
            else{
                alert("Could not add recipe.");
            }
        }
        catch(error){
            console.error("Error", error);
            alert("Error adding recipe.");
        }

    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        try {
            const name = updateRecipeNameInput.value.trim();
            const instructions = updateRecipeInstructionsInput.value.trim();
    
            if(!name || !instructions){
                alert("Please fill out all fields.");
                return;
            }
            
            const recipe = recipes.find(recipe => recipe.name.toLowerCase() === name.toLowerCase());
            if(!recipe){
                alert("Recipe not found.");
                return;
            }

            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({...recipe, instructions})
            });
    
            if(response.ok) {
                updateRecipeNameInput.value = "";
                updateRecipeInstructionsInput.value = "";
                await getRecipes();
            }
            else {
                alert("Could not update recipe.");
            }
        }
        catch (error){
            console.error("update recipe error", error);
            alert("Error updating recipe.");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        try {
            const name = deleteRecipeNameInput.value.trim();

            if(!name){
                alert("Please filled out all fields.");
            }

            const recipe = recipes.find(recipe => recipe.name.toLowerCase() == name.toLowerCase);
            if(!recipe){
                alert("Recipe not found.");
                return;
            }

            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });

            if(response.ok){
                deleteRecipeNameInput.value = "";
                await getRecipes();
            }
            else{
                alert("Could not delete recipe.");
            }
        }
        catch (error) {
            console.error("delete recipe error", error);
            alert("Error deleting recipe.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("auth-token")}
            });
            if (!response.ok){
                throw new Error("Failed to fetch recipes");
            }
            recipes = await response.json();
            refreshRecipeList();
        }
        catch(error){
            console.error(error);
            alert("Error loading recipes");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
    }

});
