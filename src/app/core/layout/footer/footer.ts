import { Component } from '@angular/core';
import { RESUME_DATA } from '../../data/resume.data';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  data = RESUME_DATA;
  currentYear = new Date().getFullYear();
}
