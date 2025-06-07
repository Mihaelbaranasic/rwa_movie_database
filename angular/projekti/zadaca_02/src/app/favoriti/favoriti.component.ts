import { Component, OnInit } from '@angular/core';
import { SerijeService } from '../servis/serije.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-favoriti',
  templateUrl: './favoriti.component.html',
  styleUrls: ['./favoriti.component.scss']
})
export class FavoritiComponent implements OnInit {
  poruka: string = '';
  greska: string = '';
  favoriti: any[] = [];
  slika: string = environment.posteriPutanja;

  constructor(private serijeService: SerijeService) { }

  ngOnInit(): void {
    this.ucitajFavorite();
  }

  ucitajFavorite(): void {
    this.serijeService.dohvatiFavorite().subscribe(
      (data: any) => {
        this.ispisiFavorite(data);
      },
      (error) => {
        this.greska = 'Greška prilikom dohvaćanja favorita.';
      }
    );
  }

  ispisiFavorite(favoriti: any[]): void {
    this.favoriti = favoriti;
  }
}
