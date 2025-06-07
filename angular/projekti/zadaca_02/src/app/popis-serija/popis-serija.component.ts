import { Component, EventEmitter, Output } from '@angular/core';
import { SerijaTmdbI } from '../servis/SerijaTmdbI';
import { SerijeService } from '../servis/serije.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-popis-serija',
  templateUrl: './popis-serija.component.html',
  styleUrls: ['./popis-serija.component.scss']
})
export class PopisSerijaComponent {
  filter: string = '';
  serije: SerijaTmdbI[] = [];
  serija!: SerijaTmdbI | null;
  oznaceniNaziv?: string;
  stranica: number = 1;
  ukupnoStranica: number = 1;
  slika: string | null = environment.posteriPutanja;
  poruka: string = 'Gost';

  constructor(private serijeServis: SerijeService, private datePipe: DatePipe, private router: Router) {}

  ngOnInit(): void {
    let pom = sessionStorage.getItem("korime");
    if(pom !== null){
      this.poruka = pom;
    }
    this.dohvatiSerije();
  }

  formatirajDatum(datum: string): string {
    return this.datePipe.transform(datum, 'dd.MM.yyyy') || '';
  }

  prikaziDetaljeSerije(id: number): void {
    this.router.navigate(['/detalji', id]);
  }
  

  async filtriraj(): Promise<void> {
    await this.serijeServis.dohvatiSerijePoFilteru(this.stranica, this.filter);
    this.serije = this.serijeServis.dajSerije();
  }

  async dohvatiSerije(): Promise<void> {
    await this.serijeServis.dohvatiSerijePoFilteru(this.stranica, this.filter);
    this.serije = this.serijeServis.dajSerije();
    this.ukupnoStranica = this.serijeServis.dajUkupnoStranica();
  }

  async promijeniStranicu(stranica: number): Promise<void> {
    if(stranica == 0 || stranica > 500){

    }else{
      this.stranica = stranica;
      await this.dohvatiSerije();
    }
  }
  
}
