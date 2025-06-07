const jwt = require("./moduli/jwt.js");

class JWTprovjera {
	constructor(tajniKljucJWT, limit) {
		this.tajniKljucJWT = tajniKljucJWT;
		this.limit = limit;
	}
	provjeriJWTadmin = async function (zahtjev, odgovor, next) {
        odgovor.type("json");
    
        if (zahtjev.headers.authorization) {
            let token = zahtjev.headers.authorization.split(" ")[1];
            console.log("Tijelo tokena: ", jwt.dajTijelo(token));
        }
    
        if (zahtjev.session.korime != null) {
            let k = { korime: zahtjev.session.korime };
            let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
            let tijelo = jwt.dajTijelo(noviToken);
            console.log("tijelo tokena: ", tijelo.korime);
            if (tijelo.korime == "admin") {
                odgovor.status(200);
                next();
            } else {
                odgovor.status(403);
                odgovor.send({ greska: "Zabranjen pristup" });
            }
        } else {
            odgovor.status(401);
            odgovor.send({ greska: "Potrebna prijava." });
        }
    };
}
module.exports = JWTprovjera;