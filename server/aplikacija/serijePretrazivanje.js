
class SerijePretrazivanje {
	constructor(port){
		this.port = port;
	}
	async dohvatiSerije(stranica, kljucnaRijec = "") {
		const url = "http://spider.foi.hr:" + this.port + "/baza";
		let putanja =
			url + "/tmdb/tv?stranica=" + stranica + "&trazi=" + kljucnaRijec;
		console.log(putanja);
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		console.log(serije);
		return serije;
	}
}

module.exports = SerijePretrazivanje;
