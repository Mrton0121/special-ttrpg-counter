function incrementStat(statId) {
    const element = document.getElementById(statId);
    let currentValue = parseInt(element.textContent);
    if (statId == "hp"){
      if (currentValue < parseInt(document.getElementById("max-hp").textContent)){
        element.textContent = currentValue + 1;
        saveData();
        return;
      }
    }
    else if (statId == "ap"){
      if (currentValue < parseInt(document.getElementById("max-ap").textContent)){
        element.textContent = currentValue + 1;
        saveData();
        return;
      }
    }
    else{
      element.textContent = currentValue + 1;
    }
    
    saveData();
}

function decrementStat(statId) {
    const element = document.getElementById(statId);
    let currentValue = parseInt(element.textContent);
    if (statId == "max-hp"){
      if (currentValue > 0) {
        element.textContent = currentValue - 1;
      }
      if (parseInt(document.getElementById("hp").textContent) > currentValue - 1){
        document.getElementById("hp").textContent = currentValue -1;
      }
    }

    if (statId == "max-ap"){
      if (currentValue > 0) {
        element.textContent = currentValue - 1;
      }
      if (parseInt(document.getElementById("ap").textContent) > currentValue - 1){
        document.getElementById("ap").textContent = currentValue -1;
      }
    }
    
    if (currentValue > 0) {
        element.textContent = currentValue - 1;
    }
    saveData();
}

// Backpack items array
let backpackItems = [];
// Skills array
let skills = [];

// Save data to localStorage when values change
function saveData() {
    const data = {
        name: document.getElementById('name').value,
        race: document.getElementById('race').value,
        age: document.getElementById('age').value,
        class: document.getElementById('class').value,
        hp: document.getElementById('hp').textContent,
        ap: document.getElementById('ap').textContent,
        maxHp: document.getElementById('max-hp').textContent,
        maxAp: document.getElementById('max-ap').textContent,
        maxCapacity: document.getElementById('max-capacity').textContent,
        strength: document.getElementById('strength').textContent,
        perception: document.getElementById('perception').textContent,
        endurance: document.getElementById('endurance').textContent,
        charisma: document.getElementById('charisma').textContent,
        intelligence: document.getElementById('intelligence').textContent,
        agility: document.getElementById('agility').textContent,
        luck: document.getElementById('luck').textContent,
        backpackItems: backpackItems,
        skills: skills
    };
    localStorage.setItem('specialCharacter', JSON.stringify(data));
}

// Load data from localStorage on page load
function loadData() {
    const savedData = localStorage.getItem('specialCharacter');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('name').value = data.name || '';
        document.getElementById('race').value = data.race || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('class').value = data.class || '';
        document.getElementById('hp').textContent = data.hp || '10';
        document.getElementById('ap').textContent = data.ap || '10';
        document.getElementById('max-hp').textContent = data.maxHp || '10';
        document.getElementById('max-ap').textContent = data.maxAp || '10';
        document.getElementById('max-capacity').textContent = data.maxCapacity || '20';
        document.getElementById('strength').textContent = data.strength || '0';
        document.getElementById('perception').textContent = data.perception || '0';
        document.getElementById('endurance').textContent = data.endurance || '0';
        document.getElementById('charisma').textContent = data.charisma || '0';
        document.getElementById('intelligence').textContent = data.intelligence || '0';
        document.getElementById('agility').textContent = data.agility || '0';
        document.getElementById('luck').textContent = data.luck || '0';
        backpackItems = data.backpackItems || [];
        skills = data.skills || [];
        renderBackpack();
        renderSkills();
    }
}

// Add item to backpack
function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const description = document.getElementById('item-description').value.trim();
    const quantity = parseInt(document.getElementById('item-quantity').value) || 1;
    let maxCapElement = document.getElementById("max-capacity")
    let maxCap = parseInt(maxCapElement.innerText)
    
    if(backpackItems.length + 1 > maxCap){
      alert("A hátizsákod tele van, nem tudsz már mást belerakni!");
      return;
    }

    if (!name) {
        alert('Kérlek add meg a tárgy nevét!');
        return;
    }
    
    const item = {
        id: Date.now(),
        name: name,
        description: description,
        quantity: quantity
    };
    
    backpackItems.push(item);
    
    // Clear form
    document.getElementById('item-name').value = '';
    document.getElementById('item-description').value = '';
    document.getElementById('item-quantity').value = '1';
    
    renderBackpack();
    saveData();
}

// Remove item from backpack
function removeItem(id) {
    backpackItems = backpackItems.filter(item => item.id !== id);
    renderBackpack();
    saveData();
}

