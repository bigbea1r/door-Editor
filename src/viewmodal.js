// viewModel.js
export default class ViewModal {

    constructor() {
        this.menu_is_open = 'block';
        this.menu_is_clouse = 'none';
        this.slider = 'slider';
        this.state = "state";
        this.idHtml = this.idHtml

    }
    selObjModels(textureFirstObj, textureSecondObj, textureThirdObj, objectItem, styleClass) {
        console.log(objectItem);
        if (objectItem.id == 1) {
            this.buildTextureButtons(textureFirstObj, objectItem, styleClass);
        }   else if (objectItem.id == 2) {
            this.buildTextureButtons(textureSecondObj, objectItem, styleClass);
        }   else if (objectItem.id == 3) {
            this.buildTextureButtons(textureThirdObj, objectItem, styleClass);
        }
    }
    
    // Метод для отображения кнопок текстур
    buildTextureButtons(textureButtons, objectItem, styleClass) {
        this.idHtml = document.getElementById(styleClass);
        this.idHtml.innerHTML = "";
        this.createTextureButtons(textureButtons, objectItem);
    }
    
    // Метод для создания кнопок текстур
    createTextureButtons(textureButtons, objectItem) {
        textureButtons.forEach(textureItem => {
            let button = document.createElement("button");
            button.textContent = textureItem.name;
            button.onclick = () => {
                // При клике на кнопку столешницы или основания выдавать массив кнопок своих текстур
                this.applicationTextureObj(objectItem, textureItem);
            };
            this.idHtml.appendChild(button);
        });
    }
    
    // Метод для выбора текстуры столешницы или основания
    applicationTextureObj(objectItem, textureItem) {
        Object.values(objectItem.object).forEach(object => {
            object.material.map = textureItem.texture;
        });
    }
    
    openMenu1(doc){
            if (doc.style.display === this.menu_is_open) {
                doc.style.display = this.menu_is_clouse;
            } else {
                doc.style.display = this.menu_is_open;
            }
    }
    createNewModel(model1, model2) {
        document.getElementById(this.state).onclick = () => {
            if (model1.visible === true) {
                model1.visible = false;
                model2.visible = true;
                // console.log("Большой стол");
            } else {
                model1.visible = true;
                model2.visible = false;
                // console.log("Маленький стол");
            }
        };
    }
    
    settingsPosition(model) {
        const slider = document.getElementById(this.slider);
        slider.addEventListener('input', () => {
            let value = parseFloat(slider.value);
            let newPosition = value * 1 - 0; 
            model.position.setY(newPosition);
        });
    }
    
 }
