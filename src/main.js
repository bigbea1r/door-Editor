// Импорты
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import ModalConstruct from './constructor.js';
import ViewModal from './viewmodal.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Создание экземпляра объекта ViewModal
let viewModal = new ViewModal();

// Модели
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Текстуры
const textureLoader = new THREE.TextureLoader();

// Функция загрузки текстур
const loadTexture = (path) => {
  const texture = textureLoader.load(path);
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
};

// BC
const D1_baseColor = loadTexture('/textures/BaseColor/D1_wood1. DoorBase. BC.png');
const D2_baseColor = loadTexture('/textures/BaseColor/D2_wood2. DoorBase. BC.png');
const D3_BC_Plastic = loadTexture('/textures/BaseColor/D3_BlackPlastic. DoorBase. BC.png');
const H1_baseColor = loadTexture('/textures/BaseColor/H1_Silver. Handle. BC.png');
const H2_G_baseColor = loadTexture('/textures/BaseColor/H2_Gold. Handle. BC.png');
const H3_GP_baseColor = loadTexture('/textures/BaseColor/H3_GlossyPlastic. Handle. BC.png');
const W1_baseColor = loadTexture('/textures/BaseColor/W1_Glass. Window. BC.png');
const W2_M_baseColor = loadTexture('/textures/BaseColor/W2_Mirror. Window. BC.png');
const W3_MG_baseColor = loadTexture('/textures/BaseColor/W3_MatteGlass. Window. BC.png');

// RoughMet
const D1_Rough = loadTexture('/textures/RoughMet/D1_wood1. DoorBase. RoughMet.png');
const D2_Rough = loadTexture('/textures/RoughMet/D2_wood2. DoorBase. RoughMet.png');
const D3_Rough = loadTexture('/textures/RoughMet/D3_BlackPlastic. DoorBase. RoughMet.png');

// NRM
const D2_NRM = loadTexture('/textures/NRM/D2_wood2. DoorBase. NRM.png');


// Создание группы для источников света
const lightHolder = new THREE.Group();

//Создание и добавление освещения
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// lightHolder.add(ambientLight);

const firstLight = new THREE.PointLight(0xffffff, 1);
firstLight.position.set(-1, 1, 3);
lightHolder.add(firstLight);
const secondLight = new THREE.PointLight(0xffffff, 1);
secondLight.position.set(1, 1, -3);
lightHolder.add(secondLight);

scene.add(lightHolder);

// const pointLightHelper = new THREE.PointLightHelper( firstLight );
// scene.add( pointLightHelper );
// Размеры
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Камера
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 6);
scene.add(camera);

// Управление
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Рендерер
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.localClippingEnabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#00ff00', 1); //"#cfcfcf"

// Загрузка моделей и скрытие прелоадера после загрузки
const loadPromises = [];

let Door;
let Box;
let Handle1;
let Window;


