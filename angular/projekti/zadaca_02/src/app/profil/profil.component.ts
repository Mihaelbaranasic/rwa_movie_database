import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  poruka: string = '';
  korisnik: any = {};
  azurirano: string = '';
  url: string = environment.restServis;
  url2: string = environment.korisnikServis;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tijeloTokena();
  }

  async tijeloTokena(): Promise<void> {
    const odgovor = await fetch(this.url2 + "tijeloJWT");
    const podaci = await odgovor.json();
    if (odgovor.ok) {
      this.dajProfil(podaci.ok);
    } else {
      this.poruka = "Potrebna prijava";
    }
  }

  async azurirajKorisnika(event: Event): Promise<void> {
    event.preventDefault();

    const parametri = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ime: this.korisnik.ime,
        prezime: this.korisnik.prezime,
        adresa: this.korisnik.adresa
      }),
    };

    const odgovor = await fetch(`${this.url}korisnici/${this.korisnik.korime}`, parametri);
    if (odgovor.status == 201) {
      this.azurirano = "Podaci uspješno ažurirani";
      this.dajProfil(this.korisnik.korime);
    } else {
      this.azurirano = "Došlo je do greške kod ažuriranja";
    }
  }

  async dajProfil(korime: string): Promise<void> {
    const parametri = { method: "GET" };
    const odgovor = await fetch(`${this.url}korisnici/${korime}`, parametri);

    if (odgovor.status == 200) {
      const podaci = await odgovor.json();
      this.korisnik = podaci;
    } else {
      this.poruka = "Greška u dohvatu profila!";
    }
  }
}
