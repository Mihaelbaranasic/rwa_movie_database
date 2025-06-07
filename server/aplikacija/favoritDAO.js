const Baza = require("./baza.js");

class FavoritDAO {

	constructor() {
		this.baza = new Baza("./RWA2023mbaranasi21.sqlite");
		console.log(this.baza)
	}

	dajSve = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM favoriti WHERE korisnik_id=?";
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (id, korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM favoriti WHERE id=? AND korisnik_id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [id, korisnik]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (serija) {
		console.log(serija)
		let sql = `INSERT INTO favoriti (naziv, opis, brojSezona, brojEpizoda, popularnost, slika, tmdb_id, poveznica, korisnik_id) VALUES (?,?,?,?,?,?,?,?,?)`;
        let podaci = [serija.naziv,serija.opis,
            serija.brojSezona,serija.brojEpizoda,serija.popularnost,serija.slika,serija.tmdb_id,serija.poveznica,serija.korisnik_id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisi = async function (id) {
		let sql = "DELETE FROM favoriti WHERE korisnik_id=?";
		await this.baza.izvrsiUpit(sql,[id]);
		return true;
	}

	azuriraj = async function (serija, id) {
		let sql = `UPDATE favoriti SET naziv=?, opis=?, brojSezona=?, brojEpizoda=?, popularnost=?, slika=?, tmdb_id=?, poveznica=?, korisnik_id=? WHERE id=?`;
        let podaci = [serija.naziv,serija.opis,
            serija.brojSezona,serija.brojEpizoda,serija.popularnost,serija.slika,serija.tmdb_id,serija.poveznica,serija.korisnik_id,id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
}

module.exports = FavoritDAO;