let groupModelSecond
// Загрузка модели стола
loadPromises.push(new Promise((resolve, reject) => {
    gltfLoader.load(
        '/models/DoorSmall. Closed.glb',
        (gltf) => {
            const firstModel = gltf.scene;
            console.log(firstModel);
            //Элементы обычного стола
            Door = firstModel.getObjectByName('Door');
            Box = firstModel.getObjectByName('Box');
            Handle1 = firstModel.getObjectByName('Handle1');
            Window = firstModel.getObjectByName('Window');
            firstModel.rotation.y = 1.58; 
            firstModel.position.y = -0.8;
            firstModel.visible = true;


            // Создание группы для обычного стола
            let groupModelFirst = new THREE.Group();
            groupModelFirst.add(Door);
            groupModelFirst.add(Box);
            groupModelFirst.add(Handle1);
            groupModelFirst.add(Window);
            //убрать данные костыли
            groupModelFirst.rotation.y = 1.58; 
            groupModelFirst.position.y = -0.8;
            Window.position.x = 0.025;
            Window.position.y = 0;
            Window.position.z = 0;

            scene.add(groupModelFirst);

            //массивы для построения кнопок
            let door = [];
            let doorLeaf = [
                { texture: D1_baseColor, name: "Светлое дерево" },
                { texture: D2_baseColor, name: "Темное дерево" },
                { texture: D3_BC_Plastic, name: "Чёрный пластик" },
            ];
            let doorHandle = [
                { texture: H1_baseColor, name: "Серебренная" },
                { texture: H2_G_baseColor, name: "Золотистая" },
                { texture: H3_GP_baseColor, name: "Белый пластик" },
            ];
            let doorWindow = [
                { texture: W1_baseColor, name: "Прозрачное" },
                { texture: W2_M_baseColor, name: "Матовое" },
                { texture: W3_MG_baseColor, name: "Полупрозрачное" },
            ];


            // Создание большого стола
            gltfLoader.load(
                '/models/DoorBig. Closed.glb',
                (gltf) => {
                    const secondModel = gltf.scene;
                    console.log(secondModel)
                    secondModel.visible = false;

                    let secondDoorRight = secondModel.getObjectByName("door_big_R");
                    let secondDoorLeft = secondModel.getObjectByName("door_big_L");
                    let secondDoorBox = secondModel.getObjectByName("door_big_box");

                    let secondHandleRight = secondModel.getObjectByName("hande_big_R");
                    let secondHandleLeft = secondModel.getObjectByName("hande_big_L");

                    let secondWindowRight = secondModel.getObjectByName("win_big_r");
                    let secondWindowLeft = secondModel.getObjectByName("win_big_L");

                    //убрать данные костыли
                    secondModel.rotation.y = 1.58;
                    secondModel.position.y = -0.8;


                    //Создание группы для большого стола
                    groupModelSecond = new THREE.Group(); 
                    groupModelSecond.visible = false; 

                    groupModelSecond.add(secondDoorRight);
                    groupModelSecond.add(secondDoorLeft);
                    groupModelSecond.add(secondDoorBox);
                    groupModelSecond.add(secondHandleRight);
                    groupModelSecond.add(secondHandleLeft);
                    groupModelSecond.add(secondWindowRight);
                    groupModelSecond.add(secondWindowLeft);

                    groupModelSecond.rotation.y = 1.58;
                    groupModelSecond.position.y = -0.8;
            
                    scene.add(groupModelSecond);
                    //Клонирование материалов

                    secondDoorRight.material = secondDoorRight.material.clone();
                    secondDoorLeft.material = secondDoorLeft.material.clone();
                    secondDoorBox.material = secondDoorBox.material.clone();
                    secondHandleRight.material = secondHandleRight.material.clone();
                    secondHandleLeft.material = secondHandleLeft.material.clone();
                    secondWindowRight.material = secondWindowRight.material.clone();
                    secondWindowLeft.material = secondWindowLeft.material.clone();


                    //замена моделей
                    viewModal.createNewModel(groupModelFirst, groupModelSecond);
            
                    // Обновление массива door, добавляем вторые объекты
                    door.push(
                        { id:1, object: { first: Door, second: secondDoorLeft, third: secondDoorRight, fourth: secondDoorBox}, name: "Полотно и коробка" },
                        { id:2, object: { first: Handle1, second: secondHandleRight, third: secondHandleLeft }, name: "Ручка" },
                        { id:3, object: { first: Window, second: secondWindowRight, third: secondWindowLeft }, name: "Стекло" },

                    );
                    console.log(door)
                    scene.add(secondModel);
                });
                document.getElementById("textures").onclick = () => {
                    const elemProduct = document.getElementById("elem_product");
                    const selectorTextures = document.getElementById("selector_textures")
                    viewModal.openMenu1(elemProduct);
                    viewModal.openMenu1(selectorTextures);
                    elemProduct.innerHTML = "";
                
                    door.forEach(objectItem => {
                        const button = document.createElement("button");
                        button.textContent = objectItem.name;
                        button.onclick = () => viewModal.selObjModels(doorLeaf, doorHandle, doorWindow, objectItem, "selector_textures", groupModelFirst, groupModelSecond);
                        elemProduct.appendChild(button);
                    });
                };
                
            scene.add(firstModel);

            resolve();
        },
        undefined,
        reject
    );
}));

// Скрыть прелоадер после загрузки всех моделей
Promise.all(loadPromises).then(() => {
    document.getElementById("loader").style.display = "none";
    document.querySelectorAll("button").forEach(button => {
        button.style.display = "block";
    });
}).catch(error => {
    console.error('Failed to load models', error);
    alert('Failed to load models. Please try again later.');
});

// Обновление сцены
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    firstLight.quaternion.copy(camera.quaternion);
    secondLight.quaternion.copy(camera.quaternion);
    window.requestAnimationFrame(tick);
};

tick();
