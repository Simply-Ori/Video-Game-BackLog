const gameForm = document.querySelector("#game-form");
const gamesSection = document.querySelector("section");
const submitButton = gameForm.querySelector("button[type='submit']");
const games = [];
let editingIndex = -1;

const statusLabels = {
	"want-to-play": "Want to Play",
	playing: "Playing",
	completed: "Completed"
};

const gameList = document.createElement("div");
gameList.className = "game-list";
gamesSection.append(gameList);

function getGameFromForm() {
	return {
		title: gameForm.elements["game-title"].value.trim(),
		platform: gameForm.elements.platform.value.trim(),
		status: gameForm.elements.status.value,
		rating: gameForm.elements.rating.value,
		notes: gameForm.elements.notes.value.trim()
	};
}

function createGameDetail(label, value) {
	const detail = document.createElement("p");
	const detailLabel = document.createElement("strong");
	detailLabel.textContent = `${label}: `;
	detail.append(detailLabel, value || "None");
	return detail;
}

function renderGames() {
	gameList.replaceChildren();

	games.forEach((game, index) => {
		const gameCard = document.createElement("article");
		gameCard.className = "game-card";

		const title = document.createElement("h3");
		title.textContent = game.title;

		const details = document.createElement("div");
		details.append(
			createGameDetail("Platform", game.platform),
			createGameDetail("Status", statusLabels[game.status]),
			createGameDetail("Rating", `${game.rating}/10`),
			createGameDetail("Notes", game.notes)
		);

		const actions = document.createElement("div");
		actions.className = "game-actions";

		const editButton = document.createElement("button");
		editButton.type = "button";
		editButton.textContent = "Edit";
		editButton.addEventListener("click", () => startEditing(index));

		const deleteButton = document.createElement("button");
		deleteButton.type = "button";
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", () => deleteGame(index));

		actions.append(editButton, deleteButton);
		gameCard.append(title, details, actions);
		gameList.append(gameCard);
	});
}

function startEditing(index) {
	const game = games[index];
	editingIndex = index;
	gameForm.elements["game-title"].value = game.title;
	gameForm.elements.platform.value = game.platform;
	gameForm.elements.status.value = game.status;
	gameForm.elements.rating.value = game.rating;
	gameForm.elements.notes.value = game.notes;
	submitButton.textContent = "Update Game";
	gameForm.elements["game-title"].focus();
}

function deleteGame(index) {
	games.splice(index, 1);
	if (editingIndex === index) {
		editingIndex = -1;
		gameForm.reset();
		submitButton.textContent = "Add Game";
	}
	if (editingIndex > index) {
		editingIndex -= 1;
	}
	renderGames();
}

gameForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const game = getGameFromForm();

	if (editingIndex === -1) {
		games.push(game);
	} else {
		games[editingIndex] = game;
	}

	gameForm.reset();
	editingIndex = -1;
	submitButton.textContent = "Add Game";
	renderGames();
});
