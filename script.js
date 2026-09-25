const SUPABASE_URL = "https://ewterqcbpkbboduyfvhc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4oLLHeRXP90fBOPY6XWIcg_41Mde0OX";

const gameForm = document.querySelector("#game-form");
const gamesSection = document.querySelector("section");
const submitButton = gameForm.querySelector("button[type='submit']");
const games = [];
let editingGameId = null;

const statusLabels = {
	"want-to-play": "Want to Play",
	playing: "Playing",
	completed: "Completed"
};

const gameList = document.createElement("div");
gameList.className = "game-list";
gamesSection.append(gameList);

const supabaseConfigured = !SUPABASE_URL.startsWith("YOUR_") && !SUPABASE_ANON_KEY.startsWith("YOUR_");
const supabaseClient = supabaseConfigured
	? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
	: null;

function getGameFromForm() {
	return {
		title: gameForm.elements["game-title"].value.trim(),
		platform: gameForm.elements.platform.value.trim(),
		status: gameForm.elements.status.value,
		rating: Number(gameForm.elements.rating.value),
		notes: gameForm.elements.notes.value.trim()
	};
}

function createGameDetail(label, value, status = "") {
	const detail = document.createElement("p");
	const detailLabel = document.createElement("strong");
	const detailValue = document.createElement("span");
	detail.className = `game-detail game-detail--${label.toLowerCase()}`;
	detailLabel.textContent = `${label}: `;
	detailValue.className = "detail-value";
	detailValue.textContent = value || "None";
	if (status) {
		detailValue.classList.add("status-badge", `status-badge--${status}`);
	} else if (label === "Rating") {
		detailValue.classList.add("rating-value");
	}
	detail.append(detailLabel, detailValue);
	return detail;
}

function renderGames() {
	gameList.replaceChildren();

	if (games.length === 0) {
		const emptyMessage = document.createElement("p");
		emptyMessage.textContent = "No games added yet.";
		gameList.append(emptyMessage);
		return;
	}

	games.forEach((game) => {
		const gameCard = document.createElement("article");
		gameCard.className = "game-card";

		const title = document.createElement("h3");
		title.textContent = game.title;

		const details = document.createElement("div");
		details.append(
			createGameDetail("Platform", game.platform),
			createGameDetail("Status", statusLabels[game.status], game.status),
			createGameDetail("Rating", `${game.rating}/10`),
			createGameDetail("Notes", game.notes)
		);

		const actions = document.createElement("div");
		actions.className = "game-actions";

		const editButton = document.createElement("button");
		editButton.type = "button";
		editButton.textContent = "Edit";
		editButton.addEventListener("click", () => startEditing(game.id));

		const deleteButton = document.createElement("button");
		deleteButton.type = "button";
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", () => deleteGame(game.id));

		actions.append(editButton, deleteButton);
		gameCard.append(title, details, actions);
		gameList.append(gameCard);
	});
}

function showMessage(message) {
	gameList.replaceChildren();
	const messageElement = document.createElement("p");
	messageElement.textContent = message;
	gameList.append(messageElement);
}

function startEditing(gameId) {
	const game = games.find((item) => item.id === gameId);
	if (!game) {
		return;
	}

	editingGameId = gameId;
	gameForm.elements["game-title"].value = game.title;
	gameForm.elements.platform.value = game.platform;
	gameForm.elements.status.value = game.status;
	gameForm.elements.rating.value = game.rating;
	gameForm.elements.notes.value = game.notes || "";
	submitButton.textContent = "Update Game";
	gameForm.elements["game-title"].focus();
}

async function deleteGame(gameId) {
	const { error } = await supabaseClient.from("games").delete().eq("id", gameId);
	if (error) {
		window.alert(`Could not delete game: ${error.message}`);
		return;
	}

	const gameIndex = games.findIndex((game) => game.id === gameId);
	games.splice(gameIndex, 1);
	if (editingGameId === gameId) {
		editingGameId = null;
		gameForm.reset();
		submitButton.textContent = "Add Game";
	}
	renderGames();
}

async function loadGames() {
	if (!supabaseConfigured) {
		showMessage("Add your Supabase project settings in script.js to load games.");
		return;
	}

	const { data, error } = await supabaseClient
		.from("games")
		.select("id, title, platform, status, rating, notes");

	if (error) {
		showMessage(`Could not load games: ${error.message}`);
		return;
	}

	games.push(...data);
	renderGames();
}

gameForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	if (!supabaseConfigured) {
		window.alert("Add your Supabase project settings in script.js first.");
		return;
	}

	const game = getGameFromForm();
	let result;

	if (editingGameId === null) {
		result = await supabaseClient.from("games").insert(game).select().single();
	} else {
		result = await supabaseClient
			.from("games")
			.update(game)
			.eq("id", editingGameId)
			.select()
			.single();
	}

	if (result.error) {
		window.alert(`Could not save game: ${result.error.message}`);
		return;
	}

	if (editingGameId === null) {
		games.unshift(result.data);
	} else {
		const gameIndex = games.findIndex((item) => item.id === editingGameId);
		games[gameIndex] = result.data;
	}

	gameForm.reset();
	editingGameId = null;
	submitButton.textContent = "Add Game";
	renderGames();
});

loadGames();
