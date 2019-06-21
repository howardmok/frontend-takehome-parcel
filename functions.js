let initialLoad = () => {
	let list = document.querySelector('#storageList');
	if (localStorage.length) {
		let numTimes = localStorage.length;
		for (let key in localStorage) {
			if (numTimes) {
				let li = document.createElement('li');
				li.innerHTML = localStorage[key];
				li.className = key;
				let buttons = li.querySelectorAll('button');
				buttons[0].addEventListener('click', save);
				buttons[1].addEventListener('click', unsave);
				list.appendChild(li);
				numTimes--;
			}
		}
	}
	let form = document.querySelector('#searchForm');
	form.addEventListener('submit', search);
};

let save = (e) => {
	localStorage.setItem(e.target.className, e.target.parentNode.innerHTML);
	let list = document.querySelector('#storageList');
	let li = document.createElement('li');
	li.className = e.target.className;
	li.innerHTML = e.target.parentNode.innerHTML;
	let buttons = li.querySelectorAll('button');
	buttons[0].addEventListener('click', save);
	buttons[1].addEventListener('click', unsave);
	list.appendChild(li);
	alert('Saved gem info on: \'' + li.className + '\'');
};

let unsave = (e) => {
	localStorage.removeItem(e.target.className);
	let saveGemsList = document.querySelector('#storageList');
	let li = saveGemsList.getElementsByClassName(e.target.className)[0];
	if (li) {
		alert('Removed gem info on \'' + e.target.className + '\' from saved list');
		li.parentNode.removeChild(li);
	} else {
		alert('Gem \'' + e.target.className + '\' is not located on the saved list');
	}
};

let search = (e) => {
	e.preventDefault();
	let query = document.querySelector('#searchBar').value;
	fetch('http://localhost:3000/api/v1/search.json?query=' + query).then((data) => {
		return (data.json());
	}).then(array => {
		console.log(array);
		let list = document.querySelector('#queryList');
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
		for (let i = 0; i < array.length; i++) {
			let li = document.createElement('li');
			let buttonSave = document.createElement('button');
			let buttonUnsave = document.createElement('button');
			let name = '';
			for (let property in array[i]) {
				let propValueToAdd = array[i][property];
				if (property === 'name') {
					name = propValueToAdd;
				}
				let newSpan = document.createElement('span');
				newSpan.className = 'propertyNames';
				newSpan.innerHTML = property + ': ';
				li.appendChild(newSpan);
				let convertLink = false;
				if (typeof propValueToAdd === "string") {
					if (propValueToAdd.indexOf('http') === 0) {
						convertLink = true;
					}
				} 
				if (!convertLink) {
					li.innerHTML += array[i][property] + '<br/>';
				} else {
					let newLink = document.createElement('a');
					newLink.href = propValueToAdd;
					newLink.target = "_blank";
					newLink.innerHTML = propValueToAdd + '<br/>';
					li.appendChild(newLink);
				}
			}
			list.appendChild(li);
			buttonSave.addEventListener('click', save);
			buttonSave.innerHTML = "Save";
			buttonSave.className = name;
			buttonUnsave.addEventListener('click', unsave);
			buttonUnsave.innerHTML = "Unsave";
			buttonUnsave.className = name;
			li.appendChild(buttonSave);
			li.appendChild(buttonUnsave);
		}
	})
};