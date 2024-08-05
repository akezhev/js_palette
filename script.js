function checkCookie() {
  if (document.cookie) {
    let cookie = document.cookie;
    cookie = cookie.split("; ");

    let cookieObj = {};

    for (let i = 0; i < cookie.length; i++) {
      let temp = cookie[i].split("=");
      cookieObj[temp[0]] = temp[1];
    }

    let templateForRGB = /^\d{1,3},\s?\d{1,3},\s?\d{1,3}$/;
    let templateForRGBA = /^\d{1,3},\s?\d{1,3},\s?\d{1,3}(,\s?\d)?$/;
    let templateForHEX = /^[a-f0-9]{6}|^[a-f0-9]{3}$/i;

    let colorContainer = document.querySelector(".all-colors__inner");

    for (let key in cookieObj) {
      if (templateForRGB.test(cookieObj[key])) {
        let colorBox = document.querySelector(".all-colors__item");
        let newColorBox = colorBox.cloneNode(true);

        newColorBox.style.backgroundColor = `rgb(${cookieObj[key]})`;
        newColorBox.querySelector(".all-colors__item-name").innerText = key;
        newColorBox.querySelector(".all-colors__item-type").innerText = "RGB";
        newColorBox.querySelector(".all-colors__item-code").innerText =
          cookieObj[key];

        colorContainer.appendChild(newColorBox);
      } else if (templateForRGBA.test(cookieObj[key])) {
        let colorBox = document.querySelector(".all-colors__item");
        let newColorBox = colorBox.cloneNode(true);

        newColorBox.style.backgroundColor = `rgba(${cookieObj[key]})`;
        newColorBox.querySelector(".all-colors__item-name").innerText = key;
        newColorBox.querySelector(".all-colors__item-type").innerText = "RGBA";
        newColorBox.querySelector(".all-colors__item-code").innerText =
          cookieObj[key];

        colorContainer.appendChild(newColorBox);
      } else if (templateForHEX.test(cookieObj[key])) {
        let colorBox = document.querySelector(".all-colors__item");
        let newColorBox = colorBox.cloneNode(true);

        newColorBox.style.backgroundColor = `#${cookieObj[key]}`;
        newColorBox.querySelector(".all-colors__item-name").innerText = key;
        newColorBox.querySelector(".all-colors__item-type").innerText = "HEX";
        newColorBox.querySelector(
          ".all-colors__item-code"
        ).innerText = `#${cookieObj[key]}`;

        colorContainer.appendChild(newColorBox);
      }
    }
    console.log(cookieObj);
  }
}

