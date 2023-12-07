const API = "http://localhost:8000/Pokemon";
// Сохраняем в переменные все инпуты для ввода данных и кнопки
let inpName = document.querySelector("#inpName");
let inpXP = document.querySelector("#inpXP");
let inpImage = document.querySelector("#inpImage");
let inpPrice = document.querySelector("#inpPrice");
let inptip = document.querySelector("#inptip");
let btnAdd = document.querySelector("#btnAdd");
let btnOpenForm = document.querySelector("#flush-collapseOne");
let sectionBooks = document.querySelector("#sectionBooks");

// Переменные для пагинации
let currentPage = 1;
let countPage = 1;

// Кнопки для пагинации
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");

// Переменная для поиска
let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";

// Переменная для корзины

// Переменная для детального обзора
let detailsContainer = document.querySelector(".details");

// Навешиваем событие на кнопку добавить
btnAdd.addEventListener("click", () => {
  // Проверка на заполненность полей
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
  // Создаем новый обьект, куда добавляет значение наших инпутов (Создание новой книги)
  let newPokemon = {
    pokeName: inpName.value,
    pokeXP: inpXP.value,
    pokeImage: inpImage.value,
    pokePrice: inpPrice.value,
    poketip: inptip.value,
  };
  createPokemon(newPokemon); // Вызываем функцию для добавления новой книги
  // в базу данных и передаем в качестве аргумента обьект, созданный выше
  readPokemon(); // вызываем функцию для отображения данных
});

//!======================= CREATE =========================
// функция для добавления новых книг в базу данных
function createPokemon(poke) {
  fetch(API, {
    // отправляем запрос методом POST, для отправки данных
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(poke),
  });
  // совершаем очистку инпутов
  inpName.value = "";
  inpXP.value = "";
  inpImage.value = "";
  inpPrice.value = "";
  inptip.value = "";

  // меняем класс с помощью toggle у аккордиона, для того чтобы закрывался аккордион
  btnOpenForm.classList.toggle("show");
}

//!======================== READ ==========================
// создаем функцию для отображения данных
async function readPokemon() {
  const response = await fetch(
    // получение данных из базы, передаем значение инпута в запрос мы должны прописать обязательно ?_q={}
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  );
  const data = await response.json();
  // очищаем наш тег, чтобы не было дубликатов
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
          <p>Название: <span id="cardName">${elem.pokeName}</span></p>
          <p>XP: <span id="cardXP">${elem.pokeXP}</span></p>
          <p>Цена: <span id="cardPrice">${elem.pokePrice}</span></p>
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
// один раз вызываем функцию для отображения данных, для того чтобы данные при первом открытии сайта, данные отобразились
readPokemon();
// todo---------------------------------------------------------







//!======================= DELETE ==========================
// событие на кнопку удаление
document.addEventListener("click", (e) => {
  // сохраняем массив с классами в переменную
  let del_class = [...e.target.classList];

  // проверяем есть ли в нашем массиве класс btnDelete
  if (del_class.includes("btnDelete")) {
    // сохраняем id элемента, по которому кликнули
    let del_id = e.target.id;

    // делаем запрос методом DELETE
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readPokemon()); // вызываем функцию отображения данных,
    // для того чтобы все перезагрузилось сразу же после удаления одной книги
  }
});

//!======================== EDIT =============================
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

//!==================== PAGINATION ========================
// функция для отображения определенных элементов на странице(в зависимости от указанного кол-во элементов)
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // записываем в переменную countPage = текущую страницу
      countPage = Math.ceil(data.length / 3);
    });
}

prevBtn.addEventListener("click", () => {
  // проверяем на какой странице мы сейчас находимся
  if (currentPage <= 1) return;
  currentPage--;
  readPokemon();
});

nextBtn.addEventListener("click", () => {
  // проверяем на какой странице мы сейчас находимся
  if (currentPage >= countPage) return;
  currentPage++;
  readPokemon();
});

//!====================== SEARCH ==========================
// добавляем слушатель событий для поля ввода в inpSearch. Он реагирует на событие input,
// то есть каждый раз, когда пользователь что-то вводит в инпут.
// Внутри этого слушателя событий есть стрелочня функция которая выполняется при каждом событии input.
// e.target.value содержит значение, введенное пользователем в инпут.
currentPage = 1;
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
  readPokemon(); // вызов функции для мгновенного отображения
});

//!================== Корзина =====================

// Пример заполнения модального окна данными
document.getElementById('cardName').innerText = 'Название вашей карточки';
document.getElementById('cardXP').innerText = 'XP вашей карточки';
document.getElementById('cardImage').src = 'путь к изображению';
document.getElementById('cardPrice').innerText = 'Цена вашей карточки';
document.getElementById('cardType').innerText = 'Тип вашей карточки';

























// /* <button class="detailsCard btn btn-outline-warning">
//         Подробнее
//         </button> */

// document.querySelector("click", (e) => {
//   let classImg = [e.target.classList];
//   if (classImg.includes("detailsCard")) {
//     details(e.target.id);
//   }
// });

// async function details(id) {
//   try {
//     const res = await fetch(`${API}/${id}`);
//     const data = await res.json();
//     displayDetails(data);

//     if (!res.ok) {
//       console.log(`HTTP ERROR! STATUS: ${res.status}`);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// let btnDetails = document.querySelector(".detailsCard");
// btnDetails.addEventListener("click", () => {
//   sectionBooks.style.display = "none";
// });

// function displayDetails(data) {
//   detailsContainer.innerHTML = `
//   <img src="${data.bookImage}" alt="Image">
//   <h2>${data.bookName}</h2>
//   <span>${data.bookAuthor}</span>
//   <p>${data.bookPrice}</p>
//  `;
// }