// Increase item quantity
function increaseQuantity(id) {
    const item = backpackItems.find(item => item.id === id);
    if (item) {
        item.quantity++;
        renderBackpack();
        saveData();
    }
}

// Decrease item quantity
function decreaseQuantity(id) {
    const item = backpackItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity--;
        renderBackpack();
        saveData();
    }
}

// Render backpack items
function renderBackpack() {
    const backpackList = document.getElementById('backpack-list');
    let maxCapElement = document.getElementById("max-capacity")
    let maxCap = parseInt(maxCapElement.innerText)

    if (backpackItems.length === 0) {
        backpackList.innerHTML = '<p class="empty-backpack">A hátizsák üres</p>';
        return;
    }

    document.getElementById("backpack-count").innerText = "Kapacitás: " + backpackItems.length + " (max: " + maxCap + ")"
    
    backpackList.innerHTML = backpackItems.map(item => `
        <div class="backpack-item">
            <div class="item-header">
                <h3 class="item-name">${item.name}</h3>
                <button onclick="removeItem(${item.id})" class="remove-btn">✕</button>
            </div>
            ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
            <div class="item-quantity-controls">
                <button onclick="decreaseQuantity(${item.id})" class="quantity-btn">-</button>
                <span class="item-quantity">Mennyiség: ${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})" class="quantity-btn">+</button>
            </div>
        </div>
    `).join('');
}

// Add skill
function addSkill() {
    const name = document.getElementById('skill-name').value.trim();
    const description = document.getElementById('skill-description').value.trim();
    const apCost = parseInt(document.getElementById('skill-ap-cost').value) || 0;
    
    if (!name) {
        alert('Kérlek add meg a képesség nevét!');
        return;
    }
    
    const skill = {
        id: Date.now(),
        name: name,
        description: description,
        apCost: apCost
    };
    
    skills.push(skill);
    
    // Clear form
    document.getElementById('skill-name').value = '';
    document.getElementById('skill-description').value = '';
    document.getElementById('skill-ap-cost').value = '1';
    
    renderSkills();
    saveData();
}

// Remove skill
function removeSkill(id) {
    skills = skills.filter(skill => skill.id !== id);
    renderSkills();
    saveData();
}

// Execute skill (consume AP)
function executeSkill(id) {
    const skill = skills.find(skill => skill.id === id);
    if (!skill) return;
    
    const apElement = document.getElementById('ap');
    const maxApElement = document.getElementById('max-ap');
    const currentAP = parseInt(apElement.textContent);
    const maxAP = parseInt(maxApElement.textContent);
    
    if (currentAP < skill.apCost) {
        alert('Nincs elég AP a képesség használatához! (Szükséges: ' + skill.apCost + ', Meglévő: ' + currentAP + ')');
        return;
    }
    
    // Calculate new AP value
    let newAP = currentAP - skill.apCost;
    
    // If it's an AP regen skill (negative cost), cap at max AP
    if (skill.apCost < 0 && newAP > maxAP) {
        newAP = maxAP;
    }
    
    apElement.textContent = newAP;
    saveData();
    
    // Visual feedback
    const skillElement = document.querySelector(`[data-skill-id="${id}"]`);
    if (skillElement) {
        skillElement.classList.add('skill-executed');
        setTimeout(() => {
            skillElement.classList.remove('skill-executed');
        }, 500);
    }
}

// Render skills
function renderSkills() {
    const skillsList = document.getElementById('skills-list');
    
    if (skills.length === 0) {
        skillsList.innerHTML = '<p class="empty-backpack">Nincsenek képességek</p>';
        return;
    }
    
    skillsList.innerHTML = skills.map(skill => `
        <div class="backpack-item skill-item" data-skill-id="${skill.id}">
            <div class="item-header">
                <h3 class="item-name">${skill.name}</h3>
                <div class="skill-header-right">
                    <span class="skill-ap-cost">AP: ${skill.apCost}</span>
                    <button onclick="removeSkill(${skill.id})" class="remove-btn">✕</button>
                </div>
            </div>
            ${skill.description ? `<p class="item-description">${skill.description}</p>` : ''}
            <div class="skill-execute-container">
                <button onclick="executeSkill(${skill.id})" class="execute-skill-btn">Végrehajtás</button>
            </div>
        </div>
    `).join('');
}

// Add event listeners for auto-save
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('name').addEventListener('input', saveData);
    document.getElementById('race').addEventListener('input', saveData);
    document.getElementById('age').addEventListener('input', saveData);
    document.getElementById('class').addEventListener('input', saveData);
    
    // Load data on page load
    loadData();
});
