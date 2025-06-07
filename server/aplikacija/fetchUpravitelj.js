const SerijePretrazivanje = require("./serijePretrazivanje.js");
const jwt = require("./moduli/jwt.js");
const Autentifikacija = require("./autentifikacija.js");
const ds = require("fs/promises");

class FetchUpravitelj {
	constructor(tajniKljucJWT, port) {
		this.port = port;
		this.auth = new Autentifikacija(this.port);
		this.fp = new SerijePretrazivanje(this.port);
		this.tajniKljucJWT = tajniKljucJWT;
	}

	getJWT = async function (zahtjev, odgovor) {
		odgovor.type("json");
		if (zahtjev.session.korime != null) {
			let k = { korime: zahtjev.session.korime };
			let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
			odgovor.send({ ok: noviToken });
			return;
		}
		odgovor.status(401);
		odgovor.send({ greska: "nemam token!" });
	};

	tijeloTokena = async function (zahtjev, odgovor, next) {
		odgovor.type("json");
	
		if (zahtjev.session.korime != null) {
			let k = { korime: zahtjev.session.korime };
			let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
			let tijelo = jwt.dajTijelo(noviToken);
			console.log("tijelo tokena: ", tijelo.korime);
			odgovor.send({ok: tijelo.korime});
		} else {
			odgovor.status(401);
			odgovor.send({ greska: "nemam token!" });
		}
	}
	

	serijePretrazivanje = async function (zahtjev, odgovor) {
			let str = zahtjev.query.str;
			let filter = zahtjev.query.filter;
			console.log(zahtjev.query);
			odgovor.json(await this.fp.dohvatiSerije(str, filter));
	};

	dodajSeriju = async function (zahtjev, odgovor) {
		console.log(zahtjev.body);
		if (!jwt.provjeriToken(zahtjev, this.tajniKljucJWT)) {
			odgovor.status(401);
			odgovor.json({ greska: "neaoutorizirani pristup" });
		} else {
		let greska = "";
		if (zahtjev.method == "POST") {
			let uspjeh = await this.auth.dodajSeriju(zahtjev.body, zahtjev.session.korId);
			if (uspjeh) {
				odgovor.redirect("/");
				return;
			} else {
				greska = "Dodavanje nije uspjelo provjerite podatke!";
			}
			}
		};
	}

	odjava = async function (zahtjev, odgovor) {
		zahtjev.session.korisnik = null;
		odgovor.redirect("/");
	};

	prijava = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
			console.log("ispisi zahtjev", zahtjev.body);

			if (korisnik) {
				console.log(korisnik);
				korisnik = JSON.parse(korisnik);
				console.log(korisnik);
				zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				zahtjev.session.korime = korisnik.korime;
				zahtjev.session.korId = korisnik.id;
				zahtjev.session.tip_Korisnika_id = korisnik.tip_Korisnika_id;
				odgovor.redirect("/");
				return;
			} else {
				odgovor.status(400);
				greska = "Netocni podaci!";
			}
		}
	};

	tvPretrazivanje = async function (zahtjev, odgovor) {
		let stranica;
		if(zahtjev.session.korisnik){
			stranica = await ucitajStranicu("index", zahtjev.session.korisnik);
		}else{
			stranica = await ucitajStranicu("index", "Gost");
		}
		odgovor.send(stranica);
	};
}
module.exports = FetchUpravitelj;


async function ucitajStranicu(nazivStranice, poruka = "") {
	let stranice = [ucitajHTML(nazivStranice)];
	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTML(htmlStranica) {
    const dijeloviPutanje = __dirname.split('/');
    dijeloviPutanje.pop();
    const putanjaDoAngular = dijeloviPutanje.join('/') + '/angular/dist/zadaca_02/browser/' + htmlStranica + '.html';

    return ds.readFile(putanjaDoAngular, "UTF-8");
}