function addColor() {
  // получаю обертку элементов цветов из разметки
  let colorContainer = document.querySelector(".all-colors__inner");

  // получаю один элемент (box) цвета
  let colorBox = document.querySelector(".all-colors__item");

  // клонирую один элемент (box) цвета, для дальнейшей его вставки в разметку
  // с новыми данными, введеными пользователем
  let newColorBox = colorBox.cloneNode(true);

  // Получаю названия всех цветов на данный момент в разметке
  // и помещаю их в массив
  let colorNames = document.getElementsByClassName("all-colors__item-name");
  colorNames = Array.from(colorNames);
  colorNames = colorNames.map(function (el) {
    return el.innerText.toLowerCase();
  });

  let colorName = document.getElementById("colorName").value; // получаю значение названия цвета, введенное пользователем
  let colorType = document.getElementById("colorType").value; // получаю тип цвета, выбранный пользователем
  let colorCode = document.getElementById("colorCode").value; // получаю код цвета, введенный пользователем

  // заготавливаю шаблоны для сверки их с данными, введенными пользователем
  let templateForColorName = /^[a-z]+$/i;
  let templateForRGB = /^\d{1,3},\s?\d{1,3},\s?\d{1,3}$/;
  let templateForRGBA = /^\d{1,3},\s?\d{1,3},\s?\d{1,3}(,\s?\d)?$/;
  let templateForHEX = /^[a-f0-9]{6}|^[a-f0-9]{3}$/i;

  // получаю раннее вставленные в разметку span-ы для вывода туда ошибок, если это необходимо
  let errorsOut = document.querySelectorAll(".err-msg");

  // Проверка названия цвета
  if (colorName == "") {
    errorsOut[0].innerText = "Это поле обязательное";
    return false;
  } else if (colorName) {
    errorsOut[0].innerText = "";

    if (!templateForColorName.test(colorName)) {
      errorsOut[0].innerText =
        "Название цвета должно содержать только буквы (без пробелов, тире и т.д)";
      return false;
    }
  }

  if (colorNames.includes(colorName.toLowerCase())) {
    errorsOut[0].innerText = "Такое название цвета уже есть";
    return false;
  }

  // Проверка на соответсвие RGB
  if (colorType == "RGB") {
    if (colorCode == "") {
      errorsOut[1].innerText = "Это поле обязательное";
      return false;
    } else if (colorCode) {
      errorsOut[1].innerText = "";
      if (!templateForRGB.test(colorCode)) {
        errorsOut[1].innerText =
          "Код RBG цвета должен содержать 3 числа, разделенных запятыми";
        return false;
      } else {
        let tempColorCodeValues = colorCode.split(",");
        let flag = true;

        for (let i = 0; i < tempColorCodeValues.length; i++) {
          if (Number(tempColorCodeValues[i]) > 255) {
            flag = false;
            break;
          }
        }

        if (!flag) {
          errorsOut[1].innerText =
            "Любое из значений цвета типа RGB не должно превышать 255";
          return false;
        } else {
          newColorBox.style.backgroundColor = `rgb(${colorCode})`;
          newColorBox.querySelector(".all-colors__item-name").innerText =
            colorName;
          newColorBox.querySelector(".all-colors__item-type").innerText =
            colorType;
          newColorBox.querySelector(".all-colors__item-code").innerText =
            colorCode;
        }
      }
    }
  }

  // Проверка на соответсвие RGBA
  if (colorType == "RGBA") {
    if (colorCode == "") {
      errorsOut[1].innerText = "Это поле обязательное";
      return false;
    } else if (colorCode) {
      errorsOut[1].innerText = "";

      if (!templateForRGBA.test(colorCode)) {
        errorsOut[1].innerText =
          "Код цвета RGBA должен содержать 4 числа, разделенных запятыми.";
        return false;
      } else {
        let tempColorCodeValues = colorCode.split(",");
        let flag = true;

        for (let i = 0; i < 3; i++) {
          if (Number(tempColorCodeValues[i]) > 255) {
            flag = false;
            break;
          }
        }
        if (!flag) {
          errorsOut[1].innerText =
            "Первые 3 значения цвета типа RGBA не должны превышать 255";
          return false;
        } else {
          if (Number(tempColorCodeValues[3]) > 1) {
            errorsOut[1].innerText =
              "Последнее значение кода типа RGBA не должно превышать 1";
            return false;
          } else {
            newColorBox.style.backgroundColor = `rgba(${colorCode})`;
            newColorBox.querySelector(".all-colors__item-name").innerText =
              colorName;
            newColorBox.querySelector(".all-colors__item-type").innerText =
              colorType;
            newColorBox.querySelector(".all-colors__item-code").innerText =
              colorCode;
          }
        }
      }
    }
  }

  // Проверка на соответсвие HEX
  if (colorType == "HEX") {
    if (colorCode == "") {
      errorsOut[1].innerText = "Это поле обязательное";
      return false;
    } else if (colorCode) {
      errorsOut[1].innerText = "";

      if (!templateForHEX.test(colorCode)) {
        errorsOut[1].innerText =
          "Код цвета HEX должен содержать 6 цифр или букв от A до F.";
        return false;
      } else {
        newColorBox.style.backgroundColor = `#${colorCode}`;
        newColorBox.querySelector(".all-colors__item-name").innerText =
          colorName;
        newColorBox.querySelector(".all-colors__item-type").innerText =
          colorType;
        newColorBox.querySelector(".all-colors__item-code").innerText =
          "#" + colorCode;
      }
    }
  }

  // готовлю переменную с "временем жизни cookie" (на 3 час)
  let expDate = new Date();
  expDate.setTime(new Date().getTime() + 180 * 1000);

  // устанавливаю cookie
  document.cookie =
    colorName +
    "=" +
    colorCode +
    ";" +
    "expires=" +
    expDate.toGMTString() +
    ";" +
    "path=/";

  // добавляю новоиспеченный блок с данными, введеными пользователем в разметку
  colorContainer.appendChild(newColorBox);

  // запрещаю отправку формы
  return false;
}
