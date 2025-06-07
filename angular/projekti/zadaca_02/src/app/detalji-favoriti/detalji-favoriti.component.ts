import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { SerijeService } from '../servis/serije.service';

@Component({
  selector: 'app-detalji-favoriti',
  templateUrl: './detalji-favoriti.component.html',
  styleUrls: ['./detalji-favoriti.component.scss']
})
export class DetaljiFavoritiComponent implements OnInit {
  poruka: string = '';
  favorit: any;
  slika: string = environment.posteriPutanja;

  constructor(private route: ActivatedRoute, private serijeServis: SerijeService) { }

  ngOnInit(): void {
    this.ucitajDetalje();
  }

  async ucitajDetalje(): Promise<void> {
    const idParam = this.route.snapshot.params['id'];
    try {
      this.favorit = await this.serijeServis.dohvatiFavorit(idParam);
    } catch (error) {
      this.poruka = 'Greška prilikom dohvaćanja detalja favorita.';
    }
  }
}
