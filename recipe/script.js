const meals = document.getElementById("meals");
const favContainer = document.getElementById("meals-ul");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

const mealContainer = document.getElementById("meal-info-container");

const mealInfo = document.getElementById("meal-info");

const randomBtn = document.getElementById("random");

const randomMeal = async () => {
  meals.style.justifyContent = "center";
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const data = await resp.json();
  console.log(data);
  loadMeal(data["meals"][0]);
};

const loadMeal = (data) => {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `<div class="meal-header">
                    <img
                        src="${data.strMealThumb}"
                        alt="${data.strMeal}"
                        id="mealimg"
                    />
                    </div>
                    <div class="meal-body">
                    <h4>${data.strMeal}</h4>
                    <button class="fa-btn"><i class="fas fa-heart fa-2x"></i></button>
                    </div>`;
  meals.appendChild(meal);

  const likemeal = loadMealLS();
  const likebtn = meal.querySelector(".fa-btn");

  if (likemeal.includes(data.idMeal)) {
    likebtn.classList.toggle("active");
  }

  likebtn.addEventListener("click", () => {
    if (likebtn.classList.contains("active")) {
      removeMealLS(data.idMeal);
    } else {
      addMealLS(data.idMeal);
    }
    likebtn.classList.toggle("active");
    fetchlikeMeal();
  });

  const mealimg = meal.querySelector("img");
  mealimg.addEventListener("click", () => {
    popupInfo(data);
  });
};

const loadfavMeal = (data) => {
  const fav = document.createElement("li");
  fav.innerHTML = `
                <img
                    src="${data.strMealThumb}"
                    alt="${data.strMeal}"
                />
                <h3>${data.strMeal}</h3>
                <button class="remove"><i class="far fa-times-circle"></i></button>
                `;

  const removebtn = fav.querySelector(".remove");
  removebtn.addEventListener("click", () => {
    removeMealLS(data.idMeal);
    fetchlikeMeal();

    const meallist = document.querySelectorAll(".meal-body");
    for (let i = 0; i < meallist.length; ++i) {
      if (meallist[i].children[0].outerText === data.strMeal) {
        meallist[i].querySelector(".fa-btn").classList.toggle("active");
      }
    }
  });

  const favimg = fav.querySelector("img");
  favimg.addEventListener("click", () => {
    popupInfo(data);
  });

  favContainer.appendChild(fav);
};

const loadMealLS = () => {
  const meals = JSON.parse(localStorage.getItem("allmeals"));

  return meals === null ? [] : meals;
};

const addMealLS = (mealId) => {
  const meals = loadMealLS();

  localStorage.setItem("allmeals", JSON.stringify([...meals, mealId]));
};

const removeMealLS = (mealId) => {
  const meals = loadMealLS();

  localStorage.setItem(
    "allmeals",
    JSON.stringify(meals.filter((id) => id != mealId))
  );
};

const fetchMealbyID = async (mealId) => {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await resp.json();

  return data["meals"][0];
};

const fetchlikeMeal = async () => {
  favContainer.innerHTML = ``;
  const meals = loadMealLS();

  if (meals.length == 0) {
    const empty = document.createElement("h3");
    empty.innerHTML = "There are no favorite meal";
    favContainer.appendChild(empty);
  } else {
    if (meals.length > 3) {
      favContainer.style.justifyContent = "stretch";
    } else {
      favContainer.style.justifyContent = "center";
    }

    for (let i = 0; i < meals.length; ++i) {
      const meal = await fetchMealbyID(meals[i]);
      loadfavMeal(meal);
    }
  }
};

const searchbyTerm = async (term) => {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=` + term
  );
  const data = await resp.json();

  return data["meals"];
};

searchTerm.addEventListener("search", async () => {
  if (searchTerm.value) {
    meals.innerHTML = "";
    const searchMeals = await searchbyTerm(searchTerm.value);

    if (searchMeals) {
      if (searchMeals.length > 1) {
        meals.style.justifyContent = "stretch";
      } else {
        meals.style.justifyContent = "center";
      }
      searchMeals.forEach((meal) => loadMeal(meal));
    }

    searchTerm.value = "";
  }
});

const popupInfo = (mealData) => {
  mealContainer.classList.remove("hidden");
  mealInfo.innerHTML = "";
  const ingredient = [];
  for (let i = 1; i <= 20; ++i) {
    if (mealData[`strIngredient${i}`]) {
      ingredient.push(
        `${mealData[`strIngredient${i}`]} - ${mealData[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  const info = document.createElement("div");
  info.innerHTML = `
                  <button id="close" class="close"><i class="fas fa-times"></i></button>
                  <h1>${mealData.strMeal}</h1>
                  <img
                    src="${mealData.strMealThumb}"
                    alt=""
                  />
                  <p>
                    ${mealData.strInstructions}
                  </p>
                  <h1>Ingredient</h1>
                  <ul>
                    ${ingredient.map((data) => `<li>${data}</li>`).join("")}
                  </ul>
                  `;
  mealInfo.appendChild(info);

  mealContainer.addEventListener("click", (e) => {
    if (e.target === mealContainer) {
      mealContainer.classList.add("hidden");
    }
  });

  const infoBtn = document.getElementById("close");
  infoBtn.addEventListener("click", () => {
    mealContainer.classList.add("hidden");
  });
};

randomBtn.addEventListener("click", () => {
  meals.innerHTML = "";
  randomMeal();
});

fetchlikeMeal();
randomMeal();
