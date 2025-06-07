CREATE TABLE "tip_Korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" VARCHAR(45),
  CONSTRAINT "naziv_UNIQUE" UNIQUE("naziv")
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(45),
  "prezime" VARCHAR(45),
  "korime" VARCHAR(45) NOT NULL,
  "lozinka" VARCHAR(45) NOT NULL,
  "adresa" TEXT,
  "email" VARCHAR(45),
  "tip_Korisnika_id" INTEGER NOT NULL,
  CONSTRAINT "korime_UNIQUE" UNIQUE("korime"),
  CONSTRAINT "fk_korisnik_tip_Korisnika" FOREIGN KEY("tip_Korisnika_id") REFERENCES "tip_Korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tipKorisnika_idx" ON "korisnik" ("tip_Korisnika_id");
CREATE TABLE "favoriti"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" VARCHAR(45),
  "brojSezona" INTEGER,
  "brojEpizoda" INTEGER NOT NULL,
  "popularnost" DOUBLE NOT NULL,
  "slika" VARCHAR(45),
  "tmdb_id" INT,
  "poveznica" VARCHAR(45) NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  CONSTRAINT "fk_favoriti_korisnik1" FOREIGN KEY("korisnik_id") REFERENCES "korisnik"("id")
);
CREATE INDEX "favoriti.fk_favoriti_korisnik1_idx" ON "favoriti" ("korisnik_id");
CREATE TABLE "dnevnickiZapis"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "datum" DATE NOT NULL,
  "vrijeme" TIME NOT NULL,
  "korime" VARCHAR(45) NOT NULL,
  "vrstaZahtjeva" VARCHAR(10) NOT NULL,
  "trazeniResurs" VARCHAR(45) NOT NULL,
  "tijelo" VARCHAR(45),
  "korisnik_id" INTEGER NOT NULL,
  CONSTRAINT "fk_dnevnickiZapis_korisnik1" FOREIGN KEY("korisnik_id") REFERENCES "korisnik"("id")
);
CREATE INDEX "dnevnickiZapis.fk_dnevnickiZapis_korisnik1_idx" ON "dnevnickiZapis" ("korisnik_id");
INSERT INTO tip_Korisnika (naziv, opis)
VALUES (
    'registrirani korisnik',
    'Uloga za običnog korisnika'
  ),
  ('administrator', 'Administrator');
INSERT INTO korisnik (
    ime,
    prezime,
    korime,
    lozinka,
    adresa,
    email,
    tip_Korisnika_id
  )
VALUES (
    'Pero',
    'Peric',
    'pero',
    'bce3f1f506ce2e4b3942a1fa4f32341a03d93874dae386f743fb6fa8c9d88d63',
    'Adresa123',
    'pero@gmail.com',
    1
  ),
  (
    'Ivo',
    'Ivić',
    'ivo',
    '3dc8c6b63ee9a7555a485d2d82bf39fa44e3cb65f15868d9aebf9d941a61be42',
    'Adresa321',
    'ivo@gmail.com',
    1
  ),
  (
    'Ime',
    'Prezime',
    'ime',
    '098ee4cfbfcfd56d65b1ba2ae31c183aa6df777c66fee3afbac95f0c9ccb86a6',
    'Adresa000',
    'ime@gmail.com',
    1
  ),
  (
    'Obican',
    'Korisnik',
    'miha',
    'e74c9b4d2cfbca515d48bfec673a662e25f9c9df79a6d45944f1024caced3f2d',
    'Adresa1',
    'obican2.korisnik@gmail.com',
    1
  ),
  (
    'Obican',
    'Korisnik',
    'obican',
    '906a472189a22ab504c0ab208135954cd5e2873d76ef5b1d3873b60b1ff06cdd',
    'Adresa1',
    'obican.korisnik@gmail.com',
    1
  );
