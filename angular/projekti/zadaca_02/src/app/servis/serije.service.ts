import { Injectable } from '@angular/core';
import { SerijaTmdbI, SerijeTmdbI } from './SerijaTmdbI';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SerijeService {
  private serije: SerijaTmdbI[] = [];
  private serijeTMDB?: SerijeTmdbI;
  private restServis = environment.restServis;
  private ukupnoStranica: number = 1;

  private apiUrl = environment.restServis;

  constructor() {}

  getSerije(stranica: number, filter: string): Observable<any> {
    const params = { str: stranica.toString(), filter: filter };
    const url = `${this.apiUrl}/?str=${params.str}&filter=${params.filter}`;

    return new Observable((observer) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.serijeTMDB = data || {};
          this.serije = (this.serijeTMDB && this.serijeTMDB.results) || [];
          this.ukupnoStranica = (this.serijeTMDB && this.serijeTMDB.total_pages) || 1;
    
          observer.next(data);
        })
        .catch((error) => observer.error(error));
    });
  }

  async dohvatiFavorit(id: string): Promise<any> {
    const parametri = { method: 'GET' };
    const url = `${environment.restServis}favoriti/${id}`;
    const odgovor = await fetch(url, parametri);
    const slanje = await odgovor.json();
    return slanje;
  }

  dohvatiFavorite(): Observable<any> {
    return new Observable((observer) => {
      fetch(`${this.restServis}favoriti`)
        .then((response) => response.json())
        .then((data) => {
          observer.next(data);
        })
        .catch((error) => observer.error(error));
    });
  }

  async osvjeziSerije(stranica: number, kljucnaRijec: string): Promise<void> {
    let parametri = `?stranica=${stranica}&trazi=${kljucnaRijec}`;
    let o = (await fetch(
      `${this.restServis}tmdb/tv${parametri}`
    )) as Response;
      console.log(o.status);
    if (o.status === 200) {
      let r = JSON.parse(await o.text()) as SerijeTmdbI;
      console.log(r);
      this.serijeTMDB = r;
      localStorage.setItem('serije', JSON.stringify(r.total_pages));
      localStorage.setItem('serija', JSON.stringify(r.results));
    }
  }

  dajSerije(): SerijaTmdbI[] {
    if (!this.serijeTMDB || this.serijeTMDB.results.length === 0) {
      return [];
    }
    return this.serijeTMDB.results;
  }

  dajSeriju(id: number): SerijaTmdbI | null {
    if (!this.serijeTMDB) return null;

    return this.serijeTMDB.results.find((serija) => serija.id === id) || null;
  }

  async dohvatiSerijePoFilteru(stranica: number, filter: string): Promise<void> {
    this.serije = [];
    await this.osvjeziSerije(stranica, filter);
  }
  dajUkupnoStranica(): number {
    const ukupnoStranicaString = localStorage.getItem('serije');
    if (ukupnoStranicaString) {
      return parseInt(ukupnoStranicaString, 10) || 1;
    } else {
      return 1;
    }
  }
  
}
