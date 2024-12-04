config = {
    url: "https://api.recursionist.io/builder/computers?type=",
    cpuBrandMenuId: "cpu-brand",
    cpuModelMenuId: "cpu-model",
    gpuBrandMenuId: "gpu-brand",
    gpuModelMenuId: "gpu-model",
    memoryNumberMenuId: "ram-num",
    memoryBrandMenuId: "ram-brand",
    memoryModelMenuId: "ram-model",
    HDDrSSDMenuId: "hdd-or-ssd",
    storageBrandMenuId: "storage-brand",
    storageModelMenuId: "storage-model",
    storageMenuId: "storage",
    buttonId: "add",
    parentDivId: "parent"
}

function setMenu(type, brandMenuId, modelMenuId, memoryNumberMenuId = undefined, storageMenuId = undefined) {
    let brandMenu = document.getElementById(brandMenuId);
    let modelMenu = document.getElementById(modelMenuId);
    let modelByBrand = {};
    let benchMarkByModel = {}
    let memoryNumberMenu = document.getElementById(memoryNumberMenuId);
    let storageMenu = document.getElementById(storageMenuId)

    fetch(config.url + type).then(response => response.json()).then(function (data) {
        let brands = [];
        let memoryNums = [];
        let storages = []
        for (component of data) {
            let brand = component.Brand;
            let model = component.Model;
            if (!brands.includes(brand)) {
                brands.push(brand);
                let newBrandOption = document.createElement("option");
                newBrandOption.value = brand;
                newBrandOption.text = brand;
                brandMenu.add(newBrandOption);
                modelByBrand[brand] = [];
            }
            modelByBrand[brand].push(model)
            benchMarkByModel[model] = component.Benchmark;
            if (type == "ram") {
                memoryNum = getNumberOfMemory(model)
                if (!memoryNums.includes(memoryNum)) {
                    memoryNums.push(memoryNum)
                    let newMemoryNumOption = document.createElement("option");
                    newMemoryNumOption.value = memoryNum;
                    newMemoryNumOption.text = memoryNum;
                    memoryNumberMenu.add(newMemoryNumOption);
                }
            }
            else if (type == "hdd" || type == "ssd") {
                storage = getStorage(model)
                if (!storages.includes(storage)) {
                    storages.push(storage);
                    let newStorageOption = document.createElement("option");
                    newStorageOption.value = storage;
                    newStorageOption.text = storage;
                    storageMenu.add(newStorageOption);
                }
            }
        }
    });

    if (memoryNumberMenuId != undefined) {
        brandMenu.addEventListener('change', function (event) {
            if (memoryNumberMenu.value != "nothing") {
                //今のmodelメニューをリセット
                modelMenu.innerHTML = `<option value="nothing">-</option>`; // 初期化
                // 選択された<option>のvalueを取得
                const selectedBrand = event.target.value;
                const selectedMemoryNum = memoryNumberMenu.value
                let modelFromSelectedBrand = modelByBrand[selectedBrand]
                for (model of modelFromSelectedBrand) {
                    let memoryNum = getNumberOfMemory(model);
                    if (selectedMemoryNum == memoryNum) {
                        let newModelOption = document.createElement("option");
                        newModelOption.value = model;
                        newModelOption.text = model;
                        modelMenu.add(newModelOption);
                    }
                }
            }
        });

        memoryNumberMenu.addEventListener('change', function (event) {
            if (brandMenu.value != "nothing") {
                //今のmodelメニューをリセット
                modelMenu.innerHTML = `<option value="nothing">-</option>`; // 初期化
                // 選択された<option>のvalueを取得
                const selectedBrand = brandMenu.value;
                const selectedMemoryNum = event.target.value
                let modelFromSelectedBrand = modelByBrand[selectedBrand]
                for (model of modelFromSelectedBrand) {
                    let memoryNum = getNumberOfMemory(model);
                    if (selectedMemoryNum == memoryNum) {
                        let newModelOption = document.createElement("option");
                        newModelOption.value = model;
                        newModelOption.text = model;
                        modelMenu.add(newModelOption);
                    }
                }
            }
        });

    }
    else if (storageMenuId != undefined) {
        brandMenu.addEventListener('change', function (event) {
            if (storageMenu.value != "nothing") {
                //今のmodelメニューをリセット
                modelMenu.innerHTML = `<option value="nothing">-</option>`; // 初期化
                // 選択された<option>のvalueを取得
                const selectedBrand = event.target.value;
                const selectedStorage = storageMenu.value
                let modelFromSelectedBrand = modelByBrand[selectedBrand]
                // console.log(modelFromSelectedBrand)
                //なぜか2回出力されるけどhddの後にSSDをすることで非同期処理がさらに始まるからだろうか
                for (model of modelFromSelectedBrand) {
                    let storage = getStorage(model);
                    if (selectedStorage == storage) {
                        let newModelOption = document.createElement("option");
                        newModelOption.value = model;
                        newModelOption.text = model;
                        modelMenu.add(newModelOption);
                    }
                }
            }
        });

        storageMenu.addEventListener('change', function (event) {
            if (brandMenu.value != "nothing") {
                //今のmodelメニューをリセット
                modelMenu.innerHTML = `<option value="nothing">-</option>`; // 初期化
                // 選択された<option>のvalueを取得
                const selectedBrand = brandMenu.value;
                const selectedStorage = event.target.value
                let modelFromSelectedBrand = modelByBrand[selectedBrand]

                for (model of modelFromSelectedBrand) {
                    let storage = getStorage(model);
                    if (selectedStorage == storage) {
                        let newModelOption = document.createElement("option");
                        newModelOption.value = model;
                        newModelOption.text = model;
                        modelMenu.add(newModelOption);
                    }
                }
            }
        });
    }
    else {
        brandMenu.addEventListener('change', function (event) {
            //今のmodelメニューをリセット
            modelMenu.innerHTML = `<option value="nothing">-</option>`; // 初期化
            // 選択された<option>のvalueを取得
            const selectedBrand = event.target.value;
            let modelFromSelectedBrand = modelByBrand[selectedBrand]
            for (model of modelFromSelectedBrand) {
                let newModelOption = document.createElement("option");
                newModelOption.value = model;
                newModelOption.text = model;
                modelMenu.add(newModelOption);
            }
        });
    }

    return benchMarkByModel;
}

