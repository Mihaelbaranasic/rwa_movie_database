import { Component } from '@angular/core';
import { SerijaTmdbI } from './servis/SerijaTmdbI';
import { SerijeService } from './servis/serije.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zadaca_02';
  putanja = 'pocetna';
  serija!: SerijaTmdbI | null;
  url: string = environment.korisnikServis;

  constructor(private serijeServis: SerijeService, private router: Router) {}

  async Odjavi() {
    const parametri = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  };

  const odgovor = await fetch(this.url + 'odjava', parametri);
  console.log(odgovor.status);
  if (odgovor.status === 200) {
    sessionStorage.setItem("korime", "Gost");
    this.router.navigate(['/']);
  } 
  }
}

