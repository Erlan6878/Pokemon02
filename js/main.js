const API = "http://localhost:8000/Pokemon";

let inpName = document.querySelector("#inpName");
let inpXP = document.querySelector("#inpXP");
let inpImage = document.querySelector("#inpImage");
let inpPrice = document.querySelector("#inpPrice");
let inptip = document.querySelector("#inptip");
let btnAdd = document.querySelector("#btnAdd");
let btnOpenForm = document.querySelector("#flush-collapseOne");
let sectionBooks = document.querySelector("#sectionBooks");


let currentPage = 1;
let countPage = 1;


let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");


let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";




let detailsContainer = document.querySelector(".details");

//todo------------------------------------------------------
btnAdd.addEventListener("click", () => {
 
  if (
    !inpName.value.trim() ||
    !inpXP.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim() ||
    !inptip.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
 
  let newPokemon = {
    pokeName: inpName.value,
    pokeXP: inpXP.value,
    pokeImage: inpImage.value,
    pokePrice: inpPrice.value,
    poketip: inptip.value,
  };
  createPokemon(newPokemon); 
  
  readPokemon(); 
});

//todo\\\\\\\\\\\\\\\\\\\\\ CREATE \\\\\\\\\\\\\\\\\\\\\\\\\\

function createPokemon(poke) {
  fetch(API, {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(poke),
  });
 
  inpName.value = "";
  inpXP.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  inptip.value = "";

 
  btnOpenForm.classList.toggle("show");
}

//todo \\\\\\\\\\\\\\\\\\\\\\ READ \\\\\\\\\\\\\\\\\\\\\\\\\\\

async function readPokemon() {
  const response = await fetch(

    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  );
  const data = await response.json();
  sectionBooks.innerHTML = "";
  data.forEach((elem) => {
    sectionBooks.innerHTML += `
    <div class="card m-4 cardPokemon" style="width: 18rem">
    <img
      src="${elem.pokeImage}"
      alt="Image"
      id="${elem.id}"
      class="card-img-top deteilsCard"
      style="height: 280px"
    />
    <div class="card-body">
      <h5 class="card-title">${elem.pokeName}</h5>
      <p class="card-text">${elem.pokeXP}</p>
      <p class="card-text">${elem.poketip}</p>
      <span class="card-text">${elem.pokePrice}</span>
      <div>
  
    <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Информация о карточке</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Здесь размещаете информацию о карточке, которую хотите отобразить -->
          <p>Фото:  <img
          src="${elem.pokeImage}"
          alt="Image"
          id="${elem.id}"
          class="card-img-top deteilsCard"
          style="height: 280px"
        /></p>
          <p>Название: <span id="cardName">${elem.pokeName.id}</span></p>
          <p>XP: <span id="cardXP">${elem.pokeXP.id}</span></p>
          <p>Цена: <span id="cardPrice">${elem.pokePrice.id}</span></p>
          <p>Тип: <span id="cardType">${elem.poketip}</span></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
      <button type="button" id="${elem.id}" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#myModal">
      Показать информацию
    </button>

        <button class="btn btn-outline-danger btnDelete" id="${elem.id}">
          Удалить
        </button>
        <button
          class="btn btn-outline-warning btnEdit"
          id="${elem.id}"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Изменить
        </button>
        

      </div>
    </div>
  </div>
    `;
  });
  pageFunc();
}
readPokemon();
//todo \\\\\\\\\\\\\\\\\\\\\\\\\\\\ DELETE ///////////////////////////////
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList]
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readPokemon()); 
  }
});

//todo\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ EDIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let editInpName = document.querySelector("#editInpName");
let editInpXP = document.querySelector("#editInpXP");
let editInpImage = document.querySelector("#editInpImage");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");
let editInptip = document.querySelector("#editInptip");
document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        editInpName.value = data.pokeName;
        editInpXP.value = data.pokeXP;
        editInpImage.value = data.pokeImage;
        editInpPrice.value = data.pokePrice;
        editInptip.value = data.poketip;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedPokemon = {
    pokeName: editInpName.value,
    pokeXP: editInpXP.value,
    pokeImage: editInpImage.value,
    pokePrice: editInpPrice.value,
    poketip: editInptip.value,
  };
  editPokemon(editedPokemon, editBtnSave.id);
});
function editPokemon(editPokemon, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editPokemon),
  }).then(() => readPokemon());
}

//todo /////////////////////////// PAGINATION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      
      countPage = Math.ceil(data.length / 3);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readPokemon();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readPokemon();
});

//todo //////////////////////////// SEARCH \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

currentPage = 1;
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
  readPokemon(); 
});

//todo ////////////////// Model \\\\\\\\\\\\\\\


document.getElementById('cardName').innerText = 'Название вашей карточки';
document.getElementById('cardXP').innerText = 'XP вашей карточки';
document.getElementById('cardImage').src = 'путь к изображению';
document.getElementById('cardPrice').innerText = 'Цена вашей карточки';
document.getElementById('cardType').innerText = 'Тип вашей карточки';


