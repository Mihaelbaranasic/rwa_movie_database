import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-korisnici',
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.scss']
})
export class KorisniciComponent implements OnInit {
  private url = environment.korisnikServis;
  poruka: string = '';
  greska: string = '';
  korisnici: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.ucitajKorisnike();
  }

  async ucitajKorisnike(): Promise<void> {
    try {
      const jwtOdgovor = await fetch(`${this.url}getJWT`);
      const jwtPodaci = await jwtOdgovor.json();
  
      if (jwtOdgovor.ok) {
      
        const parametri = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtPodaci.ok}`,
          },
        };
  
        const odgovor = await fetch(`${this.url}baza/korisnici`, parametri);
        const podaci = await odgovor.json();
  
        if (odgovor.ok) {
          this.ispisiKorisnike(podaci);
        } else {
          this.poruka = podaci;
        }
      } else {
        this.poruka = jwtPodaci.greska;
      }
    } catch (error) {
      this.poruka = 'Greška prilikom dohvaćanja korisnika.';
    }
  }
  

  ispisiKorisnike(korisnici: any[]): void {
    this.korisnici = korisnici;
  }

  async izbrisiKorisnika(korime: string, id: number): Promise<void> {
    try {
      if (korime === 'admin') {
        this.greska = 'Nije dozvoljeno brisanje administratora.';
        return;
      }

      const favoritiOdgovor = await fetch(`${this.url}baza/favoriti/${id}`, { method: 'DELETE' });
      const podFavorit = await favoritiOdgovor.text();

      const odgovor = await fetch(`${this.url}baza/korisnici/${korime}`, { method: 'DELETE' });
      if (odgovor.ok) {
        this.ucitajKorisnike();
      } else {
        this.greska = 'Greška prilikom brisanja korisnika.';
      }
    } catch (error) {
      this.greska = 'Greška prilikom brisanja korisnika.';
    }
  }
}
