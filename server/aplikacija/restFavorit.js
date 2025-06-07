const FavoritDAO = require("./favoritDAO.js");

exports.getFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if(!zahtjev.session.korisnik){
		odgovor.status(403);
		odgovor.send({ greska: "Zabranjen pristup!" });
	}else{
		let fdao = new FavoritDAO();
		fdao.dajSve(zahtjev.session.korId).then((favoriti) => {
			if(JSON.stringify(favoriti).length == 2){
				odgovor.status(400)
				odgovor.send({opis: "Nemate dodane favorite"});
			}else{
				odgovor.status(200);
				odgovor.send(JSON.stringify(favoriti));
			}
		});
	}
};

exports.postFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let podaci = zahtjev.body;
	console.log("POST podaci:");
	console.log(podaci);
	let fdao = new FavoritDAO();
	fdao.dodaj(podaci).then((poruka) => {
		odgovor.status(201);
		odgovor.send(JSON.stringify(poruka));
	});
};

exports.deleteFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.putFavoriti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.getFavorit = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if(!zahtjev.session.korisnik){
		odgovor.status(403);
		odgovor.send({ greska: "Potrebna prijava" });
	}else{
		let fdao = new FavoritDAO();
		let id = zahtjev.params.id;
		let korisnik = zahtjev.session.korId;
		fdao.daj(id, korisnik).then((favorit) => {
			console.log(favorit);
			if(favorit == null){
				odgovor.status(404);
				odgovor.send({opis: "Nema resursa"});
			}else{
				odgovor.status(200);
				odgovor.send(JSON.stringify(favorit));
			}
		});
	}
	
};

exports.postFavorit = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { opis: "Zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteFavorit = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let fdao = new FavoritDAO();
	let id = zahtjev.params.id;
	console.log("tu je id: ", id);
	fdao.obrisi(id).then(() => {
	odgovor.status(201);
	odgovor.send({opis: "izvrseno"});
	});
};

exports.putFavorit = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { opis: "Zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};
