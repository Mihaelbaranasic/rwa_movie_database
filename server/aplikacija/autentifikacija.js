const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
class Autentifikacija {
	constructor(port){
		this.port = port;
	}
	async dodajKorisnika(korisnik) {
		let tijelo = {
			ime: korisnik.ime,
			prezime: korisnik.prezime,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, korisnik.korime),
			email: korisnik.email,
			korime: korisnik.korime,
		};

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://spider.foi.hr:" + this.port + "/baza/korisnici",
			parametri
		);

		if (odgovor.status == 200) {
			console.log("Korisnik ubačen na servisu");
			let mailPoruka =
				"Korisničko ime:" +
				korisnik.korime +
				" Lozinka: " +
				korisnik.lozinka;
			let poruka = await mail.posaljiMail(
				"rwa@foi.hr",
				korisnik.email,
				"Registriran račun",
				mailPoruka
			);
			return true;
		} else {
			console.log(odgovor.status);
			console.log(await odgovor.text());
			return false;
		}
	}
	async dodajSeriju(serija, korisnik) {
		let tijelo = {
			naziv: serija.name,
			opis: serija.overview,
			brojSezona: 3,
			brojEpizoda: 24,
			popularnost: serija.popularity,
			slika: serija.poster_path,
			tmdb_id: serija.id,
			poveznica: serija.backdrop_path,
			korisnik_id: korisnik,
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://spider.foi.hr:" + this.port + "/baza/favoriti",
			parametri
		);
		if (odgovor.status == 200) {
			console.log("Serija ubačena na servisu");
			return true;
		} else {
			console.log(odgovor.status);
			console.log(await odgovor.text());
			return false;
		}
	}

	async prijaviKorisnika(korime, lozinka) {
		console.log("PRIJAVA: " + korime + lozinka);
		lozinka = kodovi.kreirajSHA256(lozinka, korime);
		let tijelo = {
			lozinka: lozinka,
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://spider.foi.hr:" + this.port + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);
		if (odgovor.status == 200) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
