import { Component } from '@angular/core';

@Component({
  selector: 'app-dokumentacija',
  standalone: true,
  imports: [],
  templateUrl: './dokumentacija.component.html',
  styleUrl: './dokumentacija.component.scss'
})
export class DokumentacijaComponent {
  mail!: string;

  ngOnInit(): void {
    this.mail = "mbaranasi21@student.foi.hr";
  }
}
