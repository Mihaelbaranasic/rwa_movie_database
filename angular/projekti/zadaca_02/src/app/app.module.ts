import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PopisSerijaComponent } from './popis-serija/popis-serija.component';
import { DatePipe } from '@angular/common';
import { DetaljiSerijeComponent } from './detalji-serije/detalji-serije.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PrijavaComponent } from './prijava/prijava.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { FavoritiComponent } from './favoriti/favoriti.component';
import { DetaljiFavoritiComponent } from './detalji-favoriti/detalji-favoriti.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: 'pocetna', component: PopisSerijaComponent },
  { path: 'detalji', component: DetaljiSerijeComponent },
  { path: 'detalji/:nazivSerije', component: DetaljiSerijeComponent },
  { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
  { path: 'detalji/:id', component: DetaljiSerijeComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'dokumentacija', component: DokumentacijaComponent},
  { path: 'korisnici', component: KorisniciComponent},
  { path: 'favoriti', component: FavoritiComponent},
  { path: 'detaljiFavorita/:id', component: DetaljiFavoritiComponent},
  { path: 'profil', component: ProfilComponent}
];

@NgModule({
  declarations: [AppComponent, PopisSerijaComponent, DetaljiSerijeComponent, PrijavaComponent, KorisniciComponent, FavoritiComponent, DetaljiFavoritiComponent, ProfilComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
