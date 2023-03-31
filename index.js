import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());

let people = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/info", (request, response) => {
	const now = new Date();
	console.log(now);
	const message =
		"<h1>Phonebook has info for " +
		people.length +
		" people!</h1>" +
		"<p>" +
		now +
		"</p>";
	response.send(message);
});

app.get("/api/people", (request, response) => {
	response.json(people);
});

app.get("/api/people/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = people.find((person) => person.id === id);

	person ? response.json(person) : response.status(404).end();
});

app.delete("/api/people/:id", (request, response) => {
	const id = Number(request.params.id);
	people = people.filter((person) => person.id !== id);

	response.status(204).end();
});

app.put("/api/people/:id", (request, response) => {
	const body = request.body;
	const id = Number(request.params.id);

	const updatedContact = {
		id: id,
		name: body.name,
		number: body.number,
	};
	people = people.map((person) => (person.id !== id ? person : updatedContact));

	response.json(updatedContact);
});

app.post("/api/people", (request, response) => {
	const body = request.body;
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "missing a necessary field",
		});
	}
	if (people.find((person) => person.name === body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	function generateId() {
		let newId = Math.floor(Math.random() * 100);
		while (people.find((person) => person.id === newId)) {
			newId = Math.floor(Math.random() * 100);
		}
		return newId;
	}

	const newContact = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};
	console.log(newContact);
	people = people.concat(newContact);

	response.json(newContact);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
