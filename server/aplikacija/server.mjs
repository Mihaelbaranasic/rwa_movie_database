import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";

import Konfiguracija from "./konfiguracija.js";
import portovi from "/var/www/RWA/2023/portovi.js";
import restKorisnik from "./restKorisnik.js";
import RestTMDB from "./restTMDB.js";
import FetchUpravitelj from "./fetchUpravitelj.js";
import cookieParser from "cookie-parser";
import restFavorit from "./restFavorit.js";
import JWTprovjera from "./jwtProvjera.js";
import cors from "cors";
const port = portovi.mbaranasi21;
//const port = 12310;

const server = express();

let konf = new Konfiguracija();
konf
	.ucitajKonfiguraciju()
	.then(pokreniServer)
	.catch((greska) => {
		console.log(greska);
		if (process.argv.length == 2) {
			console.error("Molimo unesite naziv datoteke!");
		} else {
			console.error("Nije moguće otvoriti datoteku: " + greska.path);
		}
	});

function pokreniServer() {
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(cors());
	

	server.use(kolacici());
	server.use(
		sesija({
			secret: konf.dajKonf().tajniKljucSesija,
			saveUninitialized: true,
			cookie: { maxAge: 1000 * 60 * 60 * 3 },
			resave: false,
		})
	);
	server.use(cookieParser());
	server.use("/icona", express.static("./angular/dist/zadaca_02/browser"));
	server.use("/scss", express.static("./angular/dist/zadaca_02/browser"));
	server.use("/dokumentacija", express.static("./dokumentacija"));
	server.use("/js", express.static("./angular/dist/zadaca_02/browser"));
	pripremiPutanjeKorisnik();
	pripremiPutanjeFavorit();
	pripremiPutanjeTMDB();
	pripremiPutanjePocetna();
	pripremiPutanjeAutentifikacija();
	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		odgovor.json({ opis: "nema resursa" });
	});
	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}

function pripremiPutanjeKorisnik() {
	let jwtProvjera = new JWTprovjera(konf.dajKonf().jwtTajniKljuc);
	server.get("/baza/korisnici", jwtProvjera.provjeriJWTadmin.bind(jwtProvjera), restKorisnik.getKorisnici);
	server.post("/baza/korisnici", jwtProvjera.provjeriJWTadmin.bind(jwtProvjera), restKorisnik.postKorisnici);
	server.delete("/baza/korisnici", restKorisnik.deleteKorisnici);
	server.put("/baza/korisnici", restKorisnik.putKorisnici);

	server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
	server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik);
	server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);
	server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);

	server.post(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.getKorisnikPrijava
	);
}

function pripremiPutanjeFavorit() {
	server.get("/baza/favoriti", restFavorit.getFavoriti);
	server.post("/baza/favoriti", restFavorit.postFavoriti);
	server.delete("/baza/favoriti", restFavorit.deleteFavoriti);
	server.put("/baza/favoriti", restFavorit.putFavoriti);

	server.get("/baza/favoriti/:id", restFavorit.getFavorit);
	server.post("/baza/favoriti/:id", restFavorit.postFavorit);
	server.delete("/baza/favoriti/:id", restFavorit.deleteFavorit);
	server.put("/baza/favoriti/:id", restFavorit.putFavorit);
}

function pripremiPutanjeTMDB() {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
	server.get("/baza/tmdb/zanr", restTMDB.getZanr.bind(restTMDB));
	server.get("/baza/tmdb/serije", restTMDB.getSerije.bind(restTMDB));
	server.get("/baza/tmdb/tv", restTMDB.getSerije.bind(restTMDB));
}

function pripremiPutanjePocetna() {
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc, port);
	server.get("/", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.get("/pocetna", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.post("/", fetchUpravitelj.serijePretrazivanje.bind(fetchUpravitelj));
	server.get("/detaljiSerije", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.get("/detaljiFavorita", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.get("/favoriti", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.get("/profil", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.get("/korisnici", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.post("/dodajSeriju", fetchUpravitelj.dodajSeriju.bind(fetchUpravitelj));
	server.get("/dokumentacija", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
}

function pripremiPutanjeAutentifikacija() {
	let fetchUpravitelj = new FetchUpravitelj(konf.dajKonf().jwtTajniKljuc, port);
	server.get("/odjava", fetchUpravitelj.odjava.bind(fetchUpravitelj));
	server.get("/prijava", fetchUpravitelj.tvPretrazivanje.bind(fetchUpravitelj));
	server.post("/prijava", fetchUpravitelj.prijava.bind(fetchUpravitelj));
	server.get("/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
	server.get("/tijeloJWT", fetchUpravitelj.tijeloTokena.bind(fetchUpravitelj));
}
