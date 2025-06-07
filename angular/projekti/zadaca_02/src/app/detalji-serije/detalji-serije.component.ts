import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerijeService } from '../servis/serije.service';
import { SerijaTmdbI } from '../servis/SerijaTmdbI';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-detalji-serije',
  templateUrl: './detalji-serije.component.html',
  styleUrls: ['./detalji-serije.component.scss']
})
export class DetaljiSerijeComponent implements OnInit {
  ispisDetalja: string = '';
  greskaPoruka: string = '';
  trazeno!: SerijaTmdbI | null;
  brojSezona: number = 1;
  url: string = environment.korisnikServis;

  constructor(private route: ActivatedRoute, private serijeServis: SerijeService) {}

  ngOnInit(): void {
    this.ucitajDetalje();
  }

  async ucitajDetalje(): Promise<void> {
    const path = this.route.snapshot.url.join('/');
    const idParam = path.split('/')[1];
    console.log(idParam);
    
    if (idParam !== null) {
      this.trazeno = this.serijeServis.dajSeriju(+idParam);
  
      if (this.trazeno !== null && this.trazeno !== undefined) {
        for (let sezona in this.trazeno.genre_ids) {
          this.brojSezona++;
        }
        let pom = this.trazeno.poster_path;
        this.trazeno.poster_path = environment.posteriPutanja + pom;
      } else {
        this.greskaPoruka = 'Serija nije pronađena.';
      }
    }
  }  

  async dodajUbazu(idSerije: number): Promise<void> {
    try {
      const jwtOdgovor = await fetch(`${this.url}getJWT`);
      const jwtPodaci = await jwtOdgovor.json();
  
      if (jwtOdgovor.ok) {
        const zaglavlje = new Headers();
        zaglavlje.set('Content-Type', 'application/json');
        zaglavlje.set('Authorization', `Bearer ${jwtPodaci.ok}`);
  
        const serije = JSON.parse(localStorage['serija']);
  
        for (const serija of serije) {
          if (idSerije == serija.id) {
            let parametri = {
              method: 'POST',
              body: JSON.stringify(serija),
              headers: zaglavlje
            };
  
            const odgovor = await fetch(this.url + 'dodajSeriju', parametri);
            console.log('odgovor status', odgovor.status);
  
            if (odgovor.status == 201) {
              console.log("dodano");
              this.greskaPoruka += 'Serija dodana u bazu!';
            } else if (odgovor.status == 401) {
              this.greskaPoruka = 'Neautorizirani pristup! Prijavite se!';
            } else {
              this.greskaPoruka = 'Greška u dodavanju serija!';
            }
  
            break;
          }
        }
      } else {
        this.greskaPoruka = jwtPodaci.greska;
      }
    } catch (error) {
      this.greskaPoruka = 'Greška prilikom dodavanja serije.';
    }
  }
  
}