//"Vengeance LPX DDR4 2800 C16 4x4GB"が引数
function getNumberOfMemory(model) {
    arr = model.split(/\s+/)
    memory = arr[arr.length - 1]
    memoryNum = memory.split("x")[0]
    storage = memory.split("x")[1].split("GB")[0]
    return memoryNum

}

//"Deskstar NAS 6TB"が引数
// "Gold 8TB (256MB Cache 2017)"の場合も
function getStorage(model) {
    arr = model.split(/\s+/)
    if (arr[arr.length - 1].indexOf("B") != -1) {
        storage = arr[arr.length - 1];
    }
    else {
        storage = arr[1];
    }
    return storage;

}

function main() {
    let cpuBenchMarkByModel = setMenu("cpu", config.cpuBrandMenuId, config.cpuModelMenuId);
    let gpuBenchMarkByModel = setMenu("gpu", config.gpuBrandMenuId, config.gpuModelMenuId);
    let memoryBenchMarkByModel = setMenu("ram", config.memoryBrandMenuId, config.memoryModelMenuId, config.memoryNumberMenuId);
    let storageBenchMarkByModel;

    //これだと都度非同期処理始まるから表示遅れるかもしれない
    document.getElementById(config.HDDrSSDMenuId).addEventListener("change", function (event) {
        //今のmodelメニューをリセット
        document.getElementById(config.storageMenuId).innerHTML = `<option value="nothing">-</option>`; // 初期化
        document.getElementById(config.storageBrandMenuId).innerHTML = `<option value="nothing">-</option>`; // 初期化
        document.getElementById(config.storageModelMenuId).innerHTML = `<option value="nothing">-</option>`; // 初期化
        storageType = event.target.value;
        storageBenchMarkByModel = setMenu(storageType, config.storageBrandMenuId, config.storageModelMenuId, undefined, config.storageMenuId);
    })
    let counter = 1;
    document.getElementById(config.buttonId).addEventListener("click", function () {
        let cpuModel = document.getElementById(config.cpuModelMenuId).value;
        let gpuModel = document.getElementById(config.gpuModelMenuId).value;
        let memoryModel = document.getElementById(config.memoryModelMenuId).value;
        let storageModel = document.getElementById(config.storageModelMenuId).value;
        if (cpuModel != "nothing" && gpuModel != "nothing" && memoryModel != "nothing" && storageModel != "nothing") {
            let cpuBenchMark = cpuBenchMarkByModel[cpuModel];
            let gpuBenchMark = gpuBenchMarkByModel[gpuModel];
            memoryBenchMarkByModel
            const memoryBenchMark = memoryBenchMarkByModel[memoryModel];
            const storageBenchMark = storageBenchMarkByModel[storageModel];
            const gamingScore = cpuBenchMark * 0.25 + gpuBenchMark * 0.6 + memoryBenchMark * 0.125 + storageBenchMark * 0.025;
            const workingScore = cpuBenchMark * 0.6 + gpuBenchMark * 0.25 + memoryBenchMark * 0.10 + storageBenchMark * 0.05;
            const div = document.createElement("div");
            div.classList.add('card', 'mb-3', 'text-white', 'bg-dark');
            div.style.border = "2px solid #ffc107";
            div.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title text-warning font-weight-bold">Your PC ${counter}</h5>
                    <h6 class="card-subtitle mb-2 text-muted font-weight-bold">Configuration Details</h6>
                    <h6 class="mt-3 text-info font-weight-bold">CPU</h6>
                    <p class="font-weight-bold">Brand: ${document.getElementById(config.cpuBrandMenuId).value}</p>
                    <p class="font-weight-bold">Model: ${cpuModel}</p>
                    <h6 class="mt-3 text-info font-weight-bold">GPU</h6>
                    <p class="font-weight-bold">Brand: ${document.getElementById(config.gpuBrandMenuId).value}</p>
                    <p class="font-weight-bold">Model: ${gpuModel}</p>
                    <h6 class="mt-3 text-info font-weight-bold">RAM</h6>
                    <p class="font-weight-bold">Brand: ${document.getElementById(config.memoryBrandMenuId).value}</p>
                    <p class="font-weight-bold">Model: ${memoryModel}</p>
                    <h6 class="mt-3 text-info font-weight-bold">Storage</h6>
                    <p class="font-weight-bold">Disk Type: ${document.getElementById(config.HDDrSSDMenuId).value.toUpperCase()}</p>
                    <p class="font-weight-bold">Storage: ${document.getElementById(config.storageMenuId).value}</p>
                    <p class="font-weight-bold">Brand: ${document.getElementById(config.storageBrandMenuId).value}</p>
                    <p class="font-weight-bold">Model: ${storageModel}</p>
                    <h6 class="mt-3 text-success font-weight-bold">Performance Scores</h6>
                    <p class="font-weight-bold">Gaming: <strong>${Math.round(gamingScore)}%</strong></p>
                    <p class="font-weight-bold">Work: <strong>${Math.round(workingScore)}%</strong></p>
                </div>
            `;
            document.getElementById(config.parentDivId).append(div);
            counter++;
        }
        else {
            window.alert("Please fill in all forms.")
        }
    })
}

main()
