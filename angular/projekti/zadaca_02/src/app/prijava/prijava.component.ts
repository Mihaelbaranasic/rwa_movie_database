import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})
export class PrijavaComponent {
  korime: string = '';
  lozinka: string = '';
  poruka: string = '';
  url: string = environment.korisnikServis;

  constructor(private router: Router) {}

  async provjeriUnos(): Promise<void> {
    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(this.korime)) {
        this.poruka = 'Korisničko ime može sadržavati samo slova i brojeve.';
        return;
    }

    if (!regex.test(this.lozinka)) {
        this.poruka = 'Lozinka može sadržavati samo slova i brojeve.';
        return;
    }

    try {
        const parametri = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ korime: this.korime, lozinka: this.lozinka }),
        };

        const odgovor = await fetch(this.url + 'prijava', parametri);

        if (odgovor.status === 200) {
            this.router.navigate(['/']);
            sessionStorage.setItem("korime", this.korime);
        } else {
            this.poruka = 'Netočni podaci';
        }
    } catch (error) {
        console.error(error);
        this.poruka = 'Došlo je do pogreške prilikom prijave.';
    }
  }
}
